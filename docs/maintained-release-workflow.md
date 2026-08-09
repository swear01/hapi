# Maintained release workflow

This is the release procedure for `swear01/hapi`. It is never pushed to `tiann/hapi`.

## 1. Start an isolated release worktree

```bash
git fetch origin --tags
git fetch upstream --tags
git worktree add ../hapi-release-<tag> -b release/<tag> origin/main
cd ../hapi-release-<tag>
```

Do not build, tag, or deploy from the normal checkout. Set no runner to Auto-upgrade.

## 2. Audit the exact inputs

```bash
mkdir -p tools/maintenance/releases/<tag>/patches
tools/maintenance/audit-release.sh \
  --repo "$PWD" \
  --output tools/maintenance/releases/<tag>/audit.md
git cherry -v upstream/main origin/main
```

The audit is the release record. It must contain:

- the previous maintained release and latest official release;
- every origin-only commit, classified as retained, upstreamed, replaced, or removed;
- every open upstream PR, classified as `carry`, `defer`, or `drop`, with a reason and reviewed head SHA;
- each carry PR's required targeted test.

Only clean, product-relevant PRs with current successful checks may be carried. Recheck each selected PR immediately before applying it. A merged upstream PR is rebuilt into the new base; never replay its old patch.

## 3. Rebuild and verify

Generate ordered patches and `manifest.tsv` in `tools/maintenance/releases/<tag>/`. The manifest covers every fork-only commit; `carry` and `regenerate` entries name a patch, while `drop` records its retired source commit. Use `-` as the source commit for a newly generated release patch.

```bash
tools/maintenance/sync-from-upstream.sh \
  --repo "$PWD" \
  --patch-dir tools/maintenance/releases/<tag>/patches \
  --manifest tools/maintenance/releases/<tag>/manifest.tsv
```

The rehearsal must report `TREE_MATCHES_ORIGIN_MAIN` when reproducing the current branch, or show only the explicitly reviewed new release diff. Then run the selected targeted checks and:

```bash
bun install --frozen-lockfile
bun typecheck
bun run test
bun run test:e2e
git diff --check
```

Resolve an integration failure by changing the PR decision or regenerating its patch; do not edit production `main` directly.

## 4. Publish the maintained release

Use `v<official-version>.<maintenance-number>`; for official `v0.25.3`, the first maintained build is `v0.25.3.1`.

Before the guarded rewrite, commit the audit, manifest, patches, version bump, and `.github/release-notes/<tag>.md` to the release branch. The release note must link the previous maintained tag and official base.

```bash
HAPI_SYNC_CONFIRM=RESET_ORIGIN_MAIN_WITH_FORCE_WITH_LEASE \
  tools/maintenance/sync-from-upstream.sh \
    --repo "$PWD" \
    --patch-dir tools/maintenance/releases/<tag>/patches \
    --manifest tools/maintenance/releases/<tag>/manifest.tsv \
    --push
git fetch origin
git tag <tag> origin/main
git push origin <tag>
until run_id="$(gh run list --repo swear01/hapi --workflow Release --commit "$(git rev-parse <tag>)" --limit 1 --json databaseId --jq '.[0].databaseId')" && [ -n "$run_id" ]; do sleep 5; done
gh run watch "$run_id" --repo swear01/hapi --exit-status
```

Confirm the Release action created every platform artifact, `checksums.txt`, and the signed macOS artifact before any host changes.

## 5. Deploy the whole fleet only after publication

Before deployment, save a timestamped status report, all non-user-terminated session root PIDs, and the mazu Hub DB backup. Pin the exact published tag; never use `latest`.

```bash
EXPECTED_HAPI_VERSION=<tag-without-v> \
HAPI_GITHUB_REPO=swear01/hapi \
HAPI_INSTALL_REF=<tag> \
HAPI_INSTALL_TMPDIR="$HOME/.cache/hapi-install-tmp" \
bash ~/.agents/skills/hapi/scripts/hapi-ctl.sh update all
```

Verify each runner's binary and supervisor, Oracle PM2 `treekill=false`, macOS `AbandonProcessGroup=true`, mazu Hub/Tunnel, public HTTP, all machine records, and every saved session PID. If a regression appears, pin the previous published tag and roll back through the same controller; do not clear sessions.

## 6. Close the release

Append the exact SHAs, PR decisions, test results, Release Actions URL, host verification, and any rollback decision to the release audit. Update the shared `hapi` skill and its canonical gist only when fleet policy or controller behavior changed; do not duplicate per-release details there.
