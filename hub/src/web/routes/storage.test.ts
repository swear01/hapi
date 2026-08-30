import { afterEach, describe, expect, it } from 'bun:test'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Hono } from 'hono'
import { Store } from '../../store'
import type { WebAppEnv } from '../middleware/auth'
import { createStorageRoutes } from './storage'

const directories: string[] = []

afterEach(async () => {
    await Promise.all(directories.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

function createStore(): { store: Store; directory: string } {
    const directory = join(tmpdir(), `hapi-storage-${Math.random().toString(36).slice(2)}`)
    directories.push(directory)
    return { store: new Store(join(directory, 'hapi.db')), directory }
}

function createApp(store: Store, namespace = 'default') {
    const app = new Hono<WebAppEnv>()
    app.use('*', async (c, next) => {
        c.set('namespace', namespace)
        await next()
    })
    app.route('/api', createStorageRoutes(store))
    return app
}

function seedSession(store: Store, tag: string, messageCount: number): string {
    const session = store.sessions.getOrCreateSession(tag, {}, null, 'default')
    const content = { text: 'x'.repeat(200) }
    for (let i = 0; i < messageCount; i++) {
        store.messages.addMessage(session.id, content, `local-${tag}-${i}`)
    }
    return session.id
}

type StorageUsageBody = {
    path: string
    databaseBytes: number
    walBytes: number
    shmBytes: number
    totalBytes: number
    pageSize: number
    pageCount: number
    freelistBytes: number
    usedBytes: number
    tables: Array<{ name: string; kind: string; bytes: number; rows: number }>
    breakdownApproximate: boolean
}

async function fetchUsage(app: Hono<WebAppEnv>): Promise<StorageUsageBody> {
    const response = await app.request('/api/storage/sqlite')
    expect(response.status).toBe(200)
    return (await response.json()) as StorageUsageBody
}

describe('GET /api/storage/sqlite', () => {
    it('returns physical sizes and a logical per-object breakdown', async () => {
        const { store } = createStore()
        seedSession(store, 'seed', 100)
        const app = createApp(store)

        const response = await app.request('/api/storage/sqlite')

        expect(response.status).toBe(200)
        expect(response.headers.get('cache-control')).toBe('no-store')
        const body = (await response.json()) as StorageUsageBody
        expect(body.path).toBe(store.dbPath)
        expect(body.databaseBytes).toBeGreaterThan(0)
        expect(body.pageSize).toBe(4096)
        expect(body.pageCount).toBeGreaterThan(0)
        expect(body.freelistBytes).toBeGreaterThanOrEqual(0)
        expect(body.usedBytes).toBe((body.pageCount * body.pageSize) - body.freelistBytes)
        expect(body.totalBytes).toBe(body.databaseBytes + body.walBytes + body.shmBytes)
        expect(Array.isArray(body.tables)).toBe(true)
        const messages = body.tables.find((table) => table.name === 'messages')
        expect(messages).toBeDefined()
        expect(messages!.kind).toBe('table')
        expect(messages!.rows).toBeGreaterThanOrEqual(100)
        expect(messages!.bytes).toBeGreaterThan(0)
    })

    it('shows deleted sessions as reclaimable free pages while the file does not shrink', async () => {
        const { store } = createStore()
        const sessionId = seedSession(store, 'doomed', 5000)
        const app = createApp(store)

        const before = await fetchUsage(app)
        expect(before.freelistBytes).toBeGreaterThanOrEqual(0)

        store.sessions.deleteSession(sessionId, 'default')

        const after = await fetchUsage(app)

        // Deletion moves the rows to free pages inside the file; it never
        // returns space to disk (a stray auto-checkpoint can even push the
        // physical size up while it materializes WAL frames).
        expect(after.freelistBytes).toBeGreaterThan(before.freelistBytes)
        expect(after.databaseBytes).toBeGreaterThanOrEqual(before.databaseBytes)
        expect(after.usedBytes).toBeLessThan(before.usedBytes)
        const messages = after.tables.find((table: { name: string }) => table.name === 'messages')
        // The dbstat path reports empty tables with 0 rows; the estimate
        // fallback (no dbstat vtab on Linux) drops them, so accept undefined.
        expect(messages?.rows ?? 0).toBe(0)
    }, 15_000)

    it('falls back to a content-length estimate when dbstat is unavailable', async () => {
        const { store } = createStore()
        seedSession(store, 'fallback', 200)

        const usage = store.estimateTableUsage()
        const messages = usage.find((table) => table.name === 'messages')
        expect(messages).toBeDefined()
        expect(messages!.kind).toBe('table')
        expect(messages!.rows).toBeGreaterThanOrEqual(200)
        expect(messages!.bytes).toBeGreaterThan(0)
        // The fallback only covers user tables (no indexes), so the
        // largest reported object should be messages.
        expect(usage[0]?.name).toBe('messages')
    })

    it('rejects non-default namespaces', async () => {
        const { store } = createStore()
        const response = await createApp(store, 'tenant').request('/api/storage/sqlite')

        expect(response.status).toBe(403)
        expect(await response.json()).toEqual({ error: 'Storage usage is only available to the hub owner' })
    })
})

describe('POST /api/storage/vacuum', () => {
    it('reclaims deleted pages and shrinks the database file', async () => {
        const { store } = createStore()
        const sessionId = seedSession(store, 'doomed', 5000)
        const app = createApp(store)

        const before = await fetchUsage(app)
        store.sessions.deleteSession(sessionId, 'default')

        const response = await app.request('/api/storage/vacuum', { method: 'POST' })

        expect(response.status).toBe(200)
        const result = (await response.json()) as {
            path: string
            beforeBytes: number
            afterBytes: number
            reclaimedBytes: number
        }
        expect(result.path).toBe(store.dbPath)
        expect(result.afterBytes).toBeGreaterThan(0)
        expect(result.afterBytes).toBeLessThanOrEqual(result.beforeBytes)
        expect(result.reclaimedBytes).toBe(result.beforeBytes - result.afterBytes)

        const after = await fetchUsage(app)
        expect(after.freelistBytes).toBe(0)
        expect(after.databaseBytes).toBeLessThan(before.databaseBytes)
        expect(after.walBytes).toBe(0)
        expect(after.tables.find((table: { name: string }) => table.name === 'messages')?.rows ?? 0).toBe(0)
    }, 15_000)

    it('rejects non-default namespaces', async () => {
        const { store } = createStore()
        const response = await createApp(store, 'tenant').request('/api/storage/vacuum', { method: 'POST' })

        expect(response.status).toBe(403)
        expect(await response.json()).toEqual({ error: 'Storage maintenance is only available to the hub owner' })
    })
})
