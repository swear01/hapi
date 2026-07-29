import { AcpSdkBackend } from '@/agent/backends/acp';

function filterEnv(env: NodeJS.ProcessEnv): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(env)) {
        if (value !== undefined) {
            result[key] = value;
        }
    }
    return result;
}

export function createCopilotBackend(): AcpSdkBackend {
    return new AcpSdkBackend({
        command: process.env.COPILOT_CLI_PATH ?? 'copilot',
        args: ['--acp', '--stdio'],
        env: filterEnv(process.env)
    });
}
