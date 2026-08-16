import { describe, expect, it, vi } from 'vitest';
import { AcpSdkBackend } from './AcpSdkBackend';

function makeBackend() {
    const backend = new AcpSdkBackend({ command: 'agent' });
    const backendInternal = backend as unknown as {
        activePromptRequests: number;
        transport: {
            sendRequestWithDispatch: (method: string, params: unknown, options?: { timeoutMs?: number }) => {
                dispatched: Promise<void>;
                completed: Promise<unknown>;
            };
            sendNotification: (method: string, params: unknown) => void;
            close: () => Promise<void>;
        } | null;
        waitForSessionUpdateQuiet: (quietMs: number, timeoutMs: number) => Promise<void>;
        drainLateBuffers: () => Promise<void>;
        messageHandler: { drainBuffers: () => void } | null;
        responseCompleteResolvers: Array<() => void>;
    };
    return { backend, backendInternal };
}

describe('AcpSdkBackend soft steer (#888)', () => {
    it('beginSoftSteerPrompt sends a concurrent session/prompt without cancel', () => {
        const { backend, backendInternal } = makeBackend();
        const calls: Array<{ method: string; params: unknown }> = [];
        backendInternal.activePromptRequests = 1;
        backendInternal.transport = {
            sendRequestWithDispatch: (method, params) => {
                calls.push({ method, params });
                return {
                    dispatched: Promise.resolve(),
                    completed: Promise.resolve({ stopReason: 'end_turn' })
                };
            },
            sendNotification: () => {},
            close: async () => {}
        };

        backend.beginSoftSteerPrompt('session-1', [{ type: 'text', text: 'pivot now' }]);

        expect(calls).toEqual([{
            method: 'session/prompt',
            params: {
                sessionId: 'session-1',
                prompt: [{ type: 'text', text: 'pivot now' }]
            }
        }]);
    });

    it('beginSoftSteerPrompt counts the concurrent prompt and finishes it', async () => {
        const { backend, backendInternal } = makeBackend();
        backendInternal.activePromptRequests = 1;
        backendInternal.transport = {
            sendRequestWithDispatch: () => ({
                dispatched: Promise.resolve(),
                completed: Promise.resolve({ stopReason: 'end_turn' })
            }),
            sendNotification: () => {},
            close: async () => {}
        };

        const steer = backend.beginSoftSteerPrompt('session-1', [{ type: 'text', text: 'x' }]);
        expect(backendInternal.activePromptRequests).toBe(2);

        await steer.dispatched;
        await steer.completed;
        // The main prompt is still counted after the soft steer settles.
        expect(backendInternal.activePromptRequests).toBe(1);
    });

    it('rejects soft steer when no prompt is in flight', async () => {
        const { backend, backendInternal } = makeBackend();
        backendInternal.transport = {
            sendRequestWithDispatch: () => ({
                dispatched: Promise.resolve(),
                completed: Promise.resolve({ stopReason: 'end_turn' })
            }),
            sendNotification: () => {},
            close: async () => {}
        };
        expect(() => backend.beginSoftSteerPrompt('session-1', [{ type: 'text', text: 'x' }]))
            .toThrow('No active ACP prompt to soft-steer into');
    });
});
