/**
 * Final audit for test-owned processes.
 *
 * The runner integration suite spawns real detached process trees. Even with
 * the per-test registry (see `processRegistry.ts`), an orphan whose runner was
 * already killed, or a child that escaped a crashing test, can survive the
 * suite. This module is the last-resort backstop: it scans the live process
 * table for the run's unique marker (`HAPI_TEST_MARKER=<tmpHome>`, injected by
 * `integrationEnv.ts` into every test child) and force-reaps whatever remains.
 *
 * The marker lives in the process environment, which survives reparenting to
 * PID 1, so orphaned grandchildren are still recognized. Production processes
 * never carry the marker and are never touched.
 */

import { execFileSync } from 'node:child_process'
import { killProcessTreeByPid } from '../utils/process'

export interface TestOwnedProcess {
    pid: number
    ppid: number
    rssKb: number
    command: string
}

/**
 * Scans for live processes whose environment dump contains `marker`.
 * Returns an empty array on platforms without `ps eww` (Windows).
 */
export function findTestOwnedProcesses(marker: string): TestOwnedProcess[] {
    if (process.platform === 'win32') return []

    let output: string
    try {
        // `-eo` (not `-axo`): procps-ng 4.x rejects `-x` with "must set
        // personality" on some Linux builds, which would silently disable the
        // audit. `e` shows the environment after the command; `ww` removes
        // width truncation so the env dump is not cut off.
        output = execFileSync('ps', ['eww', '-eo', 'pid=,ppid=,rss=,command='], {
            encoding: 'utf8',
            maxBuffer: 32 * 1024 * 1024,
            stdio: ['ignore', 'pipe', 'pipe'],
        })
    } catch {
        // ps unavailable — nothing we can audit with.
        return []
    }

    const found: TestOwnedProcess[] = []
    for (const line of output.split('\n')) {
        const match = line.match(/^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/)
        if (!match) continue
        const command = match[4]
        if (command.includes(marker)) {
            found.push({
                pid: Number(match[1]),
                ppid: Number(match[2]),
                rssKb: Number(match[3]),
                command: command.slice(0, 500),
            })
        }
    }
    return found
}

/**
 * Force-reaps every process carrying `marker` (whole trees), waits a bounded
 * window for them to disappear, and returns whatever still remains.
 */
export async function reapTestOwnedProcesses(marker: string): Promise<TestOwnedProcess[]> {
    const found = findTestOwnedProcesses(marker)
    for (const process of found) {
        try {
            await killProcessTreeByPid(process.pid, true)
        } catch {
            // Already dead or racing exit; re-scan below decides.
        }
    }

    const deadline = Date.now() + 10_000
    while (Date.now() < deadline && findTestOwnedProcesses(marker).length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 250))
    }
    return findTestOwnedProcesses(marker)
}
