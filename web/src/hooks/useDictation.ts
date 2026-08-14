import { useCallback, useEffect, useRef, useState } from 'react'
import type { ApiClient } from '@/api/client'
import { clearDraft, getDraft, saveDraft } from '@/lib/composer-drafts'
import type { ConversationStatus } from '@/realtime/types'
import type { MessageDeliveryMode } from '@hapi/protocol'
import type { TranscriptionMode, TranscriptionProvider } from '@hapi/protocol/voice'
import { useRealtimeDictation } from './useRealtimeDictation'

export function appendTranscript(text: string, transcript: string): string {
    const addition = transcript.trim()
    if (!addition) return text
    if (!text) return addition
    return `${text}${/\s$/.test(text) ? '' : ' '}${addition}`
}

function recordingExtension(mimeType: string): string {
    if (mimeType.includes('mp4')) return 'm4a'
    if (mimeType.includes('ogg')) return 'ogg'
    return 'webm'
}

/**
 * Optional session resolution for a `stopAndSend` voice send.
 *
 * Mirrors the text-send pipeline's `resolveSessionId` contract
 * (`useSendMessage`): an inactive session must be resumed via
 * `api.resumeSession` before the message POST, because the hub rejects
 * messages to inactive sessions with 409 `session_inactive`. The
 * dictation hooks send after transcription completes (possibly after the
 * composer unmounted), so the resolver is captured at call time and
 * applied at send time.
 */
export type DictationPendingSendOptions = {
    /**
     * Maps the target session id to the id the message should actually be
     * sent to (e.g. the resumed session id for an inactive session).
     * Invoked right before the message send. May throw to abort the send.
     *
     * Invariant: `resumed` must be `true` whenever the target session was
     * transitioned to live and must be seeded/navigated — including
     * same-id resumes — because navigation decisions key off this flag.
     * Draft snapshot/recovery key off the session id actually changing;
     * a resolver that swaps the id must therefore also report
     * `resumed: true` so the operator is navigated to the recovered
     * session after a failure.
     */
    resolveSessionId?: (sessionId: string) => Promise<{ sessionId: string; resumed: boolean }>
    /**
     * Called when `resolveSessionId` resumed the session into a live one,
     * so the caller can navigate/seed the resumed session. Fires after a
     * successful delivery and also after a failed post-resume send (so the
     * operator lands on the resumed session to retry from the recovered
     * draft). Never fires when the session was not resumed.
     */
    onSessionResolved?: (sessionId: string) => void | Promise<void>
}

/** True when the persisted draft for `sessionId` still equals `baseline`. */
export function draftUnchanged(sessionId: string, baseline: string): boolean {
    const cur = getDraft(sessionId)
    return cur === '' || cur === baseline
}

export async function notifyResolvedSession(
    pendingSend: { options: DictationPendingSendOptions },
    resumed: boolean,
    sessionId: string,
): Promise<void> {
    if (!resumed) return
    try {
        // Callers may pass an async callback; await it so a rejection is
        // caught here instead of surfacing as an unhandled rejection.
        await pendingSend.options.onSessionResolved?.(sessionId)
    } catch (error) {
        // Navigation/seed is a side effect of an already-decided send
        // outcome; a throw from it must not corrupt recovery or the
        // delivered state. Log it: this is the only signal that the
        // operator was not navigated to the recovered session.
        console.warn('Voice send: onSessionResolved failed after resume:', error)
    }
}

export type DeliverVoiceSendResult = {
    /** True when the message POST succeeded. */
    delivered: boolean
    /** Set when delivery failed. */
    error?: unknown
    /** True when the resolver reported the session was resumed. */
    resumed: boolean
    /** Session id the message was actually sent to / recovered under. */
    targetSessionId: string
}

/**
 * Shared send-with-resume orchestration for voice dictation direct-sends
 * (used by both the standard recorder path and realtime providers).
 *
 * Inactive sessions cannot accept a message POST until they are resumed
 * (hub returns 409 `session_inactive`), so the voice send runs the same
 * resume step as the text pipeline: resolve the session right before the
 * POST, deliver to the resolved id, then notify/seed via
 * `onSessionResolved`.
 *
 * Failure recovery: the retryable transcript is saved under the LIVE
 * resumed id (snapshotting that session's draft before the send so the
 * operator's in-flight text is never clobbered) and the operator is
 * still navigated to it. The archived source draft is preserved on
 * failure — the recovery save can be skipped (resumed composer changed)
 * and navigation may not land, so clearing the source would risk losing
 * the transcript entirely. Only the success path drops the source draft
 * (superseded by the merge).
 */
