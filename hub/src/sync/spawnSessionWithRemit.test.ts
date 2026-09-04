import { describe, expect, it, mock } from 'bun:test'
import type { SpawnSessionWithRemitRequest } from '@hapi/protocol/apiTypes'
import { SyncEngine } from './syncEngine'
import { RpcTargetMissingError } from './rpcGateway'

const SESSION_ID = '05d9f0f2-9273-4137-933c-07459a1146a2'
const REQUEST: SpawnSessionWithRemitRequest = {
    directory: '/tmp/project',
    message: 'implement issue',
    agent: 'codex',
    remitId: '7ee03698-0fe7-4f76-b8a8-d84f4eddbf5c',
    name: 'Worker'
}

function callSpawn(harness: Record<string, unknown>, request: SpawnSessionWithRemitRequest = REQUEST) {
    return SyncEngine.prototype.spawnSessionWithRemit.call(harness as unknown as SyncEngine, 'machine-1', 'default', request)
}

describe('spawnSessionWithRemit', () => {
    it('never waits for, cleans up, or messages a returned pre-existing id', async () => {
        const waitForSessionActive = mock(async () => true)
        const waitForSessionReady = mock(async () => 'ready' as const)
        const cleanupSpawnedSession = mock(async () => true)
        const sendMessage = mock(async () => {})
        const result = await callSpawn({
            getSessions: () => [{ id: SESSION_ID, namespace: 'other' }],
            spawnSession: async () => ({ type: 'success', sessionId: SESSION_ID }),
            waitForSessionActive,
            waitForSessionReady,
            cleanupSpawnedSession,
            sendMessage
        })

        expect(result).toEqual({
            type: 'error',
            code: 'spawn_not_fresh',
            message: 'Runner returned an existing session id; remit was not delivered'
        })
        expect(waitForSessionActive).not.toHaveBeenCalled()
        expect(waitForSessionReady).not.toHaveBeenCalled()
        expect(cleanupSpawnedSession).not.toHaveBeenCalled()
        expect(sendMessage).not.toHaveBeenCalled()
    })

    it('renames and delivers the remit only after the fresh child identity matches', async () => {
        const child = {
            id: SESSION_ID,
            namespace: 'default',
            active: true,
            metadata: { machineId: 'machine-1', name: 'Worker', path: '/tmp/project', flavor: 'codex' },
            model: null,
            modelReasoningEffort: null,
            effort: null,
            permissionMode: undefined
        }
        const renameSession = mock(async () => {})
        const sendMessage = mock(async () => {})
        const result = await callSpawn({
            getSessions: () => [],
            spawnSession: async () => ({ type: 'success', sessionId: SESSION_ID }),
            waitForSessionActive: async () => true,
            waitForSessionReady: async () => 'ready' as const,
            getSessionByNamespace: () => child,
            renameSession,
            sendMessage,
            getQueuedState: () => ({ queuedLocalIds: [REQUEST.remitId], invokedLocalMessages: [] }),
            cleanupSpawnedSession: mock(async () => true)
        })

        expect(result).toEqual({
            type: 'success',
            sessionId: SESSION_ID,
            remitId: REQUEST.remitId,
            name: 'Worker',
            session: {
                machineId: 'machine-1',
                directory: '/tmp/project',
                agent: 'codex',
                model: null,
                modelReasoningEffort: null,
                effort: null,
                permissionMode: null
            }
        })
        expect(renameSession).toHaveBeenCalledWith(SESSION_ID, 'Worker')
        expect(sendMessage).toHaveBeenCalledWith(SESSION_ID, {
            text: 'implement issue',
            localId: REQUEST.remitId,
            sentFrom: 'webapp'
        })
    })

    it('cleans up without delivering when the fresh child ends before ready', async () => {
        const cleanupSpawnedSession = mock(async () => true)
        const sendMessage = mock(async () => {})
        const result = await callSpawn({
            getSessions: () => [],
            spawnSession: async () => ({ type: 'success', sessionId: SESSION_ID }),
            waitForSessionActive: async () => true,
            waitForSessionReady: async () => 'ended' as const,
            cleanupSpawnedSession,
            sendMessage
        })

        expect(result).toMatchObject({ type: 'error', code: 'spawn_ended', cleanedUp: true })
        expect(sendMessage).not.toHaveBeenCalled()
        expect(cleanupSpawnedSession).toHaveBeenCalledTimes(1)
    })

    it('compensates and reports cleanup state when remit delivery fails', async () => {
        const cleanupSpawnedSession = mock(async () => true)
        const result = await callSpawn({
            getSessions: () => [],
            spawnSession: async () => ({ type: 'success', sessionId: SESSION_ID }),
            waitForSessionActive: async () => true,
            waitForSessionReady: async () => 'ready' as const,
            getSessionByNamespace: () => ({
                id: SESSION_ID,
                namespace: 'default',
                active: true,
                metadata: { machineId: 'machine-1', path: '/tmp/project', flavor: 'codex' },
                model: null,
                modelReasoningEffort: null,
                effort: null,
                permissionMode: undefined
            }),
            renameSession: async () => {},
            sendMessage: async () => { throw new Error('queue unavailable') },
            cleanupSpawnedSession
        })

        expect(result).toEqual({
            type: 'error',
            code: 'remit_delivery_failed',
            message: 'queue unavailable',
            childSessionId: SESSION_ID,
            cleanedUp: true
        })
        expect(cleanupSpawnedSession).toHaveBeenCalledTimes(1)
    })

    it('cleans up when the correlation id cannot be verified after delivery', async () => {
        const cleanupSpawnedSession = mock(async () => true)
        const result = await callSpawn({
            getSessions: () => [],
            spawnSession: async () => ({ type: 'success', sessionId: SESSION_ID }),
            waitForSessionActive: async () => true,
            waitForSessionReady: async () => 'ready' as const,
            getSessionByNamespace: () => ({
                id: SESSION_ID,
                namespace: 'default',
                active: true,
                metadata: { machineId: 'machine-1', path: '/tmp/project', flavor: 'codex' },
                model: null,
                modelReasoningEffort: null,
                effort: null,
                permissionMode: undefined
            }),
            renameSession: async () => {},
            sendMessage: async () => {},
            getQueuedState: () => ({ queuedLocalIds: [], invokedLocalMessages: [] }),
            cleanupSpawnedSession
        })

        expect(result).toMatchObject({
            type: 'error',
            code: 'remit_delivery_failed',
            cleanedUp: true
        })
        expect(cleanupSpawnedSession).toHaveBeenCalledTimes(1)
    })

    it('cleans up a fresh child whose selected flavor does not match', async () => {
        const cleanupSpawnedSession = mock(async () => true)
        const result = await callSpawn({
            getSessions: () => [],
            spawnSession: async () => ({ type: 'success', sessionId: SESSION_ID }),
            waitForSessionActive: async () => true,
            waitForSessionReady: async () => 'ready' as const,
            getSessionByNamespace: () => ({
                id: SESSION_ID,
                namespace: 'default',
                active: true,
                metadata: { machineId: 'machine-1', path: '/tmp/project', flavor: 'claude' },
                model: null,
                modelReasoningEffort: null,
                effort: null,
                permissionMode: undefined
            }),
            cleanupSpawnedSession
        })

        expect(result).toMatchObject({ type: 'error', code: 'spawn_selection_mismatch', cleanedUp: true })
        expect(cleanupSpawnedSession).toHaveBeenCalledTimes(1)
    })

    it('verifies the flavor-specific permission mode implied by yolo', async () => {
        const cleanupSpawnedSession = mock(async () => true)
        const result = await callSpawn({
            getSessions: () => [],
            spawnSession: async () => ({ type: 'success', sessionId: SESSION_ID }),
            waitForSessionActive: async () => true,
            waitForSessionReady: async () => 'ready' as const,
            getSessionByNamespace: () => ({
                id: SESSION_ID,
                namespace: 'default',
                active: true,
                metadata: { machineId: 'machine-1', path: '/tmp/project', flavor: 'codex' },
                model: null,
                modelReasoningEffort: null,
                effort: null,
                permissionMode: 'default'
            }),
            cleanupSpawnedSession
        }, { ...REQUEST, yolo: true })

        expect(result).toMatchObject({ type: 'error', code: 'spawn_selection_mismatch', cleanedUp: true })
        expect(cleanupSpawnedSession).toHaveBeenCalledTimes(1)
    })

    it('cleans up a fresh returned id whose namespace or runner identity does not match', async () => {
        const cleanupSpawnedSession = mock(async () => true)
        const result = await callSpawn({
            getSessions: () => [],
            spawnSession: async () => ({ type: 'success', sessionId: SESSION_ID }),
            waitForSessionActive: async () => true,
            waitForSessionReady: async () => 'ready' as const,
            getSessionByNamespace: () => null,
            cleanupSpawnedSession
        })

        expect(result).toMatchObject({ type: 'error', code: 'spawn_identity_mismatch' })
        expect(cleanupSpawnedSession).toHaveBeenCalledWith('machine-1', 'default', SESSION_ID)
    })

    it('cleanup is safe to repeat after the runner is already gone', async () => {
        const stopRunnerSession = mock(async () => 'already_gone' as const)
        const markSessionArchivedFromHub = mock(() => {})
        const harness = {
            rpcGateway: { stopRunnerSession },
            getSessionByNamespace: () => ({ id: SESSION_ID, active: false }),
            handleSessionEnd: mock(() => {}),
            sessionCache: { markSessionArchivedFromHub }
        }
        const cleanup = (SyncEngine.prototype as unknown as {
            cleanupSpawnedSession: (machineId: string, namespace: string, sessionId: string) => Promise<boolean>
        }).cleanupSpawnedSession

        await expect(cleanup.call(harness, 'machine-1', 'default', SESSION_ID)).resolves.toBe(true)
        await expect(cleanup.call(harness, 'machine-1', 'default', SESSION_ID)).resolves.toBe(true)
        expect(stopRunnerSession).toHaveBeenCalledTimes(2)
        expect(markSessionArchivedFromHub).toHaveBeenCalledTimes(2)
    })
})

