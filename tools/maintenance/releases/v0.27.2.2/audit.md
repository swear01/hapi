# HAPI maintained release audit

Previous maintained release: v0.27.2.1

Official release: v0.27.2

Personal PR owner: swear01

Origin main: 8ebfe612cde7c02e17d2c49a2fd8ef5d2c6b8d7b
Upstream main: b572c35e349e2061e3465b812d5d6285f0d60859

## Fork-only commits

- 8ebfe612cde7c02e17d2c49a2fd8ef5d2c6b8d7b fix(web): cast NewSession api mock through unknown to satisfy tsc overlap check
- baf5f6288c4908b7205a5dd8c9a4bd7d8994773f fix(desktop): map four-part maintained versions to semver and locate electron-builder template under bun layout
- ebeceee6bd47ee44fcc6a98e7f22fad2ccdbfd1f fix(desktop): accept maintained four-part release versions in sync-release-version
- 591c1eb17e3432831fb6c2b763977d83fa00dacf docs(maintenance): record standard release checklist for v0.27.2.1
- 7a059da4f522999d2cac9e36ae0ebf7774194429 chore(maintenance): record v0.27.2.1 release audit and patch manifest
- d8c4652b67b77cf8bbd1321203947e1692733bd7 chore(release): prepare v0.27.2.1

## Open upstream pull requests

