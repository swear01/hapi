import { logger } from '@/ui/logger';
import { randomUUID } from 'node:crypto';
import { loop, type EnhancedMode, type PermissionMode } from './loop';
import { MessageQueue2 } from '@/utils/MessageQueue2';
import { hashObject } from '@/utils/deterministicJson';
import { registerKillSessionHandler } from '@/claude/registerKillSessionHandler';
import type { AgentState } from '@/api/types';
import type { CodexSession } from './session';
import { parseCodexCliOverrides } from './utils/codexCliOverrides';
import { bootstrapExistingSession, bootstrapLazySession, bootstrapSession } from '@/agent/sessionFactory';
import { registerLocalHandoffHandler } from '@/agent/localHandoff';
import { createModeChangeHandler, createRunnerLifecycle, setControlledByUser } from '@/agent/runnerLifecycle';
import { isPermissionModeAllowedForFlavor } from '@hapi/protocol';
import { RPC_METHODS } from '@hapi/protocol/rpcMethods';
import { CodexCollaborationModeSchema, CodexPersonalitySchema, PermissionModeSchema } from '@hapi/protocol/schemas';
import { formatMessageWithAttachments } from '@/utils/attachmentFormatter';
import { getInvokedCwd } from '@/utils/invokedCwd';
import type { ReasoningEffort } from './appServerTypes';
import { parseCodexSpecialCommand } from './codexSpecialCommands';
import { listSlashCommands } from '@/modules/common/slashCommands';
import { listCodexModels, resolveCodexModel } from '@/modules/common/codexModels';
import type { CodexModelSummary } from '@hapi/protocol/apiTypes';
import { resolveCodexSlashCommand } from './utils/slashCommands';
import type { CodexPersonality } from '@hapi/protocol/modes';
import { parseReasoningEffortValue } from './utils/reasoningEffort';

export { emitReadyIfIdle } from './utils/emitReadyIfIdle';

