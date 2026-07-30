import { describe, expect, it, vi } from 'vitest';
import type { CopilotSession } from './session';
import { CopilotRemoteLauncher } from './copilotRemoteLauncher';

type LauncherInternals = {
    backend: { setMode: (sessionId: string, mode: string) => Promise<void> } | null;
    activeSessionId: string | null;
    currentAgentMode: string;
    displayAgentMode: string | null;
};

function createLauncher(setMode: (sessionId: string, mode: string) => Promise<void>) {
    const session = {
        sendSessionEvent: vi.fn()
    } as unknown as CopilotSession;
    const launcher = new CopilotRemoteLauncher(session, {});
    const internals = launcher as unknown as LauncherInternals;
    internals.backend = { setMode };
    internals.activeSessionId = 'copilot-session';
    return { launcher, internals, session };
}

describe('CopilotRemoteLauncher.applyAgentMode', () => {
    it('does not update the acknowledged or displayed mode when setMode fails', async () => {
        const setMode = vi.fn().mockRejectedValue(new Error('transport unavailable'));
        const { launcher, internals, session } = createLauncher(setMode);

        await expect(launcher.applyAgentMode('plan')).rejects.toThrow('transport unavailable');

        expect(internals.currentAgentMode).toBe('interactive');
        expect(internals.displayAgentMode).toBeNull();
        expect(session.sendSessionEvent).toHaveBeenCalledWith({
            type: 'message',
            message: expect.stringContaining('Failed to switch Copilot agent mode')
        });
    });

    it('rejects later changes after Copilot reports mode switching unsupported', async () => {
        const setMode = vi.fn().mockRejectedValue(new Error('Method not found'));
        const { launcher, internals } = createLauncher(setMode);

        await expect(launcher.applyAgentMode('plan')).rejects.toThrow('Method not found');
        await expect(launcher.applyAgentMode('autopilot')).rejects.toThrow(
            'does not support agent mode switching'
        );

        expect(setMode).toHaveBeenCalledTimes(1);
        expect(internals.currentAgentMode).toBe('interactive');
    });
});
