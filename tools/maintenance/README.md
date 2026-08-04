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
