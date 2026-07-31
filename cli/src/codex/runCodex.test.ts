import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { runCodex } from './runCodex'

const mockCodexSession = vi.hoisted(() => ({
    setPermissionMode: vi.fn(),
    setModel: vi.fn(),
    setModelReasoningEffort: vi.fn(),
    setServiceTier: vi.fn(),
    setCollaborationMode: vi.fn(),
    setPersonality: vi.fn(),
    stopKeepAlive: vi.fn()
}))

const harness = vi.hoisted(() => ({
    bootstrapArgs: [] as Array<Record<string, unknown>>,
    loopArgs: [] as Array<Record<string, unknown>>,
    sessionInfo: { serviceTier: null as string | null } as Record<string, unknown>,
    session: {
        onUserMessage: vi.fn(),
        onCancelQueuedMessage: vi.fn(),
        rpcHandlerManager: {
            registerHandler: vi.fn()
        }
    }
}))

vi.mock('@/agent/sessionFactory', () => ({
    bootstrapSession: vi.fn(async (options: Record<string, unknown>) => {
        harness.bootstrapArgs.push(options)
        return {
            api: {},
            session: harness.session,
            sessionInfo: harness.sessionInfo
        }
    }),
    bootstrapLazySession: vi.fn(async (options: Record<string, unknown>) => {
        harness.bootstrapArgs.push({ ...options, lazy: true })
        return {
            api: {},
            session: harness.session,
            sessionInfo: harness.sessionInfo
        }
    }),
    bootstrapExistingSession: vi.fn(async (options: Record<string, unknown>) => {
        harness.bootstrapArgs.push(options)
        return {
            api: {},
            session: harness.session,
            sessionInfo: harness.sessionInfo
        }
    })
}))

vi.mock('./loop', () => ({
    loop: vi.fn(async (options: Record<string, unknown>) => {
        harness.loopArgs.push(options)
        const onSessionReady = options.onSessionReady as ((session: unknown) => void) | undefined
        onSessionReady?.(mockCodexSession)
    })
}))

vi.mock('@/claude/registerKillSessionHandler', () => ({
    registerKillSessionHandler: vi.fn()
}))

const lifecycleMock = vi.hoisted(() => ({
    registerProcessHandlers: vi.fn(),
    cleanupAndExit: vi.fn(async () => {}),
    markCrash: vi.fn(),
    setExitCode: vi.fn(),
    setArchiveReason: vi.fn(),
    setSessionEndReason: vi.fn(),
    hasExplicitSessionEndReason: vi.fn(() => false)
}))

vi.mock('@/agent/runnerLifecycle', () => ({
    createModeChangeHandler: vi.fn(() => vi.fn()),
    createRunnerLifecycle: vi.fn(() => lifecycleMock),
    setControlledByUser: vi.fn()
}))

vi.mock('@/agent/localHandoff', () => ({
    registerLocalHandoffHandler: vi.fn()
}))

vi.mock('@/ui/logger', () => ({
    logger: {
        debug: vi.fn()
    }
}))

vi.mock('@/utils/attachmentFormatter', () => ({
    formatMessageWithAttachments: vi.fn((text: string) => text)
}))

vi.mock('@/modules/common/slashCommands', () => ({
    listSlashCommands: vi.fn(async () => [])
}))

vi.mock('@/modules/common/codexModels', async () => {
    const actual = await vi.importActual<typeof import('@/modules/common/codexModels')>('@/modules/common/codexModels')
    return {
        ...actual,
        listCodexModels: vi.fn(async () => ([
            {
                id: 'gpt-5.4',
                modelId: 'gpt-5.4',
                displayName: 'gpt-5.4',
                supportsPersonality: true
            }
        ]))
    }
})

vi.mock('./utils/slashCommands', () => ({
    resolveCodexSlashCommand: vi.fn(() => ({
        kind: 'passthrough'
    }))
}))

vi.mock('./codexSpecialCommands', () => ({
    parseCodexSpecialCommand: vi.fn(() => ({}))
}))

