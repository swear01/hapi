#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
caller_dir="$PWD"
repo="${HAPI_REPO:-$PWD}"
base_dir="$script_dir"
patch_dir="$base_dir/patches"
manifest="$base_dir/manifest.tsv"
pr_audit=
personal_pr_owner="${HAPI_PERSONAL_PR_OWNER:-}"
upstream_repo="${HAPI_UPSTREAM_REPO:-}"
upstream_sha="${HAPI_UPSTREAM_SHA:-}"
worktree_root="${HAPI_WORKTREE_ROOT:-$HOME/.agent-worktrees/hapi-maintenance}"
skip_tests=0
push=0
bun_dir=
test_home=
canonical_index=
open_pr_file=

while [ "$#" -gt 0 ]; do
    case "$1" in
        --repo) repo=$2; shift 2 ;;
        --patch-dir) patch_dir=$2; shift 2 ;;
        --manifest) manifest=$2; shift 2 ;;
        --pr-audit) pr_audit=$2; shift 2 ;;
        --personal-pr-owner) personal_pr_owner=$2; shift 2 ;;
        --upstream-sha) upstream_sha=$2; shift 2 ;;
        --skip-tests) skip_tests=1; shift ;;
        --push) push=1; shift ;;
        *) echo "Unknown argument: $1" >&2; exit 2 ;;
    esac
done

