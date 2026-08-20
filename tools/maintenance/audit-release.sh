#!/usr/bin/env bash
set -euo pipefail

repo=.
output=
pr_audit_output=
upstream_repo="${HAPI_UPSTREAM_REPO:-tiann/hapi}"
personal_pr_owner="${HAPI_PERSONAL_PR_OWNER:-}"

while [ "$#" -gt 0 ]; do
    case "$1" in
        --repo) repo=$2; shift 2 ;;
        --output) output=$2; shift 2 ;;
        --pr-audit-output) pr_audit_output=$2; shift 2 ;;
        --upstream-repo) upstream_repo=$2; shift 2 ;;
        --personal-pr-owner) personal_pr_owner=$2; shift 2 ;;
        *) echo "Unknown argument: $1" >&2; exit 2 ;;
    esac
done

git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { echo "Not a git checkout: $repo" >&2; exit 2; }
[ -n "$output" ] || { echo "--output is required" >&2; exit 2; }

if [ -z "$personal_pr_owner" ]; then
    origin_url="$(git -C "$repo" remote get-url origin)"
    personal_pr_owner="$(printf '%s\n' "$origin_url" | sed -nE 's#^(git@github\.com:|https://github\.com/)([^/]+)/.*#\2#p')"
fi
[ -n "$personal_pr_owner" ] || personal_pr_owner=unknown

git -C "$repo" fetch origin main:refs/remotes/origin/main
git -C "$repo" fetch origin --tags
git -C "$repo" fetch upstream main:refs/remotes/upstream/main

previous_tag="$(git -C "$repo" tag --merged origin/main --sort=-v:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' | head -1 || true)"
[ -n "$previous_tag" ] || { echo "No maintained four-part tag is reachable from origin/main" >&2; exit 3; }

official_tag="$(gh release view --repo "$upstream_repo" --json tagName | python3 -c 'import json,sys; print(json.load(sys.stdin)["tagName"])')"
prs="$(gh pr list --repo "$upstream_repo" --state open --limit 1000 --json number,title,isDraft,mergeStateStatus,headRefOid,url,author,additions,deletions,changedFiles,statusCheckRollup)"

mkdir -p "$(dirname "$output")"
{
    printf '# HAPI maintained release audit\n\n'
    printf 'Previous maintained release: %s\n\n' "$previous_tag"
    printf 'Official release: %s\n\n' "$official_tag"
    printf 'Personal PR owner: %s\n\n' "$personal_pr_owner"
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
    printf 'Normal carries require ready CI/merge state, clear maintainer signal, latest-head HAPI Bot no-findings, proportional or evidenced scope, and preserved or accepted behavior.\n'
    printf 'Personal PRs authored by %s are auto-carry; record and report every failed quality rule after integration.\n' "$personal_pr_owner"
    printf 'Official upstream is authoritative; upstreamed PRs are accepted and are not replayed.\n'
} > "$output"

if [ -n "$pr_audit_output" ]; then
    mkdir -p "$(dirname "$pr_audit_output")"
    printf '%s' "$prs" | python3 -c '
import json, sys

owner, output = sys.argv[1:]
allowed = {"SUCCESS", "NEUTRAL", "SKIPPED"}

def status(pr):
    if pr["isDraft"]:
        return "draft"
    if pr["mergeStateStatus"] != "CLEAN":
        return "merge-" + pr["mergeStateStatus"].lower()
    checks = pr.get("statusCheckRollup") or []
    if not checks:
        return "checks-missing"
    if any(check.get("status") != "COMPLETED" for check in checks):
        return "checks-pending"
    if any(check.get("conclusion") not in allowed for check in checks):
        return "checks-failed"
    return "ready"

with open(output, "w") as handle:
    handle.write("upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n")
    for pr in json.load(sys.stdin):
        author = pr["author"]["login"]
        decision = "carry" if author.lower() == owner.lower() else "review"
        if pr["additions"] > 3000 or pr["changedFiles"] > 40:
            scope = "review-huge"
        elif pr["additions"] > 1000 or pr["changedFiles"] > 20:
            scope = "review-large"
        else:
            scope = "review"
        reason = "additions={},deletions={},files={}".format(pr["additions"], pr["deletions"], pr["changedFiles"])
        values = ["pr-{}".format(pr["number"]), author, pr["headRefOid"], decision, status(pr), "review", "review", "-", scope, "review", reason]
        handle.write("\t".join(values) + "\n")
' "$personal_pr_owner" "$pr_audit_output"
    printf 'Wrote %s\n' "$pr_audit_output"
fi

printf 'Wrote %s\n' "$output"
