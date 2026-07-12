import React from 'react'
import { logger } from '@/ui/logger'
import { buildHapiMcpBridge } from '@/codex/utils/buildHapiMcpBridge'
import { convertAgentMessage } from '@/agent/messageConverter'
import type { AgentMessage, McpServerStdio, PromptContent } from '@/agent/types'
import {
    RemoteLauncherBase,
    type RemoteLauncherDisplayContext,
    type RemoteLauncherExitReason
} from '@/modules/common/remote/RemoteLauncherBase'
import { GrokDisplay } from '@/ui/ink/GrokDisplay'
import type { GrokSession } from './session'
import type { PermissionMode } from './types'
import { createGrokBackend, formatGrokError } from './utils/grokBackend'
import { GrokPermissionHandler } from './utils/permissionHandler'

const PLAN_MODE_INSTRUCTION =
    'Work in plan-only mode. Analyze and propose a plan, but do not execute commands or modify files.'

class GrokRemoteLauncher extends RemoteLauncherBase {
    private backend: ReturnType<typeof createGrokBackend> | null = null
    private permissionHandler: GrokPermissionHandler | null = null
    private happyServer: { stop: () => void } | null = null
    private abortController = new AbortController()
    private displayPermissionMode: PermissionMode | null = null
    private readonly lastDisplayedToolCall = new Map<string, string>()

    constructor(
        private readonly session: GrokSession,
        private readonly opts: { model?: string; effort?: string }
    ) {
        super(process.env.DEBUG ? session.logPath : undefined)
    }

    public async launch(): Promise<RemoteLauncherExitReason> {
        return this.start({
            onExit: () => this.handleExitFromUi(),
            onSwitchToLocal: () => this.handleSwitchFromUi()
        })
    }

    protected createDisplay(context: RemoteLauncherDisplayContext): React.ReactElement {
        return React.createElement(GrokDisplay, context)
    }

    protected async runMainLoop(): Promise<void> {
        const session = this.session
        const { server, mcpServers } = await buildHapiMcpBridge(session.client)
        this.happyServer = server

        const backend = createGrokBackend({
            cwd: session.path,
            ...this.opts
        })
        this.backend = backend
        backend.onStderrError((error) => {
            logger.debug('[grok-remote] stderr error', error)
            session.sendSessionEvent({ type: 'message', message: error.message })
            this.messageBuffer.addMessage(error.message, 'status')
        })

        await backend.initialize()

        const acpMcpServers = toAcpMcpServers(mcpServers)
        let acpSessionId: string
        try {
            if (session.sessionId) {
                try {
                    acpSessionId = await backend.loadSession({
                        sessionId: session.sessionId,
                        cwd: session.path,
                        mcpServers: acpMcpServers
                    })
                } catch (error) {
                    logger.warn('[grok-remote] resume failed, starting new session', error)
                    session.sendSessionEvent({
                        type: 'message',
                        message: 'Grok resume failed; starting a new session.'
                    })
                    acpSessionId = await backend.newSession({
                        cwd: session.path,
                        mcpServers: acpMcpServers
                    })
                }
            } else {
                acpSessionId = await backend.newSession({
                    cwd: session.path,
                    mcpServers: acpMcpServers
                })
            }
        } catch (error) {
            const message = formatGrokError(error)
            session.sendSessionEvent({ type: 'message', message })
            throw new Error(message, { cause: error })
        }

        session.registerExistingNativeSession(acpSessionId)
        this.permissionHandler = new GrokPermissionHandler(
            session.client,
            backend,
            () => session.getPermissionMode() as PermissionMode | undefined
        )
        this.applyDisplayMode(session.getPermissionMode() as PermissionMode | undefined)
        this.messageBuffer.addMessage(`[MODEL:${this.opts.model ?? 'default'}]`, 'system')

        this.setupAbortHandlers(session.client.rpcHandlerManager, {
            onAbort: () => this.handleAbort(),
            onSwitch: () => this.handleSwitchRequest()
        })

        while (!this.shouldExit) {
            const waitSignal = this.abortController.signal
            const batch = await session.queue.waitForMessagesAndGetAsString(waitSignal)
            if (!batch) {
                if (waitSignal.aborted && !this.shouldExit) continue
                break
            }

            this.applyDisplayMode(batch.mode.permissionMode)
            this.messageBuffer.addMessage(batch.message, 'user')
            const text = batch.mode.permissionMode === 'plan'
                ? `${PLAN_MODE_INSTRUCTION}\n\n${batch.message}`
                : batch.message
            const promptContent: PromptContent[] = [{ type: 'text', text }]

            session.onThinkingChange(true)
            try {
                await backend.prompt(acpSessionId, promptContent, (message: AgentMessage) => {
                    this.handleAgentMessage(message)
                })
            } catch (error) {
                const message = formatGrokError(error)
                logger.warn('[grok-remote] prompt failed', error)
                session.sendSessionEvent({ type: 'message', message: `Grok prompt failed: ${message}` })
                this.messageBuffer.addMessage(`Grok prompt failed: ${message}`, 'status')
            } finally {
                session.onThinkingChange(false)
                await this.permissionHandler?.cancelAll('Prompt finished')
                if (session.queue.size() === 0 && !this.shouldExit) {
                    session.sendSessionEvent({ type: 'ready' })
                }
            }
        }
    }

