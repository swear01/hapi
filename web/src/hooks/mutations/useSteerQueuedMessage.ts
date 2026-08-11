import { useMutation } from '@tanstack/react-query'
import type { ApiClient } from '@/api/client'
<<<<<<< ours
import type { DecryptedMessage } from '@/types/api'
import { appendOptimisticMessage } from '@/lib/message-window-store'
import { usePlatform } from '@/hooks/usePlatform'
import { useToast } from '@/lib/toast-context'
import { useTranslation } from '@/lib/use-translation'
=======
import { markMessagesConsumed } from '@/lib/message-window-store'
import { useTranslation } from '@/lib/use-translation'
import { useToast } from '@/lib/toast-context'
>>>>>>> theirs

type SteerQueuedMessageInput = {
    sessionId: string
    messageId: string
<<<<<<< ours
    localId: string
    snapshot: DecryptedMessage
}

/**
 * Mutation: steer one waiting-queue message into the active turn.
 * Success is confirmed by messages-consumed (steered:true) SSE; this call only
 * asks the CLI to start the steer.
 */
export function useSteerQueuedMessage(api: ApiClient | null) {
    const { haptic } = usePlatform()
    const { addToast } = useToast()
    const { t } = useTranslation()

    return useMutation({
=======
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
>>>>>>> theirs
        mutationFn: async (input: SteerQueuedMessageInput) => {
            if (!api) {
                throw new Error('API unavailable')
            }
<<<<<<< ours
            return api.steerQueuedMessage(input.sessionId, input.messageId)
=======
            return api.steerMessage(input.sessionId, input.messageId)
>>>>>>> theirs
        },
        onSuccess: (result, input) => {
            if (result.status === 'failed') {
                addToast({
                    title: t('queuedMessages.steerFailed'),
<<<<<<< ours
                    body: result.error,
                    sessionId: input.sessionId,
                    url: window.location.href,
                })
                haptic.notification('error')
                return
            }
            if (result.status === 'invoked') {
                // Race: CLI already consumed the row. Merge the authoritative
                // invoked message so the queued bar clears even if SSE was missed
                // (same pattern as useCancelQueuedMessage).
                appendOptimisticMessage(input.sessionId, {
                    id: result.message.id,
                    seq: result.message.seq,
                    localId: result.message.localId,
                    content: result.message.content,
                    createdAt: result.message.createdAt,
                    invokedAt: result.message.invokedAt,
                    scheduledAt: result.message.scheduledAt,
                    status: 'sent',
                })
                addToast({
                    title: t('queuedMessages.steerAlreadyInvoked'),
                    body: '',
                    sessionId: input.sessionId,
                    url: window.location.href,
                })
            }
            haptic.notification('success')
=======
                    body: result.error ?? '',
                    sessionId: input.sessionId,
                    url: window.location.href,
                })
                return
            }
            if (result.status === 'invoked' && result.message.localId && typeof result.message.invokedAt === 'number') {
                // The CLI consumed this message before the steer arrived. If the
                // messages-consumed SSE was missed while the row was still
                // queued, reconcile it now so the queued bar cannot keep a
                // stale actionable row (mirrors useCancelQueuedMessage).
                markMessagesConsumed(input.sessionId, [result.message.localId], result.message.invokedAt)
            }
            // status === 'steered': the messages-consumed SSE will remove the row.
>>>>>>> theirs
        },
        onError: (error, input) => {
            addToast({
                title: t('queuedMessages.steerFailed'),
<<<<<<< ours
                body: error instanceof Error ? error.message : String(error),
                sessionId: input.sessionId,
                url: window.location.href,
            })
            haptic.notification('error')
        },
    })
=======
                body: error instanceof Error ? error.message : '',
                sessionId: input.sessionId,
                url: window.location.href,
            })
        },
    })

    return mutation
>>>>>>> theirs
}
