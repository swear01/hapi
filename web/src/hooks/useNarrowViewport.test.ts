import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useNarrowViewport } from './useNarrowViewport'

describe('useNarrowViewport', () => {
    const originalMatchMedia = window.matchMedia

    afterEach(() => {
        window.matchMedia = originalMatchMedia
    })

    function mockMatchMedia(matches: boolean) {
        const listeners = new Set<(event: { matches: boolean }) => void>()
        const state = { matches }
        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            get matches() {
                return state.matches
            },
            media: query,
            addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
                listeners.add(listener)
            },
            removeEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
                listeners.delete(listener)
            },
        })) as unknown as typeof window.matchMedia
        return {
            setMatches(next: boolean) {
                state.matches = next
                listeners.forEach((listener) => listener({ matches: next }))
            },
        }
    }

    it('reports false until the media query resolves', () => {
        mockMatchMedia(true)
        const { result } = renderHook(() => useNarrowViewport())
        expect(result.current).toBe(true)
    })

    it('updates when the viewport crosses the breakpoint', () => {
        const { setMatches } = mockMatchMedia(false)
        const { result } = renderHook(() => useNarrowViewport())
        expect(result.current).toBe(false)
        act(() => setMatches(true))
        expect(result.current).toBe(true)
        act(() => setMatches(false))
        expect(result.current).toBe(false)
    })
})
