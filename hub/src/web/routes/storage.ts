import { stat } from 'node:fs/promises'
import type { SqliteStorageUsageResponse, VacuumStorageResponse } from '@hapi/protocol/apiTypes'
import { Hono } from 'hono'
import type { Store } from '../../store'
import type { WebAppEnv } from '../middleware/auth'

async function fileSize(path: string, required = false): Promise<number> {
    try {
        return (await stat(path)).size
    } catch (error) {
        if (!required && error instanceof Error && 'code' in error && error.code === 'ENOENT') return 0
        throw error
    }
}

export function createStorageRoutes(store: Store): Hono<WebAppEnv> {
    const app = new Hono<WebAppEnv>()

    app.get('/storage/sqlite', async (c) => {
        if (c.get('namespace') !== 'default') {
            return c.json({ error: 'Storage usage is only available to the hub owner' }, 403)
        }
        c.header('Cache-Control', 'no-store')
        const dbPath = store.dbPath
        try {
            const [databaseBytes, walBytes, shmBytes] = await Promise.all([
                fileSize(dbPath, true),
                fileSize(`${dbPath}-wal`),
                fileSize(`${dbPath}-shm`),
            ])
            const insights = store.storageInsights()
            const freelistBytes = insights.freelistCount * insights.pageSize
            const usedBytes = (insights.pageCount - insights.freelistCount) * insights.pageSize
            const response: SqliteStorageUsageResponse = {
                path: dbPath,
                databaseBytes,
                walBytes,
                shmBytes,
                totalBytes: databaseBytes + walBytes + shmBytes,
                pageSize: insights.pageSize,
                pageCount: insights.pageCount,
                freelistBytes,
                usedBytes,
                tables: insights.tables,
                breakdownApproximate: insights.breakdownApproximate,
            }
            return c.json(response)
        } catch (error) {
            return c.json({
                error: error instanceof Error ? error.message : 'Failed to read SQLite storage usage'
            }, 500)
        }
    })

    app.post('/storage/vacuum', (c) => {
        if (c.get('namespace') !== 'default') {
            return c.json({ error: 'Storage maintenance is only available to the hub owner' }, 403)
        }
        c.header('Cache-Control', 'no-store')
        try {
            const result = store.vacuum()
            const response: VacuumStorageResponse = {
                path: store.dbPath,
                beforeBytes: result.beforeBytes,
                afterBytes: result.afterBytes,
                reclaimedBytes: result.reclaimedBytes,
                durationMs: result.durationMs,
            }
            return c.json(response)
        } catch (error) {
            return c.json({
                error: error instanceof Error ? error.message : 'Failed to vacuum the SQLite database'
            }, 500)
        }
    })

    return app
}
