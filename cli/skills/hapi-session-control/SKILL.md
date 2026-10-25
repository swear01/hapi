---
name: hapi-session-control
description: Delegate work to a new HAPI session, or message and read another HAPI session, and collect its reply. Use for delegated work, peer messages, and session links or IDs.
---

# HAPI session control

Use the HAPI MCP tools. They use this session's hub credentials.

## Delegate new work

Call `spawn_peer` with the full task as `message`. The new session starts on this machine in this session's directory with this session's agent. Pass `directory` or `agent` only when the user asked for a different one.

Then end your turn. Do not poll. The peer's reply is posted into this session as a new message when its turn ends, and you continue from there. To follow up, call `ping_peer` with `waitForReply: true` and end your turn again.

## A session the user named

Only touch an existing session when the user gave its ID or a `/sessions/<id>` link. Sessions you started with `spawn_peer` count as named.

- Read it: `inspect_peer`.
- Message it: `ping_peer`. Add `waitForReply: true` when you need the answer, then end your turn.

Never pick a session from `list_peers` on your own, and never fall back to a different session after a failure. Report the failure instead.

## Limits

- A reply contains at most about 1,200 characters of the peer's last message. Use `inspect_peer` for context, or ask the peer to keep its final answer short.
- A pending reply is lost if this session's CLI process restarts. Use `inspect_peer` to check on the peer.
- Archiving and stopping sessions is done by the user in the HAPI web app.
