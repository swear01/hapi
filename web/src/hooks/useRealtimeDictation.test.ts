import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ApiClient } from '@/api/client'
import { clearDraft, getDraft, saveDraft } from '@/lib/composer-drafts'
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

    it('resumes an inactive session before a stopAndSend commit and notifies the resolved session', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn() }
        })
        const api = {
            fetchRealtimeTranscriptionToken: vi.fn(async () => ({ token: 'single-use-token' }))
        } as unknown as ApiClient
        const sendMessage = vi.fn(async () => {})
        const onFinalTranscript = vi.fn()
        const resolveSessionId = vi.fn(async () => ({ sessionId: 'session-A-resumed', resumed: true }))
        const onSessionResolved = vi.fn()
        const { result } = renderHook(() => useRealtimeDictation({
            api,
            provider: 'elevenlabs',
            mode: 'realtime',
            onFinalTranscript,
            sendMessage
        }))

        // Real scribe.commit() emits the committed transcript; drive the same
        // path in the mock so the send fires with the dictated text.
        scribe.commit.mockImplementation(() => {
            (scribe.options as ScribeCallbacks).onCommittedTranscript?.({ text: 'spoken words' })
        })
        await act(() => result.current.toggle())
        await act(() => result.current.stopAndSend('session-A', 'explicit initial text', undefined, {
            resolveSessionId,
            onSessionResolved
        }))

        await waitFor(() => {
            expect(sendMessage).toHaveBeenCalledWith('session-A-resumed', 'explicit initial text spoken words', undefined)
        })
        expect(resolveSessionId).toHaveBeenCalledWith('session-A')
        expect(onSessionResolved).toHaveBeenCalledWith('session-A-resumed')
    })

    it('recovers a post-resume send failure under the resumed session id', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn() }
        })
        const api = {
            fetchRealtimeTranscriptionToken: vi.fn(async () => ({ token: 'single-use-token' }))
        } as unknown as ApiClient
        const sendMessage = vi.fn(async () => { throw new Error('network down') })
        const onFinalTranscript = vi.fn()
        const resolveSessionId = vi.fn(async () => ({ sessionId: 'session-A-resumed', resumed: true }))
        const onSessionResolved = vi.fn()
        clearDraft('session-A')
        clearDraft('session-A-resumed')
        const { result } = renderHook(() => useRealtimeDictation({
            api,
            provider: 'elevenlabs',
            mode: 'realtime',
            onFinalTranscript,
            sendMessage
        }))

        scribe.commit.mockImplementation(() => {
            (scribe.options as ScribeCallbacks).onCommittedTranscript?.({ text: 'spoken words' })
        })
        await act(() => result.current.toggle())
        await act(() => result.current.stopAndSend('session-A', 'explicit initial text', undefined, {
            resolveSessionId,
            onSessionResolved
        }))

        await waitFor(() => {
            expect(sendMessage).toHaveBeenCalledWith('session-A-resumed', 'explicit initial text spoken words', undefined)
        })
        // The source session is superseded: recovery lives under the resumed id,
        // and the UI is pointed at the resumed session.
        expect(getDraft('session-A-resumed')).toBe('explicit initial text spoken words')
        expect(getDraft('session-A')).toBe('')
        expect(onSessionResolved).toHaveBeenCalledWith('session-A-resumed')
    })

    it('does not overwrite a newer resumed-session draft when a post-resume send fails', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn() }
        })
        const api = {
            fetchRealtimeTranscriptionToken: vi.fn(async () => ({ token: 'single-use-token' }))
        } as unknown as ApiClient
        let rejectSend: ((error: Error) => void) | null = null
        const sendMessage = vi.fn(() => new Promise<void>((_resolve, reject) => { rejectSend = reject }))
        const onFinalTranscript = vi.fn()
        const resolveSessionId = vi.fn(async () => ({ sessionId: 'session-A-resumed', resumed: true }))
        const onSessionResolved = vi.fn()
        clearDraft('session-A')
        clearDraft('session-A-resumed')
        const { result } = renderHook(() => useRealtimeDictation({
            api,
            provider: 'elevenlabs',
            mode: 'realtime',
            onFinalTranscript,
            sendMessage
        }))

        scribe.commit.mockImplementation(() => {
            (scribe.options as ScribeCallbacks).onCommittedTranscript?.({ text: 'spoken words' })
        })
        await act(() => result.current.toggle())
        await act(() => result.current.stopAndSend('session-A', 'explicit initial text', undefined, {
            resolveSessionId,
            onSessionResolved
        }))
        // The send is now in flight against the resumed session; the operator
        // types a newer draft there before it rejects.
        await act(async () => {
            await waitFor(() => expect(sendMessage).toHaveBeenCalled())
        })
        act(() => { saveDraft('session-A-resumed', 'newer draft typed by user') })
        await act(async () => { rejectSend?.(new Error('network down')) })
        await act(async () => {
            await waitFor(() => expect(getDraft('session-A-resumed')).toBe('newer draft typed by user'))
        })

        // The recovery must NOT clobber the newer draft.
        expect(getDraft('session-A')).toBe('')
        expect(onSessionResolved).toHaveBeenCalledWith('session-A-resumed')
    })
})
