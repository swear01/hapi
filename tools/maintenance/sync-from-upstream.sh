#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo="${HAPI_REPO:-$PWD}"
base_dir="$script_dir"
patch_dir="$base_dir/patches"
manifest="$base_dir/manifest.tsv"
skip_tests=0
push=0

while [ "$#" -gt 0 ]; do
    case "$1" in
        --repo) repo=$2; shift 2 ;;
        --patch-dir) patch_dir=$2; shift 2 ;;
        --manifest) manifest=$2; shift 2 ;;
        --skip-tests) skip_tests=1; shift ;;
        --push) push=1; shift ;;
        *) echo "Unknown argument: $1" >&2; exit 2 ;;
    esac
done

if [ "$push" -eq 1 ] && [ "${HAPI_SYNC_CONFIRM:-}" != "RESET_ORIGIN_MAIN_WITH_FORCE_WITH_LEASE" ]; then
    echo "--push requires HAPI_SYNC_CONFIRM=RESET_ORIGIN_MAIN_WITH_FORCE_WITH_LEASE" >&2
    exit 3
fi

git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { echo "Not a git checkout: $repo" >&2; exit 4; }
[ -d "$patch_dir" ] || { echo "Missing patch directory: $patch_dir" >&2; exit 4; }
[ -f "$manifest" ] || { echo "Missing manifest: $manifest" >&2; exit 4; }

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
