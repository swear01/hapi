#!/usr/bin/env bash
set -euo pipefail

repo=.
output=
upstream_repo="${HAPI_UPSTREAM_REPO:-tiann/hapi}"

while [ "$#" -gt 0 ]; do
    case "$1" in
        --repo) repo=$2; shift 2 ;;
        --output) output=$2; shift 2 ;;
        --upstream-repo) upstream_repo=$2; shift 2 ;;
        *) echo "Unknown argument: $1" >&2; exit 2 ;;
    esac
done

git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { echo "Not a git checkout: $repo" >&2; exit 2; }
[ -n "$output" ] || { echo "--output is required" >&2; exit 2; }

git -C "$repo" fetch origin main:refs/remotes/origin/main
git -C "$repo" fetch origin --tags
git -C "$repo" fetch upstream main:refs/remotes/upstream/main

previous_tag="$(git -C "$repo" tag --merged origin/main --sort=-v:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' | head -1 || true)"
[ -n "$previous_tag" ] || { echo "No maintained four-part tag is reachable from origin/main" >&2; exit 3; }

official_tag="$(gh release view --repo "$upstream_repo" --json tagName | python3 -c 'import json,sys; print(json.load(sys.stdin)["tagName"])')"
prs="$(gh pr list --repo "$upstream_repo" --state open --limit 1000 --json number,title,isDraft,mergeStateStatus,headRefOid,url)"

mkdir -p "$(dirname "$output")"
{
    printf '# HAPI maintained release audit\n\n'
    printf 'Previous maintained release: %s\n\n' "$previous_tag"
    printf 'Official release: %s\n\n' "$official_tag"
    printf 'Origin main: %s\n' "$(git -C "$repo" rev-parse origin/main)"
    printf 'Upstream main: %s\n\n' "$(git -C "$repo" rev-parse upstream/main)"
    printf '## Fork-only commits\n\n'
    git -C "$repo" log --format='- %H %s' upstream/main..origin/main
    printf '\n## Open upstream pull requests\n\n'
    printf '%s' "$prs" | python3 -c '
import json, sys
for pr in json.load(sys.stdin):
    state = "draft" if pr["isDraft"] else pr["mergeStateStatus"]
    print("- #{} [{}] {} @ {} ({})".format(pr["number"], state, pr["title"], pr["headRefOid"], pr["url"]))
'
    printf '\n## Required decisions\n\n'
    printf 'Record every open PR as carry, defer, or drop with its reviewed SHA before rebuilding.\n'
} > "$output"

printf 'Wrote %s\n' "$output"
