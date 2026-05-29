import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockAntigravitySession = vi.hoisted(() => ({
    setPermissionMode: vi.fn(),
    pushKeepAlive: vi.fn(),
    stopKeepAlive: vi.fn(),
    thinking: false,
    localLaunchFailure: null as null | { message: string; exitReason: string }
}))

const harness = vi.hoisted(() => ({
    bootstrapArgs: [] as Array<Record<string, unknown>>,
    loopArgs: [] as Array<Record<string, unknown>>,
    loopError: null as Error | null,
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
        return { api: {}, session: harness.session }
    }),
    bootstrapExistingSession: vi.fn(async (options: Record<string, unknown>) => {
        harness.bootstrapArgs.push(options)
        return { api: {}, session: harness.session }
    })
}))

vi.mock('./loop', () => ({
    antigravityLoop: vi.fn(async (options: Record<string, unknown>) => {
        harness.loopArgs.push(options)
        if (harness.loopError) throw harness.loopError
        const onSessionReady = options.onSessionReady as ((s: unknown) => void) | undefined
        onSessionReady?.(mockAntigravitySession)
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
    setSessionEndReason: vi.fn()
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
    logger: { debug: vi.fn() }
}))

vi.mock('@/utils/attachmentFormatter', () => ({
    formatMessageWithAttachments: vi.fn((text: string) => text)
}))

vi.mock('@/utils/invokedCwd', () => ({
    getInvokedCwd: vi.fn(() => '/default/cwd')
}))

import { runAntigravity } from './runAntigravity'

describe('runAntigravity', () => {
    beforeEach(() => {
        harness.bootstrapArgs.length = 0
        harness.loopArgs.length = 0
        harness.loopError = null
        mockAntigravitySession.setPermissionMode.mockReset()
        mockAntigravitySession.pushKeepAlive.mockReset()
        mockAntigravitySession.localLaunchFailure = null
        harness.session.onUserMessage.mockReset()
        harness.session.onCancelQueuedMessage.mockReset()
        harness.session.rpcHandlerManager.registerHandler.mockReset()
        lifecycleMock.registerProcessHandlers.mockClear()
        lifecycleMock.cleanupAndExit.mockClear()
        lifecycleMock.markCrash.mockClear()
        lifecycleMock.setExitCode.mockClear()
        lifecycleMock.setArchiveReason.mockClear()
        lifecycleMock.setSessionEndReason.mockClear()
    })

    it('bootstraps with flavor=antigravity', async () => {
        await runAntigravity({})

        expect(harness.bootstrapArgs[0]?.flavor).toBe('antigravity')
    })

    it('passes workingDirectory to bootstrapSession', async () => {
        await runAntigravity({ workingDirectory: '/my/project' })

        expect(harness.bootstrapArgs[0]?.workingDirectory).toBe('/my/project')
    })

    it('passes resumeSessionId through to loop', async () => {
        await runAntigravity({ resumeSessionId: 'agy-uuid-1234' })

        expect(harness.loopArgs[0]?.resumeSessionId).toBe('agy-uuid-1234')
    })

    it('passes permissionMode through to loop', async () => {
        await runAntigravity({ permissionMode: 'yolo' })

        expect(harness.loopArgs[0]?.permissionMode).toBe('yolo')
    })

    it('sets sessionEndReason to completed on normal exit', async () => {
        await runAntigravity({})

        expect(lifecycleMock.setSessionEndReason).toHaveBeenCalledWith('completed')
        expect(lifecycleMock.markCrash).not.toHaveBeenCalled()
    })

    it('marks crash and skips completed when loop throws', async () => {
        harness.loopError = new Error('agy crashed')

        await runAntigravity({})

        expect(lifecycleMock.markCrash).toHaveBeenCalledWith(harness.loopError)
        expect(lifecycleMock.setSessionEndReason).not.toHaveBeenCalledWith('completed')
        expect(lifecycleMock.cleanupAndExit).toHaveBeenCalled()
    })

    it('applies permission mode change via set-session-config RPC', async () => {
        await runAntigravity({ permissionMode: 'default' })

        const calls = harness.session.rpcHandlerManager.registerHandler.mock.calls
        const configHandler = calls.find((c: unknown[]) => c[0] === 'set-session-config')
        expect(configHandler).toBeDefined()

        const handler = configHandler![1] as (payload: unknown) => Promise<unknown>
        const result = await handler({ permissionMode: 'sandbox' }) as Record<string, unknown>
        expect((result.applied as Record<string, unknown>).permissionMode).toBe('sandbox')
    })

    it('rejects model changes (model not supported via RPC for antigravity)', async () => {
        await runAntigravity({})

        const calls = harness.session.rpcHandlerManager.registerHandler.mock.calls
        const configHandler = calls.find((c: unknown[]) => c[0] === 'set-session-config')
        const handler = configHandler![1] as (payload: unknown) => Promise<unknown>

        // modelMode: 'ignore' means model field is silently dropped, not rejected
        const result = await handler({ model: 'gemini-2.5-pro' }) as Record<string, unknown>
        const applied = result.applied as Record<string, unknown>
        expect(applied).not.toHaveProperty('model')
    })

    it('calls pushKeepAlive after a permission mode config change', async () => {
        await runAntigravity({})

        mockAntigravitySession.pushKeepAlive.mockClear()

        const calls = harness.session.rpcHandlerManager.registerHandler.mock.calls
        const configHandler = calls.find((c: unknown[]) => c[0] === 'set-session-config')
        const handler = configHandler![1] as (payload: unknown) => Promise<unknown>
        await handler({ permissionMode: 'yolo' })

        expect(mockAntigravitySession.pushKeepAlive).toHaveBeenCalledTimes(1)
    })

    it('uses existingSessionId when provided (resume flow)', async () => {
        await runAntigravity({ existingSessionId: 'hapi-session-1', resumeSessionId: 'agy-uuid-abc' })

        expect(harness.bootstrapArgs[0]).toMatchObject({
            sessionId: 'hapi-session-1',
            flavor: 'antigravity'
        })
    })
})
