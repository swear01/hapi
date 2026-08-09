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

describe('schema migration v22 to v23', () => {
    it('adds cost and context-only presence columns and rebuilds the usage index', () => {
        const dir = mkdtempSync(join(tmpdir(), 'hapi-migration-v23-'))
        tempDirs.push(dir)
        const dbPath = join(dir, 'hapi.db')

        new Store(dbPath).close()
        const legacy = new Database(dbPath)
        legacy.exec('ALTER TABLE usage_events DROP COLUMN context_only')
        legacy.exec('ALTER TABLE usage_events DROP COLUMN cost')
        legacy.exec('ALTER TABLE usage_events DROP COLUMN cost_currency')
        legacy.exec('PRAGMA user_version = 22')
        legacy.close()

        const migrated = new Store(dbPath)
        const internalDb = (migrated as unknown as { db: Database }).db
        const columns = new Set(
            (internalDb.prepare('PRAGMA table_info(usage_events)').all() as Array<{ name: string }>)
                .map((column) => column.name)
        )
        expect(columns.has('context_only')).toBe(true)
        expect(columns.has('cost')).toBe(true)
        expect(columns.has('cost_currency')).toBe(true)

        // The derived index is cleared on upgrade so rows are re-derived
        // under the new semantics instead of mixing old and new rows.
        const session = migrated.sessions.getOrCreateSession(
            'migration-v23-usage',
            { path: '/tmp', host: 'test', flavor: 'opencode' },
            null,
            'default',
            'test-model'
        )
        expect(migrated.usage.getEvents([session.id])).toEqual([])
        migrated.close()
    })
})
