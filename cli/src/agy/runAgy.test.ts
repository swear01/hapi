import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RPC_METHODS } from '@hapi/protocol/rpcMethods'
import type { MessageQueue2 } from '@/utils/MessageQueue2'
import type { AgyMode } from './types'

const mocks = vi.hoisted(() => ({
    loop: vi.fn(),
    bootstrap: vi.fn(),
    existing: vi.fn(),
    listModels: vi.fn(),
    registerHandler: vi.fn(),
    onUserMessage: vi.fn(),
    cleanup: vi.fn(),
    markCrash: vi.fn(),
}))

vi.mock('./loop', () => ({ agyLoop: mocks.loop }))
vi.mock('@/agent/sessionFactory', () => ({ bootstrapSession: mocks.bootstrap, bootstrapExistingSession: mocks.existing }))
vi.mock('@/modules/common/agyModels', () => ({ listAgyModels: mocks.listModels }))
vi.mock('@/agent/runnerLifecycle', () => ({
    createRunnerLifecycle: () => ({
        registerProcessHandlers: vi.fn(), cleanupAndExit: mocks.cleanup, markCrash: mocks.markCrash, setSessionEndReason: vi.fn(),
    }),
    createModeChangeHandler: () => vi.fn(),
}))
vi.mock('@/claude/registerKillSessionHandler', () => ({ registerKillSessionHandler: vi.fn() }))
vi.mock('@/agent/localHandoff', () => ({ registerLocalHandoffHandler: vi.fn() }))

import { runAgy } from './runAgy'

const catalog = [
    { modelId: 'gemini-4-argon-medium' },
    { modelId: 'gemini-4-argon-high' },
    { modelId: 'gemini-4-argon-max' },
    { modelId: 'gpt-oss-120b-medium' },
]

function getConfigHandler() {
    return mocks.registerHandler.mock.calls.find(([method]) => method === RPC_METHODS.SetSessionConfig)![1] as
        (config: { model?: string | null; effort?: string | null }) => Promise<unknown>
}

describe('runAgy model and effort config', () => {
    afterEach(() => {
        expect(mocks.markCrash).not.toHaveBeenCalled()
    })
    beforeEach(() => {
        vi.resetAllMocks()
        const bootstrap = {
            api: {},
            session: {
                onUserMessage: mocks.onUserMessage,
                onCancelQueuedMessage: vi.fn(),
                rpcHandlerManager: { registerHandler: mocks.registerHandler },
            },
        }
        mocks.bootstrap.mockResolvedValue(bootstrap)
        mocks.existing.mockResolvedValue(bootstrap)
        mocks.listModels.mockResolvedValue({ success: true, availableModels: catalog })
    })

    it.each([false, true])('normalizes launch/resume selection (existing=%s)', async (existing) => {
        await runAgy({
            model: 'gemini-4-argon-medium', effort: 'high', workingDirectory: '/tmp',
            ...(existing ? { existingSessionId: 'hub-session', resumeSessionId: 'brain-session' } : {}),
        })
        expect(mocks.loop).toHaveBeenCalledWith(expect.objectContaining({ model: 'gemini-4-argon', effort: 'high' }))
        if (!existing) {
            expect(mocks.bootstrap).toHaveBeenCalledWith(expect.objectContaining({ model: 'gemini-4-argon', effort: 'high' }))
        }
    })

    it('applies RPC effort, acknowledges normalization, and preserves earlier queue snapshots', async () => {
        mocks.loop.mockImplementation(async ({ messageQueue }: { messageQueue: MessageQueue2<AgyMode> }) => {
            const send = mocks.onUserMessage.mock.calls[0]![0]
            const handler = getConfigHandler()
            send({ content: { text: 'before' } }, 'first')
            await expect(handler({ effort: 'max' })).resolves.toEqual({
                applied: { model: 'gemini-4-argon', effort: 'max' },
            })
            send({ content: { text: 'after' } }, 'second')
            expect((await messageQueue.waitForMessagesAndGetAsString())?.mode)
                .toMatchObject({ model: 'gemini-4-argon', effort: 'medium' })
            expect((await messageQueue.waitForMessagesAndGetAsString())?.mode)
                .toMatchObject({ model: 'gemini-4-argon', effort: 'max' })

            await expect(handler({ model: 'gemini-4-argon-high' })).resolves.toEqual({
                applied: { model: 'gemini-4-argon', effort: 'high' },
            })
            await expect(handler({ model: 'gemini-4-argon-high', effort: null })).resolves.toEqual({
                applied: { model: 'gemini-4-argon', effort: null },
            })
            await expect(handler({ model: 'gpt-oss-120b-medium' })).resolves.toEqual({
                applied: { model: 'gpt-oss-120b-medium', effort: null },
            })
        })
        await runAgy({ model: 'gemini-4-argon-medium', workingDirectory: '/tmp' })
        expect(mocks.cleanup).toHaveBeenCalledOnce()
    })

    it('rejects an invalid RPC effort before changing runtime state', async () => {
        mocks.loop.mockImplementation(async ({ messageQueue }: { messageQueue: MessageQueue2<AgyMode> }) => {
            await expect(getConfigHandler()({ model: 'gpt-oss-120b-medium', effort: 'extreme' }))
                .rejects.toThrow('Invalid Antigravity effort')
            mocks.onUserMessage.mock.calls[0]![0]({ content: { text: 'still original' } }, 'first')
            expect((await messageQueue.waitForMessagesAndGetAsString())?.mode)
                .toMatchObject({ model: 'gemini-4-argon', effort: 'medium' })
        })
        await runAgy({ model: 'gemini-4-argon-medium', workingDirectory: '/tmp' })
    })
})
