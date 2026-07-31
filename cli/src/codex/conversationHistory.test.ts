import { describe, expect, it, vi } from 'vitest'
import { CodexConversationHistory } from './conversationHistory'

function createClient(overrides?: {
    fork?: (params: Record<string, unknown>) => Promise<{ thread: { id: string } }>
    rollback?: (params: { threadId: string; numTurns: number }) => Promise<unknown>
    read?: () => Promise<{ thread: { id: string; turns: Array<Record<string, unknown>> } }>
}) {
    return {
        forkThread: overrides?.fork ?? (async () => ({ thread: { id: 'forked-1' } })),
        rollbackThread: overrides?.rollback ?? (async () => ({ thread: { id: 'thread-1' } })),
        readThread: overrides?.read ?? (async () => ({
            thread: {
                id: 'thread-1',
                turns: [
                    { id: 'turn-a', items: [{ type: 'userMessage', clientId: 'local-a' }] },
                    { id: 'turn-b', items: [{ type: 'userMessage', clientId: 'local-b' }] },
                    { id: 'turn-c', items: [{ type: 'userMessage', clientId: 'local-c' }] }
                ]
            }
        }))
    }
}

describe('CodexConversationHistory', () => {
    it('forks current without a turn boundary', async () => {
        const fork = vi.fn(async (params: Record<string, unknown>) => {
            expect(params.beforeTurnId).toBeUndefined()
            return { thread: { id: 'forked-current' } }
        })
        const history = new CodexConversationHistory(() => createClient({ fork }) as never)
        history.setThreadId('thread-1')
        const result = await history.fork()
        expect(result).toEqual({ nativeSessionId: 'forked-current' })
        expect(fork).toHaveBeenCalledTimes(1)
    })

    it('historical fork passes lastTurnId of the previous turn', async () => {
        const fork = vi.fn(async (params: Record<string, unknown>) => {
            expect(params.lastTurnId).toBe('turn-a')
            expect(params.beforeTurnId).toBeUndefined()
            return { thread: { id: 'forked-hist' } }
        })
        const history = new CodexConversationHistory(() => createClient({ fork }) as never)
        history.setThreadId('thread-1')
        const result = await history.fork('local-b')
        expect(result.nativeSessionId).toBe('forked-hist')
    })

    it('rejects historical fork before the first turn', async () => {
        const fork = vi.fn(async () => ({ thread: { id: 'x' } }))
        const history = new CodexConversationHistory(() => createClient({ fork }) as never)
        history.setThreadId('thread-1')
        await expect(history.fork('local-a')).rejects.toThrow(/first turn/)
        expect(fork).not.toHaveBeenCalled()
    })

    it('computes rewind numTurns from selected turn', async () => {
        const rollback = vi.fn(async (params: { threadId: string; numTurns: number }) => {
            expect(params).toEqual({ threadId: 'thread-1', numTurns: 2 })
            return { thread: { id: 'thread-1' } }
        })
        const history = new CodexConversationHistory(() => createClient({ rollback }) as never)
        history.setThreadId('thread-1')
        const result = await history.rewind('local-b')
        expect(result).toEqual({
            success: true,
            truncateFromLocalId: 'local-b',
            messages: []
        })
        expect(rollback).toHaveBeenCalledTimes(1)
    })

    it('marks rewind unsupported on method-not-found without affecting fork', async () => {
        const rollback = vi.fn(async () => {
            throw new Error('thread/rollback is unsupported')
        })
        const fork = vi.fn(async () => ({ thread: { id: 'forked-ok' } }))
        const history = new CodexConversationHistory(() => createClient({ rollback, fork }) as never)
        history.setThreadId('thread-1')
        await expect(history.rewind('local-a')).rejects.toThrow(/unsupported/)
        const caps = history.getCapabilitiesForMetadata()?.conversationHistory
        expect(caps?.rewindToMessage).toBeUndefined()
        const forked = await history.fork()
        expect(forked.nativeSessionId).toBe('forked-ok')
    })

    it('does not call native fork when selected turn is missing', async () => {
        const fork = vi.fn(async () => ({ thread: { id: 'x' } }))
        const history = new CodexConversationHistory(() => createClient({
            fork,
            read: async () => ({ thread: { id: 'thread-1', turns: [] } })
        }) as never)
        history.setThreadId('thread-1')
        await expect(history.fork('missing-local')).rejects.toThrow(/No native history point/)
        expect(fork).not.toHaveBeenCalled()
    })

    it('restores durable localId→turnId locators across relaunches', async () => {
        const fork = vi.fn(async (params: Record<string, unknown>) => {
            expect(params.lastTurnId).toBe('turn-a')
            expect(params.beforeTurnId).toBeUndefined()
            return { thread: { id: 'forked-restored' } }
        })
        const history = new CodexConversationHistory(() => createClient({
            fork,
            // Simulate a relaunch where thread/read no longer exposes clientIds.
            read: async () => ({
                thread: {
                    id: 'thread-1',
                    turns: [
                        { id: 'turn-a', items: [] },
                        { id: 'turn-b', items: [] }
                    ]
                }
            })
        }) as never)
        history.setThreadId('thread-1')
        history.restoreTurns({ 'local-b': 'turn-b' })
        const result = await history.fork('local-b')
        expect(result.nativeSessionId).toBe('forked-restored')
        expect(history.getTurns()['local-b']).toBe('turn-b')
    })
})
