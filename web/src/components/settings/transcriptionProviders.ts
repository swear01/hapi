import type { TranscriptionProvider } from '@hapi/protocol/voice'

/** Curated cloud presets shown when onboarding dictation credentials. */
export const DICTATION_PROVIDER_PRESETS = [
    'elevenlabs',
    'openai',
    'groq',
] as const satisfies readonly TranscriptionProvider[]

export type DictationProviderPreset = typeof DICTATION_PROVIDER_PRESETS[number]
