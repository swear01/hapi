import { logger } from '@/ui/logger';
import { randomUUID } from 'node:crypto';
import { opencodeLoop } from './loop';
import { MessageQueue2 } from '@/utils/MessageQueue2';
import { hashObject } from '@/utils/deterministicJson';
import { registerKillSessionHandler } from '@/claude/registerKillSessionHandler';
import type { AgentState } from '@/api/types';
import type { OpencodeSession } from './session';
import type { OpencodeMode, PermissionMode } from './types';
import { bootstrapExistingSession, bootstrapSession } from '@/agent/sessionFactory';
import { registerLocalHandoffHandler } from '@/agent/localHandoff';
import { createModeChangeHandler, createRunnerLifecycle, setControlledByUser } from '@/agent/runnerLifecycle';
import { registerSessionConfigRpc } from '@/agent/sessionConfigRpc';
import { startOpencodeHookServer } from './utils/startOpencodeHookServer';
import { formatMessageWithAttachments } from '@/utils/attachmentFormatter';
import { getInvokedCwd } from '@/utils/invokedCwd';
import { listSlashCommands } from '@/modules/common/slashCommands';
import { resolveOpencodeSlashCommand } from './utils/slashCommands';

export async function runOpencode(opts: {
    startedBy?: 'runner' | 'terminal';
    startingMode?: 'local' | 'remote';
    permissionMode?: PermissionMode;
    model?: string;
    modelReasoningEffort?: string | null;
    resumeSessionId?: string;
    existingSessionId?: string;
    workingDirectory?: string;
} = {}): Promise<void> {
    const workingDirectory = opts.workingDirectory ?? getInvokedCwd();
    const startedBy = opts.startedBy ?? 'terminal';

    logger.debug(`[opencode] Starting with options: startedBy=${startedBy}, startingMode=${opts.startingMode}`);

    if (startedBy === 'runner' && opts.startingMode === 'local') {
        logger.debug('[opencode] Runner spawn requested with local mode; forcing remote mode');
        opts.startingMode = 'remote';
    }

    const startingMode: 'local' | 'remote' = opts.startingMode
        ?? (startedBy === 'runner' ? 'remote' : 'local');

    if (opts.permissionMode === 'plan' && startingMode !== 'remote') {
        throw new Error('OpenCode plan mode is only supported in remote mode');
    }

    const initialState: AgentState = {
        controlledByUser: false
    };

    // Persist only when the user (or runner) explicitly chose a model on launch.
    // Mid-session selections are persisted by the hub via the set-session-config RPC,
    // not by this initial bootstrap.
    const initialModel = opts.model ?? null;
    const initialModelReasoningEffort = opts.modelReasoningEffort ?? null;

    const bootstrap = opts.existingSessionId
        ? await bootstrapExistingSession({
            sessionId: opts.existingSessionId,
            flavor: 'opencode',
            startedBy,
            workingDirectory
        })
        : await bootstrapSession({
            flavor: 'opencode',
            startedBy,
            workingDirectory,
            agentState: initialState,
            model: initialModel ?? undefined,
            modelReasoningEffort: initialModelReasoningEffort ?? undefined
        });
    const { api, session } = bootstrap;

    setControlledByUser(session, startingMode);

    const messageQueue = new MessageQueue2<OpencodeMode>((mode) => hashObject({
        permissionMode: mode.permissionMode,
        model: mode.model ?? null,
        modelReasoningEffort: mode.modelReasoningEffort ?? null
    }));

    const sessionWrapperRef: { current: OpencodeSession | null } = { current: null };
    let currentPermissionMode: PermissionMode = opts.permissionMode ?? 'default';
    let sessionModel: string | null = initialModel;
    let sessionModelReasoningEffort: string | null = initialModelReasoningEffort;
    const hookServer = await startOpencodeHookServer({
        onEvent: (event) => {
            const currentSession = sessionWrapperRef.current;
            if (!currentSession) {
                return;
            }
            currentSession.emitHookEvent(event);
        }
    });
    const hookUrl = `http://127.0.0.1:${hookServer.port}/hook/opencode`;

    const lifecycle = createRunnerLifecycle({
        session,
        logTag: 'opencode',
        stopKeepAlive: () => sessionWrapperRef.current?.stopKeepAlive(),
        onAfterClose: () => {
            hookServer.stop();
        }
    });

    lifecycle.registerProcessHandlers();
    registerKillSessionHandler(session.rpcHandlerManager, lifecycle.cleanupAndExit);
    registerLocalHandoffHandler(session.rpcHandlerManager, lifecycle);

    const syncSessionMode = () => {
        const sessionInstance = sessionWrapperRef.current;
        if (!sessionInstance) {
            return;
        }
        sessionInstance.setPermissionMode(currentPermissionMode);
        sessionInstance.setModel(sessionModel);
        sessionInstance.setModelReasoningEffort(sessionModelReasoningEffort);

        // Notify hub immediately so the UI reflects the change without
        // waiting for the next 2s keepalive tick.
        sessionInstance.pushKeepAlive();

        logger.debug(`[opencode] Synced session config for keepalive: permissionMode=${currentPermissionMode}, model=${sessionModel ?? '(default)'}, modelReasoningEffort=${sessionModelReasoningEffort ?? '(default)'}`);
    };

    let userMessageChain: Promise<void> = Promise.resolve();
    session.onUserMessage((message, localId) => {
        userMessageChain = userMessageChain.then(async () => {
            const buildMode = (): OpencodeMode => ({
                permissionMode: currentPermissionMode,
                model: sessionModel ?? undefined,
                modelReasoningEffort: sessionModelReasoningEffort
            });
            const pushPlain = () => {
                const formattedText = formatMessageWithAttachments(message.content.text, message.content.attachments);
                messageQueue.push(formattedText, buildMode(), localId);
            };
            try {
                let text = message.content.text;
                const commands = await listSlashCommands('opencode', workingDirectory).catch(() => []);
                const slash = resolveOpencodeSlashCommand(text, {
                    commands,
                    permissionMode: currentPermissionMode,
                    model: sessionModel,
                    modelReasoningEffort: sessionModelReasoningEffort
                });

                if (slash.kind !== 'passthrough') {
                    if (slash.updates) {
                        if (slash.updates.permissionMode !== undefined) {
                            currentPermissionMode = slash.updates.permissionMode;
                        }
                        if (slash.updates.model !== undefined) {
                            sessionModel = slash.updates.model;
                        }
                        if (slash.updates.modelReasoningEffort !== undefined) {
                            sessionModelReasoningEffort = slash.updates.modelReasoningEffort;
                        }
                        syncSessionMode();
                    }
                    if (slash.message) {
                        session.sendAgentMessage({
                            type: 'message',
                            message: slash.message,
                            id: randomUUID()
                        });
                    }
                    if (slash.kind === 'handled') {
                        if (localId) {
                            session.emitMessagesConsumed([localId]);
                        }
                        return;
                    }
                    text = slash.text;
                }

                const formattedText = formatMessageWithAttachments(text, message.content.attachments);
                messageQueue.push(formattedText, buildMode(), localId);
            } catch (error) {
                logger.debug('[opencode] Failed to handle user message', error);
                pushPlain();
            }
        }).catch((error) => {
            logger.debug('[opencode] User message handler chain failed', error);
        });
    });

    session.onCancelQueuedMessage((localId) => {
        const removed = messageQueue.cancelByLocalId(localId);
        logger.debug(`[opencode] cancelByLocalId(${localId}): ${removed ? 'removed' : 'not found (best-effort)'}`);
        return removed;
    });

    registerSessionConfigRpc<PermissionMode>({
        rpcHandlerManager: session.rpcHandlerManager,
        flavor: 'opencode',
        modelMode: 'nullable',
        modelReasoningEffortMode: 'nullable',
        onApply: (config) => {
            if (config.permissionMode !== undefined) {
                currentPermissionMode = config.permissionMode;
            }
            if (config.model !== undefined) {
                sessionModel = config.model;
            }
            if (config.modelReasoningEffort !== undefined) {
                sessionModelReasoningEffort = config.modelReasoningEffort;
            }
        },
        onAfterApply: syncSessionMode
    });

    let crashed = false;

    try {
        await opencodeLoop({
            path: workingDirectory,
            startingMode,
            startedBy,
            messageQueue,
            session,
            api,
            permissionMode: currentPermissionMode,
            model: sessionModel ?? undefined,
            modelReasoningEffort: sessionModelReasoningEffort,
            resumeSessionId: opts.resumeSessionId,
            hookServer,
            hookUrl,
            onModeChange: createModeChangeHandler(session),
            onReasoningEffortRollback: (effort) => {
                sessionModelReasoningEffort = effort;
            },
            onSessionReady: (instance) => {
                sessionWrapperRef.current = instance;
                syncSessionMode();
            }
        });
    } catch (error) {
        crashed = true;
        lifecycle.markCrash(error);
        logger.debug('[opencode] Loop error:', error);
    } finally {
        const localFailure = sessionWrapperRef.current?.localLaunchFailure;
        if (localFailure?.exitReason === 'exit') {
            lifecycle.setExitCode(1);
            lifecycle.setArchiveReason(`Local launch failed: ${localFailure.message.slice(0, 200)}`);
            lifecycle.setSessionEndReason('error');
        } else if (!crashed) {
            lifecycle.setSessionEndReason('completed');
        }
        await lifecycle.cleanupAndExit();
    }
}
