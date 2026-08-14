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
     * same-id resumes — because recovery and navigation decisions key off
     * this flag.
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
                                // Inactive sessions cannot accept a message POST until they
                                // are resumed (hub returns 409 `session_inactive`), so the
                                // voice send runs the same resume step as the text pipeline.
                                let targetSessionId = pendingSend.sessionId
                                let resumed = false
                                let delivered = false
                                let recoveryDraftAtStart = pendingSend.draftAtStart
                                try {
                                    if (pendingSend.options.resolveSessionId) {
                                        const resolved = await pendingSend.options.resolveSessionId(pendingSend.sessionId)
                                        targetSessionId = resolved.sessionId
                                        resumed = resolved.resumed
                                        // Snapshot the resumed session's draft BEFORE the send: the
                                        // catch compares against this to avoid clobbering text the
                                        // operator typed into the resumed composer while the request
                                        // was in flight.
                                        if (resumed) recoveryDraftAtStart = getDraft(targetSessionId)
                                    }
                                    await sendMsg(targetSessionId, finalMessage, pendingSend.deliveryMode)
                                    delivered = true
                                } catch (sendError) {
                                    // After a resume the source session is superseded: recover the
                                    // retryable transcript under the LIVE resumed id so the operator
                                    // can retry from the resumed session (and is navigated there via
                                    // onSessionResolved) instead of leaving it under the archived
                                    // source id.
                                    const recoverySessionId = resumed ? targetSessionId : pendingSend.sessionId
                                    if (draftUnchanged(recoverySessionId, recoveryDraftAtStart)) {
                                        saveDraft(recoverySessionId, finalMessage)
                                    }
                                    // Keep the source draft on failure: the recovery save above may
                                    // have been skipped (resumed composer changed in flight) and the
                                    // operator may not actually land on the resumed session, so
                                    // clearing the source would risk losing the transcript entirely.
                                    // Only the success path drops it (superseded by the merge).
                                    await notifyResolvedSession(pendingSend, resumed, recoverySessionId)
                                    if (mountedRef.current) {
                                        // For a resumed send the retryable text lives in the resumed
                                        // session's draft store; do not also write it into the still-
                                        // mounted archived composer, whose draft must stay untouched
                                        // for the reload-safe recovery above.
                                        if (!resumed && !config.getCurrentText().trim()) {
                                            config.onTextChange(finalMessage)
                                        }
                                        setError(sendError instanceof Error ? sendError.message : 'Failed to send message')
                                        setStatus('error')
                                        return
                                    }
                                }
                                if (!delivered) return
                                // Notification is a side effect of an already-delivered send: it
                                // runs outside the send try/catch so a throw from navigation/cache
                                // updates cannot be misread as a send failure (which would
                                // re-insert the delivered text as a retryable draft).
                                await notifyResolvedSession(pendingSend, resumed, targetSessionId)
                                if (draftUnchanged(targetSessionId, recoveryDraftAtStart)) {
                                    clearDraft(targetSessionId)
                                }
                                // A resume supersedes the source composer too; drop its
                                // pre-recording draft so reopening the archived session does not
                                // resurrect stale text (mirrors clearDraftsAfterSend).
                                if (targetSessionId !== pendingSend.sessionId
                                    && draftUnchanged(pendingSend.sessionId, pendingSend.draftAtStart)) {
                                    clearDraft(pendingSend.sessionId)
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
