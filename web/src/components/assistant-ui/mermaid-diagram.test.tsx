import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, waitFor } from '@testing-library/react'

const mermaidMocks = vi.hoisted(() => ({
    initializeMock: vi.fn(),
    renderMock: vi.fn(),
    setParseErrorHandlerMock: vi.fn(),
}))

vi.mock('mermaid', () => ({
    default: {
        initialize: mermaidMocks.initializeMock,
        render: mermaidMocks.renderMock,
        setParseErrorHandler: mermaidMocks.setParseErrorHandlerMock,
    }
}))

import { MermaidDiagram } from '@/components/assistant-ui/mermaid-diagram'
import { MARKDOWN_COMPONENTS_BY_LANGUAGE } from '@/components/assistant-ui/markdown-text'

function renderMermaid(code: string) {
    return render(
        <MermaidDiagram
            code={code}
            language="mermaid"
            components={{
                Pre: (props) => <pre {...props} />,
                Code: (props) => <code {...props} />,
            }}
        />
    )
}

describe('MermaidDiagram', () => {
    beforeEach(() => {
        mermaidMocks.initializeMock.mockClear()
        mermaidMocks.setParseErrorHandlerMock.mockClear()
        mermaidMocks.renderMock.mockReset()
        mermaidMocks.renderMock.mockResolvedValue({
            svg: '<svg data-testid="mock-mermaid"></svg>'
        })
    })

    afterEach(() => {
        cleanup()
        document.documentElement.removeAttribute('data-theme')
    })

    it('is wired into the shared markdown language overrides and renders svg output', async () => {
        renderMermaid('graph TD\nA --> B')

        await waitFor(() => {
            const diagram = document.querySelector('[data-mermaid-diagram][data-rendered="true"]')
            expect(diagram).toBeTruthy()
            expect(diagram?.querySelector('[data-testid="mock-mermaid"]')).toBeTruthy()
        })

        expect(mermaidMocks.initializeMock).toHaveBeenCalled()
        expect(mermaidMocks.initializeMock).toHaveBeenCalledWith(expect.objectContaining({
            securityLevel: 'strict'
        }))
        expect(mermaidMocks.renderMock).toHaveBeenCalledWith(expect.stringContaining('mermaid-'), 'graph TD\nA --> B')
        expect(MARKDOWN_COMPONENTS_BY_LANGUAGE.mermaid.SyntaxHighlighter).toBe(MermaidDiagram)
    })

    it('falls back to source and suppresses Mermaid parse-error side effects when render fails', async () => {
        document.documentElement.dataset.theme = 'dark'
        mermaidMocks.renderMock.mockRejectedValueOnce(new Error('invalid Mermaid'))

        renderMermaid('graph TD\nA --')

        await waitFor(() => {
            const fallback = document.querySelector('.aui-mermaid-fallback')
            expect(fallback).toBeTruthy()
            expect(fallback?.textContent).toBe('graph TD\nA --')
        })

        expect(mermaidMocks.initializeMock).toHaveBeenCalledWith(expect.objectContaining({
            suppressErrors: true,
        }))
        expect(mermaidMocks.setParseErrorHandlerMock).toHaveBeenCalled()
    })
})
