import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { useRef, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '@/lib/i18n-context'
import type { PendingSchedule } from '@/components/AssistantChat/ScheduleTimePicker'
import type { ComposerSendIntent } from '@/lib/messageDelivery'
import { HappyComposer } from './HappyComposer'

/**
 * Focused harness for the generic model/effort value buttons and the
 * settings-sheet section order. Reuses the assistant-ui mock strategy from
 * HappyComposer.sendError.test.tsx but keeps ComposerButtons unmocked so the
 * new value buttons are exercised for real.
 */
type FakeAttachment = { id: string; status: { type: 'complete' } }
type MockComposerInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    asChild?: boolean
    maxRows?: number
    submitOnEnter?: boolean
    cancelOnEscape?: boolean
}
type FakeRuntimeState = {
    composer: { text: string; attachments: FakeAttachment[] }
    thread: { isRunning: boolean; isDisabled: boolean }
}

const runtime = vi.hoisted(() => ({
    snapshot: {
        composer: { text: '', attachments: [] as FakeAttachment[] },
        thread: { isRunning: false, isDisabled: false },
    } as FakeRuntimeState,
    setSnapshot: null as null | ((updater: (current: FakeRuntimeState) => FakeRuntimeState) => void),
    pendingSendIntentRef: { current: 'default' },
    sentIntents: [] as ComposerSendIntent[],
    narrowViewport: false,
}))

vi.mock('@assistant-ui/react', async () => {
    const React = await import('react')
    return {
        useAui: () => ({
            composer: () => ({
                setText: (text: string) => {
                    runtime.setSnapshot!((current) => ({
                        ...current,
                        composer: { ...current.composer, text },
                    }))
                },
                send: () => {
                    const intent = runtime.pendingSendIntentRef?.current ?? 'default'
                    runtime.sentIntents.push(intent as ComposerSendIntent)
                    if (runtime.pendingSendIntentRef) runtime.pendingSendIntentRef.current = 'default'
                    runtime.setSnapshot!((current) => ({
                        ...current,
                        composer: { text: '', attachments: [] },
                    }))
                },
                addAttachment: async () => {},
            }),
            thread: () => ({ cancelRun: () => {} }),
        }),
        useAuiState: (selector: (state: typeof runtime.snapshot) => unknown) => selector(runtime.snapshot),
        ComposerPrimitive: {
            Root: ({ children, onSubmit }: { children: ReactNode; onSubmit?: () => void }) => (
                <form onSubmit={onSubmit}>{children}</form>
            ),
            AddAttachment: ({ children }: { children: ReactNode }) => <>{children}</>,
            Input: React.forwardRef<HTMLTextAreaElement, MockComposerInputProps>(
                ({
                    asChild: _asChild,
                    onChange,
                    maxRows: _maxRows,
                    submitOnEnter: _submitOnEnter,
                    cancelOnEscape: _cancelOnEscape,
                    ...props
                }, ref) => (
                    <textarea
                        {...props}
                        ref={ref}
                        value={runtime.snapshot.composer.text}
                        onChange={(event) => {
                            runtime.setSnapshot!((current) => ({
                                ...current,
                                composer: { ...current.composer, text: event.target.value },
                            }))
                        }}
                    />
                ),
            ),
        },
    }
})
vi.mock('@/hooks/useComposerToolbarLayout', async () => {
    const actual = await import('@/hooks/useComposerToolbarLayout')
    return {
        ...actual,
        useComposerToolbarLayout: () => ({ layout: actual.DEFAULT_COMPOSER_TOOLBAR_LAYOUT }),
    }
})
vi.mock('@/hooks/useNarrowViewport', () => ({
    useNarrowViewport: () => runtime.narrowViewport,
}))
vi.mock('@/hooks/useComposerDraft', () => ({
    useComposerDraft: () => ({ sessionId: undefined, complete: true, restoredAny: false, hasStoredAttachments: false }),
}))
vi.mock('@/hooks/useComposerEnterBehavior', () => ({ useComposerEnterBehavior: () => ({ composerEnterBehavior: 'send' }) }))
vi.mock('@/hooks/usePlatform', () => ({ usePlatform: () => ({ haptic: { impact: () => {}, notification: () => {} }, isTouch: false }) }))
vi.mock('@/hooks/usePWAInstall', () => ({ usePWAInstall: () => ({ isStandalone: false, isIOS: false }) }))
vi.mock('@/hooks/useActiveWord', () => ({ useActiveWord: () => null }))
vi.mock('@/hooks/useActiveSuggestions', () => ({ useActiveSuggestions: () => [[], -1, () => {}, () => {}, () => {}] }))
vi.mock('@/components/ChatInput/FloatingOverlay', () => ({ FloatingOverlay: ({ children }: { children: ReactNode }) => <>{children}</> }))
vi.mock('@/components/ChatInput/Autocomplete', () => ({ Autocomplete: () => null }))
vi.mock('@/components/AssistantChat/StatusBar', () => ({ StatusBar: () => null }))
vi.mock('./PiModelPanel', () => ({ PiModelPanel: () => null }))
vi.mock('./PiThinkingLevelPanel', () => ({ PiThinkingLevelPanel: () => null }))

