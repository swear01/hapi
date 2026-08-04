# HAPI maintained release audit

Previous maintained release: v0.25.3.4

Official release: v0.26.0

Personal PR owner: swear01

Origin main: 9c4cf4e91567bfb8c6be4a50fd497412338a7be2
Upstream main: 807fa72aaa706cb00b80b326fc787378448dc1c0

## Fork-only commits

- 9c4cf4e91567bfb8c6be4a50fd497412338a7be2 fix(hub): repair missing scratchlist.attachments on polluted schema 15/16
- a1481f2ea4aaed0b2634af332c79342043cf7cad chore(maintenance): record v0.25.3.3 release audit
- 17975ced338b822b4f409e1f3ca05191eb8253ba chore(release): prepare v0.25.3.3
- f685bed233e96d255f2a8b2737540c90a7eeef53 fix(test): align integration fixtures with current runtime
- 78d8774aab8bbe01c9811efd2e70588c841926a5 carry: PR #1329 realtime transcription
- 1d1be36cc6b42711f409b24deb8d642730dba77d fix: preserve fork flag after Copilot integration
- cc4b8b088da35f05ca58860d2e633344a1e8891c carry: PR #1245 GitHub Copilot CLI support
- 52939fdf7dd0c823c08aaf7fa730e1348dae66a7 carry: PR #1087 linked worktree runner support
- e0df4659ff6aa478d21378743932b44fa725ca4f carry: PR #997 guard Codex terminal events
- df5403ecc43b692cc18b4e253a464c899200df94 carry: PR #986 share existing session
- cd6a2d67b3cf4da9da175f2e0eaf3b69285f4d0a carry: PR #955 project group actions
- 614e47de8c23f790b97ba39852f7959421c19268 carry: upstream PR #947
- ff7196b010f70abe9413328b16233ed64348d2a7 carry: upstream PR #912
- 89e82cfe8a7215e231e469666c325a968d320be6 carry: upstream PR #906
- 051c5f1236a4edc4d41c81a9c0819ace8f1dc2b6 carry: upstream PR #897
- f2cbb433de94c878f85b4f3fd651848c6311d6da carry: upstream PR #869
- dc183b482a0b5f9469eb6b5dca55a9237f2825cf regenerate: retained maintenance distribution overlay

## Open upstream pull requests

