/**
 * Kill switch for the peer-session MCP tools (`ping_peer` / `inspect_peer` /
 * `spawn_peer`).
 *
 * Set `HAPI_DISABLE_PEER_TOOLS=1` in the runner environment to stop wrapped
 * agents from reading or messaging other HAPI sessions: the tools are not
 * registered on the session MCP server and not advertised via
 * `--allowedTools` / `--tools`. The ping/inspect core refuses as defense in
 * depth, so `hapi ping-peer` / `inspect-peer` from inside a wrapped agent
 * shell fails loudly. Operators who keep the variable unset in their
 * interactive shell keep full CLI access.
 */

export const PEER_TOOL_NAMES = ['ping_peer', 'inspect_peer', 'spawn_peer'] as const;

export function isPeerToolsDisabled(env: NodeJS.ProcessEnv = process.env): boolean {
    return ['true', '1', 'yes'].includes((env.HAPI_DISABLE_PEER_TOOLS ?? '').toLowerCase());
}