export async function deliverVoiceSend(args: {
    pendingSend: {
        sessionId: string
        initialText: string
        draftAtStart: string
        deliveryMode?: MessageDeliveryMode
        options: DictationPendingSendOptions
    }
    finalMessage: string
    sendMsg: (sessionId: string, text: string, deliveryMode?: MessageDeliveryMode) => Promise<void>
}): Promise<DeliverVoiceSendResult> {
    let targetSessionId = args.pendingSend.sessionId
    let resumed = false
    let recoveryDraftAtStart = args.pendingSend.draftAtStart
    try {
        if (args.pendingSend.options.resolveSessionId) {
            const resolved = await args.pendingSend.options.resolveSessionId(args.pendingSend.sessionId)
            targetSessionId = resolved.sessionId
            // Derive the resume flag from the id actually changing so a
            // resolver that swaps the id without reporting `resumed` still
            // navigates/recoveries correctly. A resolver failure (e.g.
            // resume unavailable) throws here: the catch below then
            // recovers under the unchanged source id — the only id the
            // operator knows — and the thrown error (which carries the
            // resume-specific message) is surfaced by the caller.
            resumed = resolved.resumed || targetSessionId !== args.pendingSend.sessionId
            // Snapshot the resolved session's draft BEFORE the send: the
            // catch compares against this to avoid clobbering text the
            // operator typed into the resolved composer while the request
            // was in flight.
            if (targetSessionId !== args.pendingSend.sessionId) recoveryDraftAtStart = getDraft(targetSessionId)
        }
        await args.sendMsg(targetSessionId, args.finalMessage, args.pendingSend.deliveryMode)
    } catch (sendError) {
        // After a resume the source session is superseded: recover the
        // retryable transcript under the id the message actually targeted
        // so the operator can retry from the live session instead of
        // leaving it under the archived source id. Navigation is NOT fired
        // here: the caller surfaces the failure first (while the source
        // component is still mounted) and then navigates via
        // notifyResolvedSession, so a post-resume failure is never silent.
        const recoverySessionId = targetSessionId
        if (draftUnchanged(recoverySessionId, recoveryDraftAtStart)) {
            saveDraft(recoverySessionId, args.finalMessage)
        }
        return { delivered: false, error: sendError, resumed, targetSessionId }
    }
    // Draft cleanup runs BEFORE the notify: the onSessionResolved callback
    // may itself seed/navigate the target session (and write drafts), so a
    // post-notify unchanged-check could either skip the cleanup or wipe a
    // freshly seeded draft. The delivery outcome no longer depends on the
    // draft store.
    if (draftUnchanged(targetSessionId, recoveryDraftAtStart)) {
        clearDraft(targetSessionId)
    }
    // A cross-id resume supersedes the source composer too; drop its
    // pre-recording draft so reopening the archived session does not
    // resurrect stale text (mirrors clearDraftsAfterSend).
    if (targetSessionId !== args.pendingSend.sessionId
        && draftUnchanged(args.pendingSend.sessionId, args.pendingSend.draftAtStart)) {
        clearDraft(args.pendingSend.sessionId)
    }
    // Notification is a side effect of an already-delivered send: it runs
    // outside the send try/catch so a throw from navigation/cache updates
    // cannot be misread as a send failure (which would re-insert the
    // delivered text as a retryable draft). Navigation keys off `resumed`
    // (also covers same-id resumes, where the id never changes).
    await notifyResolvedSession(args.pendingSend, resumed, targetSessionId)
    return { delivered: true, resumed, targetSessionId }
}

function preferredMimeType(): string | undefined {
    if (typeof MediaRecorder.isTypeSupported !== 'function') return undefined
    return [
        'audio/webm;codecs=opus',
        'audio/mp4',
        'audio/webm',
        'audio/ogg;codecs=opus'
    ].find((type) => MediaRecorder.isTypeSupported(type))
}

