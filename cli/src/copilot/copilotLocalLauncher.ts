import { BaseLocalLauncher } from '@/modules/common/launcher/BaseLocalLauncher';
import { copilotLocal } from './copilotLocal';
import type { CopilotSession } from './session';
import type { PermissionMode } from './types';

function mapApprovalMode(mode: PermissionMode | undefined): { yolo: boolean } {
    if (!mode || mode === 'default' || mode === 'read-only') {
        return { yolo: false };
    }
    if (mode === 'yolo' || mode === 'safe-yolo') {
        return { yolo: true };
    }
    return { yolo: false };
}

export async function copilotLocalLauncher(
    session: CopilotSession,
    opts: {
        model?: string;
    }
): Promise<'switch' | 'exit'> {
    const launcher = new BaseLocalLauncher({
        label: 'copilot-local',
        failureLabel: 'Local Copilot process failed',
        queue: session.queue,
        rpcHandlerManager: session.client.rpcHandlerManager,
        startedBy: session.startedBy,
        startingMode: session.startingMode,
        launch: async (abortSignal) => {
            const approval = mapApprovalMode(session.getPermissionMode() as PermissionMode | undefined);
            await copilotLocal({
                path: session.path,
                sessionId: session.sessionId,
                abort: abortSignal,
                model: opts.model,
                yolo: approval.yolo
            });
        },
        sendFailureMessage: (message) => {
            session.sendSessionEvent({ type: 'message', message });
        },
        recordLocalLaunchFailure: (message, exitReason) => {
            session.recordLocalLaunchFailure(message, exitReason);
        }
    });

    return await launcher.run();
}
