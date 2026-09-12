import { afterAll, describe, expect, it, mock } from 'bun:test'
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const userDataPath = mkdtempSync(join(tmpdir(), 'hapi-desktop-config-'))
mock.module('electron', () => ({ app: { getPath: () => userDataPath } }))

const { ConfigStore } = await import('../src/main/configStore')

afterAll(() => rmSync(userDataPath, { recursive: true, force: true }))

describe('ConfigStore', () => {
    it('serializes concurrent read-modify-write updates', async () => {
        const store = new ConfigStore()
        await store.write({ workspaceRoots: [], relayEnabled: true, hubPort: 3006, locale: 'zh-CN' })

        await Promise.all([
            store.update((config) => ({ ...config, locale: 'en' })),
            store.update((config) => ({ ...config, launcherToken: 'token' }))
        ])

        expect(await store.read()).toMatchObject({ locale: 'en', launcherToken: 'token' })
    })

    it('orders full writes with read-modify-write updates', async () => {
        const store = new ConfigStore()
        await store.write({ workspaceRoots: [], relayEnabled: true, hubPort: 3006, locale: 'zh-CN' })

        await Promise.all([
            store.write({ workspaceRoots: ['/workspace'], relayEnabled: true, hubPort: 3006, locale: 'en' }),
            store.update((config) => ({ ...config, launcherToken: 'token' }))
        ])

        expect(await store.read()).toMatchObject({
            workspaceRoots: ['/workspace'],
            locale: 'en',
            launcherToken: 'token'
        })
    })

    it('removes the temporary file when atomic replacement fails', async () => {
        const configPath = join(userDataPath, 'config.json')
        rmSync(configPath, { force: true })
        mkdirSync(configPath)
        const store = new ConfigStore()

        await expect(store.write({
            workspaceRoots: [],
            relayEnabled: true,
            hubPort: 3006,
            locale: 'en'
        })).rejects.toThrow()

        expect(readdirSync(userDataPath).filter((name) => name.endsWith('.tmp'))).toEqual([])
    })
})
