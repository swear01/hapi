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
    const sendOnFinishRef = useRef<{ sessionId: string; initialText: string; draftAtStart: string; deliveryMode?: MessageDeliveryMode } | null>(null)

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

                    const draftUnchanged = (sid: string, baseline: string) => {
                        const cur = getDraft(sid)
                        return cur === '' || cur === baseline
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
                                try {
                                    await sendMsg(pendingSend.sessionId, finalMessage, pendingSend.deliveryMode)
                                    if (draftUnchanged(pendingSend.sessionId, pendingSend.draftAtStart)) {
                                        clearDraft(pendingSend.sessionId)
                                    }
                                } catch (sendError) {
                                    if (draftUnchanged(pendingSend.sessionId, pendingSend.draftAtStart)) {
                                        saveDraft(pendingSend.sessionId, finalMessage)
                                    }
                                    if (mountedRef.current) {
                                        if (!config.getCurrentText().trim()) {
                                            config.onTextChange(finalMessage)
                                        }
                                        setError(sendError instanceof Error ? sendError.message : 'Failed to send message')
                                        setStatus('error')
                                        return
                                    }
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

    const stopAndSend = useCallback(async (targetSessionId: string, initialText?: string, deliveryMode?: MessageDeliveryMode) => {
        sendOnFinishRef.current = {
            sessionId: targetSessionId,
            initialText: initialText ?? config.getCurrentText(),
            draftAtStart: getDraft(targetSessionId),
            deliveryMode
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
