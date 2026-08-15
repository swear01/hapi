import { clearDraft, getDraft, saveDraft } from '@/lib/composer-drafts'
import type { MessageDeliveryMode } from '@hapi/protocol'
import type { ResolvedSession } from './mutations/useSendMessage'

export function appendTranscript(text: string, transcript: string): string {
    const addition = transcript.trim()
    if (!addition) return text
    if (!text) return addition
    return `${text}${/\s$/.test(text) ? '' : ' '}${addition}`
}

/**
 * Optional session resolution for a `stopAndSend` voice send.
 *
 * Mirrors the text-send pipeline's `resolveSessionId` contract
 * (`useSendMessage`): an inactive session must be resumed via
 * `api.resumeSession` before the message POST, because the hub rejects
 * messages to inactive sessions with 409 `session_inactive`. The
 * dictation hooks send after transcription completes (possibly after the
 * composer unmounted), so the resolver is captured at call time and
 * applied at send time.
 */
export type DictationPendingSendOptions = {
    /**
     * Maps the target session id to the id the message should actually be
     * sent to (e.g. the resumed session id for an inactive session).
     * Invoked right before the message send. May throw to abort the send.
     *
     * Invariant: `resumed` must be `true` whenever the target session was
     * transitioned to live and must be seeded/navigated — including
     * same-id resumes — because navigation decisions key off this flag.
     * Draft snapshot/recovery key off the session id actually changing;
     * a resolver that swaps the id must therefore also report
     * `resumed: true` so the operator is navigated to the recovered
     * session after a failure.
     */
    resolveSessionId?: (sessionId: string) => Promise<ResolvedSession>
    /**
     * Called when `resolveSessionId` resumed the session into a live one,
     * so the caller can navigate/seed the resumed session. Fires after a
     * successful delivery and also after a failed post-resume send (so the
     * operator lands on the resumed session to retry from the recovered
     * draft). Never fires when the session was not resumed, and the
     * navigation is suppressed when the failed transcript could not be
     * recovered under the resumed session (the error and recovered text
     * then stay visible on the session the operator is already on).
     *
     * `context.error` carries the send failure so the caller can surface
     * the root cause on the resumed session after navigation.
     */
    onSessionResolved?: (sessionId: string, context?: { error?: unknown }) => void | Promise<void>
}

/**
 * True when the persisted draft for `sessionId` still equals `baseline`.
 *
 * An empty current draft always counts as unchanged (even when the
 * baseline was non-empty): the never-lose-the-transcript trade-off means
 * recovery may write into a draft the operator deliberately emptied
 * while the send was in flight — losing a transcript is worse than
 * resurrecting text.
 */
export function draftUnchanged(sessionId: string, baseline: string): boolean {
    const cur = getDraft(sessionId)
    return cur === '' || cur === baseline
}

/**
 * Recover a failed transcript into a draft: overwrite the unmoved
 * baseline (it was consumed by the send) or append only the transcribed
 * delta when the draft moved in flight, so in-flight operator text is
 * preserved and the initial text is not duplicated.
 */
function recoverDraft(sessionId: string, baseline: string, finalMessage: string, delta: string): void {
    if (draftUnchanged(sessionId, baseline)) {
        saveDraft(sessionId, finalMessage)
    } else {
        saveDraft(sessionId, appendTranscript(getDraft(sessionId), delta))
    }
}

/**
 * Navigate/seed the resumed session via `onSessionResolved`. Returns
 * `false` when the callback rejected (the operator was not navigated);
 * the error is logged because this is the only signal that the operator
 * did not reach the recovered session.
 */
/**
 * @param notify Whether to fire the callback. The success path passes the
 *   raw `resumed` flag; the failure path passes the stricter
 *   `shouldNotify` (resumed AND the transcript was recovered under the
 *   target session).
 */
