import { afterEach, describe, expect, it, vi } from 'vitest'
import { writeFileSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const { dir, identityMock } = vi.hoisted(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { mkdtempSync } = require('node:fs') as typeof import('node:fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { tmpdir } = require('node:os') as typeof import('node:os')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { join: pathJoin } = require('node:path') as typeof import('node:path')
    return { dir: mkdtempSync(pathJoin(tmpdir(), 'hapi-cli-settings-')), identityMock: vi.fn() }
})

vi.mock('@/configuration', () => ({
    configuration: {
        happyHomeDir: dir,
        settingsFile: join(dir, 'settings.json'),
        privateKeyFile: join(dir, 'access.key'),
        runnerStateFile: join(dir, 'runner.state.json'),
        runnerLockFile: join(dir, 'runner.state.json.lock'),
        logsDir: join(dir, 'logs'),
    },
}))

vi.mock('@/utils/process', () => ({
    getHapiRunnerProcessIdentity: identityMock,
    isProcessAlive: vi.fn(),
}))

import { acquireRunnerLock, releaseRunnerLock, updateSettings } from './persistence'

describe('updateSettings', () => {
    afterEach(() => {
        try {
            rmSync(join(dir, 'settings.json'), { force: true })
            rmSync(join(dir, 'settings.json.lock'), { force: true })
        } catch {
            // ignore
        }
    })

    it('rejects corrupt settings.json and leaves the original bytes intact', async () => {
        const settingsFile = join(dir, 'settings.json')
        writeFileSync(settingsFile, '{not-json')

        await expect(
            updateSettings((current) => ({ ...current, apiUrl: 'http://should-not-write' }))
        ).rejects.toThrow()

        expect(readFileSync(settingsFile, 'utf8')).toBe('{not-json')
    })
})

describe('acquireRunnerLock', () => {
    afterEach(() => {
        rmSync(join(dir, 'runner.state.json.lock'), { force: true })
        vi.clearAllMocks()
    })

    it('reclaims a lock whose live PID belongs to an unrelated process', async () => {
        writeFileSync(join(dir, 'runner.state.json.lock'), '3286')
        identityMock.mockReturnValue('foreign')

        const handle = await acquireRunnerLock(1)

        expect(handle).not.toBeNull()
        await releaseRunnerLock(handle!)
    })

    it('keeps a lock owned by a healthy runner', async () => {
        writeFileSync(join(dir, 'runner.state.json.lock'), '3286')
        identityMock.mockReturnValue('runner')

        await expect(acquireRunnerLock(1)).resolves.toBeNull()
    })
})
