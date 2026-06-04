import React from 'react';
import { logger } from '@/ui/logger';
import { buildHapiMcpBridge } from '@/codex/utils/buildHapiMcpBridge';
import { convertAgentMessage } from '@/agent/messageConverter';
import { PermissionAdapter } from '@/agent/permissionAdapter';
import type { AgentMessage, McpServerStdio, PromptContent } from '@/agent/types';
import {
    RemoteLauncherBase,
    type RemoteLauncherDisplayContext,
    type RemoteLauncherExitReason
} from '@/modules/common/remote/RemoteLauncherBase';
import { OpencodeDisplay } from '@/ui/ink/OpencodeDisplay';
import type { CursorSession } from './session';
import type { PermissionMode } from './loop';
import { createCursorAcpBackend, CURSOR_ACP_REQUIRED_MESSAGE } from './utils/cursorAcpBackend';
import { setCursorAcpModelsSnapshot } from './utils/cursorAcpModelsBridge';
import { buildCursorModelsSnapshotFromAcp } from './utils/cursorAcpModelsSnapshot';
import { CursorExtensionAdapter } from './utils/cursorExtensionAdapter';
import { applyCursorAcpMode, applyCursorAcpModel, wireIdForCursorSessionState } from './utils/cursorModeConfig';
import { seedCursorModelsCache } from '@/modules/common/cursorModels';
import type { AcpSdkBackend } from '@/agent/backends/acp';

class CursorAcpRemoteLauncher extends RemoteLauncherBase {
    private readonly session: CursorSession;
    private backend: ReturnType<typeof createCursorAcpBackend> | null = null;
    private permissionAdapter: PermissionAdapter | null = null;
    private extensionAdapter: CursorExtensionAdapter | null = null;
    private happyServer: { stop: () => void } | null = null;
    private abortController = new AbortController();
    private displayPermissionMode: PermissionMode | null = null;
    private currentBackendModel: string | null = null;
    private defaultBackendModel: string | null = null;

    constructor(session: CursorSession) {
        super(process.env.DEBUG ? session.logPath : undefined);
        this.session = session;
    }

    public async launch(): Promise<RemoteLauncherExitReason> {
        return this.start({
            onExit: () => this.handleExitFromUi(),
            onSwitchToLocal: () => this.handleSwitchFromUi()
        });
    }

    protected createDisplay(context: RemoteLauncherDisplayContext): React.ReactElement {
        return React.createElement(OpencodeDisplay, context);
    }

