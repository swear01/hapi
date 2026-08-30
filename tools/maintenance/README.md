# Maintained release tools

Use these tools from an isolated worktree under `~/.agent-worktrees/`.
Maintained releases are upstream-first rebuilds: start at a pinned
`upstream/main`, then apply only audited fork patches. The previous maintained
release is a behavior reference, never the new branch base.

## Release record

Create one directory for the new tag:

```text
tools/maintenance/releases/<tag>/
├── audit.md
├── manifest.tsv
├── pr-audit.tsv
└── patches/
```

Do not copy old release queues into a new rebuild. Regenerate patches from the
resolved integration so rehearsal reproduces the reviewed tree.

## Audit

Generate a fresh snapshot immediately before selection:

```bash
tools/maintenance/audit-release.sh \
  --output tools/maintenance/releases/<tag>/audit.md \
  --pr-audit-output tools/maintenance/releases/<tag>/pr-audit.tsv
```

The script fetches branches without tags and reads maintained tags through an
origin-specific ref namespace. A fork tag therefore cannot overwrite a same-name
upstream or local tag.

`pr-audit.tsv` has eleven tab-separated columns:

```text
upstream_ref author head_sha decision status maintainer_signal bot_verdict bot_sha scope behavior reason
```

Record every open pull request. A normal carry requires:

- `decision=carry`
- `status=ready`
- `maintainer_signal=clear`
- `bot_verdict=clean` at `bot_sha=head_sha`
- `scope=proportional`, or `scope=exception` with evidence
- `behavior=preserve` or `behavior=accepted-change`

Personal pull requests authored by the owner of `origin` start as carries. The
release report must still list every quality-gate exception. Officially merged
behavior is `upstreamed` context and must not be replayed.

## Manifest

`manifest.tsv` has no header. Each non-comment line is:

```text
patch<TAB>state<TAB>upstream_ref<TAB>source_commits
```

States:

- `carry`: audited pull-request patch
- `integrated`: audited pull request already represented by the resolved baseline,
  a coalesced carry, or authoritative upstream behavior; no duplicate patch
- `regenerate`: resolved fork or release patch
- `drop`: historical source commit intentionally omitted

`carry` and `regenerate` rows require a real `git am` patch. Source commits are
comma-separated full SHAs. `carry` and `integrated` rows record the audited PR
head, which need not exist in the old fork. Every audit `decision=carry` must
have one of those mappings. Regenerate rows account for old fork commits and
must cover the previous `origin/main` delta. Use `-` only when a generated patch
has no prior fork commit to account for. Header pins (`upstream_sha`,
`previous_origin_main`, and canonical `expected_source_tree`) are enforced;
the canonical tree excludes that release's record directory to avoid a
self-referential hash. Root `.gitattributes` disables
whitespace diagnostics for `*.patch` artifacts because unified-diff context
markers are significant; source files remain checked.

## Rehearsal

Pin the audited upstream SHA. The command fails if the remote branch moved:

```bash
HAPI_UPSTREAM_SHA=<full-upstream-sha> \
tools/maintenance/sync-from-upstream.sh \
  --patch-dir tools/maintenance/releases/<tag>/patches \
  --manifest tools/maintenance/releases/<tag>/manifest.tsv \
  --pr-audit tools/maintenance/releases/<tag>/pr-audit.tsv
```

`--upstream-sha <sha>` is equivalent to `HAPI_UPSTREAM_SHA`. Rehearsal
worktrees live under `${HAPI_WORKTREE_ROOT:-~/.agent-worktrees/hapi-maintenance}`.
Clean worktrees are removed normally. A dirty or conflicted rehearsal is retained
and its path is printed for inspection.

The script is rehearsal-only. It never pushes. Publication uses a reviewed exact
SHA after fork CI passes.

## Build and review gate

Use Bun 1.4.0 from the repository root:

```bash
bun install --frozen-lockfile
bun typecheck
bun run test
bun run test:e2e -- terminal-wrap-fidelity.spec.ts composer-copy.spec.ts
bun run test:cli:integration
python3 -m unittest discover -s tools/maintenance/tests -p 'test_*.py'
```

Run fixture and native gates when their inputs change:

```bash
bun run gen:fixtures
git diff --exit-code -- shared/fixtures
(cd android && ./gradlew :core:protocol:test :app:assembleDebug)
```

macOS CI additionally runs the HapiKit tests and simulator build.

Before publication, invoke the shared `pre-push-review` skill and inspect the
full diff against the pinned `upstream/main`.

## Release metadata

For `<tag>`:

- Set `cli/package.json` and `shared/src/buildInfo.ts` to the same four-part
  version. Keep platform optional dependencies on the official three-part
  version.
- Add `.github/release-notes/<tag>.md` containing both literal headings:
  `Compared with the previous maintained release` and
  `Compared with the official release`.
- Keep the release workflow on Bun 1.4.0 with frozen installs.
- Do not tag until the exact reviewed release SHA has passed all fork CI and the
  latest-head review bot.

Open a ready PR against `swear01/hapi:main` for review. After it passes, update
fork `main` with an explicit lease on the previously audited SHA:

```bash
git fetch --no-tags origin main
old_origin_sha=<audited-origin-main-sha>
test "$(git rev-parse origin/main)" = "$old_origin_sha"
git push \
  --force-with-lease="main:$old_origin_sha" \
  origin <reviewed-release-sha>:refs/heads/main
```

Wait for checks on that exact `main` SHA, then create and push the four-part tag.
Verify the curated release assets and `checksums.txt` before deployment.

## Smoke harness

`smoke-runner.sh` uses an isolated `HAPI_HOME` and cleans up its child processes.
Do not run it on a production runner host. Its default listen address is
`127.0.0.1`; use an SSH tunnel for remote access. `SKIP_BUILD=1` skips the web
build only when a separately verified build already exists.