    protected async cleanup(): Promise<void> {
        this.clearAbortHandlers(this.session.client.rpcHandlerManager)
        if (this.permissionHandler) {
            await this.permissionHandler.cancelAll('Session ended')
            this.permissionHandler = null
        }
        if (this.backend) {
            await this.backend.disconnect()
            this.backend = null
        }
        if (this.happyServer) {
            this.happyServer.stop()
            this.happyServer = null
        }
    }

    private handleAgentMessage(message: AgentMessage): void {
        const converted = convertAgentMessage(message)
        if (converted) this.session.sendAgentMessage(converted)

        switch (message.type) {
            case 'text':
                this.messageBuffer.addMessage(message.text, 'assistant')
                break
            case 'reasoning':
                if (!message.live) {
                    this.messageBuffer.addMessage(`[Thinking] ${message.text.substring(0, 100)}...`, 'system')
                }
                break
            case 'tool_call': {
                const previous = this.lastDisplayedToolCall.get(message.id)
                if (previous !== message.name) {
                    this.lastDisplayedToolCall.set(message.id, message.name)
                    this.messageBuffer.addMessage(`Tool call: ${message.name}`, 'tool')
                }
                break
            }
            case 'tool_result':
                this.messageBuffer.addMessage('Tool result received', 'result')
                break
            case 'plan':
                this.messageBuffer.addMessage('Plan updated', 'status')
                break
            case 'error':
                this.messageBuffer.addMessage(message.message, 'status')
                break
            case 'turn_complete':
                this.messageBuffer.addMessage('Turn complete', 'status')
                break
            case 'usage':
                break
            default: {
                const exhaustive: never = message
                return exhaustive
            }
        }
    }

    private applyDisplayMode(permissionMode: PermissionMode | undefined): void {
        if (permissionMode && permissionMode !== this.displayPermissionMode) {
            this.displayPermissionMode = permissionMode
            this.messageBuffer.addMessage(`[MODE:${permissionMode}]`, 'system')
        }
    }

    private async handleAbort(): Promise<void> {
        if (this.backend && this.session.sessionId) {
            await this.backend.cancelPrompt(this.session.sessionId)
        }
        await this.permissionHandler?.cancelAll('User aborted')
        this.session.queue.reset()
        this.session.onThinkingChange(false)
        this.abortController.abort()
        this.abortController = new AbortController()
        this.messageBuffer.addMessage('Turn aborted', 'status')
    }

    private async handleExitFromUi(): Promise<void> {
        await this.requestExit('exit', () => this.handleAbort())
    }

    private async handleSwitchFromUi(): Promise<void> {
        await this.requestExit('switch', () => this.handleAbort())
    }

    private async handleSwitchRequest(): Promise<void> {
        await this.requestExit('switch', () => this.handleAbort())
    }
}

function toAcpMcpServers(config: Record<string, { command: string; args: string[] }>): McpServerStdio[] {
    return Object.entries(config).map(([name, entry]) => ({
        name,
        command: entry.command,
        args: entry.args,
        env: []
    }))
}

export async function grokRemoteLauncher(
    session: GrokSession,
    opts: { model?: string; effort?: string }
): Promise<'switch' | 'exit'> {
    return new GrokRemoteLauncher(session, opts).launch()
}
