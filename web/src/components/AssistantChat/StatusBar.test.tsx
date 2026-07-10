import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '@/lib/i18n-context'
import { shouldShowComposerStatusBar, StatusBar } from './StatusBar'

describe('shouldShowComposerStatusBar', () => {
    it('hides the composer status bar for Cursor sessions', () => {
        expect(shouldShowComposerStatusBar('cursor')).toBe(false)
    })

    it('shows the composer status bar for other agents', () => {
        expect(shouldShowComposerStatusBar('claude')).toBe(true)
        expect(shouldShowComposerStatusBar('codex')).toBe(true)
        expect(shouldShowComposerStatusBar(null)).toBe(true)
    })
})

describe('StatusBar', () => {
    it('shows the selected Codex reasoning effort', () => {
        render(
            <I18nProvider>
                <StatusBar
                    active
                    thinking={false}
                    agentState={null}
                    agentFlavor="codex"
                    model="gpt-5.6-sol"
                    modelReasoningEffort="xhigh"
                />
            </I18nProvider>
        )

        expect(screen.getByText('reasoning xhigh')).toBeInTheDocument()
    })
})