export async function runCodex(opts: {
    startedBy?: 'runner' | 'terminal';
    codexArgs?: string[];
    permissionMode?: PermissionMode;
    resumeSessionId?: string;
    model?: string;
    modelReasoningEffort?: ReasoningEffort;
    serviceTier?: string;
    collaborationMode?: EnhancedMode['collaborationMode'];
    personality?: CodexPersonality | null;
    existingSessionId?: string;
    workingDirectory?: string;
}): Promise<void> {
    const workingDirectory = opts.workingDirectory ?? getInvokedCwd();
    const startedBy = opts.startedBy ?? 'terminal';

    logger.debug(`[codex] Starting with options: startedBy=${startedBy}`);

    let state: AgentState = {
        controlledByUser: false
    };
    const useLazyBootstrap = !opts.existingSessionId && startedBy === 'terminal';
    const bootstrap = opts.existingSessionId
        ? await bootstrapExistingSession({
            sessionId: opts.existingSessionId,
            flavor: 'codex',
            startedBy,
            workingDirectory
        })
        : await (useLazyBootstrap ? bootstrapLazySession : bootstrapSession)({
            flavor: 'codex',
            startedBy,
            workingDirectory,
            agentState: state,
            model: opts.model,
            modelReasoningEffort: opts.modelReasoningEffort
        });
    const { api, session, sessionInfo } = bootstrap;
    const codexSourceSessionId = typeof sessionInfo.metadata?.codexSourceSessionId === 'string'
        ? sessionInfo.metadata.codexSourceSessionId
        : undefined;

    const startingMode: 'local' | 'remote' = startedBy === 'runner' ? 'remote' : 'local';

    setControlledByUser(session, startingMode);

    const messageQueue = new MessageQueue2<EnhancedMode>((mode) => hashObject({
        permissionMode: mode.permissionMode,
        model: mode.model,
        modelReasoningEffort: mode.modelReasoningEffort,
        collaborationMode: mode.collaborationMode,
        proactiveMultiAgent: mode.proactiveMultiAgent,
        serviceTier: mode.serviceTier,
        personality: mode.personality
    }));

    const codexCliOverrides = parseCodexCliOverrides(opts.codexArgs);
    const sessionWrapperRef: { current: CodexSession | null } = { current: null };
    // 中文注释：当用户直接把现成的 Codex thread 导入到一个全新的 Hapi 会话时，
    // 需要在首次附着 transcript 时回放已有历史；恢复已有 Hapi 会话时则保持原来的增量模式，避免重复灌入旧消息。
    const replayTranscriptHistoryOnStart = useLazyBootstrap || Boolean(opts.resumeSessionId && !opts.existingSessionId);

    const persistedPermissionMode = sessionInfo.permissionMode ?? sessionInfo.metadata?.preferredPermissionMode;
    let currentPermissionMode: PermissionMode = opts.permissionMode
        ?? (persistedPermissionMode && isPermissionModeAllowedForFlavor(persistedPermissionMode, 'codex') ? persistedPermissionMode as PermissionMode : undefined)
        ?? 'default';
    let currentModel = opts.model;
    // Three states matter here: `undefined` inherits Codex configuration,
    // `null` explicitly clears a HAPI override, and a string explicitly sets it.
    let currentModelReasoningEffort: ReasoningEffort | null | undefined = opts.modelReasoningEffort;
    let currentCollaborationMode: EnhancedMode['collaborationMode'] = opts.collaborationMode ?? 'default';
    let currentProactiveMultiAgent: boolean | undefined;
    // Service tier (Fast mode), stored representation: `'fast'` and
    // `'standard'` are explicit user choices, `undefined`/`null` mean untouched
    // (use the account default). Prefer the spawn-time override (set by the hub
    // when resuming a session, mirroring model/effort) so a resumed Fast/Standard
    // thread immediately runs with the right tier; otherwise seed from the
    // persisted session. A persisted/absent `null` stays untouched (omitted).
    let currentServiceTier: string | null | undefined = opts.serviceTier ?? sessionInfo.serviceTier ?? undefined;
    let currentPersonality: CodexPersonality | null | undefined = opts.personality !== undefined
        ? opts.personality
        : sessionInfo.personality;
    let modelCatalog: Promise<CodexModelSummary[]> | undefined;
    const personalitySupported = async (model: string | null | undefined): Promise<boolean> => {
        try {
            modelCatalog ??= listCodexModels();
            return resolveCodexModel(await modelCatalog, model)?.supportsPersonality === true;
        } catch (error) {
            logger.debug('[codex] Unable to resolve personality support from model catalog', error);
            // Fail open when catalog discovery is unavailable so sessions still start.
            return true;
        }
    };
    const assertPersonalitySupported = async (personality: CodexPersonality | null | undefined): Promise<void> => {
        if (personality !== null && personality !== undefined && !await personalitySupported(currentModel)) {
            throw new Error('Selected model does not support personality');
        }
    };
    await assertPersonalitySupported(currentPersonality);

    const lifecycle = createRunnerLifecycle({
        session,
        logTag: 'codex',
        stopKeepAlive: () => sessionWrapperRef.current?.stopKeepAlive()
    });

    lifecycle.registerProcessHandlers();
    registerKillSessionHandler(session.rpcHandlerManager, lifecycle);
    registerLocalHandoffHandler(session.rpcHandlerManager, lifecycle);

    const applyCurrentConfigToSession = (options?: { syncModel?: boolean }) => {
        const sessionInstance = sessionWrapperRef.current;
        if (!sessionInstance) {
            return;
        }
        sessionInstance.setPermissionMode(currentPermissionMode);
        if (options?.syncModel !== false) {
            sessionInstance.setModel(currentModel ?? null);
        }
        // Do not collapse inherited Codex config into an explicit default.
        // Explicit clears remain `null` and must still be synchronized.
        if (currentModelReasoningEffort !== undefined) {
            sessionInstance.setModelReasoningEffort(currentModelReasoningEffort);
        }
        // Preserve the third state: only sync when the user/persisted session
        // has an explicit tier. `undefined` means "omit" so the keepalive does
        // not overwrite the account-default or persisted Fast tier with null.
        if (currentServiceTier !== undefined) {
            sessionInstance.setServiceTier(currentServiceTier);
        }
        sessionInstance.setCollaborationMode(currentCollaborationMode);
        if (currentPersonality !== undefined) sessionInstance.setPersonality(currentPersonality);
        logger.debug(
            `[Codex] Synced session config for keepalive: ` +
            `permissionMode=${currentPermissionMode}, model=${currentModel ?? 'auto'}, ` +
            `modelReasoningEffort=${currentModelReasoningEffort ?? 'default'}, collaborationMode=${currentCollaborationMode}`
        );
    };

    const applySlashUpdates = async (updates: {
        permissionMode?: PermissionMode;
        model?: string | null;
        modelReasoningEffort?: ReasoningEffort | null;
        collaborationMode?: EnhancedMode['collaborationMode'];
        serviceTier?: string | null;
        personality?: CodexPersonality | null;
        proactiveMultiAgent?: boolean;
    } | undefined): Promise<void> => {
        if (!updates) return;
        if (updates.permissionMode !== undefined) {
            currentPermissionMode = updates.permissionMode;
        }
        if (updates.model !== undefined) {
            currentModel = updates.model ?? undefined;
            if (currentPersonality !== null && currentPersonality !== undefined && !await personalitySupported(currentModel)) {
                currentPersonality = null;
            }
        }
        if (updates.modelReasoningEffort !== undefined) {
            currentModelReasoningEffort = updates.modelReasoningEffort;
        }
        if (updates.collaborationMode !== undefined) {
            currentCollaborationMode = updates.collaborationMode;
        }
        if (updates.serviceTier !== undefined) {
            currentServiceTier = updates.serviceTier;
        }
        if (updates.personality !== undefined) {
            await assertPersonalitySupported(updates.personality);
            currentPersonality = updates.personality;
        }
        if (updates.proactiveMultiAgent !== undefined) {
            currentProactiveMultiAgent = updates.proactiveMultiAgent;
        }
        applyCurrentConfigToSession();
    };

    const syncCurrentConfigFromSession = (): void => {
        const sessionPermissionMode = sessionWrapperRef.current?.getPermissionMode();
        if (sessionPermissionMode && isPermissionModeAllowedForFlavor(sessionPermissionMode, 'codex')) {
            currentPermissionMode = sessionPermissionMode as PermissionMode;
        }
        const sessionModel = sessionWrapperRef.current?.getModel();
        if (sessionModel !== undefined) {
            currentModel = sessionModel ?? undefined;
        }
        const sessionModelReasoningEffort = sessionWrapperRef.current?.getModelReasoningEffort();
        if (sessionModelReasoningEffort !== undefined) {
            currentModelReasoningEffort = sessionModelReasoningEffort as ReasoningEffort | null;
        }
        const sessionCollaborationMode = sessionWrapperRef.current?.getCollaborationMode();
        if (sessionCollaborationMode) {
            currentCollaborationMode = sessionCollaborationMode;
        }
        const sessionServiceTier = sessionWrapperRef.current?.getServiceTier();
        if (sessionServiceTier !== undefined) {
            currentServiceTier = sessionServiceTier;
        }
        const sessionPersonality = sessionWrapperRef.current?.getPersonality();
        if (sessionPersonality !== undefined) currentPersonality = sessionPersonality;
    };

    let userMessageChain: Promise<void> = Promise.resolve();
    session.onUserMessage((message, localId) => {
        userMessageChain = userMessageChain.then(async () => {
            try {
                syncCurrentConfigFromSession();
                let text = message.content.text;
                let isolatedCommandText: string | null = null;
                const commands = await listSlashCommands('codex', workingDirectory).catch(() => []);
                const slash = resolveCodexSlashCommand(text, {
                    commands,
                    permissionMode: currentPermissionMode,
                    collaborationMode: currentCollaborationMode,
                    model: currentModel,
                    modelReasoningEffort: currentModelReasoningEffort ?? undefined,
                    serviceTier: currentServiceTier,
                    proactiveMultiAgent: currentProactiveMultiAgent,
                    personality: currentPersonality
                });
                if (slash.kind === 'goal') {
                    if (slash.message) {
                        session.sendAgentMessage({
                            type: 'message',
                            message: slash.message,
                            id: randomUUID()
                        });
                    }
                    const goalCommand = slash.action === 'set'
                        ? `/goal ${slash.objective ?? ''}`
                        : slash.action === 'show'
                            ? '/goal'
                            : `/goal ${slash.action}`;
                    messageQueue.pushIsolateAndClear(goalCommand, {
                        permissionMode: currentPermissionMode ?? 'default',
                        model: currentModel,
                        modelReasoningEffort: currentModelReasoningEffort ?? undefined,
                        collaborationMode: currentCollaborationMode,
                        serviceTier: currentServiceTier,
                        personality: currentPersonality
                    }, localId);
                    return;
                }
                if (slash.kind !== 'passthrough') {
                    await applySlashUpdates(slash.updates);
                    if (slash.message) {
                        session.sendAgentMessage({
                            type: 'message',
                            message: slash.message,
                            id: randomUUID()
                        });
                    }
                    if (slash.kind === 'handled') {
                        if (localId) session.emitMessagesConsumed([localId]);
                        return;
                    }
                    text = slash.text;
                } else {
                    const specialCommand = parseCodexSpecialCommand(message.content.text);
                    if (specialCommand.type) {
                        logger.debug(`[Codex] Detected special command: ${specialCommand.type}`);
                        isolatedCommandText = message.content.text.trim();
                    }
                }
                text = formatMessageWithAttachments(text, message.content.attachments);

                const messagePermissionMode = currentPermissionMode;
                logger.debug(
                    `[Codex] User message received with permission mode: ${currentPermissionMode}, ` +
                    `model: ${currentModel ?? 'auto'}, modelReasoningEffort: ${currentModelReasoningEffort ?? 'default'}, ` +
                    `collaborationMode: ${currentCollaborationMode}`
                );

                const enhancedMode: EnhancedMode = {
                    permissionMode: messagePermissionMode ?? 'default',
                    model: currentModel,
                    modelReasoningEffort: currentModelReasoningEffort ?? undefined,
                    collaborationMode: currentCollaborationMode,
                    proactiveMultiAgent: currentProactiveMultiAgent,
                    serviceTier: currentServiceTier,
                    personality: currentPersonality
                };
                if (isolatedCommandText) {
                    messageQueue.pushIsolateAndClear(isolatedCommandText, enhancedMode, localId);
                    return;
                }
                messageQueue.push(text, enhancedMode, localId);
            } catch (error) {
                logger.debug('[Codex] Failed to handle user message', error);
                const enhancedMode: EnhancedMode = {
                    permissionMode: currentPermissionMode ?? 'default',
                    model: currentModel,
                    modelReasoningEffort: currentModelReasoningEffort ?? undefined,
                    collaborationMode: currentCollaborationMode,
                    proactiveMultiAgent: currentProactiveMultiAgent,
                    serviceTier: currentServiceTier,
                    personality: currentPersonality
                };
                messageQueue.push(formatMessageWithAttachments(message.content.text, message.content.attachments), enhancedMode, localId);
            }
        }).catch((error) => {
            logger.debug('[Codex] User message handler chain failed', error);
        });
    });

    session.onCancelQueuedMessage((localId) => {
        const removed = messageQueue.cancelByLocalId(localId);
        logger.debug(`[codex] cancelByLocalId(${localId}): ${removed ? 'removed' : 'not found (best-effort)'}`);
        return removed;
    });

    const formatFailureReason = (message: string): string => {
        const maxLength = 200;
        if (message.length <= maxLength) {
            return message;
        }
        return `${message.slice(0, maxLength)}...`;
    };

    const resolvePermissionMode = (value: unknown): PermissionMode => {
        const parsed = PermissionModeSchema.safeParse(value);
        if (!parsed.success || !isPermissionModeAllowedForFlavor(parsed.data, 'codex')) {
            throw new Error('Invalid permission mode');
        }
        return parsed.data as PermissionMode;
    };

    const resolveCollaborationMode = (value: unknown): EnhancedMode['collaborationMode'] => {
        if (value === null) {
            return 'default';
        }
        const parsed = CodexCollaborationModeSchema.safeParse(value);
        if (!parsed.success) {
            throw new Error('Invalid collaboration mode');
        }
        return parsed.data;
    };

    const resolveModel = (value: unknown): string => {
        if (typeof value !== 'string') {
            throw new Error('Invalid model');
        }
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            throw new Error('Invalid model');
        }
        return trimmedValue;
    };

    // Stored representation: `'fast'` and `'standard'` are explicit user
    // choices; `null` means untouched (use the account default). The
    // `'standard'` sentinel is only translated to the Codex app-server's
    // `serviceTier: null` when building thread/turn params — see
    // appServerConfig — so an explicit Fast-off stays sticky across resume.
    const resolveServiceTier = (value: unknown): string | null => {
        if (value === null) {
            return null;
        }
        if (typeof value !== 'string') {
            throw new Error('Invalid service tier');
        }
        const trimmedValue = value.trim().toLowerCase();
        if (trimmedValue === 'fast' || trimmedValue === 'standard') {
            return trimmedValue;
        }
        if (!trimmedValue || trimmedValue === 'default' || trimmedValue === 'auto') {
            return null;
        }
        throw new Error('Invalid service tier');
    };

    session.rpcHandlerManager.registerHandler(RPC_METHODS.SetSessionConfig, async (payload: unknown) => {
        if (!payload || typeof payload !== 'object') {
            throw new Error('Invalid session config payload');
        }
        const config = payload as { permissionMode?: unknown; model?: unknown; modelReasoningEffort?: unknown; collaborationMode?: unknown; serviceTier?: unknown; personality?: unknown };

        if (config.permissionMode !== undefined) {
            currentPermissionMode = resolvePermissionMode(config.permissionMode);
        }

        const shouldSyncModel = config.model !== undefined;
        if (shouldSyncModel) {
            currentModel = resolveModel(config.model);
            if (currentPersonality !== null && currentPersonality !== undefined && !await personalitySupported(currentModel)) {
                currentPersonality = null;
            }
        }

        if (config.modelReasoningEffort !== undefined) {
            currentModelReasoningEffort = parseReasoningEffortValue(config.modelReasoningEffort) ?? null;
        }

        if (config.collaborationMode !== undefined) {
            currentCollaborationMode = resolveCollaborationMode(config.collaborationMode);
        }

        if (config.serviceTier !== undefined) {
            currentServiceTier = resolveServiceTier(config.serviceTier);
        }
        if (config.personality !== undefined) {
            const personality = CodexPersonalitySchema.nullable().parse(config.personality);
            await assertPersonalitySupported(personality);
            currentPersonality = personality;
        }

        applyCurrentConfigToSession({ syncModel: shouldSyncModel });
        const applied: {
            permissionMode: PermissionMode;
            model?: string | null;
            modelReasoningEffort: ReasoningEffort | null;
            collaborationMode: EnhancedMode['collaborationMode'];
            serviceTier: string | null;
            personality?: CodexPersonality | null;
        } = {
            permissionMode: currentPermissionMode,
            modelReasoningEffort: currentModelReasoningEffort ?? null,
            collaborationMode: currentCollaborationMode,
            serviceTier: currentServiceTier ?? null
        };
        if (currentPersonality !== undefined) {
            applied.personality = currentPersonality;
        }
        if (shouldSyncModel) {
            applied.model = currentModel ?? null;
        }
        return {
            applied
        };
    });

    let crashed = false;

    try {
        await loop({
            path: workingDirectory,
            startingMode,
            messageQueue,
            api,
            session,
            codexArgs: opts.codexArgs,
            codexCliOverrides,
            startedBy,
            permissionMode: currentPermissionMode,
            model: currentModel,
            modelReasoningEffort: currentModelReasoningEffort ?? undefined,
            collaborationMode: currentCollaborationMode,
            personality: currentPersonality,
            resumeSessionId: opts.resumeSessionId,
            sourceSessionId: codexSourceSessionId,
            replayTranscriptHistoryOnStart,
            onModeChange: createModeChangeHandler(session),
            onSessionReady: (instance) => {
                sessionWrapperRef.current = instance;
                applyCurrentConfigToSession();
            }
        });
    } catch (error) {
        crashed = true;
        lifecycle.markCrash(error);
        logger.debug('[codex] Loop error:', error);
    } finally {
        const localFailure = sessionWrapperRef.current?.localLaunchFailure;
        if (localFailure?.exitReason === 'exit') {
            lifecycle.setExitCode(1);
            lifecycle.setArchiveReason(`Local launch failed: ${formatFailureReason(localFailure.message)}`);
            lifecycle.setSessionEndReason('error');
        } else if (!crashed) {
            lifecycle.setSessionEndReason('completed');
        }
        await lifecycle.cleanupAndExit();
    }
}