case "$repo" in /*) ;; *) repo="$caller_dir/$repo" ;; esac
case "$patch_dir" in /*) ;; *) patch_dir="$caller_dir/$patch_dir" ;; esac
case "$manifest" in /*) ;; *) manifest="$caller_dir/$manifest" ;; esac
if [ -n "$pr_audit" ]; then
    case "$pr_audit" in /*) ;; *) pr_audit="$caller_dir/$pr_audit" ;; esac
fi

if [ "$push" -eq 1 ]; then
    echo "sync-from-upstream.sh is rehearsal-only; publish the reviewed release SHA separately" >&2
    exit 3
fi

git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { echo "Not a git checkout: $repo" >&2; exit 4; }
[ -d "$patch_dir" ] || { echo "Missing patch directory: $patch_dir" >&2; exit 4; }
[ -f "$manifest" ] || { echo "Missing manifest: $manifest" >&2; exit 4; }
manifest="$(cd "$(dirname "$manifest")" && pwd -P)/$(basename "$manifest")"
repo_root=$(cd "$(git -C "$repo" rev-parse --show-toplevel)" && pwd -P)
release_record_rel=
case "$manifest" in
    "$repo_root"/*) release_record_rel=$(dirname "${manifest#"$repo_root"/}") ;;
esac
is_release_manifest=
case "$release_record_rel" in tools/maintenance/releases/*) is_release_manifest=yes ;; esac
manifest_has_pr_rows=$(awk -F $'\t' '$2 == "carry" || $2 == "integrated" { if ($3 ~ /^pr-[0-9]+$/) { print "yes"; exit } }' "$manifest")
if { [ -n "$manifest_has_pr_rows" ] || [ -n "$is_release_manifest" ]; } && [ -z "$pr_audit" ]; then
    echo "--pr-audit is required for pull-request or repository release manifests" >&2
    exit 4
fi
[ -z "$pr_audit" ] || [ -f "$pr_audit" ] || { echo "Missing PR audit: $pr_audit" >&2; exit 4; }
[ -n "$upstream_sha" ] || { echo "HAPI_UPSTREAM_SHA or --upstream-sha is required" >&2; exit 4; }

if [ -z "$personal_pr_owner" ]; then
    origin_url="$(git -C "$repo" remote get-url origin)"
    personal_pr_owner="$(printf '%s\n' "$origin_url" | sed -nE 's#^(git@github\.com:|https://github\.com/)([^/]+)/.*#\2#p')"
fi

git -C "$repo" fetch --no-tags origin +main:refs/remotes/origin/main
git -C "$repo" fetch --no-tags upstream +main:refs/remotes/upstream/main
actual_upstream_sha=$(git -C "$repo" rev-parse upstream/main)
[ "$actual_upstream_sha" = "$upstream_sha" ] || {
    echo "UPSTREAM_HEAD_MISMATCH expected=$upstream_sha actual=$actual_upstream_sha" >&2
    exit 4
}
old_origin_main=$(git -C "$repo" rev-parse origin/main)
manifest_upstream_sha=$(sed -n 's/^# upstream_sha=//p' "$manifest")
manifest_origin_sha=$(sed -n 's/^# previous_origin_main=//p' "$manifest")
expected_source_tree=$(sed -n 's/^# expected_source_tree=//p' "$manifest")
if [ -n "$manifest_upstream_sha" ] && [ "$manifest_upstream_sha" != "$actual_upstream_sha" ]; then
    echo "MANIFEST_UPSTREAM_SHA_MISMATCH expected=$manifest_upstream_sha actual=$actual_upstream_sha" >&2
    exit 4
fi
if [ -n "$manifest_origin_sha" ] && [ "$manifest_origin_sha" != "$old_origin_main" ]; then
    echo "MANIFEST_ORIGIN_SHA_MISMATCH expected=$manifest_origin_sha actual=$old_origin_main" >&2
    exit 4
fi
if [ -n "$is_release_manifest" ]; then
    [ -n "$manifest_upstream_sha" ] || { echo "MISSING_MANIFEST_PIN: upstream_sha" >&2; exit 4; }
    [ -n "$manifest_origin_sha" ] || { echo "MISSING_MANIFEST_PIN: previous_origin_main" >&2; exit 4; }
    [ -n "$expected_source_tree" ] || { echo "MISSING_MANIFEST_PIN: expected_source_tree" >&2; exit 4; }
fi

allowed_file=$(mktemp)
required_file=$(mktemp)
actual_file=$(mktemp)
mkdir -p "$worktree_root"
worktree="$worktree_root/rehearsal-$$"
[ ! -e "$worktree" ] || { echo "Rehearsal worktree path already exists: $worktree" >&2; exit 4; }
cleanup() {
    rm -f "$allowed_file" "$required_file" "$actual_file" ${canonical_index:+"$canonical_index"} ${open_pr_file:+"$open_pr_file"}
    [ -z "$bun_dir" ] || rm -rf "$bun_dir"
    [ -z "$test_home" ] || rm -rf "$test_home"
    if [ -f "$worktree/.git" ]; then
        if [ -n "$(git -C "$worktree" status --porcelain=v1)" ]; then
            echo "REHEARSAL_WORKTREE_RETAINED=$worktree" >&2
        elif ! git -C "$repo" worktree remove "$worktree" >/dev/null; then
            echo "REHEARSAL_WORKTREE_RETAINED=$worktree" >&2
        fi
    fi
}
trap cleanup EXIT

while IFS=$'\t' read -r patch state upstream_ref source_commits; do
    [ -n "${patch:-}" ] || continue
    case "$patch" in \#*) continue ;; esac
    case "$state" in
        carry|integrated)
            if [ "$source_commits" != "-" ]; then
                printf '%s\n' "$source_commits" | tr ',' '\n' >> "$allowed_file"
            fi
            ;;
        regenerate)
            if [ "$source_commits" != "-" ]; then
                printf '%s\n' "$source_commits" | tr ',' '\n' >> "$allowed_file"
                printf '%s\n' "$source_commits" | tr ',' '\n' >> "$required_file"
            fi
            ;;
        drop)
            if [ "$source_commits" != "-" ]; then
                printf '%s\n' "$source_commits" | tr ',' '\n' >> "$allowed_file"
            fi
            ;;
        *) echo "Invalid manifest state for $patch: $state" >&2; exit 6 ;;
    esac
done < "$manifest"

if [ -n "$pr_audit" ]; then
    python3 - "$manifest" "$pr_audit" "$personal_pr_owner" <<'PY'
import csv
import sys

manifest_path, audit_path, personal_owner = sys.argv[1:]
required = {
    "upstream_ref", "author", "head_sha", "decision", "status",
    "maintainer_signal", "bot_verdict", "bot_sha", "scope", "behavior", "reason",
}

with open(audit_path, newline="") as handle:
    reader = csv.DictReader(handle, delimiter="\t")
    missing = required - set(reader.fieldnames or [])
    if missing:
        sys.exit("INVALID_PR_AUDIT missing columns: " + ",".join(sorted(missing)))
    rows = {}
    for row in reader:
        ref = row["upstream_ref"]
        if ref in rows:
            sys.exit("INVALID_PR_AUDIT duplicate: " + ref)
        rows[ref] = row

failed = False
manifest_carries = {}
with open(manifest_path) as handle:
    for line in handle:
        if not line.strip() or line.startswith("#"):
            continue
        _, state, ref, source = line.rstrip("\n").split("\t")
        if state not in {"carry", "integrated"} or not ref.startswith("pr-"):
            continue
        if ref in manifest_carries:
            print("DUPLICATE_MANIFEST_CARRY: " + ref, file=sys.stderr)
            failed = True
            continue
        manifest_carries[ref] = source
        row = rows.get(ref)
        if row is None:
            print("MISSING_PR_AUDIT: " + ref, file=sys.stderr)
            failed = True
            continue

        if source != row["head_sha"]:
            print("MANIFEST_SOURCE_HEAD_MISMATCH {}: source={} audited={}".format(
                ref, source, row["head_sha"]
            ), file=sys.stderr)
            failed = True
            continue

        violations = []
        if row["decision"] != "carry":
            violations.append("decision-" + row["decision"])
        if row["status"] != "ready":
            violations.append("status-" + row["status"])
        if row["maintainer_signal"] != "clear":
            violations.append("maintainer-" + row["maintainer_signal"])
        if row["bot_verdict"] != "clean":
            violations.append("bot-" + row["bot_verdict"])
        elif row["bot_sha"] != row["head_sha"]:
            violations.append("bot-stale")
        if row["scope"] not in {"proportional", "exception"}:
            violations.append("scope-" + row["scope"])
        elif row["scope"] == "exception" and row["reason"] in {"", "-"}:
            violations.append("scope-exception-without-evidence")
        if row["behavior"] not in {"preserve", "accepted-change"}:
            violations.append("behavior-" + row["behavior"])

        personal = bool(personal_owner) and row["author"].lower() == personal_owner.lower()
        if personal:
            if violations:
                print("PERSONAL_PR_POLICY_EXCEPTION {}: {} | {}".format(ref, ",".join(violations), row["reason"]))
            else:
                print("PERSONAL_PR_AUTO_CARRY {}: passes standard gates".format(ref))
        elif violations:
            print("PR_QUALITY_GATE_FAILED {}: {}".format(ref, ",".join(violations)), file=sys.stderr)
            failed = True

for ref, row in rows.items():
    if row["decision"] == "carry" and ref not in manifest_carries:
        print("MISSING_MANIFEST_CARRY: " + ref, file=sys.stderr)
        failed = True

if failed:
    sys.exit(6)
PY

    pr_refs=()
    while IFS=$'\t' read -r upstream_ref _ head_sha _; do
        case "$upstream_ref" in pr-*) pr_refs+=("refs/pull/${upstream_ref#pr-}/head") ;; esac
    done < <(tail -n +2 "$pr_audit")
    if [ "${#pr_refs[@]}" -gt 0 ]; then
        live_pr_heads="$(git -C "$repo" ls-remote upstream "${pr_refs[@]}")"
        while IFS=$'\t' read -r upstream_ref _ audited_head _; do
            case "$upstream_ref" in pr-*) ;; *) continue ;; esac
            remote_ref="refs/pull/${upstream_ref#pr-}/head"
            live_head="$(printf '%s\n' "$live_pr_heads" | awk -v ref="$remote_ref" '$2 == ref { print $1 }')"
            [ -n "$live_head" ] || { echo "PR_HEAD_NOT_FOUND: $upstream_ref" >&2; exit 6; }
            [ "$live_head" = "$audited_head" ] || {
                echo "PR_AUDIT_HEAD_STALE $upstream_ref: audited=$audited_head live=$live_head" >&2
                exit 6
            }
        done < <(tail -n +2 "$pr_audit")
    fi

    if [ -z "$upstream_repo" ]; then
        upstream_url="$(git -C "$repo" remote get-url upstream)"
        upstream_repo="$(printf '%s\n' "$upstream_url" | sed -nE 's#^(git@github\.com:|https://github\.com/)([^/]+/[^/]+)$#\2#p')"
        upstream_repo="${upstream_repo%.git}"
    fi
    if [[ "$upstream_repo" =~ ^[^/]+/[^/]+$ ]]; then
        upstream_owner="${upstream_repo%%/*}"
        upstream_name="${upstream_repo#*/}"
        open_pr_file=$(mktemp)
        gh api graphql --paginate \
            -F owner="$upstream_owner" \
            -F repo="$upstream_name" \
            -F perPage=100 \
            -f query='query($owner: String!, $repo: String!, $perPage: Int!, $endCursor: String) {
                repository(owner: $owner, name: $repo) {
                    pullRequests(states: OPEN, first: $perPage, after: $endCursor) {
                        nodes { number headRefOid }
                        pageInfo { hasNextPage endCursor }
                    }
                }
            }' \
            --jq '.data.repository.pullRequests.nodes' \
            | python3 -c '