export async function notifyResolvedSession(
    pendingSend: { options: DictationPendingSendOptions },
    notify: boolean,
    sessionId: string,
    context?: { error?: unknown },
): Promise<boolean | undefined> {
    if (!notify) return undefined
    const callback = pendingSend.options.onSessionResolved
    if (!callback) return undefined
    try {
        // Callers may pass an async callback; await it so a rejection is
        // caught here instead of surfacing as an unhandled rejection.
        await callback(sessionId, context)
        return true
    } catch (error) {
        // Navigation/seed is a side effect of an already-decided send
        // outcome; a throw from it must not corrupt recovery or the
        // delivered state.
        console.warn('Voice send: onSessionResolved failed after resume:', error)
        return false
    }
}

export type DeliverVoiceSendResult = {
    /** True when the message POST succeeded. */
    delivered: boolean
    /** Set when delivery failed. */
    error?: unknown
    /** True when the resolver reported the session was resumed. */
    resumed: boolean
    /** Session id the message was actually sent to / recovered under. */
    targetSessionId: string
    /**
     * Id under which the retryable transcript was persisted on failure
     * (the targeted session, or the source session when the target's
     * draft was not ours to touch / the send never started). Equals
     * `targetSessionId` on success.
     */
    recoveredSessionId: string
    /**
     * Set on success only when the session was resumed: `false` when the
     * post-delivery navigation/seed callback rejected, `undefined` when no
     * callback ran (non-resumed send, or a resumed send whose caller did
     * not supply onSessionResolved). On failure the caller navigates
     * itself via notifyResolvedSession after surfacing the error.
     */
    notified?: boolean
    /**
     * Whether the caller should navigate/seed the target session: true on
     * success after a resume, and on failure only when the retryable
     * transcript was actually recovered under the target session.
     */
    shouldNotify: boolean
}

/** Shared fallback message for voice direct-send failures. */
export const VOICE_SEND_FAILED_MESSAGE = 'Failed to send message'

/** Shown when the message was delivered but the resumed session could not be opened/synced (also covers same-id resumes, where only seeding/cache updates failed). */
export const VOICE_NAVIGATION_FAILED_MESSAGE = 'Message sent, but the resumed session could not be opened or updated'

/** Shown when the send failed and the resumed session holding the recovery could not be opened. */
export const VOICE_SEND_NAVIGATION_FAILED_MESSAGE = 'Message not sent, and the resumed session could not be opened'

/**
 * Shared send-with-resume orchestration for voice dictation direct-sends
 * (used by both the standard recorder path and realtime providers).
 *
 * Inactive sessions cannot accept a message POST until they are resumed
 * (hub returns 409 `session_inactive`), so the voice send runs the same
 * resume step as the text pipeline: resolve the session right before the
 * POST, deliver to the resolved id, then notify/seed via
 * `onSessionResolved`.
 *
 * Failure recovery: the retryable transcript is saved under the LIVE
 * resumed id (snapshotting that session's draft before the send so the
 * operator's in-flight text is never clobbered) and the operator is
 * still navigated to it. The archived source draft is preserved on
 * failure — the recovery save can be skipped (resumed composer changed)
 * and navigation may not land, so clearing the source would risk losing
 * the transcript entirely. Only the success path drops the source draft
 * (superseded by the merge).
 */
