import { EventEmitter } from 'node:events';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { execFileSyncMock, spawnMock } = vi.hoisted(() => ({
    execFileSyncMock: vi.fn(() => 'codex-cli 1.0.0'),
    spawnMock: vi.fn()
}));

vi.mock('node:child_process', async () => {
    const actual = await vi.importActual<typeof import('node:child_process')>('node:child_process');
    return {
        ...actual,
        execFileSync: execFileSyncMock,
        spawn: spawnMock
    };
});

vi.mock('node:fs', async () => {
    const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
    return { ...actual, existsSync: vi.fn(() => false) };
});

vi.mock('@/utils/process', () => ({
    killProcessByChildProcess: vi.fn(async () => true)
}));

vi.mock('@/ui/logger', () => ({
    logger: { debug: vi.fn() }
}));

import { CodexAppServerClient } from './codexAppServerClient';

function fakeStream(): EventEmitter & { setEncoding: ReturnType<typeof vi.fn> } {
    return Object.assign(new EventEmitter(), { setEncoding: vi.fn() });
}

function fakeChild() {
    return Object.assign(new EventEmitter(), {
        stdin: { end: vi.fn(), write: vi.fn() },
        stdout: fakeStream(),
        stderr: fakeStream()
    });
}

describe('CodexAppServerClient process cwd', () => {
    beforeEach(() => {
        execFileSyncMock.mockClear();
        spawnMock.mockReset();
    });

    it('passes an explicit neutral cwd to the app-server process', async () => {
        spawnMock.mockReturnValue(fakeChild());
        const client = new CodexAppServerClient({ cwd: '/neutral-home' });

        await client.connect();

        expect(spawnMock).toHaveBeenCalledWith(
            'codex',
            ['app-server'],
            expect.objectContaining({ cwd: '/neutral-home' })
        );
        await client.disconnect();
    });
});

describe('CodexAppServerClient turn/steer', () => {
    beforeEach(() => {
        spawnMock.mockReset();
    });

    it('sends turn/steer with thread, input, and expectedTurnId', async () => {
        const child = fakeChild();
        spawnMock.mockReturnValue(child);
        const client = new CodexAppServerClient({ cwd: '/neutral-home' });

        await client.connect();
        const writes: string[] = [];
        (child.stdin.write as ReturnType<typeof vi.fn>).mockImplementation((chunk: string) => {
            const line = String(chunk).trim();
            writes.push(line);
            let request: { id?: number; method?: string } | null = null;
            try {
                request = JSON.parse(line);
            } catch {
                return true;
            }
            if (request?.method === 'initialize') {
                setTimeout(() => {
                    (child.stdout as EventEmitter).emit('data', Buffer.from(
                        JSON.stringify({ jsonrpc: '2.0', id: request!.id, result: { protocolVersion: 1 } }) + '\n'
                    ));
                }, 0);
            }
            if (request?.method === 'turn/steer') {
                setTimeout(() => {
                    (child.stdout as EventEmitter).emit('data', Buffer.from(
                        JSON.stringify({ jsonrpc: '2.0', id: request!.id, result: { turnId: 'turn-9' } }) + '\n'
                    ));
                }, 0);
            }
            return true;
        });

        const result = await client.steerTurn({
            threadId: 'thread-1',
            input: [{ type: 'text', text: 'pivot now' }],
            expectedTurnId: 'turn-9'
        });

        expect(result).toEqual({ turnId: 'turn-9' });
        const steerWrite = writes.find((w) => w.includes('turn/steer'));
        expect(steerWrite).toBeDefined();
        expect(JSON.parse(steerWrite!)).toMatchObject({
            method: 'turn/steer',
            params: {
                threadId: 'thread-1',
                input: [{ type: 'text', text: 'pivot now' }],
                expectedTurnId: 'turn-9'
            }
        });
        await client.disconnect();
    });

    it('does not timeout a steer while its app-server response is delayed', async () => {
        vi.useFakeTimers();
        try {
            const child = fakeChild();
            spawnMock.mockReturnValue(child);
            const client = new CodexAppServerClient({ cwd: '/neutral-home' });
            await client.connect();

            const steerPromise = client.steerTurn({
                threadId: 'thread-1',
                input: [{ type: 'text', text: 'pivot now' }],
                expectedTurnId: 'turn-1'
            });
            await vi.advanceTimersByTimeAsync(30_001);
            expect(spawnMock).toHaveBeenCalledTimes(1);

            const write = (child.stdin.write as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as string;
            const request = JSON.parse(write) as { id: number };
            child.stdout.emit('data', Buffer.from(JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                result: { turnId: 'turn-1' }
            }) + '\n'));

            await expect(steerPromise).resolves.toEqual({ turnId: 'turn-1' });
            await client.disconnect();
        } finally {
            vi.useRealTimers();
        }
    });
});
