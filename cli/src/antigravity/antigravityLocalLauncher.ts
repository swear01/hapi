import { antigravityLocal } from './antigravityLocal'
import { AntigravitySession } from './session'
import { createAntigravitySessionScanner } from './utils/sessionScanner'
import { BaseLocalLauncher } from '@/modules/common/launcher/BaseLocalLauncher'

export async function antigravityLocalLauncher(
    session: AntigravitySession
): Promise<'switch' | 'exit'> {
    const scanner = createAntigravitySessionScanner({
        existingSessionId: session.sessionId,
        onSessionFound: (sessionId) => session.onSessionFound(sessionId)
    })

    const launcher = new BaseLocalLauncher({
        label: 'antigravity-local',
        failureLabel: 'Local Antigravity process failed',
        queue: session.queue,
        rpcHandlerManager: session.client.rpcHandlerManager,
        startedBy: session.startedBy,
        startingMode: session.startingMode,
        launch: async (abortSignal) => {
            await antigravityLocal({
                path: session.path,
                sessionId: session.sessionId,
                abort: abortSignal,
                permissionMode: session.getPermissionMode() as import('./types').PermissionMode | undefined
            })
        },
        sendFailureMessage: (message) => {
            session.sendSessionEvent({ type: 'message', message })
        },
        recordLocalLaunchFailure: (message, exitReason) => {
            session.recordLocalLaunchFailure(message, exitReason)
        }
    })

    try {
        return await launcher.run()
    } finally {
        scanner.cleanup()
    }
}
