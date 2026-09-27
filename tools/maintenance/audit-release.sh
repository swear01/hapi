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

origin_tag_namespace=refs/hapi-maintained-tags/origin

git -C "$repo" fetch --no-tags origin +main:refs/remotes/origin/main
git -C "$repo" fetch --no-tags upstream main:refs/remotes/upstream/main
while read -r ref; do
    git -C "$repo" update-ref -d "$ref"
done < <(git -C "$repo" for-each-ref --format='%(refname)' "$origin_tag_namespace")
git -C "$repo" fetch --no-tags origin "+refs/tags/*:${origin_tag_namespace}/*"

previous_tag="$({
    git -C "$repo" for-each-ref \
        --sort=-version:refname \
        --format='%(refname:strip=3)' \
        "$origin_tag_namespace" \
        | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' \
        || true
    } | while read -r tag; do
        if git -C "$repo" merge-base --is-ancestor "$origin_tag_namespace/$tag^{commit}" origin/main; then
            printf '%s\n' "$tag"
            break
        fi
    done)"
[ -n "$previous_tag" ] || { echo "No maintained four-part tag is reachable from origin/main" >&2; exit 3; }

official_tag="$(gh release view --repo "$upstream_repo" --json tagName | python3 -c 'import json,sys; print(json.load(sys.stdin)["tagName"])')"
upstream_owner="${upstream_repo%%/*}"
upstream_name="${upstream_repo#*/}"
[ "$upstream_owner" != "$upstream_name" ] || { echo "Invalid upstream repository: $upstream_repo" >&2; exit 2; }
prs="$(gh api graphql --paginate \
    -F owner="$upstream_owner" \
    -F repo="$upstream_name" \
    -F perPage=25 \
    -f query='query($owner: String!, $repo: String!, $perPage: Int!, $endCursor: String) {
        repository(owner: $owner, name: $repo) {
            pullRequests(states: OPEN, first: $perPage, after: $endCursor, orderBy: {field: CREATED_AT, direction: DESC}) {
                nodes {
                    number title isDraft mergeStateStatus headRefOid url additions deletions changedFiles
                    author { login }
                    commits(last: 1) {
                        nodes {
                            commit {
                                statusCheckRollup {
                                    contexts(first: 100) {
                                        nodes {
                                            __typename
                                            ... on CheckRun { status conclusion }
                                            ... on StatusContext { state }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                pageInfo { hasNextPage endCursor }
            }
        }
    }' \
    --jq '.data.repository.pullRequests.nodes' \
    | python3 -c '
import json, sys

pull_requests = []
for line in sys.stdin:
    pull_requests.extend(json.loads(line))
for pr in pull_requests:
    commits = pr.pop("commits", {}).get("nodes") or []
    rollup = commits[0]["commit"].get("statusCheckRollup") if commits else None
    pr["statusCheckRollup"] = rollup["contexts"]["nodes"] if rollup else []
json.dump(pull_requests, sys.stdout, separators=(",", ":"))
')"

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
    if any(
        check["__typename"] == "CheckRun" and check.get("status") != "COMPLETED"
        or check["__typename"] == "StatusContext" and check.get("state") in {"EXPECTED", "PENDING"}
        for check in checks
    ):
        return "checks-pending"
    if any(
        check["__typename"] == "CheckRun" and check.get("conclusion") not in allowed
        or check["__typename"] == "StatusContext" and check.get("state") != "SUCCESS"
        for check in checks
    ):
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
