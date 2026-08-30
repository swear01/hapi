import { closeSync, existsSync, fstatSync, openSync, readFileSync, readSync } from 'node:fs'
import { join } from 'node:path'
import { getProjectPath } from './utils/path'
import { isExternalUserMessage } from '@/api/apiSession'
import type { RawJSONLines } from '@/claude/types'

export type NativeTurn = {
    /** uuid of the user prompt entry that starts the turn. */
    promptUuid: string
    /** uuid of the last user/assistant entry belonging to the turn on the active chain. */
    endUuid: string
}

type TranscriptEntry = {
    type?: string
    uuid?: unknown
    parentUuid?: unknown
    isSidechain?: boolean
    message?: { content?: unknown }
}

function parseTranscriptLine(line: string): TranscriptEntry | null {
    if (!line.trim()) return null
    try {
        return JSON.parse(line) as TranscriptEntry
    } catch {
        return null
    }
}

function isConversationEntry(entry: TranscriptEntry): boolean {
    return entry.type === 'user' || entry.type === 'assistant' || entry.type === 'attachment'
}

/**
 * Parse the native Claude transcript for a session into ordered turns.
 *
 * The transcript is append-only: rewinds re-parent new turns, so dropped
 * entries remain in the file as orphaned branches. Turns are therefore
 * resolved over the ACTIVE parentUuid chain — the one reachable backwards
 * from the last entry in the file — never over raw file order.
 */
export function readNativeTurns(workingDirectory: string, sessionId: string): NativeTurn[] {
    const file = join(getProjectPath(workingDirectory), `${sessionId}.jsonl`)
    if (!existsSync(file)) return []

    type Node = { entry: TranscriptEntry; parent: string | null }
    const byUuid = new Map<string, Node>()
    let tailUuid: string | null = null
    for (const line of readFileSync(file, 'utf-8').split('\n')) {
        const entry = parseTranscriptLine(line)
        if (!entry || entry.isSidechain) continue
        if (typeof entry.uuid !== 'string') continue
        byUuid.set(entry.uuid, {
            entry,
            parent: typeof entry.parentUuid === 'string' ? entry.parentUuid : null
        })
        if (isConversationEntry(entry) || typeof entry.parentUuid === 'string') tailUuid = entry.uuid
    }
    if (!tailUuid) return []

    // Walk parents from the tail; entries not on this chain are orphaned branches.
    const chain: TranscriptEntry[] = []
    const visited = new Set<string>()
    let cursor: string | null = tailUuid
    while (cursor && !visited.has(cursor)) {
        visited.add(cursor)
        const node = byUuid.get(cursor)
        if (!node) break
        chain.push(node.entry)
        cursor = node.parent
    }
    chain.reverse()

    const turns: NativeTurn[] = []
    for (const entry of chain) {
        if (entry.type !== 'user' && entry.type !== 'assistant') continue
        const uuid = entry.uuid as string
        if (entry.type === 'user') {
            // Reuse HAPI's classifier: Claude also writes system reminders, task
            // notifications and command caveats as text-bearing user entries —
            // those are not human turns and must not become rewind boundaries.
            if (!isExternalUserMessage(entry as RawJSONLines)) continue
            turns.push({ promptUuid: uuid, endUuid: uuid })
        } else if (turns.length > 0) {
            turns[turns.length - 1]!.endUuid = uuid
        }
    }
    return turns
}

