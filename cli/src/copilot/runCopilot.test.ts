import { describe, expect, it, vi } from 'vitest';
import type { CopilotSession } from './session';
import { applyCopilotSlashAgentMode } from './runCopilot';

describe('applyCopilotSlashAgentMode', () => {
    it('rejects without changing the caller mode when Copilot rejects a slash update', async () => {
        const activeSession = {
            applyRemoteAgentMode: vi.fn().mockRejectedValue(new Error('set_mode failed'))
        } as unknown as CopilotSession;
        let publishedMode: 'interactive' | 'plan' = 'interactive';

        await expect(applyCopilotSlashAgentMode(publishedMode, 'plan', activeSession))
            .rejects.toThrow('set_mode failed');

        expect(publishedMode).toBe('interactive');
        expect(activeSession.applyRemoteAgentMode).toHaveBeenCalledWith('plan');
    });
});
