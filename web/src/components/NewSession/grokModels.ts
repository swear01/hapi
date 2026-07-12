import type { GrokModelSummary } from '@/types/api'
import type { AgentType } from './types'

export function shouldEnableGrokModelDiscovery(args: {
    agent: AgentType
    machineId: string | null
    cwd: string
    cwdExists: boolean | undefined
}): boolean {
    return args.agent === 'grok'
        && Boolean(args.machineId)
        && args.cwd.length > 0
        && args.cwdExists === true
}

export function buildGrokModelOptions(
    availableModels: GrokModelSummary[]
): Array<{ value: string; label: string }> {
    return [
        { value: 'auto', label: 'Default' },
        ...availableModels.map((model) => ({
            value: model.modelId,
            label: model.name ?? model.modelId
        }))
    ]
}
