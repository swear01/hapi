import { describe, expect, it } from 'vitest'
import { codexModelSupportsFastMode, isFastServiceTier } from './codexFastMode'

describe('codexModelSupportsFastMode', () => {
    it('accepts GPT-5.5 and GPT-5.4 variants', () => {
        expect(codexModelSupportsFastMode('gpt-5.5')).toBe(true)
        expect(codexModelSupportsFastMode('gpt-5.5-codex')).toBe(true)
        expect(codexModelSupportsFastMode('GPT-5.4')).toBe(true)
        expect(codexModelSupportsFastMode('gpt-5.4-codex')).toBe(true)
    })

    it('rejects unsupported or empty models', () => {
        expect(codexModelSupportsFastMode('gpt-5.3-codex-spark')).toBe(false)
        expect(codexModelSupportsFastMode('o3')).toBe(false)
        expect(codexModelSupportsFastMode(null)).toBe(false)
        expect(codexModelSupportsFastMode(undefined)).toBe(false)
        expect(codexModelSupportsFastMode('   ')).toBe(false)
    })
})

describe('isFastServiceTier', () => {
    it('detects the fast tier regardless of casing/spacing', () => {
        expect(isFastServiceTier('fast')).toBe(true)
        expect(isFastServiceTier(' Fast ')).toBe(true)
    })

    it('treats null/standard as not fast', () => {
        expect(isFastServiceTier(null)).toBe(false)
        expect(isFastServiceTier(undefined)).toBe(false)
        expect(isFastServiceTier('standard')).toBe(false)
    })
})
