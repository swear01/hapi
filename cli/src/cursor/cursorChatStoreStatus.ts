import { createHash } from 'node:crypto'
import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import type { CursorChatStoreStatus } from '@hapi/protocol/apiTypes'

type InspectCursorChatStoreOptions = {
    home: string
    workspacePath: string
    cursorSessionId: string
}

function isSafeCursorSessionId(value: string): boolean {
    return value !== '.'
        && value !== '..'
        && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value)
}

async function isFile(path: string): Promise<boolean> {
    try {
        return (await stat(path)).isFile()
    } catch {
        return false
    }
}

export async function inspectCursorChatStore(
    options: InspectCursorChatStoreOptions
): Promise<CursorChatStoreStatus> {
    const cursorSessionId = options.cursorSessionId.trim()
    const workspacePath = options.workspacePath.trim()
    if (!isSafeCursorSessionId(cursorSessionId) || !workspacePath) {
        return { onDisk: false, store: null }
    }

    const acpStore = join(
        options.home,
        '.cursor',
        'acp-sessions',
        cursorSessionId,
        'store.db'
    )
    if (await isFile(acpStore)) {
        return { onDisk: true, store: 'acp' }
    }

    const workspaceHash = createHash('md5').update(workspacePath).digest('hex')
    const legacyStore = join(
        options.home,
        '.cursor',
        'chats',
        workspaceHash,
        cursorSessionId,
        'store.db'
    )
    if (await isFile(legacyStore)) {
        return { onDisk: true, store: 'legacy' }
    }

    return { onDisk: false, store: null }
}
