import { describe, expect, it } from 'bun:test'
import { Store } from '../store'
import { RpcRegistry } from '../socket/rpcRegistry'
import { SyncEngine } from './syncEngine'

function createEngine() {
    const store = new Store(':memory:')
    const io = {
        of: () => ({
            to: () => ({ emit: () => {} })
        })
    }
    const engine = new SyncEngine(store, io as never, new RpcRegistry(), { broadcast() {} } as never)
    return { store, engine }
}

describe('SyncEngine.steerQueuedMessage', () => {
    it('rejects every scheduled row, mature ones included, without invoking the CLI', async () => {
        const { store, engine } = createEngine()
        try {
            const session = engine.getOrCreateSession(
                'steer-scheduled',
                { path: '/tmp/project', host: 'localhost', flavor: 'pi' },
                { requests: {}, completedRequests: {} },
                'default'
            )
            // A mature scheduled row: the fire time already passed, but the row
            // is still uninvoked and waiting for the scheduled-FIFO release.
            const message = store.messages.addMessage(
                session.id,
                { text: 'mature scheduled' },
                'mature-local',
                Date.now() - 1_000
            )

            const result = await engine.steerQueuedMessage(session.id, message.id)

            expect(result).toEqual({
                status: 'failed',
                error: 'Scheduled messages cannot be steered',
                localId: 'mature-local'
            })
            // The row must stay queued — untouched by the rejected steer.
            const lookup = store.messages.lookupQueuedMessage(session.id, message.id)
            expect(lookup.status).toBe('queued')
        } finally {
            engine.stop()
        }
    })

    it('accepts codex sessions (turn/steer) and forwards to the CLI', async () => {
        const { store, engine } = createEngine()
        try {
            const session = engine.getOrCreateSession(
                'steer-codex',
                { path: '/tmp/project', host: 'localhost', flavor: 'codex' },
                { requests: {}, completedRequests: {} },
                'default'
            )
            const message = store.messages.addMessage(session.id, { text: 'hi' }, 'local-id')

            const result = await engine.steerQueuedMessage(session.id, message.id)

            // No CLI attached in this unit test → generic RPC failure, not a
            // flavor rejection: the hub forwards codex steers to the gateway.
            expect(result.status).toBe('failed')
            if (result.status === 'failed') {
                expect(result.error).not.toBe('Steering is not supported for this session')
                expect(result.localId).toBe('local-id')
            }
        } finally {
            engine.stop()
        }
    })

    it('rejects unsupported flavors without invoking the CLI', async () => {
        const { store, engine } = createEngine()
        try {
            const session = engine.getOrCreateSession(
                'steer-claude',
                { path: '/tmp/project', host: 'localhost', flavor: 'claude' },
                { requests: {}, completedRequests: {} },
                'default'
            )
            const message = store.messages.addMessage(session.id, { text: 'hi' }, 'local-id')

            const result = await engine.steerQueuedMessage(session.id, message.id)

            expect(result).toEqual({
                status: 'failed',
                error: 'Steering is not supported for this session',
                localId: null
            })
        } finally {
            engine.stop()
        }
    })

    it('accepts ACP cursor sessions but rejects legacy stream-json ones', async () => {
        const { store, engine } = createEngine()
        try {
            const acpSession = engine.getOrCreateSession(
                'steer-cursor-acp',
                {
                    path: '/tmp/project',
                    host: 'localhost',
                    flavor: 'cursor',
                    cursorSessionId: 'chat-1',
                    cursorSessionProtocol: 'acp'
                },
                { requests: {}, completedRequests: {} },
                'default'
            )
            const acpMessage = store.messages.addMessage(acpSession.id, { text: 'hi' }, 'acp-local')
            const acpResult = await engine.steerQueuedMessage(acpSession.id, acpMessage.id)
            // Forwards to the (unregistered) CLI handler → generic failure, not a flavor rejection.
            expect(acpResult.status).toBe('failed')
            if (acpResult.status === 'failed') {
                expect(acpResult.error).not.toBe('Steering is not supported for this session')
            }

            const legacySession = engine.getOrCreateSession(
                'steer-cursor-legacy',
                {
                    path: '/tmp/project',
                    host: 'localhost',
                    flavor: 'cursor',
                    cursorSessionId: 'chat-2',
                    cursorSessionProtocol: 'stream-json'
                },
                { requests: {}, completedRequests: {} },
                'default'
            )
            const legacyMessage = store.messages.addMessage(legacySession.id, { text: 'hi' }, 'legacy-local')

            const legacyResult = await engine.steerQueuedMessage(legacySession.id, legacyMessage.id)

            expect(legacyResult).toEqual({
                status: 'failed',
                error: 'Steering is not supported for this session',
                localId: null
            })
        } finally {
            engine.stop()
        }
    })
})
