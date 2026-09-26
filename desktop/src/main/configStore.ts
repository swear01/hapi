import { app } from 'electron'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import type { LauncherConfig } from '../shared'

const DEFAULT_CONFIG: LauncherConfig = {
    workspaceRoots: [],
    relayEnabled: true,
    hubPort: 3006,
    locale: 'zh-CN'
}

export class ConfigStore {
    private readonly filePath: string
    private operationQueue: Promise<void> = Promise.resolve()

    constructor() {
        this.filePath = join(app.getPath('userData'), 'config.json')
    }

    async read(): Promise<LauncherConfig> {
        try {
            const raw = await readFile(this.filePath, 'utf8')
            const parsed = JSON.parse(raw) as Partial<LauncherConfig>
            return normalizeConfig(parsed)
        } catch {
            return { ...DEFAULT_CONFIG }
        }
    }

    write(config: LauncherConfig): Promise<LauncherConfig> {
        return this.enqueue(() => this.writeNow(config))
    }

    update(updater: (config: LauncherConfig) => LauncherConfig): Promise<LauncherConfig> {
        return this.enqueue(async () => {
            const current = await this.read()
            return await this.writeNow(updater(current))
        })
    }

    private enqueue<T>(operation: () => Promise<T>): Promise<T> {
        const result = this.operationQueue.then(operation)
        this.operationQueue = result.then(() => undefined, () => undefined)
        return result
    }

    private async writeNow(config: LauncherConfig): Promise<LauncherConfig> {
        const normalized = normalizeConfig(config)
        await mkdir(app.getPath('userData'), { recursive: true })
        const temporaryPath = `${this.filePath}.${randomUUID()}.tmp`
        try {
            await writeFile(temporaryPath, JSON.stringify(normalized, null, 4), 'utf8')
            await rename(temporaryPath, this.filePath)
        } catch (error) {
            try {
                await rm(temporaryPath, { force: true })
            } catch (cleanupError) {
                throw new AggregateError([error, cleanupError], 'Failed to write and clean up launcher configuration')
            }
            throw error
        }
        return normalized
    }
}

function normalizeConfig(value: Partial<LauncherConfig>): LauncherConfig {
    const hubPort = Number.isInteger(value.hubPort) && value.hubPort !== undefined && value.hubPort > 0 && value.hubPort < 65536
        ? value.hubPort
        : DEFAULT_CONFIG.hubPort
    const locale = value.locale === 'en' ? 'en' : 'zh-CN'
    const workspaceRoots = Array.isArray(value.workspaceRoots)
        ? Array.from(new Set(value.workspaceRoots
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => item.trim())))
        : []

    return {
        workspaceRoots,
        relayEnabled: value.relayEnabled ?? DEFAULT_CONFIG.relayEnabled,
        hubPort,
        locale,
        windowBounds: value.windowBounds,
        launcherToken: typeof value.launcherToken === 'string' && value.launcherToken.length > 0 ? value.launcherToken : undefined
    }
}
