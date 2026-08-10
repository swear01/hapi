import { useMutation } from '@tanstack/react-query'
import type { ApiClient } from '@/api/client'
import { useTranslation } from '@/lib/use-translation'
import { useToast } from '@/lib/toast-context'

type SteerQueuedMessageInput = {
    sessionId: string
    messageId: string
}

/**
 * Mutation: deliver one queued message into the active Pi turn (native steer).
 *
 * Non-optimistic on purpose: the CLI acknowledges the steer via the existing
 * `messages-consumed` event, which flips the row to invoked and removes it from
 * the floating bar. An optimistic removal here would fight that event and
 * would need a revert path for the failure case anyway.
 *
 * Failure surfaces as a toast; the row stays queued and can be retried.
 */
export function useSteerQueuedMessage(api: ApiClient | null) {
    const { t } = useTranslation()
    const { addToast } = useToast()

    const mutation = useMutation({
        mutationFn: async (input: SteerQueuedMessageInput) => {
            if (!api) {
                throw new Error('API unavailable')
            }
            return api.steerMessage(input.sessionId, input.messageId)
        },
        onSuccess: (result, input) => {
            if (result.status === 'failed') {
                addToast({
                    title: t('queuedMessages.steerFailed'),
                    body: result.error ?? '',
                    sessionId: input.sessionId,
                    url: window.location.href,
                })
            }
            // status === 'steered': the messages-consumed SSE will remove the row.
            // status === 'invoked': the CLI already consumed it; nothing to do.
        },
        onError: (error, input) => {
            addToast({
                title: t('queuedMessages.steerFailed'),
                body: error instanceof Error ? error.message : '',
                sessionId: input.sessionId,
                url: window.location.href,
            })
        },
    })

    return mutation
}
