import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ApiClient } from '@/api/client'
import { getDraft } from '@/lib/composer-drafts'
import { useRealtimeDictation } from './useRealtimeDictation'

const scribe = vi.hoisted(() => ({
    options: null as unknown,
    connect: vi.fn(async () => {}),
    disconnect: vi.fn(),
    commit: vi.fn()
}))

vi.mock('@elevenlabs/react', () => ({
    CommitStrategy: { MANUAL: 'manual' },
    useScribe: (options: unknown) => {
        scribe.options = options
        return {
            connect: scribe.connect,
            disconnect: scribe.disconnect,
            commit: scribe.commit
        }
    }
}))

type ScribeCallbacks = {
    onPartialTranscript: (event: { text: string }) => void
    onDisconnect: () => void
    onCommittedTranscript: (event: { text: string }) => void
}

describe('useRealtimeDictation', () => {
    afterEach(() => vi.clearAllMocks())

    it('preserves partial ElevenLabs text on an unexpected disconnect', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn() }
        })
        const api = {
            fetchRealtimeTranscriptionToken: vi.fn(async () => ({ token: 'single-use-token' }))
        } as unknown as ApiClient
        const onFinalTranscript = vi.fn()
        const { result } = renderHook(() => useRealtimeDictation({
            api,
            provider: 'elevenlabs',
            mode: 'realtime',
            onFinalTranscript
        }))

        await act(() => result.current.toggle())
        const callbacks = scribe.options as ScribeCallbacks
        act(() => callbacks.onPartialTranscript({ text: 'spoken words' }))
        expect(onFinalTranscript).not.toHaveBeenCalled()

        act(() => callbacks.onDisconnect())

        await waitFor(() => expect(result.current.status).toBe('error'))
        expect(result.current.error).toBe('ElevenLabs realtime transcription disconnected')
        expect(result.current.partialTranscript).toBe('')
        expect(onFinalTranscript).toHaveBeenCalledWith('spoken words')
    })

    it('resumes an inactive session before a realtime stopAndSend delivers', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn() }
        })
        const api = {
            fetchRealtimeTranscriptionToken: vi.fn(async () => ({ token: 'single-use-token' })),
            sendMessage: vi.fn(async () => {})
        } as unknown as ApiClient
        const sendMessage = vi.fn(async () => {})
        const onFinalTranscript = vi.fn()
        const resolveSessionId = vi.fn(async () => ({ sessionId: 'session-C-resumed', resumed: true }))
        const onSessionResolved = vi.fn()
        const { result } = renderHook(() => useRealtimeDictation({
            api,
            provider: 'elevenlabs',
            mode: 'realtime',
            onFinalTranscript,
            sendMessage,
            getCurrentText: () => ''
        }))

        await act(() => result.current.toggle())
        const callbacks = scribe.options as ScribeCallbacks
        // Real ElevenLabs commit() resolves with the committed transcript;
        // wire the mock so the stopAndSend path delivers the spoken text.
        scribe.commit.mockImplementation(() => {
            callbacks.onCommittedTranscript({ text: 'spoken words' })
        })
        await act(() => result.current.stopAndSend('session-C', 'initial text', undefined, {
            resolveSessionId,
            onSessionResolved
        }))

        await waitFor(() => {
            expect(sendMessage).toHaveBeenCalledWith('session-C-resumed', 'initial text spoken words', undefined)
        })
        expect(resolveSessionId).toHaveBeenCalledWith('session-C')
        expect(onSessionResolved).toHaveBeenCalledWith('session-C-resumed')
        expect(result.current.status).toBe('disconnected')
    })

    it('recovers a failed post-resume realtime send under the resumed session', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn() }
        })
        const api = {
            fetchRealtimeTranscriptionToken: vi.fn(async () => ({ token: 'single-use-token' }))
        } as unknown as ApiClient
        const sendMessage = vi.fn(async () => { throw new Error('Send failed') })
        const onFinalTranscript = vi.fn()
        const resolveSessionId = vi.fn(async () => ({ sessionId: 'session-I-resumed', resumed: true }))
        const onSessionResolved = vi.fn()
        const { result } = renderHook(() => useRealtimeDictation({
            api,
            provider: 'elevenlabs',
            mode: 'realtime',
            onFinalTranscript,
            sendMessage,
            getCurrentText: () => ''
        }))

        await act(() => result.current.toggle())
        const callbacks = scribe.options as ScribeCallbacks
        scribe.commit.mockImplementation(() => {
            callbacks.onCommittedTranscript({ text: 'spoken words' })
        })
        await act(() => result.current.stopAndSend('session-I', 'initial text', undefined, {
            resolveSessionId,
            onSessionResolved
        }))

        await waitFor(() => {
            expect(result.current.status).toBe('error')
        })
        // Retryable transcript lives under the resumed id, and the operator
        // is still navigated there (recovery landed on the resumed session).
        expect(getDraft('session-I-resumed')).toBe('initial text spoken words')
        expect(onSessionResolved).toHaveBeenCalledWith('session-I-resumed')
        expect(onFinalTranscript).not.toHaveBeenCalled()
    })

    it('restores the transcript into the composer for a same-id realtime failure', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn() }
        })
        const api = {
            fetchRealtimeTranscriptionToken: vi.fn(async () => ({ token: 'single-use-token' }))
        } as unknown as ApiClient
        const sendMessage = vi.fn(async () => { throw new Error('Send failed') })
        const onFinalTranscript = vi.fn()
        const resolveSessionId = vi.fn(async () => ({ sessionId: 'session-J', resumed: true }))
        const { result } = renderHook(() => useRealtimeDictation({
            api,
            provider: 'elevenlabs',
            mode: 'realtime',
            onFinalTranscript,
            sendMessage,
            getCurrentText: () => ''
        }))

        await act(() => result.current.toggle())
        const callbacks = scribe.options as ScribeCallbacks
        scribe.commit.mockImplementation(() => {
            callbacks.onCommittedTranscript({ text: 'spoken words' })
        })
        await act(() => result.current.stopAndSend('session-J', 'initial text', undefined, { resolveSessionId }))

        await waitFor(() => {
            expect(result.current.status).toBe('error')
            // Same-id resume does not remount: the mounted composer IS the
            // recovery target, so the transcript is restored there.
            expect(onFinalTranscript).toHaveBeenCalledWith('initial text spoken words')
        })
        expect(getDraft('session-J')).toBe('initial text spoken words')
    })

    it('surfaces an unexpected rejection through the defensive catch', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn() }
        })
        const api = {
            fetchRealtimeTranscriptionToken: vi.fn(async () => ({ token: 'single-use-token' }))
        } as unknown as ApiClient
        const sendMessage = vi.fn(async () => { throw new Error('Send failed') })
        const onFinalTranscript = vi.fn()
        // A rejection outside deliverVoiceSend's own try (e.g. the caller's
        // getCurrentText throwing) hits finish's defensive catch.
        const getCurrentText = vi.fn(() => { throw new Error('boom') })
        const { result } = renderHook(() => useRealtimeDictation({
            api,
            provider: 'elevenlabs',
            mode: 'realtime',
            onFinalTranscript,
            sendMessage,
            getCurrentText
        }))

        await act(() => result.current.toggle())
        const callbacks = scribe.options as ScribeCallbacks
        scribe.commit.mockImplementation(() => {
            callbacks.onCommittedTranscript({ text: 'spoken words' })
        })
        await act(() => result.current.stopAndSend('session-K', 'initial text', undefined))

        await waitFor(() => {
            expect(result.current.status).toBe('error')
            expect(result.current.error).toBe('boom')
        })
        // finalMessage already existed when the unexpected rejection hit, so
        // the recovery paths owned the outcome (the draft was saved) and the
        // catch must not restore again (which could invite a duplicate send).
        expect(onFinalTranscript).not.toHaveBeenCalled()
        expect(getDraft('session-K')).toBe('initial text spoken words')
    })
})
