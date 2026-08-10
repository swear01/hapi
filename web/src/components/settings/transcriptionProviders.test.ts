import { describe, expect, test } from 'vitest'
import { DICTATION_PROVIDER_PRESETS, dictationOnboardProviders } from './transcriptionProviders'

describe('dictation provider presets', () => {
    test('offers the supported hosted presets in the intended order', () => {
        expect(DICTATION_PROVIDER_PRESETS).toEqual(['elevenlabs', 'openai', 'groq'])
    })
})

describe('dictationOnboardProviders', () => {
    test('shows only the curated presets when no legacy credentials exist', () => {
        expect(dictationOnboardProviders(false, false)).toEqual(['elevenlabs', 'openai', 'groq'])
    })

    test('keeps legacy providers manageable once their credentials exist', () => {
        expect(dictationOnboardProviders(true, true)).toEqual([
            'elevenlabs',
            'openai',
            'groq',
            'deepgram',
            'openai-compatible',
        ])
        expect(dictationOnboardProviders(true, false)).toEqual([
            'elevenlabs',
            'openai',
            'groq',
            'deepgram',
        ])
    })
})
