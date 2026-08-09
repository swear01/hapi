# HAPI maintained release audit

Previous maintained release: v0.26.0.2

Official release: v0.27.2

Personal PR owner: swear01

Origin main: 8df83539765911cfc897926228de1097da8958a9
Upstream main: 06e2507ad8dd65d8a954d7cf6b4e0432606bee11

## Fork-only commits

- 8df83539765911cfc897926228de1097da8958a9 docs(release): complete v0.26.0.2 comparison notes
- 7cd3e64f2eea6afee9df1292916c731a4514872a chore(maintenance): record v0.26.0.2 release audit
- 987f3c26daa2707d52e2942be39441456c9a5bd3 chore(release): prepare v0.26.0.2
- 03d5921c91d36da41d3ec830931bcdac6a668d92 fix(web): ignore non-left mouseup in useLongPress; harden StorageEvent test
- 78f14ab6b18fccda2e6993032b21691b3df47264 fix(test): make schema-19 attachments repair fixture realistic
- 0a37905644b7233eddfe2112c18d0563c9cb7e21 fix(web): complete SessionSummary fixtures for project-group tests
- 95e55f2f3943d548c04c3209f20b63e3f5b40e7f fix(web): avoid React #185 from MessageActions useAuiState object snapshot
- 20336ffde4e2c2c841b7e0e7465ddb8537530b4c fix(hub): repair missing scratchlist.attachments on polluted schema 15+
- 490b40562d6a4af7d58a17f9bac76ade0595eab2 carry: PR #906 per-queued-message Steer for Codex and Cursor
- b36c0d19d418339a94f4efa1b7a71a270172515a carry: PR #955 project group context menu
- 9b41c10a5affafe9c15ee24416f48e47e3df6752 carry: PR #986 searchable session picker on Android share target
- 900862d665211903d6681a09a4ca1c8a43444373 carry: PR #1359 preserve fallback models for legacy usage events
- a7dee85ebefb81cd719334b92b04215a59ea6602 regenerate: retained maintenance distribution overlay

## Open upstream pull requests

