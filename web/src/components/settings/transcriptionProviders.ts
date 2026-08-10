import type { TranscriptionProvider } from '@hapi/protocol/voice'

/** Curated cloud presets shown when onboarding dictation credentials. */
export const DICTATION_PROVIDER_PRESETS = [
    'elevenlabs',
    'openai',
    'groq',
] as const satisfies readonly TranscriptionProvider[]

export type DictationProviderPreset = typeof DICTATION_PROVIDER_PRESETS[number]

/**
 * Providers offered in the dictation credential onboard panel: the curated
 * presets, plus legacy providers that already have hub credentials so
 * existing keys stay rotatable/clearable from the UI.
 */
export function dictationOnboardProviders(
    includeDeepgram: boolean,
    includeOpenAICompatible: boolean
): Array<DictationProviderPreset | 'deepgram' | 'openai-compatible'> {
    return [
        ...DICTATION_PROVIDER_PRESETS,
        ...(includeDeepgram ? ['deepgram' as const] : []),
        ...(includeOpenAICompatible ? ['openai-compatible' as const] : []),
    ]
}
