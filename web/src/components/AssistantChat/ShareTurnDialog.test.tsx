import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '@/lib/i18n-context'
import { ShareTurnDialog } from './ShareTurnDialog'

vi.mock('html2canvas-pro', () => ({
    default: vi.fn(async () => {
        const canvas = document.createElement('canvas')
        Object.defineProperty(canvas, 'toBlob', {
            value: (callback: BlobCallback) => callback(new Blob(['png'], { type: 'image/png' })),
        })
        return canvas
    }),
}))

const snapshots = [{
    html: `
        <div data-hapi-message-role="assistant">
            <div data-hapi-generated-media-id="generated-1" data-hapi-generated-media-file-name="fixture.zip">
                <button type="button" data-hapi-generated-media-download="true">Prepare download</button>
            </div>
        </div>
    `,
    text: 'Prepare download',
    role: 'assistant' as const,
}]

function renderDialog(getGeneratedMediaBlob?: (imageId: string) => Promise<Blob>, isOpen = true) {
    return render(
        <I18nProvider>
            <ShareTurnDialog
                isOpen={isOpen}
                title="Generated file fixture"
                metadataItems={[]}
                sourceSnapshots={snapshots}
                getGeneratedMediaBlob={getGeneratedMediaBlob}
                onClose={vi.fn()}
            />
        </I18nProvider>
    )
}

afterEach(() => {
    vi.restoreAllMocks()
})

describe('ShareTurnDialog generated-file lifecycle', () => {
    it('removes generated-file controls when no loader is available', async () => {
        renderDialog()

        await waitFor(() => expect(screen.queryByRole('button', { name: 'Prepare download' })).not.toBeInTheDocument())
    })

    it('restores native link semantics after preparing a download', async () => {
        vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fixture')
        renderDialog(vi.fn(async () => new Blob(['file'], { type: 'application/zip' })))

        fireEvent.click(await screen.findByRole('button', { name: 'Prepare download' }))

        await waitFor(() => {
            const link = document.querySelector<HTMLAnchorElement>('a[download="fixture.zip"]')
            expect(link).not.toBeNull()
            expect(link).not.toHaveAttribute('role')
            expect(link).not.toHaveAttribute('tabindex')
        })
    })

    it('ignores a generated-file response after the preview closes', async () => {
        let resolveBlob: ((blob: Blob) => void) | undefined
        const getGeneratedMediaBlob = vi.fn(() => new Promise<Blob>((resolve) => {
            resolveBlob = resolve
        }))
        const createObjectUrl = vi.spyOn(URL, 'createObjectURL')
        const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click')
        const view = renderDialog(getGeneratedMediaBlob)

        fireEvent.click(await screen.findByRole('button', { name: 'Prepare download' }))
        await waitFor(() => expect(getGeneratedMediaBlob).toHaveBeenCalledWith('generated-1'))

        view.rerender(
            <I18nProvider>
                <ShareTurnDialog
                    isOpen={false}
                    title="Generated file fixture"
                    metadataItems={[]}
                    sourceSnapshots={snapshots}
                    getGeneratedMediaBlob={getGeneratedMediaBlob}
                    onClose={vi.fn()}
                />
            </I18nProvider>
        )

        await act(async () => {
            resolveBlob?.(new Blob(['file'], { type: 'application/zip' }))
            await Promise.resolve()
            await Promise.resolve()
        })

        expect(createObjectUrl).not.toHaveBeenCalled()
        expect(anchorClick).not.toHaveBeenCalled()
    })
})
