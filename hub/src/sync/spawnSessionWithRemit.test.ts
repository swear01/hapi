import { describe, expect, it, mock } from 'bun:test'
import { createHash } from 'node:crypto'
import type { SpawnSessionWithRemitRequest } from '@hapi/protocol/apiTypes'
import { SyncEngine } from './syncEngine'
import { RpcTargetMissingError } from './rpcGateway'

const SESSION_ID = '05d9f0f2-9273-4137-933c-07459a1146a2'
const EXISTING_ID = '6acb2b8a-1334-4955-b0c6-86f5a22656d2'
const REQUEST: SpawnSessionWithRemitRequest = {
    directory: '/tmp/project',
    message: 'implement issue',
    agent: 'codex',
    remitId: '7ee03698-0fe7-4f76-b8a8-d84f4eddbf5c',
    name: 'Worker'
}

function callSpawn(harness: Record<string, unknown>, request: SpawnSessionWithRemitRequest = REQUEST) {
    const requestHash = createHash('sha256')
        .update(JSON.stringify(['machine-1', ...Object.entries(request).sort(([a], [b]) => a.localeCompare(b))]))
        .digest('hex')
    const reserved = {
        id: SESSION_ID,
        namespace: 'default',
        active: false,
        metadata: {
            machineId: 'machine-1',
            path: '/tmp/project',
            flavor: 'codex',
            spawnRemitOperation: {
                remitId: request.remitId,
                requestHash,
                machineId: 'machine-1',
                state: 'pending',
                updatedAt: 1
            }
        },
        model: null,
        modelReasoningEffort: null,
        effort: null,
        permissionMode: undefined
    }
    return SyncEngine.prototype.spawnSessionWithRemit.call({
        spawnRemitTails: new Map(),
        spawnSessionWithRemitOnce: (SyncEngine.prototype as unknown as {
            spawnSessionWithRemitOnce: SyncEngine['spawnSessionWithRemit']
        }).spawnSessionWithRemitOnce,
        getOrCreateSession: () => reserved,
        getQueuedState: () => ({ queuedLocalIds: [], invokedLocalMessages: [] }),
        persistSpawnRemitOperation: () => true,
        buildSpawnRemitSuccess: (SyncEngine.prototype as unknown as {
            buildSpawnRemitSuccess: SyncEngine['spawnSessionWithRemit']
        }).buildSpawnRemitSuccess,
        ...harness
    } as unknown as SyncEngine, 'machine-1', 'default', request)
}

describe('spawnSessionWithRemit', () => {
    it('coalesces concurrent retries for the same remit', async () => {
        let finish!: (result: { type: 'error'; code: string; message: string }) => void
        const resultPromise = new Promise<{ type: 'error'; code: string; message: string }>((resolve) => { finish = resolve })
        const spawnSessionWithRemitOnce = mock(async () => await resultPromise)
        const harness = { spawnRemitTails: new Map(), spawnSessionWithRemitOnce } as unknown as SyncEngine

        const first = SyncEngine.prototype.spawnSessionWithRemit.call(harness, 'machine-1', 'default', REQUEST)
        const retry = SyncEngine.prototype.spawnSessionWithRemit.call(harness, 'machine-1', 'default', REQUEST)
        finish({ type: 'error', code: 'spawn_timeout', message: 'timeout' })

        await expect(Promise.all([first, retry])).resolves.toEqual([
            { type: 'error', code: 'spawn_timeout', message: 'timeout' },
            { type: 'error', code: 'spawn_timeout', message: 'timeout' }
        ])
        expect(spawnSessionWithRemitOnce).toHaveBeenCalledTimes(1)
    })

    it('never waits for, cleans up, or messages an unexpected returned id', async () => {
        const waitForSessionActive = mock(async () => true)
        const waitForSessionReady = mock(async () => 'ready' as const)
        const cleanupSpawnedSession = mock(async () => true)
        const sendMessage = mock(async () => {})
        const result = await callSpawn({
            spawnSession: async () => ({ type: 'success', sessionId: EXISTING_ID }),
            waitForSessionActive,
            waitForSessionReady,
            cleanupSpawnedSession,
            sendMessage
        })

        expect(result).toEqual({
            type: 'error',
            code: 'spawn_not_fresh',
            message: 'Runner returned an unexpected session id; it was not stopped',
            childSessionId: EXISTING_ID,
            cleanedUp: false
        })
        expect(waitForSessionActive).not.toHaveBeenCalled()
        expect(waitForSessionReady).not.toHaveBeenCalled()
        expect(cleanupSpawnedSession).toHaveBeenCalledWith('machine-1', 'default', SESSION_ID)
        expect(cleanupSpawnedSession).not.toHaveBeenCalledWith('machine-1', 'default', EXISTING_ID)
        expect(sendMessage).not.toHaveBeenCalled()
    })

    it('returns the same child without spawning or redelivering after a lost success response', async () => {
        const spawnSession = mock(async () => ({ type: 'success' as const, sessionId: SESSION_ID }))
        const sendMessage = mock(async () => {})
        const requestHash = createHash('sha256')
            .update(JSON.stringify(['machine-1', ...Object.entries(REQUEST).sort(([a], [b]) => a.localeCompare(b))]))
            .digest('hex')
        const result = await callSpawn({
            getOrCreateSession: () => ({
                id: SESSION_ID,
                namespace: 'default',
                active: true,
                metadata: {
                    machineId: 'machine-1',
                    path: '/tmp/project',
                    flavor: 'codex',
                    name: 'Worker',
                    spawnRemitOperation: {
                        remitId: REQUEST.remitId,
                        requestHash,
                        machineId: 'machine-1',
                        state: 'completed',
                        updatedAt: 2
                    }
                },
                model: null,
                modelReasoningEffort: null,
                effort: null,
                permissionMode: undefined
            }),
            spawnSession,
            sendMessage
        })

        expect(result).toMatchObject({ type: 'success', sessionId: SESSION_ID, remitId: REQUEST.remitId })
        expect(spawnSession).not.toHaveBeenCalled()
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
        let delivered = false
        const sendMessage = mock(async () => { delivered = true })
        const result = await callSpawn({
            getSessions: () => [],
            spawnSession: async () => ({ type: 'success', sessionId: SESSION_ID }),
            waitForSessionActive: async () => true,
            waitForSessionReady: async () => 'ready' as const,
            getSessionByNamespace: () => child,
            renameSession,
            sendMessage,
            getQueuedState: () => ({ queuedLocalIds: delivered ? [REQUEST.remitId] : [], invokedLocalMessages: [] }),
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