- #1480 [CLEAN] feat(pi): queue mid-turn messages by default; steer only via explicit per-message Steer button @ 69aa1622227e9302155ef669d9f09848540032e8 (https://github.com/tiann/hapi/pull/1480)
- #1477 [CLEAN] feat(web): settings for AGENT_NOTIFY_SUMMARY chat display (default hide) @ ba518f2ec868cefb5f5daf3045af7aa623526d68 (https://github.com/tiann/hapi/pull/1477)
- #1475 [UNKNOWN] feat(web): composer model/effort value buttons and first-class permission (part of #1438) @ 9132211487318215429e9339422ec271f75035f8 (https://github.com/tiann/hapi/pull/1475)
- #1474 [UNKNOWN] feat(voice): curate dictation credential presets to ElevenLabs, OpenAI, Groq @ aaabfb2efb9995b299b0ce0bda4cd242fb51aa1b (https://github.com/tiann/hapi/pull/1474)
- #1473 [CLEAN] feat(peer): attribute ping_peer deliveries with trusted provenance @ 07e775cd69d45e04beccf61c8db8abbf9ca91667 (https://github.com/tiann/hapi/pull/1473)
- #1471 [UNKNOWN] fix(web): keep single tildes literal in markdown @ a74d4ad4e42b36513bf8826c858bbe24d6926ab7 (https://github.com/tiann/hapi/pull/1471)
- #1469 [UNKNOWN] feat: unified agent configuration descriptors (session config consolidation) @ 77f668678a4e27e251136773e5569a024cbbf6dd (https://github.com/tiann/hapi/pull/1469)
- #1468 [UNKNOWN] feat(usage): record ACP cost and surface per-agent reporting availability @ f16fe64c2e86023e1ab40bc530477b7b4d4d5632 (https://github.com/tiann/hapi/pull/1468)
- #1462 [UNSTABLE] feat(web): render AGENT_NOTIFY_SUMMARY as compact metadata @ e84f8a4ff6b49891f72012a72ccfbb1f2f46594a (https://github.com/tiann/hapi/pull/1462)
- #1451 [UNKNOWN] feat(web): configure Create agent visibility @ 2877e73d28921019bfae786a6406cbf38aa1a70d (https://github.com/tiann/hapi/pull/1451)
- #1447 [CLEAN] feat(web): add separate option to pin active sessions @ df3e0e9e78f02ffdd6e4d84395fb26aaa7830d1a (https://github.com/tiann/hapi/pull/1447)
- #1443 [UNSTABLE] feat: restore mid-turn steer for Codex and Cursor @ c0f78cc2a4c10d9cf50b36f269e255e033f11567 (https://github.com/tiann/hapi/pull/1443)
- #1436 [UNKNOWN] feat(web): persist and send voice input message across session navigation (#1435) @ 7a57fc142d2dd6f19857c79d5c529b82b23063a6 (https://github.com/tiann/hapi/pull/1436)
- #1429 [UNSTABLE] feat(claude): import local session history @ 860771570f3c775780040f2ad815ca022677e182 (https://github.com/tiann/hapi/pull/1429)
- #1424 [CLEAN] feat: show progress bar on session for hours-long jobs @ 65eb54481de26da1c1875b3eed006a5b2dfd13e5 (https://github.com/tiann/hapi/pull/1424)
- #1422 [CLEAN] fix(web): make long file errors expandable @ 5ae02d6caed360298761decc20e1f23db6d880da (https://github.com/tiann/hapi/pull/1422)
- #1421 [UNKNOWN] feat(web): remember all launch settings options in NewSession preferences @ 3f0cfe6578405338b295e97f0c8a874874076ad0 (https://github.com/tiann/hapi/pull/1421)
- #1419 [UNKNOWN] feat(web): add direct send button during active voice session @ adb0ad029640aeae8dd821d62af7ee790ec95b12 (https://github.com/tiann/hapi/pull/1419)
- #1418 [UNKNOWN] feat(web): drag sessions into composer mentions @ 58a84ed53ab9beb12b678882dd2430a1c3a09f98 (https://github.com/tiann/hapi/pull/1418)
- #1414 [CLEAN] fix(web): hide redundant machine labels on single-machine pinned rows @ 242beb9e6bd400804aa0057e862e50f94d34bcc2 (https://github.com/tiann/hapi/pull/1414)
- #1413 [CLEAN] feat(web): native/deep-link ingest for /share (GET url, text, title) @ 54603b788c03a41efbecdfc3649eaf4cb42da90b (https://github.com/tiann/hapi/pull/1413)
- #1361 [UNKNOWN] Fix/codex sync idle active @ 9ab90d3e4be976a839bfcfe296dfb65487ddeb20 (https://github.com/tiann/hapi/pull/1361)
- #1360 [CLEAN] feat: add notification preferences and customizable web push copy @ 0eda13503288d2016fc766ae7e7322cd3027f184 (https://github.com/tiann/hapi/pull/1360)
- #1351 [UNKNOWN] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1309 [draft] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [UNKNOWN] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [UNKNOWN] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [UNKNOWN] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ 999f1d1170d382cc4fd5e5fdf6e0a6ab4a0bf65f (https://github.com/tiann/hapi/pull/1193)
- #1189 [UNKNOWN] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [UNKNOWN] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [draft] feat(session): opt-in GitHub PR awareness + explicit attach @ 4975731f3d24d05c445485c653533ec552dbe171 (https://github.com/tiann/hapi/pull/1163)
- #1158 [CLEAN] fix(web): unify session header display labels @ 9ea45c1497bb1a15b796ee23fd4059dcb3e7b2c2 (https://github.com/tiann/hapi/pull/1158)
- #1157 [draft] feat(web): add configurable tool grouping mode @ b62788b053616a9b2f02b118116a917bec253be9 (https://github.com/tiann/hapi/pull/1157)
- #1126 [UNKNOWN] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1108 [CLEAN] feat(hub,cli,web): fleet runner version governance (skew, self-upgrade, soft-fail reopen) @ 01c30eccd3cc960f2bfea9968a2060846a852566 (https://github.com/tiann/hapi/pull/1108)
- #1099 [UNKNOWN] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [CLEAN] feat(web): add assistant response navigation @ c94fa5fccd41f5f8113585b0afef737664d5f0c6 (https://github.com/tiann/hapi/pull/1093)
- #1092 [UNKNOWN] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [UNKNOWN] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [UNKNOWN] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [UNKNOWN] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [CLEAN] feat(cursor): detect inline model errors, surface, notify, and bridge (#878) @ 2c0362f4f20c127faab55e6a53d29dc0acad67f6 (https://github.com/tiann/hapi/pull/987)
- #986 [CLEAN] feat(web): searchable session picker on Android share target @ a989dda1822be4e54893908d4baf7c2afeca19e6 (https://github.com/tiann/hapi/pull/986)
- #975 [UNKNOWN] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #955 [UNKNOWN] feat(web): right-click context menu for sidebar project groups (#881) @ cd37fc60386cd61f342af8f603cbfb534c478883 (https://github.com/tiann/hapi/pull/955)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ db5248429b2797b6cc437f72c135ae66f0963605 (https://github.com/tiann/hapi/pull/945)
- #942 [UNKNOWN] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
- #906 [UNKNOWN] feat(web+cli): per-queued-message Steer for Codex and Cursor (mid-turn) @ d652eafdb885d5b2e09ff76461564f3f316b78e1 (https://github.com/tiann/hapi/pull/906)
- #847 [CLEAN] Codex usage indicator with cross-flavor budget gauge shape (rebase of #537) @ 9a83fc8f08974f24c880b547b726f45ac231b2f2 (https://github.com/tiann/hapi/pull/847)
- #769 [UNKNOWN] feat(desktop): add HAPI desktop launcher @ 60c11607ce3bba734f38b6fcf87be07b32298683 (https://github.com/tiann/hapi/pull/769)
- #663 [UNKNOWN]   feat: support Codex local goal sync and remote approvals @ 5dbf6d406a6bb8507dc07598ba2aecc8cd98ee0f (https://github.com/tiann/hapi/pull/663)
- #658 [UNKNOWN] fix(cli): preserve permission mode after ExitPlanMode + sidechain UUID chain fix @ f7d8ca3ea0f8ae47245443ce2c0cfec612263e62 (https://github.com/tiann/hapi/pull/658)
- #553 [UNKNOWN] feat(hub): add WeCom bot push notification channel @ 6e3da463f4fb213afc6a95d3005232e647f39ec6 (https://github.com/tiann/hapi/pull/553)
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
