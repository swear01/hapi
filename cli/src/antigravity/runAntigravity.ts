import { logger } from '@/ui/logger'
import { antigravityLoop } from './loop'
import { MessageQueue2 } from '@/utils/MessageQueue2'
import { hashObject } from '@/utils/deterministicJson'
import { registerKillSessionHandler } from '@/claude/registerKillSessionHandler'
import type { AgentState } from '@/api/types'
import type { AntigravitySession } from './session'
import type { AntigravityMode, PermissionMode } from './types'
import { bootstrapExistingSession, bootstrapSession } from '@/agent/sessionFactory'
import { registerLocalHandoffHandler } from '@/agent/localHandoff'
import { createModeChangeHandler, createRunnerLifecycle, setControlledByUser } from '@/agent/runnerLifecycle'
import { registerSessionConfigRpc } from '@/agent/sessionConfigRpc'
import { formatMessageWithAttachments } from '@/utils/attachmentFormatter'
import { getInvokedCwd } from '@/utils/invokedCwd'

export async function runAntigravity(opts: {
    startedBy?: 'runner' | 'terminal';
    startingMode?: 'local' | 'remote';
    permissionMode?: PermissionMode;
    resumeSessionId?: string;
    existingSessionId?: string;
    workingDirectory?: string;
} = {}): Promise<void> {
    const workingDirectory = opts.workingDirectory ?? getInvokedCwd()
    const startedBy = opts.startedBy ?? 'terminal'

    logger.debug(`[antigravity] Starting with options: startedBy=${startedBy}, startingMode=${opts.startingMode}`)

    const initialState: AgentState = {
        controlledByUser: false
    }

    const bootstrap = opts.existingSessionId
        ? await bootstrapExistingSession({
            sessionId: opts.existingSessionId,
            flavor: 'antigravity',
            startedBy,
            workingDirectory
        })
        : await bootstrapSession({
            flavor: 'antigravity',
            startedBy,
            workingDirectory,
            agentState: initialState
        })
    const { api, session } = bootstrap

    const startingMode: 'local' | 'remote' = opts.startingMode
        ?? (startedBy === 'runner' ? 'remote' : 'local')

    setControlledByUser(session, startingMode)

    const messageQueue = new MessageQueue2<AntigravityMode>((mode) => hashObject({
        permissionMode: mode.permissionMode
    }))

    const sessionWrapperRef: { current: AntigravitySession | null } = { current: null }
    let currentPermissionMode: PermissionMode = opts.permissionMode ?? 'default'

    const lifecycle = createRunnerLifecycle({
        session,
        logTag: 'antigravity',
        stopKeepAlive: () => sessionWrapperRef.current?.stopKeepAlive()
    })

    lifecycle.registerProcessHandlers()
    registerKillSessionHandler(session.rpcHandlerManager, lifecycle.cleanupAndExit)
    registerLocalHandoffHandler(session.rpcHandlerManager, lifecycle)

    const syncSessionMode = () => {
        const sessionInstance = sessionWrapperRef.current
        if (!sessionInstance) {
            return
        }
        sessionInstance.setPermissionMode(currentPermissionMode)
        sessionInstance.pushKeepAlive()
        logger.debug(`[antigravity] Synced session config: permissionMode=${currentPermissionMode}`)
    }

    session.onUserMessage((message, localId) => {
        const formattedText = formatMessageWithAttachments(message.content.text, message.content.attachments)
        const mode: AntigravityMode = {
            permissionMode: currentPermissionMode
        }
        messageQueue.push(formattedText, mode, localId)
    })

    session.onCancelQueuedMessage((localId) => {
        const removed = messageQueue.cancelByLocalId(localId)
        logger.debug(`[antigravity] cancelByLocalId(${localId}): ${removed ? 'removed' : 'not found (best-effort)'}`)
        return removed
    })

    registerSessionConfigRpc<PermissionMode>({
        rpcHandlerManager: session.rpcHandlerManager,
        flavor: 'antigravity',
        modelMode: 'ignore',
        onApply: (config) => {
            if (config.permissionMode !== undefined) {
                currentPermissionMode = config.permissionMode
            }
        },
        onAfterApply: syncSessionMode
    })

    let crashed = false

    try {
        await antigravityLoop({
            path: workingDirectory,
            startingMode,
            startedBy,
            messageQueue,
            session,
            api,
            permissionMode: currentPermissionMode,
            resumeSessionId: opts.resumeSessionId,
            onModeChange: createModeChangeHandler(session),
            onSessionReady: (instance) => {
                sessionWrapperRef.current = instance
                syncSessionMode()
            }
        })
    } catch (error) {
        crashed = true
        lifecycle.markCrash(error)
        logger.debug('[antigravity] Loop error:', error)
    } finally {
        const localFailure = sessionWrapperRef.current?.localLaunchFailure
        if (localFailure?.exitReason === 'exit') {
            lifecycle.setExitCode(1)
            lifecycle.setArchiveReason(`Local launch failed: ${localFailure.message.slice(0, 200)}`)
            lifecycle.setSessionEndReason('error')
        } else if (!crashed) {
            lifecycle.setSessionEndReason('completed')
        }
        await lifecycle.cleanupAndExit()
    }
}
