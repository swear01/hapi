import { describe, expect, it } from 'vitest'
import { getOpencodeModelsRefetchInterval, shouldRetryOpencodeModelsQuery } from './useOpencodeModels'

describe('useOpencodeModels retry policy', () => {
    it('retries early failures while the session model RPC may still be registering', () => {
        expect(shouldRetryOpencodeModelsQuery(0)).toBe(true)
        expect(shouldRetryOpencodeModelsQuery(2)).toBe(true)
        expect(shouldRetryOpencodeModelsQuery(3)).toBe(false)
    })

    it('polls briefly until OpenCode session models are discovered', () => {
        expect(getOpencodeModelsRefetchInterval(true, undefined)).toBe(1000)
        expect(getOpencodeModelsRefetchInterval(true, { success: true, availableModels: [] })).toBe(1000)
        expect(getOpencodeModelsRefetchInterval(true, { success: false, error: 'not ready' })).toBe(1000)
    })

    it('stops polling once model options are available or the query is disabled', () => {
        expect(getOpencodeModelsRefetchInterval(true, {
            success: true,
            availableModels: [{ modelId: 'provider/model', name: 'Provider Model' }],
            currentModelId: 'provider/model'
        })).toBe(false)
        expect(getOpencodeModelsRefetchInterval(false, undefined)).toBe(false)
    })
})
