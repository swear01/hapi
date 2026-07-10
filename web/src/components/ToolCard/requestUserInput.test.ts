import { afterEach, describe, expect, it, vi } from 'vitest'
import { openRequestUserInputUrl, parseRequestUserInputInput } from './requestUserInput'

describe('MCP URL request user input', () => {
    afterEach(() => vi.restoreAllMocks())

    it('only exposes http(s) URLs to the approval UI', () => {
        expect(parseRequestUserInputInput({ url: 'https://example.com/login', questions: [] }).url)
            .toBe('https://example.com/login')
        expect(parseRequestUserInputInput({ url: 'javascript:alert(1)', questions: [] }).url)
            .toBeNull()
    })

    it('reports popup failures instead of treating the URL as opened', () => {
        const open = vi.spyOn(window, 'open').mockReturnValue(null)
        expect(openRequestUserInputUrl('https://example.com/login')).toBe(false)
        expect(open).toHaveBeenCalledWith('https://example.com/login', '_blank')
    })
})