- #1361 [UNSTABLE] Fix/codex sync idle active @ 34f20d7473bedd43211bd2aa008816869b7a62a9 (https://github.com/tiann/hapi/pull/1361)
- #1360 [CLEAN] feat: add notification preferences and customizable web push copy @ 209a013c39a871e84c0ae3718823147aaea208a1 (https://github.com/tiann/hapi/pull/1360)
- #1359 [CLEAN] fix: preserve fallback models for legacy usage events @ 64beb62c7d458667c4e02b00d93ef32c7f8dc081 (https://github.com/tiann/hapi/pull/1359)
- #1358 [UNSTABLE] fix(web): prevent near-bottom chat scroll jump @ 587aba434ad5625a202994da16c6cba79e963f6e (https://github.com/tiann/hapi/pull/1358)
- #1354 [UNKNOWN] fix(web): close composer settings on outside click @ 95efa58a35c2d0fa87e86c04cbc4f3ecefae4638 (https://github.com/tiann/hapi/pull/1354)
- #1351 [UNKNOWN] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1318 [DIRTY] feat(hub,web): support custom Claude models via settings.json @ 4ee27b57013a6b4d107beac0e2020d1d8b2b956f (https://github.com/tiann/hapi/pull/1318)
- #1309 [UNKNOWN] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [CLEAN] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [DIRTY] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [DIRTY] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ cd4044f8889f5ac28bea037c157c89ff32ececd8 (https://github.com/tiann/hapi/pull/1193)
- #1189 [UNKNOWN] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [UNKNOWN] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [draft] feat(session): opt-in GitHub PR awareness + explicit attach @ 63eb1d7cd51db767973cfe3df347d0d3a4033054 (https://github.com/tiann/hapi/pull/1163)
- #1158 [UNSTABLE] fix(web): unify session header display labels @ 8148ce403c935571e1fca55ab787886fac8b60cf (https://github.com/tiann/hapi/pull/1158)
- #1157 [UNKNOWN] feat(web): add configurable tool grouping mode @ a92cff49b39f2091d2c4a588ea94aef4855056ec (https://github.com/tiann/hapi/pull/1157)
- #1126 [UNKNOWN] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1115 [UNSTABLE] feat(web): support persistent pinned sessions @ fdfa4e7f0a5d6b4bc4e5adc287af316a66068fe0 (https://github.com/tiann/hapi/pull/1115)
- #1108 [CLEAN] feat(hub,cli,web): fleet runner version governance (skew, self-upgrade, soft-fail reopen) @ f0180a8abc97b4b646081512cb91e7352bbb91a9 (https://github.com/tiann/hapi/pull/1108)
- #1099 [UNKNOWN] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [UNKNOWN] feat(web): add assistant response navigation @ e0a3924f22b66a0dc10a314fb6c5e0ea95414e67 (https://github.com/tiann/hapi/pull/1093)
- #1092 [UNKNOWN] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [UNKNOWN] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [UNKNOWN] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [UNKNOWN] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [CLEAN] feat(cursor): detect inline model errors, surface + notify (#878) @ bbfb6f784eeffe868e006184e21ba931edbb93d9 (https://github.com/tiann/hapi/pull/987)
- #986 [CLEAN] feat(web): searchable session picker on Android share target @ b8bb352008004ee1c4bb3fab26966a46c7b30622 (https://github.com/tiann/hapi/pull/986)
- #975 [DIRTY] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #958 [CLEAN] feat(cli): cross-flavor inline image and video display via MCP and ACP @ 71ac698f24d12eddda5045b503c1067e4298793f (https://github.com/tiann/hapi/pull/958)
- #955 [UNKNOWN] feat(web): right-click context menu for sidebar project groups (#881) @ cd37fc60386cd61f342af8f603cbfb534c478883 (https://github.com/tiann/hapi/pull/955)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ f11dc6ed14a74880d0a9c96917121bfce7ddadf5 (https://github.com/tiann/hapi/pull/945)
- #942 [UNKNOWN] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
- #906 [UNKNOWN] feat(web+cli): per-queued-message Steer for Codex and Cursor (mid-turn) @ d652eafdb885d5b2e09ff76461564f3f316b78e1 (https://github.com/tiann/hapi/pull/906)
- #847 [CLEAN] Codex usage indicator with cross-flavor budget gauge shape (rebase of #537) @ d62bd082eb9d78e800d1e01ad3d6e6f42453f2ac (https://github.com/tiann/hapi/pull/847)
- #769 [UNKNOWN] feat(desktop): add HAPI desktop launcher @ 60c11607ce3bba734f38b6fcf87be07b32298683 (https://github.com/tiann/hapi/pull/769)
- #663 [UNKNOWN]   feat: support Codex local goal sync and remote approvals @ 5dbf6d406a6bb8507dc07598ba2aecc8cd98ee0f (https://github.com/tiann/hapi/pull/663)
- #658 [CLEAN] fix(cli): preserve permission mode after ExitPlanMode + sidechain UUID chain fix @ f7d8ca3ea0f8ae47245443ce2c0cfec612263e62 (https://github.com/tiann/hapi/pull/658)
- #553 [CLEAN] feat(hub): add WeCom bot push notification channel @ 5fb81622479e028557dccb8f9649312dcf490274 (https://github.com/tiann/hapi/pull/553)
- #536 [DIRTY] [codex] restore Codex session history @ 1de72788e93c6aae6511a5af8bb05bda631093c0 (https://github.com/tiann/hapi/pull/536)
- #535 [UNKNOWN] [codex] add Codex session selection support @ abcf3a4bff8b685a70ceeb77008f4f217b43b67c (https://github.com/tiann/hapi/pull/535)
- #518 [draft] feat: import existing sessions and restore Codex runtime UI @ 72cceea333addd3a8b39948b722750056433d39b (https://github.com/tiann/hapi/pull/518)
- #490 [draft] [codex] add mobile attention notifications @ 745acf545461ad7f8c615ebd178f3a15df869fb2 (https://github.com/tiann/hapi/pull/490)
- #484 [UNKNOWN] feat(web): multi-session grid view, composer status bar, in-chat keyboard shortcuts @ 641a01266de65d4944ec5c609a40c717cd41662a (https://github.com/tiann/hapi/pull/484)
- #394 [UNKNOWN] feat(claude): sync Claude Code session title to HAPI web UI @ fb5f201ec230e0b7abdc15dcf26483d67a56a1be (https://github.com/tiann/hapi/pull/394)
- #325 [UNKNOWN] Feishu support @ c12df55ff52d2544ff40f313b702b24dc0732cf8 (https://github.com/tiann/hapi/pull/325)
- #312 [DIRTY] 增加飞书支持 @ 572d489bbd359fe1ca9b4eb96a852804e42e69ac (https://github.com/tiann/hapi/pull/312)

## Required decisions

Record every open PR as carry, defer, or drop with its reviewed SHA before rebuilding.
Normal carries require ready CI/merge state, clear maintainer signal, latest-head HAPI Bot no-findings, proportional or evidenced scope, and preserved or accepted behavior.
Personal PRs authored by swear01 are auto-carry; record and report every failed quality rule after integration.
Hard exclusion: PR #1320 (Antigravity) must be recorded as drop and must not be replayed as a carry patch.

## Operator decisions for this release

- **PR #1320 inherit authorized (2026-08-04):** `upstream/main` tip `807fa72a` already contains merged Antigravity (`#1320`). Permanent exclusion requires stopping for an explicit operator decision; operator authorized inheriting the official base ("官方包了 那就包吧"). Do **not** replay `#1320` as a carry patch; do **not** attempt to revert it from the upstream tip. Manifest records `drop-pr-1320-exclusion-superseded`.
- **Carry:** `#1359`, `#986`, `#955` (personal), `#906` (personal).
- **Drop:** `#553` (WeCom; maintainer rejected).
- **Defer:** all other open PRs listed above.
