import { describe, expect, it } from 'bun:test'
import { resolveWindowBounds } from '../src/main/windowBounds'

const primary = { x: 0, y: 0, width: 1920, height: 1080 }

describe('resolveWindowBounds', () => {
    it('keeps restored bounds that intersect a connected display', () => {
        expect(resolveWindowBounds(
            { x: 100, y: 120, width: 900, height: 600 },
            [primary],
            primary
        )).toEqual({ x: 100, y: 120, width: 900, height: 600 })
    })

    it('centers restored bounds that no longer intersect a connected display', () => {
        expect(resolveWindowBounds(
            { x: 3000, y: 100, width: 900, height: 600 },
            [primary],
            primary
        )).toEqual({ x: 510, y: 240, width: 900, height: 600 })
    })
})
