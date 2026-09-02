# Engineering notes

- ACP session config caches separate `mode` and `thought_level` domains. Only reconcile the thought-level cache when the requested value is advertised by that thought-level option; Copilot agent modes such as `plan` must not overwrite effort state.
- Copilot and Kimi ACP effort handlers register after session initialization. Web discovery must tolerate transient `handler-not-registered` responses until the remote session is ready.
- Maintenance manifest `source_commits` may identify resolved fork commits rather than upstream PR heads. For refreshes, map commits with `git range-diff` and apply only the PR's non-merge commits; a direct tree diff can replay unrelated upstream merges.
- Resolved carry snapshots are semantic integration records, not substitutes for live PR-head validation. Record the audited head in `pr-audit.tsv`/`manifest.tsv`, then validate it again during rehearsal.
- `shared` has no standalone typecheck script. Use root `bun typecheck`; running `bunx tsc` inside `shared` typechecks unintended test shapes and can rewrite the workspace lockfile.
- Run CLI unit and integration suites serially. Both use `/tmp/hapi-test-config.json`; concurrent runs can remove each other's isolated hub config and make otherwise valid unit files fail during setup.
