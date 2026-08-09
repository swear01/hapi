import { describe, expect, it } from 'vitest'
import { formatCost } from './usage'

describe('formatCost', () => {
    it('formats standard currency amounts', () => {
        expect(formatCost(2.5, 'USD')).toBe('$2.50')
    })

    it('keeps sub-cent amounts nonzero', () => {
        const rendered = formatCost(0.004, 'USD')
        expect(rendered).not.toBe('$0.00')
        expect(rendered).toContain('0.00')
    })

    it('falls back to a plain amount for unknown currencies', () => {
        expect(formatCost(0.5, 'NOPE')).toBe('0.5000 NOPE')
    })
})
