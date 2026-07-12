import { AcpSdkBackend } from '@/agent/backends/acp'

function filterEnv(env: NodeJS.ProcessEnv): Record<string, string> {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(env)) {
        if (value !== undefined) {
            result[key] = value
        }
    }
    return result
}

export function buildGrokAgentArgs(opts: { model?: string; effort?: string }): string[] {
    const args = ['agent']
    if (opts.model) {
        args.push('--model', opts.model)
    }
    if (opts.effort) {
        args.push('--reasoning-effort', opts.effort)
    }
    args.push('stdio')
    return args
}

export function createGrokBackend(opts: {
    model?: string
    effort?: string
}): AcpSdkBackend {
    return new AcpSdkBackend({
        command: 'grok',
        args: buildGrokAgentArgs(opts),
        env: filterEnv(process.env)
    })
}

export function formatGrokError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error)
    if (/authentication required|no auth method id provided/i.test(message)) {
        return 'Grok authentication required. Run `grok login --device-auth` on this machine, or configure XAI_API_KEY.'
    }
    return message
}
