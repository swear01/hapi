import { spawn } from 'node:child_process'
import type { GrokModelSummary, GrokModelsResponse } from '@hapi/protocol/apiTypes'
import { getErrorMessage } from './rpcResponses'

export interface ListGrokModelsForCwdRequest {
    cwd?: string
}

export type ListGrokModelsForCwdResponse = GrokModelsResponse

interface CacheEntry {
    expiresAt: number
    response: ListGrokModelsForCwdResponse
}

const CACHE_TTL_MS = 60_000
const PROBE_TIMEOUT_MS = 15_000
const cache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<ListGrokModelsForCwdResponse>>()

export function buildGrokModelsArgs(cwd: string): string[] {
    return ['--cwd', cwd, 'models']
}

export function parseGrokModelsOutput(output: string): {
    availableModels: GrokModelSummary[]
    currentModelId: string | null
} {
    const availableModels: GrokModelSummary[] = []
    const seen = new Set<string>()
    let currentModelId: string | null = null
    let inAvailableModels = false

    for (const rawLine of output.split(/\r?\n/)) {
        const line = rawLine.trim()
        if (line.startsWith('Default model:')) {
            currentModelId = line.slice('Default model:'.length).trim() || null
            continue
        }
        if (line === 'Available models:') {
            inAvailableModels = true
            continue
        }
        if (!inAvailableModels || !line.startsWith('*')) continue

        const modelId = line.slice(1).replace(/\s+\(default\)\s*$/, '').trim()
        if (!modelId || seen.has(modelId)) continue
        seen.add(modelId)
        availableModels.push({ modelId })
    }

    if (currentModelId && !seen.has(currentModelId)) {
        availableModels.unshift({ modelId: currentModelId })
    }

    return { availableModels, currentModelId }
}

async function runGrokModelsProbe(cwd: string): Promise<ListGrokModelsForCwdResponse> {
    return await new Promise((resolve, reject) => {
        const child = spawn('grok', buildGrokModelsArgs(cwd), {
            env: process.env,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: process.platform === 'win32',
            windowsHide: process.platform === 'win32'
        })
        let stdout = ''
        let stderr = ''
        let settled = false

        const timeout = setTimeout(() => {
            if (settled) return
            settled = true
            child.kill('SIGTERM')
            reject(new Error('Grok model discovery timed out'))
        }, PROBE_TIMEOUT_MS)

        child.stdout?.on('data', (chunk) => {
            stdout += chunk.toString()
        })
        child.stderr?.on('data', (chunk) => {
            stderr += chunk.toString()
        })
        child.on('error', (error) => {
            if (settled) return
            settled = true
            clearTimeout(timeout)
            reject(error)
        })
        child.on('exit', (code) => {
            if (settled) return
            settled = true
            clearTimeout(timeout)
            if (code !== 0) {
                reject(new Error(stderr.trim() || `grok models exited with code ${code}`))
                return
            }
            resolve({ success: true, ...parseGrokModelsOutput(stdout) })
        })
    })
}

export async function listGrokModelsForCwd(cwd: string): Promise<ListGrokModelsForCwdResponse> {
    const trimmed = cwd?.trim()
    if (!trimmed) return { success: false, error: 'cwd is required' }

    const cached = cache.get(trimmed)
    if (cached && cached.expiresAt > Date.now()) return cached.response

    const running = inflight.get(trimmed)
    if (running) return running

    const promise = (async () => {
        try {
            const response = await runGrokModelsProbe(trimmed)
            if (response.success) {
                cache.set(trimmed, { expiresAt: Date.now() + CACHE_TTL_MS, response })
            }
            return response
        } catch (error) {
            return {
                success: false,
                error: getErrorMessage(error, 'Failed to discover Grok models')
            }
        } finally {
            inflight.delete(trimmed)
        }
    })()

    inflight.set(trimmed, promise)
    return promise
}

export function _resetGrokModelsCacheForTests(): void {
    cache.clear()
    inflight.clear()
}