export function useDictation(config: {
    api: ApiClient | null
    provider: TranscriptionProvider | null
    mode: TranscriptionMode
    getCurrentText: () => string
    onTextChange: (text: string) => void
    sendMessage?: (sessionId: string, text: string, deliveryMode?: MessageDeliveryMode) => Promise<void>
}) {
    const onFinalTranscript = useCallback((transcript: string) => {
        config.onTextChange(appendTranscript(config.getCurrentText(), transcript))
    }, [config])
    const realtime = useRealtimeDictation({
        api: config.api,
        provider: config.provider,
        mode: config.mode,
        onFinalTranscript,
        sendMessage: config.sendMessage,
        getCurrentText: config.getCurrentText
    })
    const browserCanRecord = typeof navigator !== 'undefined'
        && typeof navigator.mediaDevices?.getUserMedia === 'function'
        && typeof MediaRecorder !== 'undefined'
    const standardSupported = config.mode === 'standard'
        && config.api !== null
        && config.provider !== null
        && browserCanRecord

    const supported = realtime.supported || standardSupported
    const [status, setStatus] = useState<ConversationStatus>('disconnected')
    const [error, setError] = useState<string | null>(null)
    const mountedRef = useRef(true)
    const recorderRef = useRef<MediaRecorder | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const operationRef = useRef(0)
    const transcribingRef = useRef(false)
    const sendOnFinishRef = useRef<{
        sessionId: string
        initialText: string
        draftAtStart: string
        deliveryMode?: MessageDeliveryMode
        options: DictationPendingSendOptions
    } | null>(null)

    const stopTracks = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop())
            mediaStreamRef.current = null
        }
    }, [])

    const start = useCallback(async () => {
        if (status !== 'disconnected' && status !== 'error') return
        setError(null)
        if (realtime.supported) {
            await realtime.toggle()
            return
        }
        if (!standardSupported || !browserCanRecord) {
            setError('Voice input is not supported in this browser')
            setStatus('error')
            return
        }
        const mimeType = preferredMimeType()
        operationRef.current += 1
        const operation = operationRef.current
        setStatus('connecting')

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            if (operationRef.current !== operation) {
                stream.getTracks().forEach((track) => track.stop())
                return
            }
            mediaStreamRef.current = stream
            chunksRef.current = []

            const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
            recorderRef.current = recorder
            const type = recorder.mimeType || mimeType || 'audio/webm'

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data)
            }

            // A MediaRecorder error can still be followed by dataavailable +
            // stop with partial bytes; treat it as a failed recording instead
            // of transcribing (and possibly auto-sending) corrupt audio.
            let recordingFailed = false
            recorder.onerror = () => {
                recordingFailed = true
            }

            recorder.onstop = async () => {
                stopTracks()
                try {
                    const blob = new Blob(chunksRef.current, { type })
                    recorderRef.current = null
                    chunksRef.current = []
                    const pendingSend = sendOnFinishRef.current
                    sendOnFinishRef.current = null

                    if (!mountedRef.current && !pendingSend) return

                    if (!blob.size) {
                        transcribingRef.current = false
                        if (pendingSend && draftUnchanged(pendingSend.sessionId, pendingSend.draftAtStart)) {
                            saveDraft(pendingSend.sessionId, pendingSend.initialText)
                        }
                        if (mountedRef.current) {
                            if (pendingSend && !config.getCurrentText().trim()) config.onTextChange(pendingSend.initialText)
                            setError('No audio was recorded')
                            setStatus('error')
                        }
                        return
                    }
                    if (recordingFailed) {
                        transcribingRef.current = false
                        if (pendingSend && draftUnchanged(pendingSend.sessionId, pendingSend.draftAtStart)) {
                            saveDraft(pendingSend.sessionId, pendingSend.initialText)
                        }
                        if (mountedRef.current) {
                            if (pendingSend && !config.getCurrentText().trim()) config.onTextChange(pendingSend.initialText)
                            setError('Audio recording failed')
                            setStatus('error')
                        }
                        return
                    }
                    transcribingRef.current = true
                    try {
                        const savedLanguage = (typeof localStorage !== 'undefined' && localStorage.getItem('hapi-voice-lang')) || undefined
                        const result = await config.api!.transcribeVoice({
                            file: new File([blob], `speech.${recordingExtension(type)}`, { type }),
                            provider: config.provider!,
                            mode: 'standard',
                            language: savedLanguage
                        })
                        const transcribedText = result.text || ''
                        if (pendingSend) {
                            const finalMessage = appendTranscript(pendingSend.initialText, transcribedText)
                            if (finalMessage.trim()) {
                                const sendMsg = config.sendMessage ?? ((sid: string, msg: string, dm?: MessageDeliveryMode) => config.api!.sendMessage(sid, msg, null, undefined, undefined, dm))
                                const result = await deliverVoiceSend({ pendingSend, finalMessage, sendMsg })
                                if (!result.delivered) {
                                    // Surface the failure while the source component is still
                                    // mounted, then navigate to the resumed session (whose
                                    // recovered draft carries the retryable text). For a
                                    // cross-id resumed send the text lives only in that draft
                                    // store; for a non-resumed or same-id resumed send the
                                    // mounted composer IS the recovery target (a same-id resume
                                    // does not remount), so restore the text there too.
                                    if (mountedRef.current) {
                                        if ((!result.resumed || result.targetSessionId === pendingSend.sessionId)
                                            && !config.getCurrentText().trim()) {
                                            config.onTextChange(finalMessage)
                                        }
                                        setError(result.error instanceof Error ? result.error.message : 'Failed to send message')
                                        setStatus('error')
                                    }
                                    await notifyResolvedSession(pendingSend, result.resumed, result.targetSessionId)
                                    return
                                }
                            }
                        } else if (mountedRef.current) {
                            config.onTextChange(appendTranscript(config.getCurrentText(), transcribedText))
                        }
                        if (mountedRef.current) {
                            setStatus('disconnected')
                        }
                    } catch (transcriptionError) {
                        if (pendingSend && draftUnchanged(pendingSend.sessionId, pendingSend.draftAtStart)) {
                            saveDraft(pendingSend.sessionId, pendingSend.initialText)
                        }
                        if (mountedRef.current) {
                            if (pendingSend && !config.getCurrentText().trim()) config.onTextChange(pendingSend.initialText)
                            setError(transcriptionError instanceof Error ? transcriptionError.message : 'Transcription failed')
                            setStatus('error')
                        }
                    }
                } finally {
                    transcribingRef.current = false
                }
            }
            recorder.start()
            setStatus('connected')
        } catch (startError) {
            if (operationRef.current !== operation) return
            stopTracks()
            setError(startError instanceof Error ? startError.message : 'Could not start transcription')
            setStatus('error')
        }
    }, [config, standardSupported, status, stopTracks])

    const stop = useCallback(async () => {
        if (transcribingRef.current) return
        operationRef.current += 1
        const recorder = recorderRef.current
        if (recorder && recorder.state !== 'inactive') {
            transcribingRef.current = true
            setStatus('connecting')
            recorder.stop()
        } else {
            setStatus('disconnected')
            stopTracks()
        }
    }, [stopTracks])

    const stopAndSend = useCallback(async (
        targetSessionId: string,
        initialText?: string,
        deliveryMode?: MessageDeliveryMode,
        options: DictationPendingSendOptions = {},
    ) => {
        sendOnFinishRef.current = {
            sessionId: targetSessionId,
            initialText: initialText ?? config.getCurrentText(),
            draftAtStart: getDraft(targetSessionId),
            deliveryMode,
            options
        }
        await stop()
    }, [config, stop])

    const toggle = useCallback(async () => {
        if (status === 'connected' || status === 'connecting') await stop()
        else await start()
    }, [start, status, stop])

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
            operationRef.current += 1
            transcribingRef.current = false
            const recorder = recorderRef.current
            if (recorder && recorder.state !== 'inactive') recorder.stop()
            stopTracks()
        }
    }, [stopTracks])

    return config.mode === 'realtime'
        ? { ...realtime, stopAndSend: realtime.stopAndSend }
        : { supported, status, error, partialTranscript: '', toggle, stopAndSend }
}
