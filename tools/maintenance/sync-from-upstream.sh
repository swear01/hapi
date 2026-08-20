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
skip_tests=0
push=0

while [ "$#" -gt 0 ]; do
    case "$1" in
        --repo) repo=$2; shift 2 ;;
        --patch-dir) patch_dir=$2; shift 2 ;;
        --manifest) manifest=$2; shift 2 ;;
        --pr-audit) pr_audit=$2; shift 2 ;;
        --personal-pr-owner) personal_pr_owner=$2; shift 2 ;;
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

if [ "$push" -eq 1 ] && [ "${HAPI_SYNC_CONFIRM:-}" != "RESET_ORIGIN_MAIN_WITH_FORCE_WITH_LEASE" ]; then
    echo "--push requires HAPI_SYNC_CONFIRM=RESET_ORIGIN_MAIN_WITH_FORCE_WITH_LEASE" >&2
    exit 3
fi

git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { echo "Not a git checkout: $repo" >&2; exit 4; }
[ -d "$patch_dir" ] || { echo "Missing patch directory: $patch_dir" >&2; exit 4; }
[ -f "$manifest" ] || { echo "Missing manifest: $manifest" >&2; exit 4; }
[ -z "$pr_audit" ] || [ -f "$pr_audit" ] || { echo "Missing PR audit: $pr_audit" >&2; exit 4; }

if [ -z "$personal_pr_owner" ]; then
    origin_url="$(git -C "$repo" remote get-url origin)"
    personal_pr_owner="$(printf '%s\n' "$origin_url" | sed -nE 's#^(git@github\.com:|https://github\.com/)([^/]+)/.*#\2#p')"
fi

git -C "$repo" fetch origin +main:refs/remotes/origin/main
git -C "$repo" fetch upstream +main:refs/remotes/upstream/main
old_origin_main=$(git -C "$repo" rev-parse origin/main)

allowed_file=$(mktemp)
required_file=$(mktemp)
actual_file=$(mktemp)
worktree=$(mktemp -d /tmp/hapi-upstream-rebuild.XXXXXX)
cleanup() {
    git -C "$repo" worktree remove --force "$worktree" >/dev/null 2>&1 || true
    rm -f "$allowed_file" "$required_file" "$actual_file"
    rm -rf "$worktree"
}
trap cleanup EXIT

while IFS=$'\t' read -r patch state upstream_ref source_commits; do
    [ -n "${patch:-}" ] || continue
    case "$patch" in \#*) continue ;; esac
    case "$state" in
        carry|regenerate)
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
with open(manifest_path) as handle:
    for line in handle:
        if not line.strip() or line.startswith("#"):
            continue
        _, state, ref, _ = line.rstrip("\n").split("\t")
        if state != "carry" or not ref.startswith("pr-"):
            continue
        row = rows.get(ref)
        if row is None:
            print("MISSING_PR_AUDIT: " + ref, file=sys.stderr)
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

if failed:
    sys.exit(6)
PY

    pr_refs=()
    while IFS=$'\t' read -r patch state upstream_ref source_commits; do
        [ "$state" = "carry" ] || continue
        case "$upstream_ref" in
            pr-*) pr_refs+=("refs/pull/${upstream_ref#pr-}/head") ;;
        esac
    done < "$manifest"
    if [ "${#pr_refs[@]}" -gt 0 ]; then
        live_pr_heads="$(git -C "$repo" ls-remote upstream "${pr_refs[@]}")"
        while IFS=$'\t' read -r patch state upstream_ref source_commits; do
            [ "$state" = "carry" ] || continue
            case "$upstream_ref" in pr-*) ;; *) continue ;; esac
            remote_ref="refs/pull/${upstream_ref#pr-}/head"
            live_head="$(printf '%s\n' "$live_pr_heads" | awk -v ref="$remote_ref" '$2 == ref { print $1 }')"
            audited_head="$(awk -F $'\t' -v ref="$upstream_ref" 'NR > 1 && $1 == ref { print $3 }' "$pr_audit")"
            [ -n "$live_head" ] || { echo "PR_HEAD_NOT_FOUND: $upstream_ref" >&2; exit 6; }
            [ "$live_head" = "$audited_head" ] || {
                echo "PR_AUDIT_HEAD_STALE $upstream_ref: audited=$audited_head live=$live_head" >&2
                exit 6
            }
        done < "$manifest"
    fi
elif [ "$push" -eq 1 ] && grep -Eq $'^[^#][^\t]*\tcarry\tpr-[0-9]+\t' "$manifest"; then
    echo "--push requires --pr-audit for carried pull requests" >&2
    exit 6
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

git -C "$repo" worktree add --detach "$worktree" upstream/main >/dev/null
git -C "$worktree" config user.name "swear01"
git -C "$worktree" config user.email "stanley.yellow1@gmail.com"

while IFS=$'\t' read -r patch state upstream_ref source_commits; do
    [ -n "${patch:-}" ] || continue
    case "$patch" in \#*) continue ;; esac
    case "$state" in
        carry|regenerate)
            [ -f "$patch_dir/$patch" ] || { echo "Missing patch: $patch" >&2; exit 6; }
            git -C "$worktree" am "$patch_dir/$patch" >/dev/null
            ;;
        drop) ;;
        *) echo "Invalid manifest state for $patch: $state" >&2; exit 6 ;;
    esac
done < "$manifest"

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
    bun_dir=$(mktemp -d /tmp/hapi-bun-path.XXXXXX)
    ln -s "$bun_bin" "$bun_dir/bun"
    export PATH="$bun_dir:$PATH"
    trap 'rm -rf "$bun_dir"; cleanup' EXIT
    (cd "$worktree" && bun install --frozen-lockfile && bun typecheck)
    test_home=$(mktemp -d /tmp/hapi-test-home.XXXXXX)
    (cd "$worktree" && env -u HAPI_API_URL -u CLI_API_TOKEN -u HAPI_CLI_EXECUTABLE HAPI_HOME="$test_home" bun run test)
    rm -rf "$test_home"
fi

new_head=$(git -C "$worktree" rev-parse HEAD)
echo "REHEARSAL_OK old=$old_origin_main new=$new_head"

if [ "$push" -eq 1 ]; then
    git -C "$worktree" push --force-with-lease="main:$old_origin_main" origin HEAD:main
    echo "PUSH_OK main=$new_head"
fi
