import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

async function collectAdditions(
    file: File,
    uploadFile = vi.fn(async () => ({ success: true, path: '/uploads/file' }))
) {
    const { createAttachmentAdapter } = await import('./attachmentAdapter')
    const adapter = createAttachmentAdapter({ uploadFile } as never, 'session-1')
    const additions = adapter.add({ file }) as AsyncIterable<Record<string, unknown>>
    const emitted: Record<string, unknown>[] = []

    for await (const attachment of additions) {
        emitted.push(attachment)
    }

    return { emitted, uploadFile }
}

function stubPreviewReadFailureThenUploadSuccess(): void {
    let readCount = 0
    class FileReaderMock {
        result: string | ArrayBuffer | null = null
        onload: FileReader['onload'] = null
        onerror: FileReader['onerror'] = null
        readAsDataURL(): void {
            readCount += 1
            if (readCount === 1) {
                this.onerror?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>)
                return
            }
            this.result = 'data:image/png;base64,dXBsb2Fk'
            this.onload?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>)
        }
    }
    vi.stubGlobal('FileReader', FileReaderMock)
}

describe('attachmentAdapter', () => {
    beforeEach(() => {
        vi.stubGlobal('indexedDB', undefined)
        vi.resetModules()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('uses the assistant-ui wildcard sentinel so all files reach the adapter', async () => {
        const { createAttachmentAdapter } = await import('./attachmentAdapter')
        const adapter = createAttachmentAdapter({} as never, 'session-1')

        expect(adapter.accept).toBe('*')
    })

    it('restores an uploaded draft without uploading it again', async () => {
        const drafts = await import('./composer-attachment-drafts')
        const { createAttachmentAdapter } = await import('./attachmentAdapter')
        const file = new File(['image'], 'ready.png', { type: 'image/png' })
        drafts.saveDraftAttachments('session-1', [{
            id: 'attachment-ready',
            file,
            path: '/uploads/ready.png',
            previewUrl: 'data:image/png;base64,aW1hZ2U=',
        }])
        const [restored] = await drafts.getDraftAttachments('session-1')
        expect(restored).toBeDefined()

        const uploadFile = vi.fn()
        const adapter = createAttachmentAdapter({ uploadFile } as never, 'session-1')
        const emitted = []
        const additions = adapter.add({ file: restored! }) as AsyncIterable<unknown>
        for await (const attachment of additions) {
            emitted.push(attachment)
        }

        expect(uploadFile).not.toHaveBeenCalled()
        expect(emitted).toEqual([expect.objectContaining({
            id: 'attachment-ready',
            path: '/uploads/ready.png',
            previewUrl: 'data:image/png;base64,aW1hZ2U=',
            status: { type: 'requires-action', reason: 'composer-send' },
        })])
    })

    it('keeps a successful upload ready when image preview generation fails', async () => {
        stubPreviewReadFailureThenUploadSuccess()
        const { createAttachmentAdapter } = await import('./attachmentAdapter')
        const uploadFile = vi.fn().mockResolvedValue({ success: true, path: '/uploads/proof.png' })
        const deleteUploadFile = vi.fn().mockResolvedValue({ success: true })
        const adapter = createAttachmentAdapter({ uploadFile, deleteUploadFile } as never, 'session-1')
        const file = new File(['proof'], 'proof.png', { type: 'image/png' })
        const states: import('@assistant-ui/react').PendingAttachment[] = []

        for await (const state of adapter.add({ file }) as AsyncGenerator<import('@assistant-ui/react').PendingAttachment>) {
            states.push(state)
        }

        const ready = states.at(-1) as import('@assistant-ui/react').PendingAttachment & {
            path?: string
            previewUrl?: string
        }
        expect(uploadFile).toHaveBeenCalledTimes(1)
        expect(uploadFile).toHaveBeenCalledWith('session-1', 'proof.png', 'dXBsb2Fk', 'image/png')
        expect(ready).toMatchObject({
            type: 'file',
            name: 'proof.png',
            status: { type: 'requires-action', reason: 'composer-send' },
            path: '/uploads/proof.png',
        })
        expect(ready.id).toEqual(expect.any(String))
        expect(ready.previewUrl).toBeUndefined()

        const sent = await adapter.send(ready)
        expect(JSON.parse((sent.content[0] as { text: string }).text)).toEqual({
            __attachmentMetadata: {
                id: ready.id,
                filename: 'proof.png',
                mimeType: 'image/png',
                size: file.size,
                path: '/uploads/proof.png',
            },
        })

        await adapter.remove(ready)
        expect(deleteUploadFile).toHaveBeenCalledWith('session-1', '/uploads/proof.png')
    })


})

describe('attachmentAdapter image previews', () => {
    it('includes the preview URL in every image upload state', async () => {
        const file = new File(['image'], 'photo.png', { type: 'image/png' })
        const readSpy = vi.spyOn(FileReader.prototype, 'readAsDataURL')
        const { emitted } = await collectAdditions(file)

        expect(emitted).toHaveLength(3)
        expect(emitted[0]).toMatchObject({
            previewUrl: 'data:image/png;base64,aW1hZ2U=',
            status: { type: 'running', progress: 0 }
        })
        expect(emitted[1]).toMatchObject({
            previewUrl: 'data:image/png;base64,aW1hZ2U=',
            status: { type: 'running', progress: 50 }
        })
        expect(emitted[2]).toMatchObject({
            previewUrl: 'data:image/png;base64,aW1hZ2U=',
            status: { type: 'requires-action' }
        })
        expect(readSpy).toHaveBeenCalledTimes(1)
    })

    it('does not generate previews for non-image attachments', async () => {
        const file = new File(['notes'], 'notes.txt', { type: 'text/plain' })
        const { emitted } = await collectAdditions(file)

        expect(emitted).toHaveLength(3)
        expect(emitted.every((attachment) => attachment.previewUrl === undefined)).toBe(true)
    })
})
