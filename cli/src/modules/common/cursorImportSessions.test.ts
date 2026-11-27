import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

// Exercise the production bun:sqlite implementation against temporary Cursor homes.
const scenario = `
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Database } from 'bun:sqlite'
import { prepareCursorImportOnDisk } from './cursorImportSessions'

const home = mkdtempSync(join(tmpdir(), 'hapi-cursor-import-test-'))
try {
    const uuid = 'test-session'
    const workspacePath = join(home, 'workspace')
    const mode = process.argv[1]
    const requestedPath = mode === 'relative' ? 'workspace' : workspacePath
    const drawer = createHash('md5').update(requestedPath).digest('hex')
    const legacy = join(home, '.cursor', 'chats', drawer, uuid)
    const destination = join(home, '.cursor', 'acp-sessions', uuid)
    mkdirSync(legacy, { recursive: true })
    mkdirSync(join(home, '.local', 'bin'), { recursive: true })
    writeFileSync(join(home, '.local', 'bin', 'agent'), '')
    const source = join(legacy, 'store.db')
    const db = new Database(source, { create: true })
    if (mode === 'retry-wal-source') db.exec('PRAGMA journal_mode=WAL')
    db.exec("CREATE TABLE blobs (data TEXT); INSERT INTO blobs VALUES ('synthetic history')")
    db.close()
    const original = readFileSync(source)
    if (mode === 'symlink') {
        renameSync(source, join(home, 'unrelated.db'))
        symlinkSync(join(home, 'unrelated.db'), source)
    }
    if (mode === 'symlink-drawer') {
        const originalDrawer = join(home, '.cursor', 'chats', drawer)
        renameSync(originalDrawer, join(home, 'unrelated-drawer'))
        symlinkSync(join(home, 'unrelated-drawer'), originalDrawer, 'dir')
    }
    if (mode === 'existing') {
        mkdirSync(destination, { recursive: true })
        writeFileSync(join(destination, 'store.db'), 'unrelated')
    }
    const params = {
        sessionId: mode === 'wrong-replay-id' ? 'unrelated' : uuid,
        update: {
            sessionUpdate: mode === 'config' ? 'config_option_update' : 'user_message_chunk',
            content: { type: 'text', text: mode === 'empty' ? ' ' : 'synthetic history' }
        }
    }
    const prepare = () => prepareCursorImportOnDisk({
        uuid, home, workspacePath: mode === 'drawer' ? home : requestedPath,
        knownMessageCount: mode === 'shrunken' ? 1000 : 10,
        deps: {
            tmpDir: () => home,
            createProbe: () => ({
                start() {}, async stop() {}, async initialize() { return { ok: true } },
                async loadSession() { return { response: { ok: true } } },
                clearNotifications() {},
                getNotifications() { return [{ method: 'session/update', params }] }
            })
        }
    })
    const result = await prepare()
    const storePath = join(destination, 'store.db')
    const metaPath = join(destination, 'meta.json')
    const directorySnapshot = () => readdirSync(destination).sort().map(file =>
        [file, readFileSync(join(destination, file)).toString('hex')]
    )
    let retry
    let retryPreserved
    if (mode.startsWith('retry')) {
        if (!result.success) throw new Error(JSON.stringify(result))
        if (mode === 'retry-changed') writeFileSync(storePath, 'new content')
        if (mode === 'retry-same-bytes') {
            await Bun.sleep(20)
            writeFileSync(storePath, original)
        }
        if (mode === 'retry-wal') writeFileSync(storePath + '-wal', 'new WAL')
        if (mode === 'retry-partial') rmSync(metaPath)
        if (mode === 'retry-meta-changed') writeFileSync(metaPath, '{"title":"new title"}')
        if (mode === 'retry-source-changed') {
            const changed = new Database(source, { readwrite: true })
            changed.exec("INSERT INTO blobs VALUES ('new history')")
            changed.close()
        }
        const before = directorySnapshot()
        retry = await prepare()
        retryPreserved = JSON.stringify(before) === JSON.stringify(directorySnapshot())
    }
    const placed = existsSync(storePath) ? readFileSync(storePath) : null
    console.log(JSON.stringify({
        result, originalPreserved: original.equals(readFileSync(source)),
        copyMatches: placed?.equals(original) ?? false, existingPreserved: placed?.toString() === 'unrelated',
        destinationExists: existsSync(destination), retry, retryPreserved
    }))
} finally {
    rmSync(home, { recursive: true, force: true })
}
`

describe('legacy resume on the owning Cursor runner', () => {
    function run(mode: string) {
        const child = spawnSync('bun', ['-e', scenario, mode], { cwd: __dirname, encoding: 'utf8' })
        expect(child.status, child.stderr).toBe(0)
        return JSON.parse(child.stdout.trim())
    }

    it('copies the verified snapshot and retains the original', () => {
        expect(run('valid')).toMatchObject({
            result: { success: true, sourceFormat: 'legacy', verifiedLegacyCopy: true },
            originalPreserved: true, copyMatches: true
        })
    })

    it.each(['drawer', 'relative', 'symlink', 'symlink-drawer', 'empty', 'config', 'wrong-replay-id', 'shrunken'])('refuses %s', (mode) => {
        expect(run(mode)).toMatchObject({
            result: { success: false }, originalPreserved: true, destinationExists: false
        })
    })

    it('refuses to select or overwrite an existing destination', () => {
        expect(run('existing')).toMatchObject({
            result: { success: false, reason: 'target_already_exists' },
            originalPreserved: true, existingPreserved: true
        })
    })

    it.each(['retry', 'retry-wal-source'])(
        'can recover an unchanged copy after a lost response (%s)',
        (mode) => {
            expect(run(mode)).toMatchObject({
                result: { success: true, verifiedLegacyCopy: true },
                retry: { success: true, sourceFormat: 'legacy', verifiedLegacyCopy: true },
                originalPreserved: true,
                retryPreserved: true
            })
        }
    )

    it.each(['retry-changed', 'retry-same-bytes', 'retry-wal', 'retry-partial', 'retry-meta-changed', 'retry-source-changed'])(
        'preserves and refuses %s',
        (mode) => {
            expect(run(mode)).toMatchObject({
                result: { success: true },
                retry: { success: false, reason: 'target_already_exists' },
                retryPreserved: true
            })
        }
    )
})
