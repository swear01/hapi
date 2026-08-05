# HAPI maintained release audit

Previous maintained release: v0.26.0.1

Official release: v0.26.0

Personal PR owner: swear01

Origin main: d8881e7c82eb663e20f168d22591ea1039911af4
Upstream main: 27bc6bade397da811b0fde48534788699d9371c8

## Fork-only commits

- d8881e7c82eb663e20f168d22591ea1039911af4 chore(maintenance): record v0.26.0.1 release audit
- da6d9e0254807f3023f9c26e1d728bb40d16fd1b fix(web): ignore non-left mouseup in useLongPress; harden StorageEvent test
- 9b0e66502e04ede0e63ae7ae05a1f400f0932d99 fix(test): make schema-19 attachments repair fixture realistic
- 67a1a23968743c3383741ab5761b59539845f2db fix(web): complete SessionSummary fixtures for project-group tests
- 9f207c4ee03fd018c34187d6d642912165d35917 chore(release): prepare v0.26.0.1
- c088e3a5c3430dda8a8c0f37606dc42bbf942bee fix(hub): repair missing scratchlist.attachments on polluted schema 15+
- a194c9f489d5ea2129bcded52419cac51e2006ac carry: PR #906 per-queued-message Steer for Codex and Cursor
- 0a7f8e7864ba4f75b99a06b8f747cb3e92ad7bb1 carry: PR #955 project group context menu
- 78793d36546b6a1c0656dafd5ea5cf1e474f9fa8 carry: PR #986 searchable session picker on Android share target
- 3f0a914c456bffff75be0365ff4ca75f0e8b0f03 carry: PR #1359 preserve fallback models for legacy usage events
- 97856bcf5666de95477b1c7feb674b72b46e53dd regenerate: retained maintenance distribution overlay

## Open upstream pull requests