function renderComposer(agentFlavor: string) {
    render(
        <I18nProvider>
            <HappyComposer
                sessionId="composer-test"
                disabled={false}
                agentFlavor={agentFlavor}
                model="claude-sonnet-4"
                effort="high"
                permissionMode="default"
                onModelChange={vi.fn()}
                onEffortChange={vi.fn()}
                onPermissionModeChange={vi.fn()}
                availableModelOptions={[{ value: 'claude-sonnet-4', label: 'Sonnet 4' }]}
                pendingSendIntentRef={runtime.pendingSendIntentRef as { current: ComposerSendIntent }}
            />
        </I18nProvider>
    )
}

describe('HappyComposer generic model/effort value buttons', () => {
    afterEach(() => {
        cleanup()
        runtime.setSnapshot = null
        runtime.narrowViewport = false
        runtime.sentIntents = []
    })

    it('shows model and effort value buttons for Claude on wide viewports', () => {
        renderComposer('claude')
        expect(screen.getByRole('button', { name: 'Sonnet 4' })).toBeTruthy()
        expect(screen.getByRole('button', { name: 'High' })).toBeTruthy()
        expect(screen.getByRole('button', { name: 'Settings' })).toBeTruthy()
    })

    it('shows only the model button for flavors without effort support', () => {
        renderComposer('codex')
        expect(screen.getByRole('button', { name: 'Sonnet 4' })).toBeTruthy()
        expect(screen.queryByRole('button', { name: 'High' })).toBeNull()
    })

    it('hides value buttons on narrow viewports, keeping settings', () => {
        runtime.narrowViewport = true
        renderComposer('claude')
        expect(screen.queryByRole('button', { name: 'Sonnet 4' })).toBeNull()
        expect(screen.queryByRole('button', { name: 'High' })).toBeNull()
        expect(screen.getByRole('button', { name: 'Settings' })).toBeTruthy()
    })

    it('opens the settings sheet from the model button with Model before Permission', () => {
        renderComposer('claude')
        fireEvent.click(screen.getByRole('button', { name: 'Sonnet 4' }))
        const model = screen.getByText('Model')
        const permission = screen.getByText('Permission Mode')
        expect(model.compareDocumentPosition(permission) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        expect(screen.getByText('Effort')).toBeTruthy()
    })

    it('keeps Pi on its dedicated model/thinking buttons', () => {
        renderComposer('pi')
        // Generic value buttons are Pi-excluded; Pi panels stay the quick path.
        expect(screen.queryByRole('button', { name: 'Sonnet 4' })).toBeNull()
    })
})
