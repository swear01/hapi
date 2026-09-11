import { describe, expect, it, vi } from 'vitest'
import { RPC_METHODS } from '@hapi/protocol/rpcMethods'
import { registerAgySessionConfigRpc, type AgySessionConfigState } from './agySessionConfig'

describe('registerAgySessionConfigRpc', () => {
    it('applies live effort changes before syncing the active driver', async () => {
        const registerHandler = vi.fn()
        let state: AgySessionConfigState = {
            permissionMode: 'request-review',
            model: null,
            effort: undefined,
        }
        const sync = vi.fn()

        registerAgySessionConfigRpc({
            rpcHandlerManager: { registerHandler } as never,
            getState: () => state,
            setState: (next) => { state = next },
            sync,
        })
        const handler = registerHandler.mock.calls.find(
            (call) => call[0] === RPC_METHODS.SetSessionConfig
        )?.[1] as ((payload: unknown) => Promise<unknown>) | undefined

        expect(handler).toBeTypeOf('function')
        await handler!({ effort: 'high' })

        expect(state.effort).toBe('high')
        expect(sync).toHaveBeenCalledOnce()
    })
})