    protected async runMainLoop(): Promise<void> {
        const session = this.session;
        const messageBuffer = this.messageBuffer;

        const { server: happyServer, mcpServers } = await buildHapiMcpBridge(session.client);
        this.happyServer = happyServer;

        const backend = createCursorAcpBackend({ cwd: session.path, model: session.model });
        this.backend = backend;

        backend.setUsageUpdateListener((message) => this.handleAgentMessage(message));

        backend.onStderrError((error) => {
            logger.debug('[cursor-acp] stderr error', error);
            session.sendSessionEvent({ type: 'message', message: error.message });
            messageBuffer.addMessage(error.message, 'status');
        });

        try {
            await backend.initialize();
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            throw new Error(`${CURSOR_ACP_REQUIRED_MESSAGE} (${errMsg})`);
        }

        await backend.authenticateIfAvailable('cursor_login');

        const extensionAdapter = new CursorExtensionAdapter(
            session.client,
            backend,
            (message) => this.handleAgentMessage(message)
        );
        this.extensionAdapter = extensionAdapter;

        this.permissionAdapter = new PermissionAdapter(
            session.client,
            backend,
            () => session.getPermissionMode(),
            (response) => extensionAdapter.handlePermissionResponse(response)
        );

        const resumeSessionId = session.sessionId;
        const mcpServerList = toAcpMcpServers(mcpServers);
        let acpSessionId: string;

        if (resumeSessionId && backend.supportsLoadSession()) {
            try {
                acpSessionId = await backend.loadSession({
                    sessionId: resumeSessionId,
                    cwd: session.path,
                    mcpServers: mcpServerList
                });
            } catch (error) {
                logger.warn('[cursor-acp] session/load failed', error);
                throw new Error(
                    'Failed to resume Cursor ACP session. Legacy stream-json sessions cannot be loaded via ACP.'
                );
            }
        } else if (resumeSessionId) {
            throw new Error(
                'Cursor ACP session/load is not supported by this agent build. Start a new Cursor session.'
            );
        } else {
            acpSessionId = await backend.newSession({
                cwd: session.path,
                mcpServers: mcpServerList
            });
        }

        session.onSessionFoundWithProtocol(acpSessionId, 'acp');

        syncCursorModelsFromAcp(backend, acpSessionId);

        const initialMetadata = backend.getSessionModelsMetadata(acpSessionId);
        this.currentBackendModel = initialMetadata?.currentModelId ?? session.model ?? null;
        this.defaultBackendModel = this.currentBackendModel;

        const previousSetModel = session.setModel.bind(session);

        await applyCursorAcpMode(backend, acpSessionId, session.getPermissionMode() as PermissionMode);
        if (session.model) {
            const initialModel = await applyCursorAcpModel(backend, acpSessionId, session.model);
            const resolvedWireId = initialModel.resolvedWireId
                ?? (this.currentBackendModel && !isSpawnDefaultModel(this.currentBackendModel)
                    ? this.currentBackendModel
                    : undefined);
            if (resolvedWireId) {
                const sessionWire = wireIdForCursorSessionState(session.model ?? resolvedWireId, resolvedWireId);
                this.currentBackendModel = sessionWire;
                previousSetModel(sessionWire);
                this.pushModelStatusLine(sessionWire);
                session.pushKeepAlive();
                syncCursorModelsFromAcp(backend, acpSessionId);
            }
        } else if (this.currentBackendModel && !isSpawnDefaultModel(this.currentBackendModel)) {
            this.pushModelStatusLine(this.currentBackendModel);
        }

        this.installLiveSessionConfigSync(backend, acpSessionId, previousSetModel);

        this.applyDisplayMode(session.getPermissionMode() as PermissionMode);

        this.setupAbortHandlers(session.client.rpcHandlerManager, {
            onAbort: () => this.handleAbort(),
            onSwitch: () => this.handleSwitchRequest()
        });

        const sendReady = () => {
            session.sendSessionEvent({ type: 'ready' });
        };

        while (!this.shouldExit) {
            const waitSignal = this.abortController.signal;
            const batch = await session.queue.waitForMessagesAndGetAsString(waitSignal);
            if (!batch) {
                if (waitSignal.aborted && !this.shouldExit) {
                    continue;
                }
                break;
            }

            const requestedModel = batch.mode.model === null
                ? this.defaultBackendModel
                : batch.mode.model;

            const modelChanged = Boolean(
                requestedModel && requestedModel !== this.currentBackendModel
            );
            if (modelChanged) {
                const modelResult = await applyCursorAcpModel(backend, acpSessionId, requestedModel);
                if (modelResult.applied && modelResult.resolvedWireId) {
                    const sessionWire = wireIdForCursorSessionState(
                        requestedModel ?? modelResult.resolvedWireId,
                        modelResult.resolvedWireId
                    );
                    this.currentBackendModel = sessionWire;
                    batch.mode.model = sessionWire;
                    previousSetModel(sessionWire);
                    this.pushModelStatusLine(sessionWire);
                    session.pushKeepAlive();
                    syncCursorModelsFromAcp(backend, acpSessionId);
                } else {
                    batch.mode.model = this.currentBackendModel ?? undefined;
                }
            }

            await applyCursorAcpMode(backend, acpSessionId, batch.mode.permissionMode as PermissionMode);
            this.applyDisplayMode(batch.mode.permissionMode as PermissionMode);
            messageBuffer.addMessage(batch.message, 'user');

            const promptContent: PromptContent[] = [{
                type: 'text',
                text: batch.message
            }];

            session.onThinkingChange(true);

            try {
                await backend.prompt(acpSessionId, promptContent, (message) => {
                    this.handleAgentMessage(message);
                });
            } catch (error) {
                logger.warn('[cursor-acp] prompt failed', error);
                const errMsg = error instanceof Error ? error.message : String(error);
                session.sendSessionEvent({
                    type: 'message',
                    message: `Cursor Agent failed: ${errMsg}`
                });
                messageBuffer.addMessage(`Cursor Agent failed: ${errMsg}`, 'status');
            } finally {
                session.onThinkingChange(false);
                await this.permissionAdapter?.cancelAll('Prompt finished');
                await this.extensionAdapter?.cancelAll('Prompt finished');
                if (session.queue.size() === 0 && !this.shouldExit) {
                    sendReady();
                }
            }
        }
    }

    protected async cleanup(): Promise<void> {
        this.clearAbortHandlers(this.session.client.rpcHandlerManager);

        if (this.permissionAdapter) {
            await this.permissionAdapter.cancelAll('Session ended');
            this.permissionAdapter = null;
        }

        if (this.extensionAdapter) {
            await this.extensionAdapter.cancelAll('Session ended');
            this.extensionAdapter = null;
        }

        if (this.backend) {
            await this.backend.disconnect();
            this.backend = null;
        }

        if (this.happyServer) {
            this.happyServer.stop();
            this.happyServer = null;
        }

        setCursorAcpModelsSnapshot(null);
    }