- #1381 [CLEAN] fix(web): avoid React #185 from MessageActions useAuiState object snapshot @ 426fda851e57a084f3e87e5acac5d6efc5a9a60b (https://github.com/tiann/hapi/pull/1381)
- #1379 [CLEAN] fix(pi): keep running state through active RPC turns @ c8fe9c76fa6421c9e8980d858040f8bbe782609f (https://github.com/tiann/hapi/pull/1379)
- #1378 [CLEAN] fix(web): preserve drafts across inactive session resume @ 9f802f8ed9c33df72d031cc80e1b3b93020c6a2f (https://github.com/tiann/hapi/pull/1378)
- #1377 [CLEAN] fix(web): preserve manual scroll during initial settling @ 79ecceb116e0d03f7a523128ef8a68c259f6636b (https://github.com/tiann/hapi/pull/1377)
- #1376 [CLEAN] feat: settings toggle for AGENT_NOTIFY_SUMMARY contract injection @ eb3f9ffd89de87e2cf4cbd4e2f99a05dfb4f7a82 (https://github.com/tiann/hapi/pull/1376)
- #1373 [CLEAN] feat(a2a): steer session citations toward inspect_peer @ 4428dbe38edd71cbf26a7ef413d126cba5cb1803 (https://github.com/tiann/hapi/pull/1373)
- #1372 [CLEAN] feat(cli): MCP list_peers + runner hub auth for peer discovery @ 85f6fffc9f560548977debb73a82dfdc43e3b43f (https://github.com/tiann/hapi/pull/1372)
- #1368 [DIRTY] fix(web): collapse expanded composer after successful send @ c8fad5a9d98744193f2545d4799f9ec7e72be735 (https://github.com/tiann/hapi/pull/1368)
- #1367 [CLEAN] fix(web): keep session date filter directly accessible @ 060c5601b514d231aae5bff42d158dbd3401d50c (https://github.com/tiann/hapi/pull/1367)
- #1365 [CLEAN] feat(pi): import and reconcile local sessions @ 7f13fb18618d6320e6ac5b8efa12dead98c915b1 (https://github.com/tiann/hapi/pull/1365)
- #1361 [UNSTABLE] Fix/codex sync idle active @ 34f20d7473bedd43211bd2aa008816869b7a62a9 (https://github.com/tiann/hapi/pull/1361)
- #1360 [CLEAN] feat: add notification preferences and customizable web push copy @ 0d3eabeaeec762b601f9eb1ee1cc11321b44bef0 (https://github.com/tiann/hapi/pull/1360)
- #1359 [CLEAN] fix: preserve fallback models for legacy usage events @ 6577917c6ba42ef8498af7b777366be23e2814ca (https://github.com/tiann/hapi/pull/1359)
- #1358 [CLEAN] fix(web): prevent near-bottom chat scroll jump @ 9cc4fd599141d8a5c8e16eca3a29dc62a0bcd36b (https://github.com/tiann/hapi/pull/1358)
- #1354 [CLEAN] fix(web): close composer settings on outside click @ 4bc88bdf0ff1521f0096d263da59ab1e001a62b6 (https://github.com/tiann/hapi/pull/1354)
- #1351 [DIRTY] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1318 [CLEAN] feat(hub,web): support custom Claude models via settings.json @ 55746075e4240319a662014d9e8bed3eba589859 (https://github.com/tiann/hapi/pull/1318)
- #1309 [draft] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [CLEAN] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [DIRTY] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [DIRTY] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ dba0000a572fff4ed85550681d795fd009bd6a75 (https://github.com/tiann/hapi/pull/1193)
- #1189 [DIRTY] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [DIRTY] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [draft] feat(session): opt-in GitHub PR awareness + explicit attach @ 1041274a52ef9969177bfe85379ab6ca33871d50 (https://github.com/tiann/hapi/pull/1163)
- #1158 [UNSTABLE] fix(web): unify session header display labels @ c8e679b1bdcae4915bfa10a6eb48258b90ef46a5 (https://github.com/tiann/hapi/pull/1158)
- #1157 [DIRTY] feat(web): add configurable tool grouping mode @ a92cff49b39f2091d2c4a588ea94aef4855056ec (https://github.com/tiann/hapi/pull/1157)
- #1126 [DIRTY] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1115 [CLEAN] feat(web): support persistent pinned sessions @ 41a0afa43e093af68a892ef491eef1b0b5869798 (https://github.com/tiann/hapi/pull/1115)
- #1108 [CLEAN] feat(hub,cli,web): fleet runner version governance (skew, self-upgrade, soft-fail reopen) @ 4af8ecaa111175cdb01dd68f37ddc10a46a8df74 (https://github.com/tiann/hapi/pull/1108)
- #1099 [DIRTY] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [DIRTY] feat(web): add assistant response navigation @ e0a3924f22b66a0dc10a314fb6c5e0ea95414e67 (https://github.com/tiann/hapi/pull/1093)
- #1092 [DIRTY] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [DIRTY] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [DIRTY] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [UNSTABLE] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [CLEAN] feat(cursor): detect inline model errors, surface + notify (#878) @ f8c46d9744f64970c0e772fbbf21363bf630e693 (https://github.com/tiann/hapi/pull/987)
- #986 [CLEAN] feat(web): searchable session picker on Android share target @ 01f7847e9ac0406cd11c002ec61e8d17de336639 (https://github.com/tiann/hapi/pull/986)
- #975 [DIRTY] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #958 [CLEAN] feat(cli): cross-flavor inline image and video display via MCP and ACP @ 71ac698f24d12eddda5045b503c1067e4298793f (https://github.com/tiann/hapi/pull/958)
- #955 [DIRTY] feat(web): right-click context menu for sidebar project groups (#881) @ cd37fc60386cd61f342af8f603cbfb534c478883 (https://github.com/tiann/hapi/pull/955)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ 1728f4f6cdd03fef124e7e5601eb1938d89ad5e3 (https://github.com/tiann/hapi/pull/945)
- #942 [DIRTY] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
- #906 [DIRTY] feat(web+cli): per-queued-message Steer for Codex and Cursor (mid-turn) @ d652eafdb885d5b2e09ff76461564f3f316b78e1 (https://github.com/tiann/hapi/pull/906)
- #847 [CLEAN] Codex usage indicator with cross-flavor budget gauge shape (rebase of #537) @ 314dd625aeee7cc56578fd485ae8a4af485b6311 (https://github.com/tiann/hapi/pull/847)
- #769 [DIRTY] feat(desktop): add HAPI desktop launcher @ 60c11607ce3bba734f38b6fcf87be07b32298683 (https://github.com/tiann/hapi/pull/769)
- #663 [DIRTY]   feat: support Codex local goal sync and remote approvals @ 5dbf6d406a6bb8507dc07598ba2aecc8cd98ee0f (https://github.com/tiann/hapi/pull/663)
- #658 [CLEAN] fix(cli): preserve permission mode after ExitPlanMode + sidechain UUID chain fix @ f7d8ca3ea0f8ae47245443ce2c0cfec612263e62 (https://github.com/tiann/hapi/pull/658)
- #553 [CLEAN] feat(hub): add WeCom bot push notification channel @ 6e3da463f4fb213afc6a95d3005232e647f39ec6 (https://github.com/tiann/hapi/pull/553)
- #536 [DIRTY] [codex] restore Codex session history @ 1de72788e93c6aae6511a5af8bb05bda631093c0 (https://github.com/tiann/hapi/pull/536)
- #535 [DIRTY] [codex] add Codex session selection support @ abcf3a4bff8b685a70ceeb77008f4f217b43b67c (https://github.com/tiann/hapi/pull/535)
- #518 [draft] feat: import existing sessions and restore Codex runtime UI @ 72cceea333addd3a8b39948b722750056433d39b (https://github.com/tiann/hapi/pull/518)
- #490 [draft] [codex] add mobile attention notifications @ 745acf545461ad7f8c615ebd178f3a15df869fb2 (https://github.com/tiann/hapi/pull/490)
- #484 [DIRTY] feat(web): multi-session grid view, composer status bar, in-chat keyboard shortcuts @ 641a01266de65d4944ec5c609a40c717cd41662a (https://github.com/tiann/hapi/pull/484)
- #394 [DIRTY] feat(claude): sync Claude Code session title to HAPI web UI @ fb5f201ec230e0b7abdc15dcf26483d67a56a1be (https://github.com/tiann/hapi/pull/394)
- #325 [DIRTY] Feishu support @ c12df55ff52d2544ff40f313b702b24dc0732cf8 (https://github.com/tiann/hapi/pull/325)
- #312 [DIRTY] 增加飞书支持 @ 572d489bbd359fe1ca9b4eb96a852804e42e69ac (https://github.com/tiann/hapi/pull/312)

## Required decisions

Record every open PR as carry, defer, or drop with its reviewed SHA before rebuilding.
Normal carries require ready CI/merge state, clear maintainer signal, latest-head HAPI Bot no-findings, proportional or evidenced scope, and preserved or accepted behavior.
Personal PRs authored by swear01 are auto-carry; record and report every failed quality rule after integration.
Hard exclusion: PR #1320 (Antigravity) must be recorded as drop and must not be replayed.

## Selection (v0.26.0.2)

Hotfix rebuild from `upstream/main` @ `27bc6bad` after official `v0.26.0`.

**Carry:** #1381 (React #185), #1359, #986, #955 (personal), #906 (personal)
**Regenerate:** distribution overlay, schema attachments repair, fixtures, mouseup/StorageEvent, release version `0.26.0.2`
**Drop:** pr-1320 (permanent exclusion; tip inheritance already authorized), superseded `origin/main` fork history from `v0.26.0.1`

