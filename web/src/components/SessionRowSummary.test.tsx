import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import type { SessionSummary } from '@/types/api'
import { I18nProvider } from '@/lib/i18n-context'
import { SessionRowSummary } from './SessionRowSummary'

afterEach(() => cleanup())

function renderWithI18n(children: ReactNode) {
    return render(<I18nProvider>{children}</I18nProvider>)
}

function makeSummary(overrides: Partial<SessionSummary> & { id: string }): SessionSummary {
    return {
        active: true,
        thinking: false,
        activeAt: 0,
        updatedAt: 0,
        metadata: null,
        metadataVersion: 0,
        agentStateVersion: 0,
        todosUpdatedAt: 0,
        todoProgress: null,
        pendingRequestsCount: 0,
        pendingRequestKinds: [],
        pendingRequests: [],
        backgroundTaskCount: 0,
        futureScheduledMessageCount: 0,
        nextScheduledAt: null,
        model: null,
        effort: null,
        ...overrides,
    }
}

describe('SessionRowSummary model-error + attention', () => {
    it('shows model-error and permission attention together', () => {
        const summary = makeSummary({
            id: 's-both',
            pendingRequestsCount: 1,
            pendingRequestKinds: ['permission'],
            pendingRequests: [{ id: 'r1', kind: 'permission', tool: 'Bash', since: 0 }],
            metadata: {
                path: '/tmp/proj',
                lastModelError: {
                    eventId: 'evt-row-1',
                    kind: 'model_not_found',
                    transient: false,
                    rawSnippet: 'Unknown model',
                    atTs: 1,
                    priorAssistantClaimsDone: false,
                },
            },
        })

        renderWithI18n(
            <SessionRowSummary
                session={summary}
                showDetailedStatus
                selected={false}
                nestedTooltips={false}
            />
        )

        expect(screen.getByLabelText(/Model error/i)).toBeTruthy()
        expect(screen.getByLabelText('Permission required')).toBeTruthy()
    })

    it('refreshes unread attention when the local watermark version changes', () => {
        const session = makeSummary({
            id: 's-unread',
            active: false,
            backgroundTaskCount: 0,
            updatedAt: 2_000,
        })
        localStorage.setItem('hapi.sessionLastSeen.v1', JSON.stringify({ [session.id]: 2_000 }))
        const view = render(
            <I18nProvider>
                <SessionRowSummary
                    session={session}
                    showDetailedStatus={true}
                    lastSeenVersion={0}
                />
            </I18nProvider>
        )

        expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument()

        localStorage.setItem('hapi.sessionLastSeen.v1', JSON.stringify({ [session.id]: 1_999 }))
        view.rerender(
            <I18nProvider>
                <SessionRowSummary
                    session={session}
                    showDetailedStatus={true}
                    lastSeenVersion={1}
                />
            </I18nProvider>
        )

        expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('New activity')
    })

    it('shows an explicit unread dot for the selected session only', () => {
        const session = makeSummary({
            id: 'selected-unread',
            active: false,
            backgroundTaskCount: 0,
            updatedAt: 2_000,
        })
        localStorage.setItem('hapi.sessionLastSeen.v1', JSON.stringify({ [session.id]: 2_000 }))
        localStorage.setItem('hapi.sessionManualUnread.v1', JSON.stringify({ [session.id]: 2_000 }))

        const view = render(
            <I18nProvider>
                <SessionRowSummary
                    session={session}
                    selected={true}
                    showDetailedStatus={true}
                    lastSeenVersion={0}
                />
            </I18nProvider>
        )

        expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('New activity')

        view.rerender(
            <I18nProvider>
                <SessionRowSummary
                    session={{ ...session, updatedAt: 2_001 }}
                    selected={true}
                    showDetailedStatus={true}
                    lastSeenVersion={1}
                />
            </I18nProvider>
        )

        expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument()
    })

    it('shows an explicit unread dot before the thinking spinner', () => {
        const session = makeSummary({
            id: 'selected-thinking-unread',
            thinking: true,
            updatedAt: 2_000,
        })
        localStorage.setItem('hapi.sessionLastSeen.v1', JSON.stringify({ [session.id]: 2_000 }))
        localStorage.setItem('hapi.sessionManualUnread.v1', JSON.stringify({ [session.id]: 2_000 }))

        render(
            <I18nProvider>
                <SessionRowSummary
                    session={session}
                    selected={true}
                    showDetailedStatus={true}
                    lastSeenVersion={0}
                />
            </I18nProvider>
        )

        expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('New activity')
    })
})
