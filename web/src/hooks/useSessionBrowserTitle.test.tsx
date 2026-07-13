import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Session } from '@/types/api'
import { useSessionBrowserTitle } from './useSessionBrowserTitle'

function makeSession(metadata: Session['metadata']): Session {
    return {
        id: 'session-1234567890',
        active: true,
        thinking: false,
        activeAt: 0,
        updatedAt: 0,
        metadata,
    } as Session
}

describe('useSessionBrowserTitle', () => {
    it('tracks session title updates and restores the app title on unmount', () => {
        document.title = 'HAPI'
        const initialSession = makeSession({
            path: '/work/hapi',
            host: 'localhost',
            summary: { text: 'Initial summary', updatedAt: 1 },
        })

        const { rerender, unmount } = renderHook(
            ({ session }) => useSessionBrowserTitle(session),
            { initialProps: { session: initialSession } },
        )

        expect(document.title).toBe('Initial summary - HAPI')

        rerender({
            session: makeSession({
                ...initialSession.metadata!,
                name: 'Renamed session',
            }),
        })

        expect(document.title).toBe('Renamed session - HAPI')

        unmount()
        expect(document.title).toBe('HAPI')
    })
})
