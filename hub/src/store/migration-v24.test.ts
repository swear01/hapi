import { afterEach, describe, expect, it } from 'bun:test'
import { Database } from 'bun:sqlite'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Store } from './index'

const tempDirs: string[] = []

afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
        rmSync(dir, { recursive: true, force: true })
    }
})

function getColumns(store: Store, table: string): string[] {
    const db: Database = (store as unknown as { db: Database }).db
    const rows = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>
    return rows.map((row) => row.name)
}

describe('Store V23→V24 migration: session_jobs table', () => {
    it('fresh DB has session_jobs with expected columns', () => {
        const store = new Store(':memory:')
        const cols = getColumns(store, 'session_jobs')
        expect(cols).toContain('session_id')
        expect(cols).toContain('job_key')
        expect(cols).toContain('label')
        expect(cols).toContain('status')
        expect(cols).toContain('done')
        expect(cols).toContain('total')
        expect(cols).toContain('remaining')
        expect(cols).toContain('heartbeat_at')
        expect(cols).toContain('started_at')
        expect(cols).toContain('updated_at')
        expect(cols).toContain('run_id')
        store.close()
    })

    it('upserts, patches, deletes a job and surfaces primary running', () => {
        const store = new Store(':memory:')
        const session = store.sessions.getOrCreateSession('test', { path: '/tmp' }, null, 'default')

        const created = store.sessionJobs.upsert(session.id, 'beets', {
            label: 'beets import',
            status: 'running',
            remaining: 100,
            unit: 'tracks'
        })
        expect(created.outcome).toBe('upserted')
        if (created.outcome !== 'upserted') throw new Error('unreachable')

        const primary = store.sessionJobs.getPrimaryRunning(session.id)
        expect(primary?.key).toBe('beets')
        expect(primary?.remaining).toBe(100)

        // Stable primary: earliest started_at wins even after a newer job heartbeats.
        store.sessionJobs.upsert(session.id, 'newer', {
            label: 'sidecar',
            status: 'running',
            remaining: 1,
            startedAt: (primary!.startedAt) + 60_000
        })
        store.sessionJobs.patch(session.id, 'newer', { remaining: 0 })
        expect(store.sessionJobs.getPrimaryRunning(session.id)?.key).toBe('beets')
        expect(store.sessionJobs.delete(session.id, 'newer')).toEqual({ outcome: 'deleted' })

        const patched = store.sessionJobs.patch(session.id, 'beets', { remaining: 80 })
        expect(patched.outcome).toBe('patched')
        if (patched.outcome !== 'patched') throw new Error('unreachable')
        expect(patched.job.remaining).toBe(80)

        expect(store.sessionJobs.delete(session.id, 'beets')).toEqual({ outcome: 'deleted' })
        expect(store.sessionJobs.getPrimaryRunning(session.id)).toBeNull()
        store.close()
    })

    it('refuses delete while a running job exists; cascades terminal jobs', async () => {
        const store = new Store(':memory:')
        const session = store.sessions.getOrCreateSession('test', { path: '/tmp' }, null, 'default')
        store.sessionJobs.upsert(session.id, 'job', { label: 'x', status: 'running' })
        expect(store.sessionJobs.list(session.id)).toHaveLength(1)
        expect(store.sessions.deleteSession(session.id, 'default')).toBe(false)
        expect(store.sessionJobs.list(session.id)).toHaveLength(1)

        store.sessionJobs.patch(session.id, 'job', { status: 'completed' })
        expect(store.sessions.deleteSession(session.id, 'default')).toBe(true)
        expect(store.sessionJobs.list(session.id)).toHaveLength(0)
        store.close()
    })

    it('preserves startedAt on PUT without body.startedAt; honors explicit correction', () => {
        const store = new Store(':memory:')
        const session = store.sessions.getOrCreateSession('test', { path: '/tmp' }, null, 'default')
        const historical = 1_785_304_595_000

        const created = store.sessionJobs.upsert(session.id, 'beets', {
            label: 'beets import',
            status: 'running',
            remaining: 10
        }, 2_000)
        expect(created.outcome).toBe('upserted')
        if (created.outcome !== 'upserted') throw new Error('unreachable')
        expect(created.job.startedAt).toBe(2_000)

        const progress = store.sessionJobs.upsert(session.id, 'beets', {
            label: 'beets import',
            status: 'running',
            remaining: 9
        }, 3_000)
        expect(progress.outcome).toBe('upserted')
        if (progress.outcome !== 'upserted') throw new Error('unreachable')
        expect(progress.job.startedAt).toBe(2_000)
        expect(progress.job.remaining).toBe(9)

        const corrected = store.sessionJobs.upsert(session.id, 'beets', {
            label: 'beets import',
            status: 'running',
            remaining: 9,
            startedAt: historical
        }, 4_000)
        expect(corrected.outcome).toBe('upserted')
        if (corrected.outcome !== 'upserted') throw new Error('unreachable')
        expect(corrected.job.startedAt).toBe(historical)

        const patched = store.sessionJobs.patch(session.id, 'beets', { remaining: 8 }, 5_000)
        expect(patched.outcome).toBe('patched')
        if (patched.outcome !== 'patched') throw new Error('unreachable')
        expect(patched.job.startedAt).toBe(historical)
        expect(patched.job.remaining).toBe(8)

        const ownedRunId = store.sessionJobs.get(session.id, 'beets')!.runId!
        expect(ownedRunId).toBeTruthy()

        // Stale supervisor fence: wrong expectedRunId must not mutate the row.
        const stale = store.sessionJobs.patch(
            session.id,
            'beets',
            { status: 'completed', expectedRunId: 'stale-run-id' },
            6_000
        )
        expect(stale.outcome).toBe('run-mismatch')
        expect(store.sessionJobs.get(session.id, 'beets')?.status).toBe('running')

        const owned = store.sessionJobs.patch(
            session.id,
            'beets',
            { status: 'completed', expectedRunId: ownedRunId },
            7_000
        )
        expect(owned.outcome).toBe('patched')
        if (owned.outcome !== 'patched') throw new Error('unreachable')
        expect(owned.job.status).toBe('completed')
        store.close()
    })


    it('stamps heartbeatAt from hub now on upsert and patch', () => {
        const store = new Store(':memory:')
        const session = store.sessions.getOrCreateSession('test', { path: '/tmp' }, null, 'default')
        const created = store.sessionJobs.upsert(session.id, 'beets', {
            label: 'beets',
            status: 'running',
        }, 5_000)
        expect(created.outcome).toBe('upserted')
        if (created.outcome !== 'upserted') throw new Error('unreachable')
        expect(created.job.heartbeatAt).toBe(5_000)

        const patched = store.sessionJobs.patch(
            session.id,
            'beets',
            { remaining: 1 },
            6_000
        )
        expect(patched.outcome).toBe('patched')
        if (patched.outcome !== 'patched') throw new Error('unreachable')
        expect(patched.job.heartbeatAt).toBe(6_000)
        store.close()
    })

    it('mints distinct runIds even when startedAt collides', () => {
        const store = new Store(':memory:')
        const session = store.sessions.getOrCreateSession('test', { path: '/tmp' }, null, 'default')
        const a = store.sessionJobs.upsert(session.id, 'drain', {
            label: 'a',
            status: 'running',
            startedAt: 1_000,
            runId: 'run-a'
        }, 1_000)
        expect(a.outcome).toBe('upserted')
        const b = store.sessionJobs.upsert(session.id, 'drain', {
            label: 'b',
            status: 'running',
            startedAt: 1_000,
            runId: 'run-b'
        }, 1_001)
        expect(b.outcome).toBe('upserted')
        if (b.outcome !== 'upserted') throw new Error('unreachable')
        expect(b.job.runId).toBe('run-b')
        expect(b.job.startedAt).toBe(1_000)

        const stale = store.sessionJobs.patch(session.id, 'drain', {
            status: 'completed',
            expectedRunId: 'run-a'
        }, 1_002)
        expect(stale.outcome).toBe('run-mismatch')
        expect(store.sessionJobs.get(session.id, 'drain')?.status).toBe('running')
        store.close()
    })

    it('transfers jobs on merge without colliding keys', () => {
        const store = new Store(':memory:')
        const oldSession = store.sessions.getOrCreateSession('old', { path: '/a' }, null, 'default')
        const newSession = store.sessions.getOrCreateSession('new', { path: '/b' }, null, 'default')
        store.sessionJobs.upsert(oldSession.id, 'beets', {
            label: 'beets',
            status: 'running',
            remaining: 5
        })
        const result = store.sessionJobs.transfer(oldSession.id, newSession.id)
        expect(result.moved).toBe(1)
        expect(store.sessionJobs.getPrimaryRunning(newSession.id)?.remaining).toBe(5)
        expect(store.sessionJobs.list(oldSession.id)).toHaveLength(0)
        store.close()
    })
})

