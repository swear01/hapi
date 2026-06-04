import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

/**
 * Cursor's `agent` CLI appears to allow only one active process at a time.
 * Spawning `agent --list-models` while `agent acp` is running terminates the ACP
 * child (SIGTERM / exit 143) and crashes the remote session.
 *
 * In-process ref counting covers RPC handlers in the same process; a HAPI_HOME
 * lock directory covers runner vs session child processes.
 */
let activeAcpTransportCount = 0;

function getAcpLockDir(): string {
    const home = process.env.HAPI_HOME?.trim() || join(tmpdir(), 'hapi');
    return join(home, 'locks', 'agent-acp-active');
}

export function registerActiveAcpTransport(): void {
    activeAcpTransportCount += 1;
    const lockDir = getAcpLockDir();
    try {
        mkdirSync(lockDir, { recursive: true });
        writeFileSync(join(lockDir, 'pid'), String(process.pid));
    } catch {
        // Another process may have created the lock; in-process guard still applies.
    }
}

export function unregisterActiveAcpTransport(): void {
    activeAcpTransportCount = Math.max(0, activeAcpTransportCount - 1);
    if (activeAcpTransportCount > 0) {
        return;
    }
    const lockDir = getAcpLockDir();
    if (existsSync(lockDir)) {
        try {
            rmSync(lockDir, { recursive: true, force: true });
        } catch {
            // Best effort — stale lock is preferable to killing a live ACP session.
        }
    }
}

export function isAgentAcpTransportActive(): boolean {
    return activeAcpTransportCount > 0 || existsSync(getAcpLockDir());
}

export function _resetAgentCliGuardForTests(): void {
    activeAcpTransportCount = 0;
    const lockDir = getAcpLockDir();
    if (existsSync(lockDir)) {
        rmSync(lockDir, { recursive: true, force: true });
    }
}
