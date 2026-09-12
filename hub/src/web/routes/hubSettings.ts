import { Hono } from 'hono'
import { UpdateHubSettingsRequestSchema, type HubSettingsResponse } from '@hapi/protocol'
import {
    readSessionSummaryInChatEnabled,
    writeSessionSummaryInChatEnabled
} from '../../config/sessionSummaryInChat'
import type { WebAppEnv } from '../middleware/auth'

const OWNER_ONLY_ERROR = 'Hub settings are only available to the hub owner'

async function readHubSettings(dataDir: string): Promise<HubSettingsResponse> {
    return { sessionSummaryInChat: await readSessionSummaryInChatEnabled(dataDir) }
}

export function createHubSettingsRoutes(dataDir: string): Hono<WebAppEnv> {
    const app = new Hono<WebAppEnv>()

    app.get('/hub-settings', async (c) => {
        c.header('Cache-Control', 'no-store')
        return c.json(await readHubSettings(dataDir))
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
        if (parsed.data.sessionSummaryInChat !== undefined) {
            await writeSessionSummaryInChatEnabled(
                dataDir,
                parsed.data.sessionSummaryInChat
            )
        }
        c.header('Cache-Control', 'no-store')
        return c.json(await readHubSettings(dataDir))
    })

    return app
}
