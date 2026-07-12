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

export function buildGrokAgentArgs(opts: { cwd: string; model?: string; effort?: string }): string[] {
    // --cwd is a top-level Grok flag and must precede the `agent` subcommand.
    // session/new also carries cwd, but setting it at process start ensures
    // Grok discovers the correct project rules/plugins before initialization.
    const args = ['--cwd', opts.cwd, 'agent']
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
    cwd: string
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
