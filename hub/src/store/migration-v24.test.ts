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

describe('schema migration v23 to v24', () => {
    it('adds cost and context-only presence columns and rebuilds the usage index', () => {
        const dir = mkdtempSync(join(tmpdir(), 'hapi-migration-v24-'))
        tempDirs.push(dir)
        const dbPath = join(dir, 'hapi.db')

        new Store(dbPath).close()
        const legacy = new Database(dbPath)
        legacy.exec('ALTER TABLE usage_events DROP COLUMN context_only')
        legacy.exec('ALTER TABLE usage_events DROP COLUMN cost')
        legacy.exec('ALTER TABLE usage_events DROP COLUMN cost_currency')
        // Seed a v23-shaped derived row: the upgrade must wipe it so the lazy
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
        const columns = new Set(
            (internalDb.prepare('PRAGMA table_info(usage_events)').all() as Array<{ name: string }>)
                .map((column) => column.name)
        )
        expect(columns.has('context_only')).toBe(true)
        expect(columns.has('cost')).toBe(true)
        expect(columns.has('cost_currency')).toBe(true)

        // The derived index is cleared on upgrade so rows are re-derived
        // under the new semantics instead of mixing old and new rows.
        const seedCount = internalDb.prepare("SELECT COUNT(*) AS n FROM usage_events WHERE session_id = 'migration-v24-seed'").get() as { n: number }
        expect(seedCount.n).toBe(0)
        migrated.close()
    })
})
