# Maintained release tools

Run these commands from an isolated worktree of `swear01/hapi`.

`audit-release.sh` writes a release snapshot containing the previous maintained tag, latest official tag, origin-only commits, and all currently open upstream PRs. It also creates the PR quality ledger used by the rebuild gate.

`sync-from-upstream.sh` rebuilds `origin/main` from `upstream/main` and an audited patch manifest. It rehearses by default. `--push` additionally requires `HAPI_SYNC_CONFIRM=RESET_ORIGIN_MAIN_WITH_FORCE_WITH_LEASE`.

Keep one release directory outside the checkout or under `tools/maintenance/releases/<tag>/` with:

```text
manifest.tsv
pr-audit.tsv
patches/
audit.md
```

`manifest.tsv` has four tab-separated columns:

```text
patch	state	upstream_ref	source_commits
```

Its states are `carry`, `regenerate`, or `drop`. Every fork-only commit must be represented before a rebuild can proceed.
Use `-` for the source commit of a newly generated release patch that is not replacing an existing fork commit.

PR #1320 (Antigravity) is excluded from future maintained releases. Record `pr-1320` and its follow-up patches as `drop`; `sync-from-upstream.sh` rejects attempts to carry or regenerate that upstream ref. If an official upstream base later contains it, stop for an explicit operator decision instead of silently inheriting or reverting it.

## Nightly PR gate

The target is official merge quality with a shorter waiting period. Aggressive timing does not lower the quality or product-direction bar.

Create the snapshot and ledger immediately before selection:

```bash
tools/maintenance/audit-release.sh \
  --output tools/maintenance/releases/<tag>/audit.md \
  --pr-audit-output tools/maintenance/releases/<tag>/pr-audit.tsv
```

`pr-audit.tsv` columns:

```text
upstream_ref author head_sha decision status maintainer_signal bot_verdict bot_sha scope behavior reason
```

Review every open PR and replace each `review` value:

- `decision`: `carry`, `defer`, or `drop`.
- `status`: only `ready` may pass: not draft, mergeable, and all current checks complete successfully.
- `maintainer_signal`: `clear` only after reading issue comments, PR comments, and reviews. A maintainer request to split, park, reduce scope, preserve intentional behavior, or change direction blocks a normal carry.
- `bot_verdict`: `clean` only when the latest HAPI Bot review explicitly reports no findings. A successful `pr-review` Action only proves the review ran. Record that review's commit as `bot_sha`; it must equal `head_sha`.
- `scope`: `proportional` or an evidenced `exception`. More than 1,000 additions or 20 files requires manual scope mapping. More than 3,000 additions or 40 files normally waits for official maintainer acceptance. A small stated goal with framework, settings, persistence, editor, i18n, or unrelated subsystem changes is `mismatch`, regardless of raw size.
- `behavior`: `preserve` or `accepted-change`. Use the linked issue, reproduction, `git log`/`git blame`, old PR discussion, common-path cost, and maintenance-surface impact. Preference-only changes to behavior that already works are `unjustified-change`.
- `reason`: evidence for an exception, defer, or drop. Map every changed file group to a stated acceptance criterion; generated and lockfile churn does not count as semantic scope.

Personal PRs authored by the owner of `origin` start as `carry` and always bypass the quality gate. The rebuild still verifies their current PR head and prints every failed rule as `PERSONAL_PR_POLICY_EXCEPTION`; include those lines in the final release report. This bypass does not override the permanent PR #1320 exclusion or stale-audit protection.

Rehearse with the completed ledger:

```bash
tools/maintenance/sync-from-upstream.sh \
  --patch-dir tools/maintenance/releases/<tag>/patches \
  --manifest tools/maintenance/releases/<tag>/manifest.tsv \
  --pr-audit tools/maintenance/releases/<tag>/pr-audit.tsv
```

`--push` refuses carried PRs without `--pr-audit`. Immediately before applying patches, the script compares each audited head with GitHub's live `refs/pull/<number>/head`. Keep every PR in its own patch/commit. After rehearsal, run frozen install, full typecheck and tests, inspect the integrated diff, push with the guarded force-with-lease confirmation, tag from `main`, publish and verify all artifacts, then deploy through the Skillshare HAPI fleet workflow.

## Standard release checklist (as executed for v0.27.2.1)

The `sync-from-upstream.sh --push` path is the canonical rebuild; when the merge
is performed by hand in an isolated worktree (conflict resolution + test fixes
cannot be reproduced from raw patches alone), publish the validated state
directly instead:

1. Create the release worktree from the pinned upstream base:

   ```bash
   git worktree add ../hapi-release-v<tag> release/v<tag>
   ```

2. Merge the carried PR patches (`tools/maintenance/releases/<tag>/patches/`),
   resolve conflicts, and DROP any PR rejected by operator decision (record the
   drop in `manifest.tsv` with a comment; do not apply its patch).

3. Prepare the release:
   - `cli/package.json` version → four-part `<upstream>.<n>` (n > 0); keep
     `optionalDependencies` pinned to the three-part upstream version.
   - `shared/src/buildInfo.ts` `APP_VERSION` → same four-part version.
   - `.github/release-notes/v<tag>.md` containing BOTH the literal strings
     `Compared with the previous maintained release` and
     `Compared with the official release` (the workflow greps for them).
   - Run `tools/maintenance/audit-release.sh` to produce `audit.md` +
     `pr-audit.tsv`, then write `manifest.tsv` (patch / state / upstream_ref /
     source_commits; overlay is `regenerate`, carried PRs are `carry` with the
     audited head sha).

4. Validate: `bun install`, `bun typecheck` (cli/web/hub/desktop), then
   `bun run test:shared && bun run test:hub && bun run test:web` and
   `bun run test:cli`. Known environmental caveats:
   - agy carrier tests (`src/agy/utils/*`) read real `/proc` and are
     Linux-CI-only; guard them with `it.skipIf(process.platform !== 'linux')`.
   - `src/runner/runner.integration.test.ts` and a few timing tests flake under
     host load (they pass in isolation); re-run with `--maxWorkers=4`.
   - `src/upgrade/tunwgPin.test.ts` downloads a pinned GitHub asset; pass a
     short `timeoutMs` to `ensurePinnedTunwgBinary` in the test so it never
     exceeds the vitest default.

5. Commit `chore(release): prepare v<tag>` (+ `chore(maintenance): record
   v<tag> release audit and patch manifest`), then update the fork's main and
   tag (tag points at the final main commit, like v0.26.0.2):

   ```bash
   git fetch origin
   git push origin <release-commit>:refs/heads/main --force-with-lease=<current origin/main sha>
   git tag v<tag> <release-commit>
   git push origin v<tag>
   ```

   The `--force-with-lease` replaces the standard script's
   `HAPI_SYNC_CONFIRM=RESET_ORIGIN_MAIN_WITH_FORCE_WITH_LEASE` guard — verify
   the lease sha is the current `origin/main` before pushing.

6. The tag triggers `.github/workflows/release.yml`: it validates the four-part
   tag against `cli/package.json`, verifies the commit is on `main`, requires
   the release notes, builds all single-exe binaries, signs macOS with the local
   `MACOS_SIGNING_P12` identity, builds the desktop apps, and publishes a
   curated GitHub Release (never auto-generated notes; no Homebrew push).

7. After the workflow completes, verify all artifacts on the GitHub Release and
   deploy through the Skillshare HAPI fleet workflow.