    private handleAgentMessage(message: AgentMessage): void {
        const converted = convertAgentMessage(message);
        if (converted) {
            this.session.sendAgentMessage(converted);
        }

        switch (message.type) {
            case 'text':
                this.messageBuffer.addMessage(message.text, 'assistant');
                break;
            case 'reasoning':
                break;
            case 'usage':
                break;
            case 'tool_call':
                this.messageBuffer.addMessage(`Tool: ${message.name}`, 'tool');
                break;
            case 'tool_result':
                this.messageBuffer.addMessage('Tool result', 'result');
                break;
            case 'plan':
                this.messageBuffer.addMessage('Plan updated', 'status');
                break;
            case 'turn_complete':
                break;
            default:
                break;
        }
    }

    private installLiveSessionConfigSync(
        backend: AcpSdkBackend,
        acpSessionId: string,
        previousSetModel: CursorSession['setModel']
    ): void {
        const session = this.session;
        const previousSetPermissionMode = session.setPermissionMode.bind(session);
        session.setPermissionMode = (mode: PermissionMode) => {
            previousSetPermissionMode(mode);
            void applyCursorAcpMode(backend, acpSessionId, mode).then(() => {
                this.applyDisplayMode(mode);
            });
        };

        session.setModel = (model: string | null | undefined) => {
            const requested = model?.trim();
            if (!requested || isSpawnDefaultModel(requested)) {
                this.currentBackendModel = null;
                previousSetModel(undefined);
                session.pushKeepAlive();
                return;
            }

            const optimisticWire = wireIdForCursorSessionState(requested, requested);
            this.currentBackendModel = optimisticWire;
            previousSetModel(optimisticWire);
            session.pushKeepAlive();

            void applyCursorAcpModel(backend, acpSessionId, requested).then((result) => {
                if (!result.applied || !result.resolvedWireId) {
                    return;
                }
                const sessionWire = wireIdForCursorSessionState(
                    result.requestedWireId ?? requested,
                    result.resolvedWireId
                );
                if (sessionWire === this.currentBackendModel) {
                    syncCursorModelsFromAcp(backend, acpSessionId);
                    return;
                }
                this.currentBackendModel = sessionWire;
                previousSetModel(sessionWire);
                this.pushModelStatusLine(sessionWire);
                session.pushKeepAlive();
                syncCursorModelsFromAcp(backend, acpSessionId);
            });
        };
    }

    private pushModelStatusLine(model: string | null | undefined): void {
        const trimmed = model?.trim();
        if (!trimmed || isSpawnDefaultModel(trimmed)) {
            this.messageBuffer.addMessage('[MODEL:auto]', 'system');
            return;
        }
        this.messageBuffer.addMessage(`[MODEL:${trimmed}]`, 'system');
    }

    private applyDisplayMode(permissionMode: PermissionMode | undefined): void {
        if (permissionMode && permissionMode !== this.displayPermissionMode) {
            this.displayPermissionMode = permissionMode;
            this.messageBuffer.addMessage(`[MODE:${permissionMode}]`, 'system');
        }
    }

    private async handleAbort(): Promise<void> {
        const backend = this.backend;
        const sessionId = this.session.sessionId;
        if (backend && sessionId) {
            await backend.cancelPrompt(sessionId);
        }
        await this.permissionAdapter?.cancelAll('User aborted');
        await this.extensionAdapter?.cancelAll('User aborted');
        this.session.queue.reset();
        this.session.onThinkingChange(false);
        this.abortController.abort();
        this.abortController = new AbortController();
        this.messageBuffer.addMessage('Turn aborted', 'status');
    }

    private async handleExitFromUi(): Promise<void> {
        await this.requestExit('exit', () => this.handleAbort());
    }

    private async handleSwitchFromUi(): Promise<void> {
        await this.requestExit('switch', () => this.handleAbort());
    }

    private async handleSwitchRequest(): Promise<void> {
        await this.requestExit('switch', () => this.handleAbort());
    }
}

function isSpawnDefaultModel(modelId: string): boolean {
    const normalized = modelId.trim().toLowerCase();
    return normalized === 'auto' || normalized === 'default' || normalized === 'default[]';
}

function syncCursorModelsFromAcp(backend: AcpSdkBackend, acpSessionId: string): void {
    const snapshot = buildCursorModelsSnapshotFromAcp(backend, acpSessionId);
    if (!snapshot) {
        return;
    }

    setCursorAcpModelsSnapshot(snapshot);
    seedCursorModelsCache({ success: true, ...snapshot });
}

function toAcpMcpServers(config: Record<string, { command: string; args: string[] }>): McpServerStdio[] {
    return Object.entries(config).map(([name, entry]) => ({
        name,
        command: entry.command,
        args: entry.args,
        env: []
    }));
}

export async function cursorAcpRemoteLauncher(session: CursorSession): Promise<'switch' | 'exit'> {
    const launcher = new CursorAcpRemoteLauncher(session);
    return launcher.launch();
}
