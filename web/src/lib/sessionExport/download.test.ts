import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ApiClient } from '@/api/client'
import type { HapiSessionExport } from '@hapi/protocol/sessionExport'
import { downloadSessionExport } from './download'

const warning = {
    type: 'warning' as const,
    count: 20_001,
    limit: 20_000,
    sizeBytes: 12_345_678
}

function makeExport(): HapiSessionExport {
    return {
        schemaVersion: 2,
        exportedAt: 1_762_000_000_000,
        session: {
            id: 'abcdef123456',
            metadata: { name: 'Export Demo' }
        } as HapiSessionExport['session'],
        messages: [],
        scratchlist: []
    }
}

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

describe('downloadSessionExport', () => {
    it('returns the server warning without creating a download', async () => {
        const getSessionExport = vi.fn().mockResolvedValue(warning)
        const result = await downloadSessionExport(
            { getSessionExport } as unknown as ApiClient,
            'session-1',
            'json'
        )

        expect(result).toEqual(warning)
        expect(getSessionExport).toHaveBeenCalledWith('session-1', {
            signal: undefined,
            allowLarge: undefined
        })
    })

    it('downloads the confirmed payload', async () => {
        const getSessionExport = vi.fn().mockResolvedValue(makeExport())
        const createObjectURL = vi.fn(() => 'blob:export')
        const revokeObjectURL = vi.fn()
        vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

        const result = await downloadSessionExport(
            { getSessionExport } as unknown as ApiClient,
            'session-1',
            'json',
            { allowLarge: true }
        )

        expect(result).toMatchObject({
            type: 'download',
            messageCount: 0
        })
        if (result.type !== 'download') throw new Error('Expected download result')
        expect(result.filename).toMatch(/^export-demo-abcdef12-\d{4}-\d{2}-\d{2}\.json$/)
        expect(getSessionExport).toHaveBeenCalledWith('session-1', {
            signal: undefined,
            allowLarge: true
        })
        expect(click).toHaveBeenCalledOnce()
        expect(createObjectURL).toHaveBeenCalledOnce()
    })
})
