import type { RpcHandlerManager } from '@/api/rpc/RpcHandlerManager'
import type { SessionEffort, SessionModel } from '@/api/types'
import { registerSessionConfigRpc } from '@/agent/sessionConfigRpc'
import type { PermissionMode } from './types'

export type AgySessionConfigState = {
    permissionMode: PermissionMode
    model: SessionModel
    effort: SessionEffort | undefined
}

export function registerAgySessionConfigRpc(options: {
    rpcHandlerManager: RpcHandlerManager
    getState: () => AgySessionConfigState
    setState: (state: AgySessionConfigState) => void
    sync: () => void
}): void {
    registerSessionConfigRpc<PermissionMode>({
        rpcHandlerManager: options.rpcHandlerManager,
        flavor: 'agy',
        modelMode: 'nullable',
        effortMode: 'nullable',
        onApply: async (config) => {
            const current = options.getState()
            options.setState({
                permissionMode: config.permissionMode ?? current.permissionMode,
                model: config.model !== undefined ? config.model : current.model,
                effort: config.effort !== undefined ? config.effort : current.effort,
            })
        },
        onAfterApply: options.sync,
    })
}
