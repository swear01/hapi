# HAPI maintained release audit

Previous maintained release: v0.25.3.2

Official release: v0.25.3

Personal PR owner: swear01

Origin main: 04b2f052e5b265f215e1f5215c47ee7421ab35a0
Upstream main: 3c3bffdfbddfc6fdc827473197c97668fdc4f89c

## Fork-only commits

- 04b2f052e5b265f215e1f5215c47ee7421ab35a0 maintenance: gate nightly PR selection
- 2ea22f3d07cb8e2ee984547105d2ac441d9f4445 maintenance: exclude Antigravity PR from future releases
- 7dbea6a953f1a10706ae51dc381b4b318f00be79 docs(release): complete v0.25.3.2 comparison notes
- 09d120ab56b8a14f09176ed95fdb751f9f1ee4d0 chore(release): prepare v0.25.3.2
- 52552c94f57884cfd9a43e7b2e05680a39ebb26c fix(web): declare markdown renderer dependency
- f2139ba5b969850573a872707f8732d552088f9b chore(release): prepare v0.25.3.1
- be46ac0d72d34bce8eece14147b925bc268e4c55 fix: resolve v0.25.3 integration regressions
- f1d2d490f59bc87067d52ee6a4990365e5625ef5 fix(web): normalize empty wrapper offsets
- fe89a2d4b76bb07b02dd57435ad77519f7a6b235 fix(web): preserve session title size bounds
- b1599326b21229609ba9ae5885e144b8d0711306 fix(web): truncate session titles safely
- 7551c3217715bce95dda1eaf69d09aa997450328 fix(web): align rich composer DOM offsets
- 7e4f3c79cb99cf17f91a9ac471cae9a800976300 fix(web): hide unsupported AGY model reset
- 047499402c87923bf7eb0b59f988dcd7d8f025f8 fix(agy): discard stale queued question answers
- f98a7a147320742f96c933ca3ef03888b4e04e4d fix(pty): close watchdog run boundaries
- c66fd3f1ed209b1a98c1e724f511bc6a61b78cff carry: upstream PR #1324
- 8e80e43e8719e01289980ac83e1964401e711440 carry: upstream PR #1323
- ad7ce85a0fb35a141b6da7c216c0f9a61fa76180 carry: upstream PR #1322
- c08723a72586be84c023d3a7db65466e23deeff0 carry: upstream PR #1321
- 9da1c9663da6c55254ceca61b29e912b25fc5ed6 carry: upstream PR #1320
- 4b0b50141388d30b8a9d4d40e5fb499f677ce7e6 carry: upstream PR #1319
- 1e45222922295445a7cea5bf4312ec7d997b4953 carry: upstream PR #1318
- 25ce0e1c96d3e0200fad867d1d828484dac93b04 carry: upstream PR #1317
- 673b934dfd5b74c75f0691f67a85f987986eaae7 carry: upstream PR #1316
- 8f3fc4fa3b716753772725e5df21ebdd83373885 carry: upstream PR #1315
- 75167b33f029462dc44584ee18ea5e2addf437a8 fix: integrate retained fork features on v0.25.3
- 9fe50a18f290810024eb290dc3025fc2a815a0fd regenerate: retained fork overlay on v0.25.3

## Open upstream pull requests

