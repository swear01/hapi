import { useMutation } from '@tanstack/react-query'
import type { ApiClient } from '@/api/client'
import { markMessagesConsumed, markMessagesRequeued } from '@/lib/message-window-store'

type RetryIndeterminateMessageInput = {
    sessionId: string
    messageId: string
}

export function useRetryIndeterminateMessage(api: ApiClient | null) {
    return useMutation({
        mutationFn: async (input: RetryIndeterminateMessageInput) => {
            if (!api) throw new Error('API unavailable')
            return api.retryIndeterminateMessage(input.sessionId, input.messageId)
        },
        onSuccess: (result, input) => {
            if (result.status === 'retried' || result.status === 'already-queued') {
                markMessagesRequeued(input.sessionId, result.localId ? [result.localId] : [])
            }
            if (result.status === 'invoked' && result.message.localId && typeof result.message.invokedAt === 'number') {
                markMessagesConsumed(input.sessionId, [result.message.localId], result.message.invokedAt)
            }
        },
    })
}