export async function deliverVoiceSend(args: {
    pendingSend: {
        sessionId: string
        draftAtStart: string
        deliveryMode?: MessageDeliveryMode
        options: DictationPendingSendOptions
    }
    finalMessage: string
    /** Raw transcribed text (without the pre-recording initialText). */
    transcriptDelta: string
    sendMsg: (sessionId: string, text: string, deliveryMode?: MessageDeliveryMode) => Promise<void>
}): Promise<DeliverVoiceSendResult> {
    let targetSessionId = args.pendingSend.sessionId
    let resumed = false
    let recoveryDraftAtStart = args.pendingSend.draftAtStart
    // Note: api.sendMessage carries no idempotency key, so a rejection
    // after the hub accepted the message (e.g. a response timeout) is
    // recovered for retry and may deliver twice — the at-least-once
    // trade-off of the whole recovery design.
    let sendAttempted = false
    try {
        if (args.pendingSend.options.resolveSessionId) {
            const resolved = await args.pendingSend.options.resolveSessionId(args.pendingSend.sessionId)
            if (!resolved || typeof resolved.sessionId !== 'string' || typeof resolved.resumed !== 'boolean') {
                throw new Error('Voice send: session resolver returned an invalid result')
            }
            targetSessionId = resolved.sessionId
            // Derive the resume flag from the id actually changing so a
            // resolver that swaps the id without reporting `resumed` still
            // navigates/recoveries correctly. A resolver failure (e.g.
            // resume unavailable) throws here: the catch below then
            // recovers under the unchanged source id — the only id the
            // operator knows — and the thrown error (which carries the
            // resume-specific message) is surfaced by the caller.
            resumed = resolved.resumed || targetSessionId !== args.pendingSend.sessionId
            // Snapshot the resolved session's draft BEFORE the send: the
            // catch compares against this to avoid clobbering text the
            // operator typed into the resolved composer while the request
            // was in flight.
            if (targetSessionId !== args.pendingSend.sessionId) recoveryDraftAtStart = getDraft(targetSessionId)
        }
        sendAttempted = true
        await args.sendMsg(targetSessionId, args.finalMessage, args.pendingSend.deliveryMode)
    } catch (sendError) {
        // After a resume the source session is superseded: recover the
        // retryable transcript so the operator can retry from the live
        // session instead of losing it. Navigation is NOT fired here: the
        // caller surfaces the failure first (while the source component is
        // still mounted) and then navigates via notifyResolvedSession, so
        // a post-resume failure is never silent. Recovery is wrapped so a
        // storage failure cannot escape as an unexpected rejection with
        // the transcript unrecovered; the caller's own restore path then
        // still puts the text back into the composer.
        const recoverySessionId = targetSessionId
        let recoveredSessionId = args.pendingSend.sessionId
        try {
            if (!sendAttempted) {
                // The resolver rejected before any POST: the baseline draft
                // was never consumed, so do not overwrite it (the caller's
                // composer restore still makes the text visible when mounted,
                // and the unmounted case keeps the operator's baseline).
                recoveredSessionId = args.pendingSend.sessionId
            } else if (recoverySessionId === args.pendingSend.sessionId) {
                // Same-id (or unresolved): the baseline is the pre-recording
                // draft, which the send consumed.
                recoverDraft(recoverySessionId, recoveryDraftAtStart, args.finalMessage, args.transcriptDelta)
                recoveredSessionId = recoverySessionId
            } else if (recoveryDraftAtStart === '' && draftUnchanged(recoverySessionId, recoveryDraftAtStart)) {
                // Cross-id: only the empty-at-resolve target draft is ours to
                // write — a non-empty target baseline is the operator's own
                // text in the resumed session and must not be overwritten.
                saveDraft(recoverySessionId, args.finalMessage)
                recoveredSessionId = recoverySessionId
            } else {
                // The target draft moved in flight (or was never empty): fall
                // back to the source id so the transcript is never lost (the
                // source draft is preserved on failure anyway).
                recoverDraft(args.pendingSend.sessionId, args.pendingSend.draftAtStart, args.finalMessage, args.transcriptDelta)
                recoveredSessionId = args.pendingSend.sessionId
            }
        } catch (recoveryError) {
            console.warn('Voice send: draft recovery failed:', recoveryError)
            recoveredSessionId = args.pendingSend.sessionId
        }
        return {
            delivered: false,
            error: sendError,
            resumed,
            targetSessionId,
            recoveredSessionId,
            shouldNotify: resumed && recoveredSessionId === targetSessionId,
        }
    }
    // Draft cleanup runs BEFORE the notify: the onSessionResolved callback
    // may itself seed/navigate the target session (and write drafts), so a
    // post-notify unchanged-check could either skip the cleanup or wipe a
    // freshly seeded draft. The delivery outcome no longer depends on the
    // draft store. The cleanup is guarded: the message is already
    // delivered, so a storage failure must not reject (the callers'
    // defensive nets would otherwise re-persist the delivered text as a
    // retryable draft, risking a duplicate send).
    try {
        if (targetSessionId === args.pendingSend.sessionId
            && draftUnchanged(targetSessionId, recoveryDraftAtStart)) {
            // Same-id: the pre-recording draft was consumed by the delivery.
            // Cross-id targets are never cleared: a target draft is either
            // empty (nothing to clear) or the operator's own text (not ours).
            clearDraft(targetSessionId)
        }
        // A cross-id resume supersedes the source composer too; drop its
        // pre-recording draft so reopening the archived session does not
        // resurrect stale text (mirrors clearDraftsAfterSend).
        if (targetSessionId !== args.pendingSend.sessionId
            && draftUnchanged(args.pendingSend.sessionId, args.pendingSend.draftAtStart)) {
            clearDraft(args.pendingSend.sessionId)
        }
    } catch (cleanupError) {
        console.warn('Voice send: post-delivery draft cleanup failed:', cleanupError)
    }
    // Notification is a side effect of an already-delivered send: it runs
    // outside the send try/catch so a throw from navigation/cache updates
    // cannot be misread as a send failure (which would re-insert the
    // delivered text as a retryable draft). Navigation keys off `resumed`
    // (also covers same-id resumes, where the id never changes).
    const notified = await notifyResolvedSession(args.pendingSend, resumed, targetSessionId)
    return { delivered: true, resumed, targetSessionId, recoveredSessionId: targetSessionId, notified, shouldNotify: resumed }
}