- #1329 [CLEAN] Add realtime dictation providers @ 99667bc4a0b276a50dc82ee378ef8e9217320123 (https://github.com/tiann/hapi/pull/1329)
- #1328 [DIRTY] fix(web): improve rich composer IME handling and newline scrolling @ 5c5c13bab70df9da2f9fa094d59f9a5a5191918a (https://github.com/tiann/hapi/pull/1328)
- #1322 [DIRTY] feat(web): preview composer image attachments @ 5e2f0e9c491b74de1729405c5afdc5c128057c20 (https://github.com/tiann/hapi/pull/1322)
- #1320 [DIRTY] feat(agy): add Antigravity as an interactive PTY agent @ d770bff310861a62776cfc6a8c6827e3420bd3f4 (https://github.com/tiann/hapi/pull/1320)
- #1318 [CLEAN] feat(hub,web): support custom Claude models via settings.json @ d1d5295b64ed1d10a8db1c4e39990d243cadaa8d (https://github.com/tiann/hapi/pull/1318)
- #1317 [CLEAN] fix(web): hide the voice button when no voice backend is configured @ 9f209a8e630d6607c067b7c43fceb67c1fae9dac (https://github.com/tiann/hapi/pull/1317)
- #1316 [CLEAN] fix(web): re-subscribe push subscriptions when VAPID keys change @ cb6dbc049e18327b78beb43d50e8ba0a708f78c4 (https://github.com/tiann/hapi/pull/1316)
- #1309 [CLEAN] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1306 [DIRTY] fix(web): sync share metadata and active-turn availability @ 32a81620d2193270624676e21fb8818a5f429933 (https://github.com/tiann/hapi/pull/1306)
- #1300 [DIRTY] feat(opencode): open a fresh session on clear @ 91b0b4d92a343ad6121ea08f31fe30920ab9bb57 (https://github.com/tiann/hapi/pull/1300)
- #1274 [DIRTY] feat(web): FUE + composer hint for session @-mentions @ 46df5307c8772aa8d8db3115c6e426a34096e3ad (https://github.com/tiann/hapi/pull/1274)
- #1257 [CLEAN] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1245 [DIRTY] feat(cli): add GitHub Copilot CLI agent support via ACP @ a9cebd2868eca19cf6eec241875b1d80b71e5a49 (https://github.com/tiann/hapi/pull/1245)
- #1242 [CLEAN] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1227 [DIRTY] fix(web): migrate chat-path attachments on scratchlist park @ 0abd4d916ec67daad433ea625691320a00dae887 (https://github.com/tiann/hapi/pull/1227)
- #1212 [DIRTY] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ a524dcbe734dd1c00938e7670c655c1edad0da33 (https://github.com/tiann/hapi/pull/1193)
- #1189 [CLEAN] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [DIRTY] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [draft] feat(session): opt-in GitHub PR awareness + explicit attach @ 0fceb44a4a20b2dc49ab8b810b08c2b7b8b6d86a (https://github.com/tiann/hapi/pull/1163)
- #1158 [DIRTY] fix(web): unify session header display labels @ 7a498c8ea94c5bb6940e742ba1b6740de1c70f3d (https://github.com/tiann/hapi/pull/1158)
- #1157 [DIRTY] feat(web): add configurable tool grouping mode @ 5366c6abbdf84e84397d97ca171e9d636b087b33 (https://github.com/tiann/hapi/pull/1157)
- #1147 [CLEAN] fix: resolveCodexImportMachineId fails with multiple online machines @ 52338ba5c318427d19f966090d900bb447953a66 (https://github.com/tiann/hapi/pull/1147)
- #1126 [DIRTY] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1115 [DIRTY] feat(web): support persistent pinned sessions @ f5a519d0963a4212f4fb678838e803c747653935 (https://github.com/tiann/hapi/pull/1115)
- #1108 [DIRTY] feat(hub,cli,web): fleet runner version governance (skew, self-upgrade, soft-fail reopen) @ 35076b6bd6a41b16ce0e0317d7f082ffa4b050dc (https://github.com/tiann/hapi/pull/1108)
- #1099 [DIRTY] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [DIRTY] feat(web): add assistant response navigation @ e0a3924f22b66a0dc10a314fb6c5e0ea95414e67 (https://github.com/tiann/hapi/pull/1093)
- #1092 [DIRTY] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [DIRTY] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1087 [CLEAN] fix(acp/runner): Cursor worktree banner + skip nested --worktree hang @ 455371ca714340e2d357d61e8406f548592e8346 (https://github.com/tiann/hapi/pull/1087)
- #1059 [DIRTY] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [UNSTABLE] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #997 [CLEAN] fix(codex): recover ready after stale terminal event @ 435dcaad7919e394cafaacdad3c369781aaaa274 (https://github.com/tiann/hapi/pull/997)
- #987 [DIRTY] feat(cursor): detect inline model errors, surface + notify (#878) @ 4d401093ae17cd2902d58dae35a7ef27db41b49f (https://github.com/tiann/hapi/pull/987)
- #986 [CLEAN] feat(web): searchable session picker on Android share target @ 3f74600d889ccef5e5ea90c8c217c578a2474885 (https://github.com/tiann/hapi/pull/986)
- #975 [DIRTY] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #958 [CLEAN] feat(cli): cross-flavor inline image and video display via MCP and ACP @ 5d6e89e7fcb4374e93e9c9388a98c5993ff1d1c6 (https://github.com/tiann/hapi/pull/958)
- #955 [DIRTY] feat(web): right-click context menu for sidebar project groups (#881) @ ac11c43639db1749fc9782657127d7b80f02b020 (https://github.com/tiann/hapi/pull/955)
- #947 [CLEAN] fix(web+cli): Cursor model picker empty on bare ACP ids + nested variant drill-down @ 57a51d7ff298e284addcdcea27a79e3d4efafdb5 (https://github.com/tiann/hapi/pull/947)
- #945 [DIRTY] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ 8efb6473a23456d2d1af41972c7f8b6d1cfebebc (https://github.com/tiann/hapi/pull/945)
- #942 [DIRTY] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
- #912 [CLEAN] fix(hub): support macOS Codex Desktop restart @ 0c213d9a77c878c459f9a4c4f56e94504d2eb2ab (https://github.com/tiann/hapi/pull/912)
- #906 [DIRTY] feat(web+cli): per-queued-message Steer for Codex and Cursor (mid-turn) @ 97993295fdfa182ed80df9a51785f5b607ac1359 (https://github.com/tiann/hapi/pull/906)
- #897 [CLEAN] perf(hub,web): emit structured patches for session todos/teamState/metadata/agentState writes (closes #895, second half of #884) @ 0e40a983ad1e0aca6ab4041d817b80e8e5af3f25 (https://github.com/tiann/hapi/pull/897)
- #869 [CLEAN] fix(opencode): surface stall errors and clear thinking spinner @ 29e165a7a88ab3a6e34dfd11e3360a140a38cea7 (https://github.com/tiann/hapi/pull/869)
- #847 [DIRTY] Codex usage indicator with cross-flavor budget gauge shape (rebase of #537) @ 981276d5a821825981a7afe39d527491ae4e08b9 (https://github.com/tiann/hapi/pull/847)
- #769 [DIRTY] feat(desktop): add HAPI desktop launcher @ 60c11607ce3bba734f38b6fcf87be07b32298683 (https://github.com/tiann/hapi/pull/769)
- #663 [DIRTY]   feat: support Codex local goal sync and remote approvals @ 5dbf6d406a6bb8507dc07598ba2aecc8cd98ee0f (https://github.com/tiann/hapi/pull/663)
- #658 [CLEAN] fix(cli): preserve permission mode after ExitPlanMode + sidechain UUID chain fix @ f7d8ca3ea0f8ae47245443ce2c0cfec612263e62 (https://github.com/tiann/hapi/pull/658)
- #553 [CLEAN] feat(hub): add WeCom bot push notification channel @ 803dd4c64db2be7056db421539627ca7f0430a19 (https://github.com/tiann/hapi/pull/553)
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