describe('schema migration v23 to v29', () => {
    it('adds fcm_devices.push_key to a V23 database and keeps existing rows', () => {
        const dir = mkdtempSync(join(tmpdir(), 'hapi-migration-v24-'))
        tempDirs.push(dir)
        const dbPath = join(dir, 'hapi.db')

        new Store(dbPath).close()
        const legacy = new Database(dbPath)
        legacy.exec(`
            ALTER TABLE usage_events DROP COLUMN context_only;
            ALTER TABLE usage_events DROP COLUMN cost;
            ALTER TABLE usage_events DROP COLUMN cost_currency;
            ALTER TABLE fcm_devices DROP COLUMN push_key;
            INSERT INTO fcm_devices (namespace, token, platform, device_id, created_at, updated_at)
            VALUES ('default', 'fcm-tok-1', 'phone', 'pixel-1', 1, 1);
        `)
        // Seed v23-shaped derived data: the upgrade must wipe it so the lazy
        // re-index rebuilds every row under the new semantics.
        legacy.prepare(`
            INSERT INTO usage_events (
                session_id, source_key, source_seq, created_at, agent, model, kind,
                input_tokens, output_tokens, cache_read_tokens, cache_creation_tokens
            ) VALUES (
                'migration-v24-seed', 'delta|seed', 1, 0, 'opencode', NULL, 'delta',
                100, 20, 0, 0
            )
        `).run()
        legacy.exec('PRAGMA user_version = 23')
        legacy.close()

        const migrated = new Store(dbPath)
        const internalDb = (migrated as unknown as { db: Database }).db
        const usageColumns = new Set(
            (internalDb.prepare('PRAGMA table_info(usage_events)').all() as Array<{ name: string }>)
                .map((column) => column.name)
        )
        const fcmColumns = internalDb.prepare('PRAGMA table_info(fcm_devices)').all() as Array<{ name: string }>
        const messageColumns = internalDb.prepare('PRAGMA table_info(messages)').all() as Array<{ name: string }>
        const version = internalDb.prepare('PRAGMA user_version').get() as { user_version: number }

        expect(usageColumns.has('context_only')).toBe(true)
        expect(usageColumns.has('cost')).toBe(true)
        expect(usageColumns.has('cost_currency')).toBe(true)
        expect(fcmColumns.some((column) => column.name === 'push_key')).toBe(true)
        expect(messageColumns.some((column) => column.name === 'delivery_state')).toBe(true)
        expect(version.user_version).toBe(29)
        expect((internalDb.prepare("SELECT COUNT(*) AS count FROM usage_events WHERE session_id = 'migration-v24-seed'").get() as { count: number }).count).toBe(0)

        const devices = migrated.fcm.getDevicesByNamespace('default')
        expect(devices).toHaveLength(1)
        expect(devices[0].token).toBe('fcm-tok-1')
        expect(devices[0].pushKey).toBeNull()

        migrated.fcm.upsertDevice('default', {
            token: 'a1b2',
            platform: 'ios',
            deviceId: 'iphone-1',
            pushKey: Buffer.alloc(32, 7).toString('base64')
        })
        expect(migrated.fcm.getDevicesByNamespace('default', ['ios'])).toHaveLength(1)
        migrated.close()
    })

    it('completes either V24 schema shape before adding delivery state', () => {
        const dir = mkdtempSync(join(tmpdir(), 'hapi-migration-v24-delivery-'))
        tempDirs.push(dir)
        const dbPath = join(dir, 'hapi.db')

        new Store(dbPath).close()
        const legacy = new Database(dbPath)
        legacy.exec(`
            ALTER TABLE usage_events DROP COLUMN context_only;
            ALTER TABLE usage_events DROP COLUMN cost;
            ALTER TABLE usage_events DROP COLUMN cost_currency;
            ALTER TABLE fcm_devices DROP COLUMN push_key;
            ALTER TABLE messages DROP COLUMN delivery_state;
            PRAGMA user_version = 24;
        `)
        legacy.close()

        const migrated = new Store(dbPath)
        const internalDb = (migrated as unknown as { db: Database }).db
        const usageColumns = internalDb.prepare('PRAGMA table_info(usage_events)').all() as Array<{ name: string }>
        const fcmColumns = internalDb.prepare('PRAGMA table_info(fcm_devices)').all() as Array<{ name: string }>
        const messageColumns = internalDb.prepare('PRAGMA table_info(messages)').all() as Array<{ name: string }>
        const version = internalDb.prepare('PRAGMA user_version').get() as { user_version: number }
        expect(usageColumns.some((column) => column.name === 'context_only')).toBe(true)
        expect(usageColumns.some((column) => column.name === 'cost')).toBe(true)
        expect(usageColumns.some((column) => column.name === 'cost_currency')).toBe(true)
        expect(fcmColumns.some((column) => column.name === 'push_key')).toBe(true)
        expect(messageColumns.some((column) => column.name === 'delivery_state')).toBe(true)
        expect(version.user_version).toBe(29)
        migrated.close()
    })
})