export type VoiceSendOutcomeHandling = {
    pendingSend: {
        sessionId: string
        draftAtStart: string
        options: DictationPendingSendOptions
    }
    result: DeliverVoiceSendResult
    finalMessage: string
    transcriptDelta: string
    /** Live mount check (re-read after each await inside the helper). */
    isMounted: () => boolean
    /**
     * Restores the failed transcript into the composer. `fullMessage` is
     * the value to set when the composer is empty; `delta` is appended to
     * the operator's in-flight text when it is not.
     */
    restoreText: (fullMessage: string, delta: string) => void
    setError: (message: string) => void
    setStatusError: () => void
}

/**
 * Shared call-site orchestration for a completed `deliverVoiceSend`
 * outcome, used by both the standard recorder path and the realtime
 * hook so failure surfacing, text recovery and post-resume navigation
 * cannot drift.
 *
 * Failure: surfaces the error while the source component is still
 * mounted, restores the text when the transcript was recovered under
 * the mounted session, then navigates to the resumed session (only when
 * the retryable transcript actually lives there).
 *
 * Success with a rejected navigation/seed callback: surfaces a visible
 * error (or at least a warning when unmounted) so a delivered message
 * whose session could not be opened is never silent.
 *
 * Returns 'handled' when the caller must return early.
 */
export async function handleVoiceSendOutcome(args: VoiceSendOutcomeHandling): Promise<'handled' | 'continue'> {
    if (!args.result.delivered) {
        let errorMessage = args.result.error instanceof Error ? args.result.error.message : VOICE_SEND_FAILED_MESSAGE
        if (args.isMounted()) {
            if (args.result.recoveredSessionId === args.pendingSend.sessionId) {
                args.restoreText(args.finalMessage, args.transcriptDelta)
            }
            args.setError(errorMessage)
            args.setStatusError()
        }
        const navigated = await notifyResolvedSession(args.pendingSend, args.result.shouldNotify, args.result.targetSessionId, { error: args.result.error })
        if (args.result.shouldNotify && navigated === false) {
            // The transcript was recovered under the resumed session and the
            // operator was not navigated there: make it reachable locally so
            // the failed text is never stranded in an unseen session.
            if (args.isMounted()) {
                if (args.result.recoveredSessionId !== args.pendingSend.sessionId) {
                    args.restoreText(args.finalMessage, args.transcriptDelta)
                }
                // Amend the already-shown error with the navigation failure
                // (keeping the root cause visible); no second status firing.
                args.setError(`${VOICE_SEND_NAVIGATION_FAILED_MESSAGE} — ${errorMessage}`)
            } else {
                console.warn('Voice send: failed and the resumed session could not be opened')
            }
        }
        return 'handled'
    }
    if (args.result.resumed && args.result.notified === false) {
        if (args.isMounted()) {
            args.setError(VOICE_NAVIGATION_FAILED_MESSAGE)
            args.setStatusError()
        } else {
            console.warn('Voice send: delivered, but the resumed session could not be opened')
        }
        return 'handled'
    }
    return 'continue'
}
