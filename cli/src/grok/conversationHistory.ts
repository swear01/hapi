import type { AcpSdkBackend } from '@/agent/backends/acp/AcpSdkBackend'
import type { Metadata } from '@/api/types'
import {
    GROK_CONVERSATION_HISTORY_INITIAL,
    markSupported,
    markUnsupported,
    toConversationHistoryCapabilities,
    type ConversationHistoryCapabilityStates
} from '@hapi/protocol/conversationHistory'
import type {
    ForkConversationRpcResult,
    RewindConversationRpcResult
} from '@hapi/protocol/apiTypes'

function isMethodNotFound(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error)
    return /method not found|-32601/i.test(message)
}

function asString(value: unknown): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null
}

function asRecord(value: unknown): Record<string, unknown> | null {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
        ? value as Record<string, unknown>
        : null
}

export class GrokConversationHistory {
    private states: ConversationHistoryCapabilityStates = { ...GROK_CONVERSATION_HISTORY_INITIAL }
    private sessionId: string | null = null
    private cwd: string | null = null
    private readonly promptIndexByLocalId = new Map<string, number>()
    private busy = false
    private publishCapabilities: (() => Promise<void>) | null = null

    constructor(private readonly getBackend: () => AcpSdkBackend | null) {}

    setPublishCapabilities(fn: () => Promise<void>): void {
        this.publishCapabilities = fn
    }

    setBusy(busy: boolean): void {
        this.busy = busy
    }

    setSession(sessionId: string | null, cwd: string | null): void {
        this.sessionId = sessionId
        this.cwd = cwd
    }

    rememberPromptIndex(localId: string | undefined, promptIndex: number | null | undefined): void {
        if (!localId || promptIndex == null || !Number.isInteger(promptIndex) || promptIndex < 0) return
        this.promptIndexByLocalId.set(localId, promptIndex)
    }

    getCapabilitiesForMetadata(): Metadata['capabilities'] {
        const conversationHistory = toConversationHistoryCapabilities(this.states)
        return conversationHistory ? { conversationHistory } : undefined
    }

    getHistoryPoints(): Record<string, true> {
        const points: Record<string, true> = {}
        for (const localId of this.promptIndexByLocalId.keys()) {
            points[localId] = true
        }
        return points
    }

    async probeCapabilities(): Promise<void> {
        const backend = this.getBackend()
        const sessionId = this.sessionId
        if (!backend || !sessionId) return

        if (this.states.forkCurrent === 'unknown') {
            // Defer actual fork probe; mark unknown until first successful call or method-not-found.
            // Optimistic display forbidden — leave unknown until we confirm via a lightweight points call.
        }

        if (this.states.rewindToMessage === 'unknown' || this.states.forkAtMessage === 'unknown') {
            try {
                await backend.sendExtensionRequest('_x.ai/rewind/points', { sessionId })
                this.states = markSupported(this.states, 'rewindToMessage')
                this.states = markSupported(this.states, 'forkCurrent')
                this.states = markSupported(this.states, 'forkAtMessage')
            } catch (error) {
                if (isMethodNotFound(error)) {
                    this.states = markUnsupported(this.states, 'rewindToMessage')
                    // Fork may still work independently — probe separately below
                }
            }
        }

        if (this.states.forkCurrent === 'unknown') {
            // Assume supported until method-not-found on actual fork; still don't show until supported.
            // Use a no-op probe: if rewind points worked, fork usually exists; else try listing via same transport.
            try {
                // Don't actually fork. If rewind/points worked we already marked fork supported.
                // If still unknown, leave unknown (hidden).
            } catch {
                // ignore
            }
        }

        await this.publishCapabilities?.()
    }

    async fork(messageLocalId?: string): Promise<ForkConversationRpcResult> {
        if (this.busy) throw new Error('Session is busy')
        const backend = this.getBackend()
        const sessionId = this.sessionId
        const cwd = this.cwd
        if (!backend || !sessionId || !cwd) throw new Error('Grok session is not ready')

        const params: Record<string, unknown> = {
            sourceSessionId: sessionId,
            sourceCwd: cwd,
            newCwd: cwd
        }
        if (messageLocalId) {
            if (this.states.forkAtMessage === 'unsupported') {
                throw new Error('Historical fork is not supported')
            }
            const targetPromptIndex = this.promptIndexByLocalId.get(messageLocalId)
            if (targetPromptIndex == null) {
                throw new Error(`No native history point for message ${messageLocalId}`)
            }
            params.targetPromptIndex = targetPromptIndex
        } else if (this.states.forkCurrent === 'unsupported') {
            throw new Error('Fork current is not supported')
        }

        try {
            const response = await backend.sendExtensionRequest<Record<string, unknown>>(
                '_x.ai/session/fork',
                params
            )
            const nativeSessionId = asString(response.newSessionId)
                ?? asString(asRecord(response)?.sessionId)
                ?? asString(response.sessionId)
            if (!nativeSessionId) throw new Error('x.ai/session/fork did not return newSessionId')
            this.states = markSupported(this.states, messageLocalId ? 'forkAtMessage' : 'forkCurrent')
            if (!messageLocalId) this.states = markSupported(this.states, 'forkCurrent')
            else {
                this.states = markSupported(this.states, 'forkAtMessage')
                this.states = markSupported(this.states, 'forkCurrent')
            }
            await this.publishCapabilities?.()
            return { nativeSessionId }
        } catch (error) {
            if (isMethodNotFound(error)) {
                if (messageLocalId) {
                    this.states = markUnsupported(this.states, 'forkAtMessage')
                } else {
                    this.states = markUnsupported(this.states, 'forkCurrent')
                }
                await this.publishCapabilities?.()
            }
            throw error
        }
    }

    async rewind(messageLocalId: string): Promise<RewindConversationRpcResult> {
        if (this.busy) throw new Error('Session is busy')
        const backend = this.getBackend()
        const sessionId = this.sessionId
        if (!backend || !sessionId) throw new Error('Grok session is not ready')
        if (this.states.rewindToMessage === 'unsupported') {
            throw new Error('Rewind is not supported')
        }
        const targetPromptIndex = this.promptIndexByLocalId.get(messageLocalId)
        if (targetPromptIndex == null) {
            throw new Error(`No native history point for message ${messageLocalId}`)
        }

        try {
            const response = await backend.sendExtensionRequest<Record<string, unknown>>(
                '_x.ai/rewind/execute',
                {
                    sessionId,
                    targetPromptIndex,
                    mode: 'conversation_only',
                    force: false
                }
            )
            if (response.success === false) {
                throw new Error(asString(response.error) ?? 'Rewind point is no longer available')
            }
            this.states = markSupported(this.states, 'rewindToMessage')
            await this.publishCapabilities?.()
            return {
                success: true,
                truncateFromLocalId: messageLocalId,
                messages: []
            }
        } catch (error) {
            if (isMethodNotFound(error)) {
                this.states = markUnsupported(this.states, 'rewindToMessage')
                await this.publishCapabilities?.()
            }
            throw error
        }
    }
}