describe('stopSession', () => {
    it('is idempotent when the process is already inactive', async () => {
        const killSession = mock(async () => {})
        const result = await SyncEngine.prototype.stopSession.call({
            getSession: () => ({ id: SESSION_ID, active: false }),
            rpcGateway: { stopSessionProcess: killSession }
        } as unknown as SyncEngine, SESSION_ID)

        expect(result).toEqual({ alreadyStopped: true })
        expect(killSession).not.toHaveBeenCalled()
    })

    it('reconciles an active row when its process is already gone', async () => {
        const handleSessionEnd = mock(() => {})
        const result = await SyncEngine.prototype.stopSession.call({
            getSession: () => ({ id: SESSION_ID, active: true }),
            rpcGateway: {
                stopSessionProcess: async () => { throw new RpcTargetMissingError('kill-session', 'handler-not-registered') }
            },
            handleSessionEnd
        } as unknown as SyncEngine, SESSION_ID)

        expect(result).toEqual({ alreadyStopped: false })
        expect(handleSessionEnd).toHaveBeenCalledWith(expect.objectContaining({ sid: SESSION_ID, reason: 'error' }))
    })

    it('marks an accepted stop inactive at the Hub boundary', async () => {
        const handleSessionEnd = mock(() => {})
        const result = await SyncEngine.prototype.stopSession.call({
            getSession: () => ({ id: SESSION_ID, active: true }),
            rpcGateway: { stopSessionProcess: async () => {} },
            handleSessionEnd
        } as unknown as SyncEngine, SESSION_ID)

        expect(result).toEqual({ alreadyStopped: false })
        expect(handleSessionEnd).toHaveBeenCalledWith(expect.objectContaining({ sid: SESSION_ID }))
    })
})

describe('archiveSession', () => {
    it('persists archive metadata at the Hub even when the CLI accepts the request', async () => {
        const markSessionArchivedFromHub = mock(() => {})
        const handleSessionEnd = mock(() => {})

        await SyncEngine.prototype.archiveSession.call({
            rpcGateway: { killSession: async () => {} },
            sessionCache: { markSessionArchivedFromHub },
            handleSessionEnd
        } as unknown as SyncEngine, SESSION_ID)

        expect(markSessionArchivedFromHub).toHaveBeenCalledWith(SESSION_ID, 'Archived from hub')
        expect(handleSessionEnd).toHaveBeenCalledWith(expect.objectContaining({ sid: SESSION_ID }))
    })
})
