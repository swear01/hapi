import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { I18nProvider } from '@/lib/i18n-context'
import { encodeBase64 } from '@/lib/utils'

const readSessionFile = vi.hoisted(() => vi.fn(async () => ({ success: true, content: 'iVBORw0K' })))

vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => vi.fn(),
}))

vi.mock('@/lib/app-context', () => ({
    useAppContext: () => ({ api: { readSessionFile } }),
}))

const markdown = [
    '[Sibling](error-notes.md)',
    '[Escape](../../outside.md)',
    '![Local](images/page-001.png)',
    '![Remote](https://example.com/image.png)',
].join('\n\n')

describe('MarkdownRenderer standalone file base', () => {
    it('resolves relative links and images against the Markdown file directory', async () => {
        render(
            <QueryClientProvider client={new QueryClient()}>
                <I18nProvider>
                    <MarkdownRenderer content={markdown} standalone sessionId="session-1" filePath="docs/notes-01.md" />
                </I18nProvider>
            </QueryClientProvider>
        )

        const sibling = screen.getByText('Sibling').closest('a')
        const search = new URLSearchParams({ path: encodeBase64('docs/error-notes.md'), origin: 'chat' })
        expect(sibling).toHaveAttribute('href', `/sessions/session-1/file?${search.toString()}`)
        expect(screen.getByText('Escape').closest('a')).toBeNull()

        await waitFor(() => {
            expect(screen.getByAltText('Local')).toHaveAttribute('src', 'data:image/png;base64,iVBORw0K')
        })
        expect(readSessionFile).toHaveBeenCalledWith('session-1', 'docs/images/page-001.png')
        expect(screen.getByAltText('Remote')).toHaveAttribute('src', 'https://example.com/image.png')
    })
})
