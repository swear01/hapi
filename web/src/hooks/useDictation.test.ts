import { StrictMode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ApiClient } from '@/api/client'
import { appendTranscript, useDictation } from './useDictation'

describe('appendTranscript', () => {
    it('preserves the draft and adds one separator', () => {
        expect(appendTranscript('existing draft  ', '  dictated words  ')).toBe('existing draft  dictated words')
        expect(appendTranscript('existing draft\n', 'dictated words')).toBe('existing draft\ndictated words')
        expect(appendTranscript('', ' dictated words ')).toBe('dictated words')
        expect(appendTranscript('existing draft', '   ')).toBe('existing draft')
        expect(appendTranscript('請更新 API', 'and run tests')).toBe('請更新 API and run tests')
    })
})

describe('useDictation', () => {
    afterEach(() => vi.unstubAllGlobals())

    it('records and inserts a final transcript under React StrictMode', async () => {
        const stopTrack = vi.fn()
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop: stopTrack }] })) }
        })

        class MockMediaRecorder {
            static isTypeSupported() { return true }
            state: RecordingState = 'inactive'
            mimeType = 'audio/webm'
            ondataavailable: ((event: BlobEvent) => void) | null = null
            onerror: (() => void) | null = null
            onstop: (() => void) | null = null
            start() { this.state = 'recording' }
            stop() {
                this.state = 'inactive'
                this.ondataavailable?.({ data: new Blob(['audio'], { type: this.mimeType }) } as BlobEvent)
                this.onstop?.()
            }
        }
        vi.stubGlobal('MediaRecorder', MockMediaRecorder)

        const onTextChange = vi.fn()
        const api = {
            transcribeVoice: vi.fn(async () => ({ text: 'dictated words' }))
        }
        const { result } = renderHook(() => useDictation({
            api: api as unknown as ApiClient,
            provider: 'openai',
            mode: 'standard',
            getCurrentText: () => 'existing draft',
            onTextChange
        }), { wrapper: StrictMode })

        await act(() => result.current.toggle())
        expect(result.current.status).toBe('connected')
        await act(() => result.current.toggle())

        await waitFor(() => expect(onTextChange).toHaveBeenCalledWith('existing draft dictated words'))
        expect(api.transcribeVoice).toHaveBeenCalledOnce()
        expect(stopTrack).toHaveBeenCalled()
    })

    it('shows on-device partial text and inserts only the final transcript', async () => {
        vi.stubGlobal('navigator', {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0 Safari/537.36',
            userAgentData: { platform: 'macOS', mobile: false },
            language: 'en-US'
        })
        let recognition: MockSpeechRecognition | null = null
        class MockSpeechRecognition {
            static async available() { return 'available' }
            continuous = false
            interimResults = false
            lang = ''
            processLocally = false
            onresult: ((event: Event & { results: unknown }) => void) | null = null
            onerror: ((event: Event) => void) | null = null
            onend: (() => void) | null = null
            constructor() { recognition = this }
            start() {}
            stop() { this.onend?.() }
            abort() {}
            emit(text: string, isFinal: boolean) {
                const result = Object.assign([{ transcript: text }], { isFinal })
                this.onresult?.({ results: [result] } as unknown as Event & { results: unknown })
            }
        }
        Object.defineProperty(MockSpeechRecognition.prototype, 'processLocally', {
            configurable: true,
            writable: true,
            value: false
        })
        vi.stubGlobal('SpeechRecognition', MockSpeechRecognition)

        const onTextChange = vi.fn()
        const { result } = renderHook(() => useDictation({
            api: {} as ApiClient,
            provider: 'browser-local',
            mode: 'realtime',
            getCurrentText: () => 'existing draft',
            onTextChange
        }))

        await act(() => result.current.toggle())
        act(() => recognition?.emit('live words', false))
        expect(result.current.partialTranscript).toBe('live words')
        expect(onTextChange).not.toHaveBeenCalled()
        act(() => recognition?.emit('final words', true))
        await act(() => result.current.toggle())

        await waitFor(() => expect(onTextChange).toHaveBeenCalledWith('existing draft final words'))
        expect(result.current.partialTranscript).toBe('')
    })

    it('sends message to target session when unmounted after stopAndSend', async () => {
        const stopTrack = vi.fn()
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop: stopTrack }] })) }
        })

        class MockMediaRecorder {
            static isTypeSupported() { return true }
            state: RecordingState = 'inactive'
            mimeType = 'audio/webm'
            ondataavailable: ((event: BlobEvent) => void) | null = null
            onerror: (() => void) | null = null
            onstop: (() => void) | null = null
            start() { this.state = 'recording' }
            stop() {
                this.state = 'inactive'
                this.ondataavailable?.({ data: new Blob(['audio'], { type: this.mimeType }) } as BlobEvent)
                this.onstop?.()
            }
        }
        vi.stubGlobal('MediaRecorder', MockMediaRecorder)

        const onTextChange = vi.fn()
        let resolveTranscribe: ((res: { text: string }) => void) | null = null
        const api = {
            transcribeVoice: vi.fn(() => new Promise<{ text: string }>((resolve) => { resolveTranscribe = resolve })),
            sendMessage: vi.fn(async () => {})
        }

        const { result, unmount } = renderHook(() => useDictation({
            api: api as unknown as ApiClient,
            provider: 'openai',
            mode: 'standard',
            getCurrentText: () => 'initial text',
            onTextChange
        }))

        await act(() => result.current.toggle())
        expect(result.current.status).toBe('connected')

        act(() => {
            result.current.stopAndSend('session-A', 'explicit initial text')
        })

        unmount()

        await act(async () => {
            resolveTranscribe?.({ text: 'voice payload' })
        })

        await waitFor(() => {
            expect(api.sendMessage).toHaveBeenCalledWith('session-A', 'explicit initial text voice payload')
        })
    })

    it('restores draft via onTextChange if sendMessage fails while still mounted', async () => {
        const stopTrack = vi.fn()
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop: stopTrack }] })) }
        })

        class MockMediaRecorder {
            static isTypeSupported() { return true }
            state: RecordingState = 'inactive'
            mimeType = 'audio/webm'
            ondataavailable: ((event: BlobEvent) => void) | null = null
            onerror: (() => void) | null = null
            onstop: (() => void) | null = null
            start() { this.state = 'recording' }
            stop() {
                this.state = 'inactive'
                this.ondataavailable?.({ data: new Blob(['audio'], { type: this.mimeType }) } as BlobEvent)
                this.onstop?.()
            }
        }
        vi.stubGlobal('MediaRecorder', MockMediaRecorder)

        const onTextChange = vi.fn()
        const api = {
            transcribeVoice: vi.fn(async () => ({ text: 'voice text' })),
            sendMessage: vi.fn(async () => { throw new Error('Send failed') })
        }

        const { result } = renderHook(() => useDictation({
            api: api as unknown as ApiClient,
            provider: 'openai',
            mode: 'standard',
            getCurrentText: () => 'draft text',
            onTextChange
        }))

        await act(() => result.current.toggle())
        await act(() => result.current.stopAndSend('session-A', 'draft text'))

        await waitFor(() => {
            expect(onTextChange).toHaveBeenCalledWith('draft text voice text')
            expect(result.current.status).toBe('error')
        })
    })

    it('forwards saved language from localStorage to transcribeVoice', async () => {
        const stopTrack = vi.fn()
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: { getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop: stopTrack }] })) }
        })

        class MockMediaRecorder {
            static isTypeSupported() { return true }
            state: RecordingState = 'inactive'
            mimeType = 'audio/webm'
            ondataavailable: ((event: BlobEvent) => void) | null = null
            onstop: (() => void) | null = null
            start() { this.state = 'recording' }
            stop() {
                this.state = 'inactive'
                this.ondataavailable?.({ data: new Blob(['audio'], { type: this.mimeType }) } as BlobEvent)
                this.onstop?.()
            }
        }
        vi.stubGlobal('MediaRecorder', MockMediaRecorder)
        localStorage.setItem('hapi-voice-lang', 'zh-TW')

        const api = {
            transcribeVoice: vi.fn(async () => ({ text: '轉錄內容' }))
        }
        const { result } = renderHook(() => useDictation({
            api: api as unknown as ApiClient,
            provider: 'openai',
            mode: 'standard',
            getCurrentText: () => '',
            onTextChange: vi.fn()
        }))

        await act(() => result.current.toggle())
        await act(() => result.current.toggle())

        await waitFor(() => {
            expect(api.transcribeVoice).toHaveBeenCalledWith(expect.objectContaining({
                language: 'zh-TW'
            }))
        })
    })

    it('reports supported as false when browser recording APIs are unavailable', () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            configurable: true,
            value: undefined
        })
        const { result } = renderHook(() => useDictation({
            api: {} as ApiClient,
            provider: 'openai',
            mode: 'standard',
            getCurrentText: () => '',
            onTextChange: vi.fn()
        }))

        expect(result.current.supported).toBe(false)
    })
})
