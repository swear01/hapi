// Codex Fast mode (service tier) is only available on models that advertise it.
// Per OpenAI's Codex speed docs, that is currently GPT-5.5 and GPT-5.4. The
// toggle must stay hidden for any other model so we never POST a service tier
// the backend/model would reject.
const FAST_MODE_MODEL_PATTERN = /gpt-5\.(4|5)(\b|-)/

export function codexModelSupportsFastMode(model?: string | null): boolean {
    const normalized = model?.trim().toLowerCase()
    if (!normalized) {
        return false
    }
    return FAST_MODE_MODEL_PATTERN.test(normalized)
}

export function isFastServiceTier(serviceTier?: string | null): boolean {
    return serviceTier?.trim().toLowerCase() === 'fast'
}
