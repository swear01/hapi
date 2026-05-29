import { watch, readdirSync, mkdirSync } from 'node:fs'
import type { FSWatcher } from 'node:fs'
import { logger } from '@/ui/logger'
import { AGY_IMPLICIT_DIR } from './config'

export type AntigravitySessionScannerHandle = {
    cleanup: () => void;
}

export function createAntigravitySessionScanner(opts: {
    existingSessionId: string | null;
    onSessionFound: (sessionId: string) => void;
}): AntigravitySessionScannerHandle {
    // If resuming, session ID is already known — no watcher needed
    if (opts.existingSessionId) {
        return { cleanup: () => undefined }
    }

    let watcher: FSWatcher | null = null

    try {
        mkdirSync(AGY_IMPLICIT_DIR, { recursive: true })
    } catch {
        // best-effort
    }

    // Snapshot existing .pb files before agy starts
    let existing: Set<string>
    try {
        existing = new Set(
            readdirSync(AGY_IMPLICIT_DIR).filter((f) => f.endsWith('.pb'))
        )
    } catch {
        existing = new Set()
    }

    let found = false

    try {
        watcher = watch(AGY_IMPLICIT_DIR, (event, filename) => {
            if (found || !filename || !filename.endsWith('.pb')) {
                return
            }
            if (existing.has(filename)) {
                return
            }
            found = true
            const uuid = filename.slice(0, -'.pb'.length)
            logger.debug(`[antigravity-session-scanner] New session file detected: ${filename}, uuid=${uuid}`)
            opts.onSessionFound(uuid)
        })
    } catch (error) {
        logger.debug(`[antigravity-session-scanner] Failed to watch ${AGY_IMPLICIT_DIR}:`, error)
    }

    return {
        cleanup: () => {
            watcher?.close()
            watcher = null
        }
    }
}
