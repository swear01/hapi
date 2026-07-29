import { logger } from '@/ui/logger';
import { spawnWithTerminalGuard } from '@/utils/spawnWithTerminalGuard';

export async function copilotLocal(opts: {
    path: string;
    sessionId: string | null;
    abort: AbortSignal;
    model?: string;
    yolo?: boolean;
}): Promise<void> {
    const args: string[] = [];

    if (opts.sessionId) {
        args.push(`--resume=${opts.sessionId}`);
    }
    if (opts.model) {
        args.push('--model', opts.model);
    }
    if (opts.yolo) {
        args.push('--allow-all');
    }

    logger.debug(`[CopilotLocal] Spawning copilot with args: ${JSON.stringify(args)}`);

    await spawnWithTerminalGuard({
        command: process.env.COPILOT_CLI_PATH ?? 'copilot',
        args,
        cwd: opts.path,
        env: process.env,
        signal: opts.abort,
        shell: process.platform === 'win32',
        logLabel: 'CopilotLocal',
        spawnName: 'copilot',
        installHint: 'GitHub Copilot CLI (npm install -g @github/copilot)',
        includeCause: true,
        logExit: true
    });
}
