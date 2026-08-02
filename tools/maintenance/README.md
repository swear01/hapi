# Maintained release tools

Run these commands from an isolated worktree of `swear01/hapi`.

`audit-release.sh` writes a release snapshot containing the previous maintained tag, latest official tag, origin-only commits, and all currently open upstream PRs.

`sync-from-upstream.sh` rebuilds `origin/main` from `upstream/main` and an audited patch manifest. It rehearses by default. `--push` additionally requires `HAPI_SYNC_CONFIRM=RESET_ORIGIN_MAIN_WITH_FORCE_WITH_LEASE`.

Keep one release directory outside the checkout or under `tools/maintenance/releases/<tag>/` with:

```text
manifest.tsv
patches/
audit.md
```

`manifest.tsv` has four tab-separated columns:

```text
patch	state	upstream_ref	source_commits
```

Its states are `carry`, `regenerate`, or `drop`. Every fork-only commit must be represented before a rebuild can proceed.
Use `-` for the source commit of a newly generated release patch that is not replacing an existing fork commit.
