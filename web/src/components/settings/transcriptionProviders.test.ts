import { describe, expect, test } from 'vitest'
import { DICTATION_PROVIDER_PRESETS } from './transcriptionProviders'

describe('dictation provider presets', () => {
    test('offers the supported hosted presets in the intended order', () => {
        expect(DICTATION_PROVIDER_PRESETS).toEqual(['elevenlabs', 'openai', 'groq'])
    })
})
