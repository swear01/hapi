/**
 * Select the HAPI transcript prefix to hydrate into a forked child session.
 * Historical fork excludes the boundary message and everything after it.
 * Current fork copies the full source transcript.
 */
export function selectForkTranscriptPrefix<T extends { localId: string | null }>(
    messages: T[],
    messageLocalId?: string
): T[] {
    if (!messageLocalId) {
        return messages
    }
    const cutoff = messages.findIndex((message) => message.localId === messageLocalId)
    if (cutoff < 0) {
        throw new Error('Fork boundary message not found')
    }
    return messages.slice(0, cutoff)
}
