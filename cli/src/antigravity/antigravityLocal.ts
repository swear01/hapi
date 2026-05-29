import { logger } from '@/ui/logger'
import { spawnWithTerminalGuard } from '@/utils/spawnWithTerminalGuard'
import { buildAntigravityEnv } from './utils/config'
import type { PermissionMode } from './types'

export async function antigravityLocal(opts: {
    path: string;
    sessionId: string | null;
    abort: AbortSignal;
    permissionMode?: PermissionMode;
}): Promise<void> {
    const args: string[] = []

    if (opts.sessionId) {
        args.push('--conversation', opts.sessionId)
    }

    if (opts.permissionMode === 'yolo') {
        args.push('--dangerously-skip-permissions')
    } else if (opts.permissionMode === 'sandbox') {
        args.push('--sandbox')
    }

    args.push('--add-dir', opts.path)

    const env = buildAntigravityEnv()

    logger.debug(`[AntigravityLocal] Spawning agy with args: ${JSON.stringify(args)}`)

    await spawnWithTerminalGuard({
        command: 'agy',
        args,
        cwd: opts.path,
        env,
        signal: opts.abort,
        shell: process.platform === 'win32',
        logLabel: 'AntigravityLocal',
        spawnName: 'agy',
        installHint: 'Antigravity CLI',
        includeCause: true,
        logExit: true
    })
}