- #1467 [draft] feat(a2a): P3 AGENT_NOTIFY_SUMMARY → work-graph status ingest @ 0268a30992aea2f59bd6eaa0050ddcf642b15ded (https://github.com/tiann/hapi/pull/1467)
- #1463 [CLEAN] fix(cli): skip invalid set_mode for interactive Copilot sessions @ 4dea0e1b1579a3141f33cb3f3ef18a9b29516772 (https://github.com/tiann/hapi/pull/1463)
- #1462 [UNSTABLE] feat(web): render AGENT_NOTIFY_SUMMARY as compact metadata @ e84f8a4ff6b49891f72012a72ccfbb1f2f46594a (https://github.com/tiann/hapi/pull/1462)
- #1456 [CLEAN] fix(agy): preserve PTY running status @ 0e402dd0830766b22344387dc614989e721cfe31 (https://github.com/tiann/hapi/pull/1456)
- #1455 [CLEAN] Fix dictation locale for OpenAI-compatible transcription @ 5938ffe47daf7b27d62a9a694401f773378fe6c3 (https://github.com/tiann/hapi/pull/1455)
- #1454 [CLEAN] fix(pi): sync native session name @ 9794d43f9824573d80c3ad0bc45321ed4105e8ac (https://github.com/tiann/hapi/pull/1454)
- #1451 [UNKNOWN] feat(web): configure Create agent visibility @ 83326d0262fa9250b392570c74f8b82ecf43b9cb (https://github.com/tiann/hapi/pull/1451)
- #1450 [UNKNOWN] fix(web): show file metadata in file preview header @ b1d241e2ac091ab6bf39ab996cd0aa62aacfc05e (https://github.com/tiann/hapi/pull/1450)
- #1449 [UNKNOWN] fix(web): remove trailing ellipses from search placeholders @ 28e2fb7dabf5ad96f75e36fd56fbb9658ee5777f (https://github.com/tiann/hapi/pull/1449)
- #1447 [UNKNOWN] feat(web): add separate option to pin active sessions @ 2d55cfc0c7ce38d4bfcbd65dbde982a4f4698665 (https://github.com/tiann/hapi/pull/1447)
- #1443 [CLEAN] feat: restore mid-turn steer for Codex and Cursor @ b53cea71eaea40d485eb2d6ca5033000e4b86588 (https://github.com/tiann/hapi/pull/1443)
- #1442 [CLEAN] fix(web): keep Pi controls available during message send @ a9a67f1a509368296621a46c2a7bdc4f943e234c (https://github.com/tiann/hapi/pull/1442)
- #1436 [CLEAN] feat(web): persist and send voice input message across session navigation (#1435) @ 7a57fc142d2dd6f19857c79d5c529b82b23063a6 (https://github.com/tiann/hapi/pull/1436)
- #1434 [UNKNOWN] Fix confirmation dialog description alignment @ db83a03fe05d7339f85de410e0059af805054f83 (https://github.com/tiann/hapi/pull/1434)
- #1433 [CLEAN] fix(opencode): surface upstream errors and retries @ 82a999eecf1d4dd1f4f42f0e6098a53333374e12 (https://github.com/tiann/hapi/pull/1433)
- #1430 [CLEAN] fix(cli): remap bracketed Cursor wires onto bare/SKU catalogs @ 2a713471afb4d874fb2eb1870b21a91b2c699e6d (https://github.com/tiann/hapi/pull/1430)
- #1429 [UNKNOWN] feat(claude): import local session history @ e9de7233a009d50b848cfb177b8a6cabd0b4d07f (https://github.com/tiann/hapi/pull/1429)
- #1424 [CLEAN] feat: show progress bar on session for hours-long jobs @ 742f102910e6e4a9073252eaef736042777566a7 (https://github.com/tiann/hapi/pull/1424)
- #1422 [UNKNOWN] fix(web): make long file errors expandable @ b603433bf3e2d371440cfb4fe72ee173a6a2beec (https://github.com/tiann/hapi/pull/1422)
- #1421 [UNKNOWN] feat(web): remember all launch settings options in NewSession preferences @ 3f0cfe6578405338b295e97f0c8a874874076ad0 (https://github.com/tiann/hapi/pull/1421)
- #1420 [UNKNOWN] fix(codex): preserve Plan approval when YOLO is enabled @ 228dcfa2366c3162b7a1dd218b44845467d6ca6c (https://github.com/tiann/hapi/pull/1420)
- #1419 [UNKNOWN] feat(web): add direct send button during active voice session @ adb0ad029640aeae8dd821d62af7ee790ec95b12 (https://github.com/tiann/hapi/pull/1419)
- #1418 [UNKNOWN] feat(web): drag sessions into composer mentions @ 58a84ed53ab9beb12b678882dd2430a1c3a09f98 (https://github.com/tiann/hapi/pull/1418)
- #1415 [UNKNOWN] fix(web): return chat file previews to conversation @ ab18465f807c9643693e825349408b1ce22f21d4 (https://github.com/tiann/hapi/pull/1415)
- #1414 [UNKNOWN] fix(web): hide redundant machine labels on single-machine pinned rows @ e14ebe65d8d88db0543cc8199de74bb30f82f43a (https://github.com/tiann/hapi/pull/1414)
- #1413 [CLEAN] feat(web): native/deep-link ingest for /share (GET url, text, title) @ 54603b788c03a41efbecdfc3649eaf4cb42da90b (https://github.com/tiann/hapi/pull/1413)
- #1411 [UNKNOWN] fix(web): keep shared-image titles in sync with renamed sessions @ 9df8e84d71983e7fb9f3082aeabb5be50541963e (https://github.com/tiann/hapi/pull/1411)
- #1410 [UNKNOWN] fix(web): align and remember Codex-family permission mode @ f892b89f8cbc916fe8af4590f4ce01aa190ad846 (https://github.com/tiann/hapi/pull/1410)
- #1361 [UNKNOWN] Fix/codex sync idle active @ 9ab90d3e4be976a839bfcfe296dfb65487ddeb20 (https://github.com/tiann/hapi/pull/1361)
- #1360 [UNKNOWN] feat: add notification preferences and customizable web push copy @ eebc35af4a7d0474fa82e5c3928bbe4127c55b56 (https://github.com/tiann/hapi/pull/1360)
- #1351 [UNKNOWN] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1309 [draft] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [UNKNOWN] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [UNKNOWN] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [UNKNOWN] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ 999f1d1170d382cc4fd5e5fdf6e0a6ab4a0bf65f (https://github.com/tiann/hapi/pull/1193)
- #1189 [UNKNOWN] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [UNKNOWN] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [draft] feat(session): opt-in GitHub PR awareness + explicit attach @ 4975731f3d24d05c445485c653533ec552dbe171 (https://github.com/tiann/hapi/pull/1163)
- #1158 [UNKNOWN] fix(web): unify session header display labels @ 9323174baee46e85b04a20ac0eba2fdad821befa (https://github.com/tiann/hapi/pull/1158)
- #1157 [draft] feat(web): add configurable tool grouping mode @ b62788b053616a9b2f02b118116a917bec253be9 (https://github.com/tiann/hapi/pull/1157)
- #1126 [UNKNOWN] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1108 [CLEAN] feat(hub,cli,web): fleet runner version governance (skew, self-upgrade, soft-fail reopen) @ 0d9eaf065f0d194f273cfd73bb4fbd1d853fe55e (https://github.com/tiann/hapi/pull/1108)
- #1099 [UNKNOWN] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [UNKNOWN] feat(web): add assistant response navigation @ c94fa5fccd41f5f8113585b0afef737664d5f0c6 (https://github.com/tiann/hapi/pull/1093)
- #1092 [UNKNOWN] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [UNKNOWN] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [UNKNOWN] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [UNKNOWN] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [CLEAN] feat(cursor): detect inline model errors, surface + notify (#878) @ 283ccca04f2bf173f3362d48236d7c8ec6de47e3 (https://github.com/tiann/hapi/pull/987)
- #986 [CLEAN] feat(web): searchable session picker on Android share target @ a989dda1822be4e54893908d4baf7c2afeca19e6 (https://github.com/tiann/hapi/pull/986)
- #975 [UNKNOWN] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #955 [UNKNOWN] feat(web): right-click context menu for sidebar project groups (#881) @ cd37fc60386cd61f342af8f603cbfb534c478883 (https://github.com/tiann/hapi/pull/955)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ db5248429b2797b6cc437f72c135ae66f0963605 (https://github.com/tiann/hapi/pull/945)
- #942 [UNKNOWN] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
- #906 [UNKNOWN] feat(web+cli): per-queued-message Steer for Codex and Cursor (mid-turn) @ d652eafdb885d5b2e09ff76461564f3f316b78e1 (https://github.com/tiann/hapi/pull/906)
- #847 [CLEAN] Codex usage indicator with cross-flavor budget gauge shape (rebase of #537) @ bdcbbe068e93279c9d23aa7aea6c6cd089d73542 (https://github.com/tiann/hapi/pull/847)
- #769 [UNKNOWN] feat(desktop): add HAPI desktop launcher @ 60c11607ce3bba734f38b6fcf87be07b32298683 (https://github.com/tiann/hapi/pull/769)
- #663 [UNKNOWN]   feat: support Codex local goal sync and remote approvals @ 5dbf6d406a6bb8507dc07598ba2aecc8cd98ee0f (https://github.com/tiann/hapi/pull/663)
- #658 [UNKNOWN] fix(cli): preserve permission mode after ExitPlanMode + sidechain UUID chain fix @ f7d8ca3ea0f8ae47245443ce2c0cfec612263e62 (https://github.com/tiann/hapi/pull/658)
- #553 [DIRTY] feat(hub): add WeCom bot push notification channel @ 6e3da463f4fb213afc6a95d3005232e647f39ec6 (https://github.com/tiann/hapi/pull/553)
- #536 [UNKNOWN] [codex] restore Codex session history @ 1de72788e93c6aae6511a5af8bb05bda631093c0 (https://github.com/tiann/hapi/pull/536)
- #535 [UNKNOWN] [codex] add Codex session selection support @ abcf3a4bff8b685a70ceeb77008f4f217b43b67c (https://github.com/tiann/hapi/pull/535)
- #518 [draft] feat: import existing sessions and restore Codex runtime UI @ 72cceea333addd3a8b39948b722750056433d39b (https://github.com/tiann/hapi/pull/518)
- #490 [draft] [codex] add mobile attention notifications @ 745acf545461ad7f8c615ebd178f3a15df869fb2 (https://github.com/tiann/hapi/pull/490)
- #484 [UNKNOWN] feat(web): multi-session grid view, composer status bar, in-chat keyboard shortcuts @ 641a01266de65d4944ec5c609a40c717cd41662a (https://github.com/tiann/hapi/pull/484)
- #394 [UNKNOWN] feat(claude): sync Claude Code session title to HAPI web UI @ fb5f201ec230e0b7abdc15dcf26483d67a56a1be (https://github.com/tiann/hapi/pull/394)
- #325 [UNKNOWN] Feishu support @ c12df55ff52d2544ff40f313b702b24dc0732cf8 (https://github.com/tiann/hapi/pull/325)
- #312 [UNKNOWN] 增加飞书支持 @ 572d489bbd359fe1ca9b4eb96a852804e42e69ac (https://github.com/tiann/hapi/pull/312)

## Required decisions

Record every open PR as carry, defer, or drop with its reviewed SHA before rebuilding.
Normal carries require ready CI/merge state, clear maintainer signal, latest-head HAPI Bot no-findings, proportional or evidenced scope, and preserved or accepted behavior.
Personal PRs authored by swear01 are auto-carry; record and report every failed quality rule after integration.
Hard exclusion: PR #1320 (Antigravity) must be recorded as drop and must not be replayed.
