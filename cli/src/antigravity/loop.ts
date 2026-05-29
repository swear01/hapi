import { MessageQueue2 } from '@/utils/MessageQueue2'
import { logger } from '@/ui/logger'
import { runLocalRemoteSession } from '@/agent/loopBase'
import { AntigravitySession } from './session'
import { antigravityLocalLauncher } from './antigravityLocalLauncher'
import { ApiClient, ApiSessionClient } from '@/lib'
import type { AntigravityMode, PermissionMode } from './types'

interface AntigravityLoopOptions {
    path: string;
    startingMode?: 'local' | 'remote';
    startedBy?: 'runner' | 'terminal';
    onModeChange: (mode: 'local' | 'remote') => void;
    messageQueue: MessageQueue2<AntigravityMode>;
    session: ApiSessionClient;
    api: ApiClient;
    permissionMode?: PermissionMode;
    resumeSessionId?: string;
    onSessionReady?: (session: AntigravitySession) => void;
}

export async function antigravityLoop(opts: AntigravityLoopOptions): Promise<void> {
    const logPath = logger.getLogPath()
    const startedBy = opts.startedBy ?? 'terminal'
    const startingMode = opts.startingMode ?? 'local'

    const session = new AntigravitySession({
        api: opts.api,
        client: opts.session,
        path: opts.path,
        sessionId: opts.resumeSessionId ?? null,
        logPath,
        messageQueue: opts.messageQueue,
        onModeChange: opts.onModeChange,
        mode: startingMode,
        startedBy,
        startingMode,
        permissionMode: opts.permissionMode ?? 'default'
    })

    if (opts.resumeSessionId) {
        session.onSessionFound(opts.resumeSessionId)
    }

    // agy has no ACP remote mode; remote spawns fall back to local launcher
    await runLocalRemoteSession({
        session,
        startingMode: opts.startingMode,
        logTag: 'antigravity-loop',
        runLocal: (instance) => antigravityLocalLauncher(instance),
        runRemote: (instance) => antigravityLocalLauncher(instance),
        onSessionReady: opts.onSessionReady
    })
}
