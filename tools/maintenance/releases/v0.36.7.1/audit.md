# HAPI v0.36.7.1 release audit

- Upstream base is `6f7420aa6ec87878391fa0b4535711ba04e0b0ba`. The official `v0.36.7` tag is `4e36c995d9fb7fa31d966503a038ebd9798d698f`. The two intervening commits add Cursor session import and retain browser-test failure traces.
- Previous fork main is `9ac535a47f58c19afd551299b64a568f70ee9c48`, including the removal of the bundled peer skill after `v0.35.0.1`.
- [pr-audit.tsv](pr-audit.tsv) records the refreshed snapshot of open PRs, including deferred and dropped rows. [manifest.tsv](manifest.tsv) accounts for the previous fork commits and maps each carried PR to its audited head and patch.

## Carry decisions

- Web session header labels (#1158), drag-to-mention (#1418), reasoning collapse (#1592), autocomplete (#1660), generated media (#1666), cancellation of stale file search (#1702), and expanded composer Enter behavior (#1729).
- Packaged inline-media health check (#1920), Hub test settings isolation (#2510), and removal of unavailable model controls from locally driven sessions (#2584).
- The own-PR exception for #1418 is limited to its upstream merge/CI status. The exact head received a clean HAPI Bot review and the fork covers both affected components. #1702 is a scope exception for one cancellable request across browser, hub and runner.
- Open personal PRs #2096 and #2099 remain deferred because findings affect transcript completeness. #2342 remains deferred to avoid using the next official schema number for a private migration. New personal draft #2621 is a cosmetic icon update awaiting review.
- The official base absorbed #1414, #1616, #2346, #2410, #2423 and #2432. Older carries #1615, #1617, #1849, #1921 and #2092 did not pass the current selection. The older fork-specific rewind repair depended on #2092 and was removed with it.

## Fork behavior and distribution

- Keep Skillshare discovery roots and isolated test homes from fork PR #34. The upstream peer commands remain available. The bundled peer skill installer stays removed.
- Keep the Android Codex CAS retry and Unicode paging fixes. The upstream spinner now uses the active action's content color.
- Retain official Antigravity and session-attached jobs inherited from the same official base lineage as `v0.35.0.1`. The original Antigravity patch is excluded from the carry queue.
- The Desktop Launcher originated in closed, unmerged upstream PR #769. Its app packages are removed from this release. Keep the five standalone platform packages, the four-part version, Pages guard, release-from-main checks, and strict Darwin signing with identifier `xyz.hapi.cli`.
- Existing release archives are restored from the pinned fork commit during rehearsal. New patches omit those archives to avoid recursively embedding earlier patch queues.

## Deployment verification

- The isolated migration suite passed 86 cases at the upstream base. A schema-35 WAL database backed up through SQLite migrated to 36 with sample sessions, their namespaces and messages intact. Its schema-35 backup reopened successfully.
- The production Hub needs a fresh verified backup. After rollout, check schema 36, original session IDs, Hub and tunnel health, every runner's running binary, and continued operation of live pre-upgrade agents.
- Local packaging built all five target binaries. Check CI and the bot review on the exact release candidate, then verify published checksums and Darwin signatures before installing.
