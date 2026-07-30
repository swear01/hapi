import { describe, expect, it } from 'vitest';
import type { PermissionRequest } from '@/agent/types';
import { mapCopilotPermissionDecision } from './permissionHandler';

describe('mapCopilotPermissionDecision', () => {
    it('cancels an explicit denial when only an allow option is available', () => {
        const request: PermissionRequest = {
            id: 'permission-1',
            sessionId: 'session-1',
            toolCallId: 'tool-1',
            options: [{
                optionId: 'allow-once',
                name: 'Allow once',
                kind: 'allow_once'
            }]
        };

        expect(mapCopilotPermissionDecision(request, 'denied')).toEqual({
            outcome: 'cancelled'
        });
    });
});