export function readLatestNativeTurn(workingDirectory: string, sessionId: string): NativeTurn | null {
    const file = join(getProjectPath(workingDirectory), `${sessionId}.jsonl`)
    let fd: number
    try {
        fd = openSync(file, 'r')
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
        throw error
    }
    let endUuid: string | null = null
    let parentUuid: string | null | undefined
    const inspectLine = (line: string): NativeTurn | null => {
        const entry = parseTranscriptLine(line)
        if (!entry || entry.isSidechain || typeof entry.uuid !== 'string') return null
        if (!isConversationEntry(entry) && typeof entry.parentUuid !== 'string') return null
        if (parentUuid !== undefined && entry.uuid !== parentUuid) return null
        parentUuid = typeof entry.parentUuid === 'string' ? entry.parentUuid : null
        if (!isConversationEntry(entry)) return null
        if (entry.type === 'assistant') {
            endUuid ??= entry.uuid
            return null
        }
        if (entry.type !== 'user' || !isExternalUserMessage(entry as RawJSONLines)) return null
        return { promptUuid: entry.uuid, endUuid: endUuid ?? entry.uuid }
    }

    try {
        let position = fstatSync(fd).size
        const fragments: Buffer[] = []
        while (position > 0) {
            const start = Math.max(0, position - 64 * 1024)
            const chunk = Buffer.allocUnsafe(position - start)
            let bytesRead = 0
            while (bytesRead < chunk.length) {
                const count = readSync(fd, chunk, bytesRead, chunk.length - bytesRead, start + bytesRead)
                if (count === 0) return null
                bytesRead += count
            }
            const data = chunk.subarray(0, bytesRead)

            let lineEnd = data.length
            for (let index = data.length - 1; index >= 0; index--) {
                if (data[index] !== 0x0a) continue
                const segment = data.subarray(index + 1, lineEnd)
                const lineParts: Buffer[] = [segment]
                for (let fragment = fragments.length - 1; fragment >= 0; fragment--) {
                    lineParts.push(fragments[fragment]!)
                }
                const line = Buffer.concat(lineParts).toString('utf8')
                fragments.length = 0
                const turn = inspectLine(line)
                if (turn) return turn
                lineEnd = index
            }
            if (lineEnd > 0) fragments.push(Buffer.from(data.subarray(0, lineEnd)))
            position = start
        }
        fragments.reverse()
        return inspectLine(Buffer.concat(fragments).toString('utf8'))
    } finally {
        closeSync(fd)
    }
}

export type RewindPlan = {
    resumeSessionAt?: string
    dropsTurns: string[]
}

/** Native `--resume-session-at` truncation landed in Claude Code v2.1.223. */
export const NATIVE_REWIND_MIN_VERSION = [2, 1, 223] as const

export function parseClaudeVersion(versionOutput: string | null | undefined): number[] | null {
    if (!versionOutput) return null
    const match = /(\d+)\.(\d+)\.(\d+)/.exec(versionOutput)
    if (!match) return null
    return [Number(match[1]), Number(match[2]), Number(match[3])]
}

/**
 * Whether the installed Claude Code supports resume-time truncation.
 * `null`/unparseable output (detection failed) conservatively reports false so
 * the rewind capability is not advertised against an unknown binary.
 */
export function supportsNativeRewind(versionOutput: string | null | undefined): boolean {
    const version = parseClaudeVersion(versionOutput)
    if (!version) return false
    for (let i = 0; i < NATIVE_REWIND_MIN_VERSION.length; i++) {
        const actual = version[i] ?? 0
        const min = NATIVE_REWIND_MIN_VERSION[i]!
        if (actual !== min) return actual > min
    }
    return true
}

/**
 * Build the resume flags to drop the turn started by `promptUuid` and every
 * turn after it on the active chain. The kept boundary is the last entry of
 * the previous turn; dropping every turn including the first is not
 * representable and is rejected.
 */
export function resolveRewindPlan(turns: NativeTurn[], dropFromPromptUuid: string): RewindPlan {
    const index = turns.findIndex((turn) => turn.promptUuid === dropFromPromptUuid)
    if (index < 0) {
        throw new Error(`No native history point for message prompt ${dropFromPromptUuid}`)
    }
    if (index === 0) {
        throw new Error('Cannot rewind the first message')
    }
    return {
        resumeSessionAt: turns[index - 1]!.endUuid,
        dropsTurns: turns.slice(index).map((turn) => turn.promptUuid)
    }
}
