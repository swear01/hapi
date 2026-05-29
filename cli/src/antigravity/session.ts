import { ApiClient, ApiSessionClient } from '@/lib'
import { MessageQueue2 } from '@/utils/MessageQueue2'
import { AgentSessionBase } from '@/agent/sessionBase'
import type { AntigravityMode, PermissionMode } from './types'
import type { LocalLaunchExitReason } from '@/agent/localLaunchPolicy'

type LocalLaunchFailure = {
    message: string;
    exitReason: LocalLaunchExitReason;
};

export class AntigravitySession extends AgentSessionBase<AntigravityMode> {
    readonly startedBy: 'runner' | 'terminal'
    readonly startingMode: 'local' | 'remote'
    localLaunchFailure: LocalLaunchFailure | null = null

    constructor(opts: {
        api: ApiClient;
        client: ApiSessionClient;
        path: string;
        logPath: string;
        sessionId: string | null;
        messageQueue: MessageQueue2<AntigravityMode>;
        onModeChange: (mode: 'local' | 'remote') => void;
        mode?: 'local' | 'remote';
        startedBy: 'runner' | 'terminal';
        startingMode: 'local' | 'remote';
        permissionMode?: PermissionMode;
    }) {
        super({
            api: opts.api,
            client: opts.client,
            path: opts.path,
            logPath: opts.logPath,
            sessionId: opts.sessionId,
            messageQueue: opts.messageQueue,
            onModeChange: opts.onModeChange,
            mode: opts.mode,
            sessionLabel: 'AntigravitySession',
            sessionIdLabel: 'Antigravity',
            applySessionIdToMetadata: (metadata, sessionId) => ({
                ...metadata,
                antigravitySessionId: sessionId
            }),
            permissionMode: opts.permissionMode
        })

        this.startedBy = opts.startedBy
        this.startingMode = opts.startingMode
    }

    setPermissionMode = (mode: PermissionMode): void => {
        this.permissionMode = mode
    }

    recordLocalLaunchFailure = (message: string, exitReason: LocalLaunchExitReason): void => {
        this.localLaunchFailure = { message, exitReason }
    }

    sendAgentMessage = (message: unknown): void => {
        this.client.sendAgentMessage(message)
    }

    sendUserMessage = (text: string): void => {
        this.client.sendUserMessage(text)
    }

    sendSessionEvent = (event: Parameters<ApiSessionClient['sendSessionEvent']>[0]): void => {
        this.client.sendSessionEvent(event)
    }
}