import json, sys
for line in sys.stdin:
    for pr in json.loads(line):
        print("pr-{}\t{}".format(pr["number"], pr["headRefOid"]))
' > "$open_pr_file"
        python3 - "$pr_audit" "$open_pr_file" <<'PY'
import csv
import sys

audit_path, live_path = sys.argv[1:]
with open(audit_path, newline="") as handle:
    audited = {row["upstream_ref"]: row["head_sha"] for row in csv.DictReader(handle, delimiter="\t")}
with open(live_path) as handle:
    live = dict(line.rstrip("\n").split("\t", 1) for line in handle if line.strip())
if set(audited) != set(live):
    print("OPEN_PR_AUDIT_SET_MISMATCH missing={} closed={}".format(
        ",".join(sorted(set(live) - set(audited))),
        ",".join(sorted(set(audited) - set(live))),
    ), file=sys.stderr)
    sys.exit(6)
for ref in sorted(live):
    if audited[ref] != live[ref]:
        print("PR_AUDIT_HEAD_STALE {}: audited={} live={}".format(ref, audited[ref], live[ref]), file=sys.stderr)
        sys.exit(6)
PY
        rm -f "$open_pr_file"
        open_pr_file=
    elif [ -n "$is_release_manifest" ]; then
        echo "INVALID_UPSTREAM_REPO: expected owner/repo, got ${upstream_repo:-empty}" >&2
        exit 6
    fi
