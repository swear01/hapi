#!/usr/bin/env bash
# tools/maintenance/smoke-runner.sh — isolated dev hub + source runner smoke harness.
#
# Runs a throwaway hapi hub + source runner against an isolated HAPI_HOME so a
# PR can be exercised without touching the production runner or hub. Every
# process is owned by this script and killed on exit (no setsid, no orphans).
#
# Guard: refuses to run on production runner hosts (oracle / swever and the
# small Linux fleet boxes) because their RAM/CPU cannot absorb build:web + a
# second runner. Allowed by default: Mac, mazu, and any other machine.
# Override with HAPI_SMOKE_FORCE=1 (only on machines you know can take it).
#
# Usage:
#   cd <hapi checkout>   # must be the repo root (this script lives under tools/)
#   ./tools/maintenance/smoke-runner.sh            # 127.0.0.1 only
#   HAPI_LISTEN_HOST=0.0.0.0 ./tools/maintenance/smoke-runner.sh  # LAN access
#   SKIP_BUILD=1 ./tools/maintenance/smoke-runner.sh              # skip build:web
#
# Ctrl-C (or SIGTERM/SIGHUP) stops the hub and runner and removes $TEST_HOME.

set -euo pipefail

# ── Guard: production hosts where this must not run ────────────────────────
PROD_HOSTS="oracle swever cthulhu athena valkyrie zeus"
HOST="$(hostname | cut -d. -f1)"
if [[ " $PROD_HOSTS " == *" $HOST "* ]]; then
  if [[ "${HAPI_SMOKE_FORCE:-}" != "1" ]]; then
    echo "ERROR: host '$HOST' is a production runner host; refusing to run." >&2
    echo "  Run this on your Mac or on mazu. If you really know what you are" >&2
    echo "  doing (machine has spare RAM/CPU), set HAPI_SMOKE_FORCE=1." >&2
    exit 1
  fi
  echo "WARNING: running on production host '$HOST' with HAPI_SMOKE_FORCE=1." >&2
fi

# Processes this harness owns (hub + source runner started via bun).
SMOKE_PATTERN='bun (hub/src/index[.]ts|cli/src/index[.]ts runner start-sync)'

# Must run from the repo root (script lives under tools/maintenance/).
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"
[ -f package.json ] || { echo "ERROR: not a hapi repo root: $REPO_ROOT" >&2; exit 1; }

# ── Stray-process check: refuse if a previous run left hub/runner behind ───
STRAYS="$(pgrep -f "$SMOKE_PATTERN" || true)"
if [ -n "$STRAYS" ]; then
  echo "ERROR: leftover smoke hub/runner processes from a previous run:" >&2
  ps -o pid,etime,cmd -p $STRAYS >&2
  echo "  Kill them first (e.g. 'kill $STRAYS') or reboot." >&2
  exit 1
fi

# ── Setup ──────────────────────────────────────────────────────────────────
BUN_BIN="${BUN_BIN:-$(command -v bun || true)}"
if [ -z "$BUN_BIN" ] && [ -x "$HOME/.bun/bin/bun" ]; then BUN_BIN="$HOME/.bun/bin/bun"; fi
[ -n "$BUN_BIN" ] || { echo "ERROR: bun not found (install it or set BUN_BIN)" >&2; exit 1; }

TEST_HOME="$(mktemp -d /tmp/hapi-smoke.XXXXXX)"
TEST_PORT="${HAPI_SMOKE_PORT:-17888}"
TEST_TOKEN="${HAPI_SMOKE_TOKEN:-$(head -c 18 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 18)}"
HAPI_LISTEN_HOST="${HAPI_LISTEN_HOST:-127.0.0.1}"
HUB_PID=""
RUNNER_PID=""

cleanup() {
  trap - EXIT INT TERM HUP
  # Graceful first; the source runner may defer SIGTERM while shutting down.
  kill "$RUNNER_PID" "$HUB_PID" 2>/dev/null || true
  sleep 2
  # Hard-kill stragglers so no orphan survives the harness.
  pkill -KILL -f "$SMOKE_PATTERN" 2>/dev/null || true
  rm -rf "$TEST_HOME"
  echo
  echo "smoke harness stopped; cleaned $TEST_HOME"
}
trap cleanup EXIT INT TERM HUP

cat > "$TEST_HOME/env" <<ENV
HAPI_HOME=$TEST_HOME
HAPI_LISTEN_HOST=$HAPI_LISTEN_HOST
HAPI_LISTEN_PORT=$TEST_PORT
HAPI_PUBLIC_URL=http://$HAPI_LISTEN_HOST:$TEST_PORT
CORS_ORIGINS=*
CLI_API_TOKEN=$TEST_TOKEN
HAPI_API_URL=http://127.0.0.1:$TEST_PORT
TELEGRAM_NOTIFICATION=false
ENV

# ── Build web assets (optional; the hub serves the current UI with them) ───
if [[ "${SKIP_BUILD:-}" != "1" ]]; then
  echo "== build:web (this is the memory-hungry step) =="
  npm exec -- bun run build:web
fi

# ── Start isolated hub ─────────────────────────────────────────────────────
set -a; source "$TEST_HOME/env"; set +a
echo "== starting isolated hub on $HAPI_LISTEN_HOST:$TEST_PORT =="
"$BUN_BIN" hub/src/index.ts > "$TEST_HOME/hub.log" 2>&1 &
HUB_PID=$!
for _ in $(seq 1 30); do
  curl -fsS "http://127.0.0.1:$TEST_PORT/health" >/dev/null 2>&1 && break
  sleep 1
done
curl -fsS "http://127.0.0.1:$TEST_PORT/health" >/dev/null 2>&1 \
  || { echo "ERROR: hub did not come up; see $TEST_HOME/hub.log" >&2; exit 1; }

# ── Start source runner against that hub ───────────────────────────────────
echo "== starting source runner (workspace-root: $(pwd)) =="
"$BUN_BIN" cli/src/index.ts runner start-sync --workspace-root "$REPO_ROOT" \
  > "$TEST_HOME/runner.log" 2>&1 &
RUNNER_PID=$!
sleep 3
kill -0 "$RUNNER_PID" 2>/dev/null \
  || { echo "ERROR: runner died; see $TEST_HOME/runner.log" >&2; exit 1; }

echo
echo "Open: http://$HAPI_LISTEN_HOST:$TEST_PORT/?token=$TEST_TOKEN"
echo "Hub pid: $HUB_PID   Runner pid: $RUNNER_PID"
echo "Logs: $TEST_HOME/{hub,runner}.log   Press Ctrl-C to stop everything."
echo
wait
