import { Hono } from 'hono'
import { UpdateHubSettingsRequestSchema, type HubSettingsResponse } from '@hapi/protocol'
import {
    readAutoBridgeTransientModelErrorsEnabled,
    writeAutoBridgeTransientModelErrorsEnabled
} from '../../config/autoBridgeTransientModelErrors'
import {
    readSessionSummaryContractEnabled,
    writeSessionSummaryContractEnabled
} from '../../config/sessionSummaryContract'
import type { SyncEngine } from '../../sync/syncEngine'
import type { WebAppEnv } from '../middleware/auth'

const OWNER_ONLY_ERROR = 'Hub settings are only available to the hub owner'

export function createHubSettingsRoutes(
    dataDir: string,
    getSyncEngine?: () => SyncEngine | null
): Hono<WebAppEnv> {
    const app = new Hono<WebAppEnv>()

    app.get('/hub-settings', async (c) => {
        if (c.get('namespace') !== 'default') {
            return c.json({ error: OWNER_ONLY_ERROR }, 403)
        }
        c.header('Cache-Control', 'no-store')
        const [sessionSummaryContract, autoBridgeTransientModelErrors] = await Promise.all([
            readSessionSummaryContractEnabled(dataDir),
            readAutoBridgeTransientModelErrorsEnabled(dataDir)
        ])
        const response: HubSettingsResponse = {
            sessionSummaryContract,
            autoBridgeTransientModelErrors
        }
        return c.json(response)
    })

    app.put('/hub-settings', async (c) => {
        if (c.get('namespace') !== 'default') {
            return c.json({ error: OWNER_ONLY_ERROR }, 403)
        }
        const json = await c.req.json().catch(() => null)
        const parsed = UpdateHubSettingsRequestSchema.safeParse(json)
        if (!parsed.success) {
            return c.json({ error: 'Invalid body' }, 400)
        }
        if (parsed.data.sessionSummaryContract !== undefined) {
            await writeSessionSummaryContractEnabled(
                dataDir,
                parsed.data.sessionSummaryContract
            )
        }
        if (parsed.data.autoBridgeTransientModelErrors !== undefined) {
            const enabled = parsed.data.autoBridgeTransientModelErrors
            const engine = getSyncEngine?.() ?? null
            if (engine) {
                try {
                    // Disk write + fanout + rollback share SyncEngine's lock so
                    // concurrent PUTs cannot leave CLI prefs ahead of settings.json.
                    await engine.applyAutoBridgeTransientModelErrorsSetting(dataDir, enabled)
                } catch (error) {
                    const message = error instanceof Error
                        ? error.message
                        : 'Failed to update every active Cursor session'
                    return c.json({ error: message }, 409)
                }
            } else {
                await writeAutoBridgeTransientModelErrorsEnabled(dataDir, enabled)
            }
        }
        c.header('Cache-Control', 'no-store')
        const [sessionSummaryContract, autoBridgeTransientModelErrors] = await Promise.all([
            readSessionSummaryContractEnabled(dataDir),
            readAutoBridgeTransientModelErrorsEnabled(dataDir)
        ])
        const response: HubSettingsResponse = {
            sessionSummaryContract,
            autoBridgeTransientModelErrors
        }
        return c.json(response)
    })

    return app
}
