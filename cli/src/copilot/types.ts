import type { CopilotPermissionMode } from '@hapi/protocol/types';

export type PermissionMode = CopilotPermissionMode;

export interface CopilotMode {
    permissionMode: PermissionMode;
    model?: string;
}
