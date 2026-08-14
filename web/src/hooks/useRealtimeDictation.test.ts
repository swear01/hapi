import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ApiClient } from '@/api/client'
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
})