fi

sort -u "$allowed_file" -o "$allowed_file"
sort -u "$required_file" -o "$required_file"
git -C "$repo" rev-list upstream/main..origin/main | sort -u > "$actual_file"

unknown=$(comm -23 "$actual_file" "$allowed_file" || true)
if [ -n "$unknown" ]; then
    printf 'UNRECORDED_FORK_COMMIT: %s\n' "$unknown" >&2
    exit 5
fi
missing=$(comm -13 "$actual_file" "$required_file" || true)
if [ -n "$missing" ]; then
    printf 'MANIFEST_COMMIT_NOT_IN_ORIGIN_MAIN: %s\n' "$missing" >&2
    exit 5
fi

git -C "$repo" worktree add --detach "$worktree" "$upstream_sha" >/dev/null
echo "REHEARSAL_WORKTREE=$worktree"

while IFS=$'\t' read -r patch state upstream_ref source_commits; do
    [ -n "${patch:-}" ] || continue
    case "$patch" in \#*) continue ;; esac
    case "$state" in
        carry|regenerate)
            [ -f "$patch_dir/$patch" ] || { echo "Missing patch: $patch" >&2; exit 6; }
            git -C "$worktree" -c user.name=swear01 -c user.email=stanley.yellow1@gmail.com am "$patch_dir/$patch" >/dev/null
            ;;
        integrated|drop) ;;
        *) echo "Invalid manifest state for $patch: $state" >&2; exit 6 ;;
    esac
done < "$manifest"

if [ -n "$expected_source_tree" ]; then
    actual_source_tree=$(git -C "$worktree" rev-parse 'HEAD^{tree}')
    if [ -n "$release_record_rel" ]; then
        canonical_index=$(mktemp)
        GIT_INDEX_FILE="$canonical_index" git -C "$worktree" read-tree HEAD
        GIT_INDEX_FILE="$canonical_index" git -C "$worktree" rm -r --cached --ignore-unmatch -- "$release_record_rel" >/dev/null
        actual_source_tree=$(GIT_INDEX_FILE="$canonical_index" git -C "$worktree" write-tree)
        rm -f "$canonical_index"
        canonical_index=
    fi
    [ "$actual_source_tree" = "$expected_source_tree" ] || {
        echo "REPLAY_TREE_MISMATCH expected=$expected_source_tree actual=$actual_source_tree" >&2
        exit 6
    }
    echo "REPLAY_TREE_MATCHES=$actual_source_tree"
fi

if git -C "$worktree" diff --quiet origin/main HEAD; then
    echo "TREE_MATCHES_ORIGIN_MAIN"
else
    echo "TREE_DIFFERS_FROM_ORIGIN_MAIN"
    git -C "$worktree" diff --stat origin/main HEAD
fi

if [ "$skip_tests" -eq 0 ]; then
    bun_bin=${BUN_BIN:-}
    if [ -z "$bun_bin" ]; then
        bun_bin=$(command -v bun || true)
    fi
    if [ -z "$bun_bin" ] && [ -x /home/ubuntu/.npm/_npx/5c4f1b4a21be27f7/node_modules/bun/bin/bun.exe ]; then
        bun_bin=/home/ubuntu/.npm/_npx/5c4f1b4a21be27f7/node_modules/bun/bin/bun.exe
    fi
    [ -x "$bun_bin" ] || { echo "bun not found" >&2; exit 7; }
    bun_dir=$(mktemp -d "${TMPDIR:-/tmp}/hapi-bun-path.XXXXXX")
    ln -s "$bun_bin" "$bun_dir/bun"
    export PATH="$bun_dir:$PATH"
    (cd "$worktree" && bun install --frozen-lockfile && bun typecheck)
    test_home=$(mktemp -d "${TMPDIR:-/tmp}/hapi-test-home.XXXXXX")
    (cd "$worktree" && env -u HAPI_API_URL -u CLI_API_TOKEN -u HAPI_CLI_EXECUTABLE HAPI_HOME="$test_home" bun run test)
    rm -rf "$test_home"
    test_home=
fi

new_head=$(git -C "$worktree" rev-parse HEAD)
echo "REHEARSAL_OK old=$old_origin_main new=$new_head"