vi.mock('./utils/codexCliOverrides', () => ({
    parseCodexCliOverrides: vi.fn(() => ({}))
}))

import { runCodex as runCodexImpl } from './runCodex'
import { RPC_METHODS } from '@hapi/protocol/rpcMethods'
import { listCodexModels } from '@/modules/common/codexModels'

describe('runCodex', () => {
    beforeEach(() => {
        harness.bootstrapArgs.length = 0
        harness.loopArgs.length = 0
        harness.sessionInfo = { serviceTier: null }
        harness.session.onUserMessage.mockReset()
        harness.session.onCancelQueuedMessage.mockReset()
        harness.session.rpcHandlerManager.registerHandler.mockReset()
        mockCodexSession.setPermissionMode.mockReset()
        mockCodexSession.setModel.mockReset()
        mockCodexSession.setModelReasoningEffort.mockReset()
        mockCodexSession.setServiceTier.mockReset()
        mockCodexSession.setCollaborationMode.mockReset()
        mockCodexSession.setPersonality.mockReset()
        lifecycleMock.registerProcessHandlers.mockClear()
        lifecycleMock.cleanupAndExit.mockClear()
        lifecycleMock.markCrash.mockClear()
        lifecycleMock.setExitCode.mockClear()
        lifecycleMock.setArchiveReason.mockClear()
        lifecycleMock.setSessionEndReason.mockClear()
        vi.mocked(listCodexModels).mockResolvedValue([{
            id: 'gpt-5.4',
            displayName: 'gpt-5.4',
            isDefault: true,
            supportsPersonality: true
        }])
    })

    it('uses the requested collaboration mode when resuming locally', async () => {
        const options = {
            existingSessionId: 'hapi-session-1',
            workingDirectory: '/tmp/project',
            resumeSessionId: 'codex-thread-1',
            collaborationMode: 'plan'
        } as Parameters<typeof runCodex>[0] & { collaborationMode: 'plan' }

        await runCodexImpl(options)

        expect(harness.bootstrapArgs[0]).toEqual(expect.objectContaining({
            sessionId: 'hapi-session-1',
            workingDirectory: '/tmp/project'
        }))
        expect(harness.loopArgs[0]).toEqual(expect.objectContaining({
            resumeSessionId: 'codex-thread-1',
            collaborationMode: 'plan',
            replayTranscriptHistoryOnStart: false
        }))
        expect(mockCodexSession.setCollaborationMode).toHaveBeenLastCalledWith('plan')
    })

    it('preserves a persisted Fast service tier on startup', async () => {
        harness.sessionInfo = { serviceTier: 'fast' }

        await runCodexImpl({
            existingSessionId: 'hapi-session-1',
            workingDirectory: '/tmp/project',
            resumeSessionId: 'codex-thread-1'
        } as Parameters<typeof runCodex>[0])

        // The first keepalive sync must re-assert Fast, not collapse it.
        expect(mockCodexSession.setServiceTier).toHaveBeenCalledWith('fast')
        expect(mockCodexSession.setServiceTier).not.toHaveBeenCalledWith(null)
    })

    it('keeps an explicit Standard service tier sticky on startup', async () => {
        harness.sessionInfo = { serviceTier: 'standard' }

        await runCodexImpl({
            existingSessionId: 'hapi-session-1',
            workingDirectory: '/tmp/project',
            resumeSessionId: 'codex-thread-1'
        } as Parameters<typeof runCodex>[0])

        // Explicit Standard must survive resume (not be dropped to untouched),
        // so later turns keep sending app-server serviceTier: null.
        expect(mockCodexSession.setServiceTier).toHaveBeenCalledWith('standard')
    })

    it('prefers the spawn-time service tier override when resuming (hub passes Fast)', async () => {
        // On resume the hub spawns a fresh session (serviceTier null in the new
        // row) and passes the old tier via opts; the override must win so the
        // resumed thread immediately runs Fast.
        harness.sessionInfo = { serviceTier: null }

        await runCodexImpl({
            workingDirectory: '/tmp/project',
            resumeSessionId: 'codex-thread-1',
            serviceTier: 'fast'
        } as Parameters<typeof runCodex>[0])

        expect(mockCodexSession.setServiceTier).toHaveBeenCalledWith('fast')
    })

    it('does not collapse an untouched service tier into explicit Standard on startup', async () => {
        harness.sessionInfo = { serviceTier: null }

        await runCodexImpl({
            workingDirectory: '/tmp/project'
        } as Parameters<typeof runCodex>[0])

        // Untouched (account-default) sessions must omit the tier entirely so
        // the keepalive never persists serviceTier: null over the default.
        expect(mockCodexSession.setServiceTier).not.toHaveBeenCalled()
    })

    it('does not collapse inherited Codex reasoning effort into explicit default on startup', async () => {
        await runCodexImpl({ workingDirectory: '/tmp/project' })

        expect(mockCodexSession.setModelReasoningEffort).not.toHaveBeenCalled()
        expect(harness.loopArgs[0]?.modelReasoningEffort).toBeUndefined()
    })

    it('uses lazy bootstrap for a fresh terminal launch', async () => {
        await runCodexImpl({ workingDirectory: '/tmp/project' })

        expect(harness.bootstrapArgs[0]).toEqual(expect.objectContaining({
            workingDirectory: '/tmp/project',
            lazy: true
        }))
        expect(harness.loopArgs[0]).toEqual(expect.objectContaining({
            replayTranscriptHistoryOnStart: true
        }))
    })

    it('keeps eager bootstrap for runner launches', async () => {
        await runCodexImpl({
            startedBy: 'runner',
            workingDirectory: '/tmp/project'
        })

        expect(harness.bootstrapArgs[0]).not.toHaveProperty('lazy')
    })

    it('restores persisted personality into keepalive and app-server mode', async () => {
        harness.sessionInfo = { serviceTier: null, personality: 'friendly' }

        await runCodexImpl({
            existingSessionId: 'hapi-session-1',
            workingDirectory: '/tmp/project',
            resumeSessionId: 'codex-thread-1'
        } as Parameters<typeof runCodex>[0])

        expect(mockCodexSession.setPersonality).toHaveBeenCalledWith('friendly')
        expect(harness.loopArgs[0]).toEqual(expect.objectContaining({ personality: 'friendly' }))
    })

    it('lets an explicit default personality override a persisted selection', async () => {
        harness.sessionInfo = { serviceTier: null, personality: 'pragmatic' }

        await runCodexImpl({
            existingSessionId: 'hapi-session-1',
            workingDirectory: '/tmp/project',
            resumeSessionId: 'codex-thread-1',
            personality: null
        } as Parameters<typeof runCodex>[0])

        expect(mockCodexSession.setPersonality).toHaveBeenCalledWith(null)
        expect(harness.loopArgs[0]).toEqual(expect.objectContaining({ personality: null }))
    })

    it('allows personality for a model absent from the catalog', async () => {
        await runCodexImpl({
            workingDirectory: '/tmp/project',
            model: 'custom-model',
            personality: 'friendly'
        } as Parameters<typeof runCodex>[0])

        expect(harness.loopArgs[0]).toEqual(expect.objectContaining({ personality: 'friendly' }))
    })

    it('cleans up the session when startup personality validation fails', async () => {
        vi.mocked(listCodexModels).mockResolvedValue([{
            id: 'gpt-5.4',
            displayName: 'gpt-5.4',
            isDefault: true,
            supportsPersonality: false
        }])

        await runCodexImpl({
            workingDirectory: '/tmp/project',
            personality: 'friendly'
        } as Parameters<typeof runCodex>[0])

        expect(lifecycleMock.markCrash).toHaveBeenCalled()
        expect(lifecycleMock.cleanupAndExit).toHaveBeenCalledOnce()
    })

    it('replays transcript history when attaching a new Hapi session to an existing Codex thread', async () => {
        await runCodexImpl({
            workingDirectory: '/tmp/project',
            resumeSessionId: 'codex-thread-2'
        })

        expect(harness.loopArgs[0]).toEqual(expect.objectContaining({
            resumeSessionId: 'codex-thread-2',
            replayTranscriptHistoryOnStart: true
        }))
    })

    it('keeps personality unset in unrelated config RPC responses', async () => {
        await runCodexImpl({ workingDirectory: '/tmp/project' })

        const registration = harness.session.rpcHandlerManager.registerHandler.mock.calls.find(
            ([method]) => method === RPC_METHODS.SetSessionConfig
        )
        const handler = registration?.[1] as ((payload: unknown) => Promise<{ applied: Record<string, unknown> }>) | undefined
        const response = await handler?.({ permissionMode: 'yolo' })

        expect(response?.applied).not.toHaveProperty('personality')
    })

    it('rejects live unsupported personality changes', async () => {
        vi.mocked(listCodexModels).mockResolvedValue([{
            id: 'gpt-5.4',
            displayName: 'gpt-5.4',
            isDefault: true,
            supportsPersonality: false
        }])
        await runCodexImpl({ workingDirectory: '/tmp/project' })

        const registration = harness.session.rpcHandlerManager.registerHandler.mock.calls.find(
            ([method]) => method === RPC_METHODS.SetSessionConfig
        )
        const handler = registration?.[1] as ((payload: unknown) => Promise<unknown>) | undefined

        await expect(handler?.({ personality: 'friendly' })).rejects.toThrow('Selected model does not support personality')
    })

    it('clears personality when a live model change loses support', async () => {
        vi.mocked(listCodexModels).mockResolvedValue([
            { id: 'gpt-5.4', displayName: 'gpt-5.4', isDefault: true, supportsPersonality: true },
            { id: 'gpt-5.3', displayName: 'gpt-5.3', isDefault: false, supportsPersonality: false }
        ])
        harness.sessionInfo = { serviceTier: null, personality: 'friendly' }
        await runCodexImpl({ workingDirectory: '/tmp/project', model: 'gpt-5.4' })

        const registration = harness.session.rpcHandlerManager.registerHandler.mock.calls.find(
            ([method]) => method === RPC_METHODS.SetSessionConfig
        )
        const handler = registration?.[1] as ((payload: unknown) => Promise<{ applied: Record<string, unknown> }>) | undefined
        const response = await handler?.({ model: 'gpt-5.3' })

        expect(mockCodexSession.setPersonality).toHaveBeenLastCalledWith(null)
        expect(response?.applied.personality).toBeNull()
    })

    it('accepts and normalizes model-reported reasoning efforts from session config', async () => {
        await runCodexImpl({ workingDirectory: '/tmp/project' })

        const registration = harness.session.rpcHandlerManager.registerHandler.mock.calls.find(
            ([method]) => method === RPC_METHODS.SetSessionConfig
        )
        const handler = registration?.[1] as ((payload: unknown) => Promise<unknown>) | undefined
        expect(handler).toBeTypeOf('function')

        await handler?.({ modelReasoningEffort: 'max' })
        await handler?.({ modelReasoningEffort: ' EXTREME ' })

        expect(mockCodexSession.setModelReasoningEffort).toHaveBeenNthCalledWith(1, 'max')
        expect(mockCodexSession.setModelReasoningEffort).toHaveBeenNthCalledWith(2, 'extreme')
    })

    it('still persists an explicit reasoning effort reset as null', async () => {
        await runCodexImpl({ workingDirectory: '/tmp/project' })

        const registration = harness.session.rpcHandlerManager.registerHandler.mock.calls.find(
            ([method]) => method === RPC_METHODS.SetSessionConfig
        )
        const handler = registration?.[1] as ((payload: unknown) => Promise<unknown>) | undefined
        const result = await handler?.({ modelReasoningEffort: null })

        expect(mockCodexSession.setModelReasoningEffort).toHaveBeenCalledTimes(1)
        expect(mockCodexSession.setModelReasoningEffort).toHaveBeenCalledWith(null)
        expect(result).toEqual({
            applied: expect.objectContaining({ modelReasoningEffort: null })
        })
    })
})
