import { describe, expect, it, vi } from 'vitest'
import { realtimeClientTools, registerSessionStore } from './realtimeClientTools'
import { updateCurrentSessionId } from './RealtimeSession'

describe('realtimeClientTools', () => {
    it('sends message to target sessionId via api.sendMessage when active session differs', async () => {
        const mockApi = {
            sendMessage: vi.fn(async (_sessionId: string, _message: string) => {})
        }
        const sessionBOnSend = vi.fn()

        registerSessionStore({
            getSession: (id) => (id === 'session-B' ? { agentState: {} } : null),
            sendMessage: (sessionId, message) => {
                if (sessionId === 'session-B') {
                    sessionBOnSend(message)
                } else {
                    mockApi.sendMessage(sessionId, message)
                }
            },
            approvePermission: async (_sessionId: string, _requestId: string) => {},
            denyPermission: async (_sessionId: string, _requestId: string) => {}
        })

        updateCurrentSessionId('session-A')

        const result = await realtimeClientTools.messageCodingAgent({ message: 'fix the bug' })

        expect(result).toContain('sent')
        expect(sessionBOnSend).not.toHaveBeenCalled()
        expect(mockApi.sendMessage).toHaveBeenCalledWith('session-A', 'fix the bug')
    })
})
