import chalk from 'chalk'
import { authAndSetupMachineIfNeeded } from '@/ui/auth'
import { initializeToken } from '@/ui/tokenInit'
import { maybeAutoStartServer } from '@/utils/autoStartServer'
import type { CommandDefinition } from './types'
import { ANTIGRAVITY_PERMISSION_MODES } from '@hapi/protocol/modes'
import { parseRemoteAgentCommandOptions } from './agentCommandOptions'

export const antigravityCommand: CommandDefinition = {
    name: 'antigravity',
    requiresRuntimeAssets: true,
    run: async ({ commandArgs }) => {
        try {
            const options = parseRemoteAgentCommandOptions(commandArgs, ANTIGRAVITY_PERMISSION_MODES)

            await initializeToken()
            await maybeAutoStartServer()
            await authAndSetupMachineIfNeeded()

            const { runAntigravity } = await import('@/antigravity/runAntigravity')
            await runAntigravity(options)
        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error')
            if (process.env.DEBUG) {
                console.error(error)
            }
            process.exit(1)
        }
    }
}
