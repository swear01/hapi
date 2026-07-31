/**
 * Select the HAPI transcript prefix to hydrate into a forked child session.
 * Historical fork excludes the boundary message and everything after it.
 * Current fork copies the full source transcript.
 * Pending scheduled/queued rows (`invokedAt == null`) are never copied — they
 * are not part of the native history being forked and would otherwise fire on
 * both the source and the child.
 */
export function selectForkTranscriptPrefix<T extends { localId: string | null; invokedAt: number | null }>(
    messages: T[],
    messageLocalId?: string
): T[] {
    let scoped: T[]
    if (!messageLocalId) {
        scoped = messages
    } else {
        const cutoff = messages.findIndex((message) => message.localId === messageLocalId)
        if (cutoff < 0) {
            throw new Error('Fork boundary message not found')
        }
        scoped = messages.slice(0, cutoff)
    }
    return scoped.filter((message) => message.invokedAt != null)
}
