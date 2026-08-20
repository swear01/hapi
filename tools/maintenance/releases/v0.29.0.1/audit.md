# HAPI maintained release audit

Previous maintained release: v0.27.3.6

Official release: v0.29.0

Personal PR owner: swear01

Origin main: edd71e89c0d252d1e62646c599eed494d7d4495e
Upstream main: 0aebf39c7877d6372e45b3953c282d40d27e7829

## Fork-only commits

- edd71e89c0d252d1e62646c599eed494d7d4495e chore(maintenance): add v0.27.3.6 pr-audit ledger
- ef48961e6c315901b18c63daf20d0fa7a80674dc chore(maintenance): record v0.27.3.6 release audit (audit.md + pr-audit.tsv)
- ee5a185545072709f436c18e34883799aaabafda test(web): align reasoning collapse tests with #1592 preference-off behavior
- 164f1e4f47a50198208ff3b987f7df63917b9819 fix(web): complete reasoning test merge
- 28022c9341babf967f0e6900df776c5bd8333bf0 fix(cli): close merged locale test block
- 4d8142c4979aebe779e40b44a0d71bde43f6d33b chore(release): prepare v0.27.3.6 (version bump, release notes, drop #1093, 4 carries)
- 3e53f4f1510980b7e2938a86065b5087b03e3985 fix(web): restrict select-all takeover to unshifted Ctrl/Cmd+A; wire e2e spec into CI
- d945fce373e963a9e81e547799c6aae693a52d35 fix(web): restore Ctrl+A select-all on the chat page
- 54484e1c2cfc5b9e572c05e58f16179cdc9aefba fix(web): hydrate reasoning preference on cold load
- 86fd7f9d63cf2d7b306cca3df6c38a0d9fb2d307 fix(web): apply reasoning collapse preference to history
- 128a44b9e41f10b4e20259ccadde8116a6905354 fix(agy): read the model list from agy's structured output
- 81666fc4b71d01ea88af62badd1bf8d3dfb82e22 refactor(agy): extract the agy models probe from the fetch flow
- e6033695bb033bb776de26fb2ad796abb808c818 feat(cli): follow conversation language in status prompt
- 546da465e4c29c8d3006c5eb276261a7933eb9cd test: clean up PR #1093 navigation fixtures
- db9a33bf6c3a3a0e9c2ef6d6a61faecd44518c95 revert: drop fork-carried PR #1093 assistant response navigation (operator ruling 2026-08-15)
- 21f172194a41660895240c8600406b4ce7721a06 chore(maintenance): record v0.27.3.5 release audit (audit.md + pr-audit.tsv)
- 69e2be1015865871b0d3fe8fde72f1198ac488b1 chore(release): bump to v0.27.3.5 (overlay copy carried v0.27.3.4 version)
- 056f0c883e394be0a738aa69c7d0d64dd4f17105 fix(hub): rebuild sessionCache from fork overlay + official updateSessionSummary
- 92559f6b0b3f26e939aae8499eebf6cdf4b7bfe6 fix(hub): complete method separations in merged syncEngine
- 213cf50d39f6c789c8f8d73e905d8e452e9c59c6 fix(web): drop duplicate showSessionSummaryInChat per PR #1582
- 128ae975e9aacae62ab3cfdf46054f0f1f3c9aa6 fix(web): complete markdown-a fixture merge
- 08dadaed3efded933d412a4bb62e823ba2cea866 chore(release): prepare v0.27.3.5 (version bump, release notes, UFR merge from upstream 901f17d0c + 3 carries)
- d0cb52b4dd7bc83602555a93f1825b3002b52943 fix(web): remove duplicate showSessionSummaryInChat in markdown-a fixture
- 89bdd1865c89b4b6d5b08f0597d0e6ba70ea84d1 fix(web): map codex-enveloped compact-summary to the chat block
- 56209d03a98b650463232675985190d67e6218e5 fix(web): route send acceptance to resolved session
- 97e6cba03e0c0b15f20bea5fad83ef8c2e913c33 fix(web): isolate retry and remounted edit settlements
- fecfe7d42ca04281c933045a143359030643d7e6 fix(web): preserve programmatic queued edits
- 0d9d2058dcb1e7649f1bf7c272337d8928114e1f fix(web): consume send settlements after draft reconciliation
- f656a2817925d99da45630acc2967536a440a2ce fix(web): clear stale drafts after delayed queued sends
- 0500d12164129360ca2178242723177f79359a9c fix(web): invalidate Fork boundary after message consumption
- 4d2454bac8cf6e65cde871a08708839ba9808114 fix(web): invalidate stale Fork boundary during history updates
- 5de86faefb9429aefffcb232ea0c27ae70d3bd42 fix(web): preserve current Fork action while reading history
- 3f4fbc3dd870e8eccceafc3679284bd5a5a1772f merge: rebuild v0.27.3.5 from upstream 901f17d0c with maintained overlay

## Open upstream pull requests

- #1647 [UNKNOWN] fix: warn before large session exports @ abcd1023c4058ce54e5d52731b2e0ea185a752a5 (https://github.com/tiann/hapi/pull/1647)
- #1646 [UNKNOWN] docs(macOS): set launchd runner file limit @ 648528074c157445ad8c4035f3d0fdc34e39ca0e (https://github.com/tiann/hapi/pull/1646)
- #1644 [CLEAN] fix(opencode): render edit/write tool calls through the shared diff views @ 61d9b66cbca8716099235c0727aed363923a517d (https://github.com/tiann/hapi/pull/1644)
- #1642 [UNSTABLE] fix(agy): report the failure reason instead of echoing the answer @ ccc098bf7bb5df49acc5e432a93fe132c4a06dcb (https://github.com/tiann/hapi/pull/1642)
- #1640 [CLEAN] feat: add lightweight shared Agent Studios @ 2995ec379af773fff09cd1061a911b44135e10a5 (https://github.com/tiann/hapi/pull/1640)
- #1637 [UNKNOWN] feat(web): add desktop session sidebar toggle @ 0d66ab5233bd62e7c16de38490166471d7cf75db (https://github.com/tiann/hapi/pull/1637)
- #1636 [UNKNOWN] fix(web): prevent session navigation on right-click @ 60db9468d95b5197cbc49984f022256057f25dbe (https://github.com/tiann/hapi/pull/1636)
- #1635 [UNKNOWN] feat(web): show project in session header @ 6c65104bb7c8878c232cb20c22669b9998cd6fb5 (https://github.com/tiann/hapi/pull/1635)
- #1633 [UNKNOWN] fix(codex): preserve context config in remote sessions @ 4e597e4739022eabadc49d328148ae4d01392d97 (https://github.com/tiann/hapi/pull/1633)
- #1632 [UNKNOWN] feat(dsh): integrate DeepSeek Harness through ACP @ b92b3e0ad8dc4c9b55105dfe4c8c6aafced8f20f (https://github.com/tiann/hapi/pull/1632)
- #1629 [CLEAN] fix(agy): stop delivering the same answer twice when deltas are mangled @ 13c500388806a1c830d9832aab1763b152935ac8 (https://github.com/tiann/hapi/pull/1629)
- #1627 [CLEAN] feat(web): anchor the composer settings sheet to the clicked value button @ 3fc51785661635c75c5ad72c281a6ede62bf9ecc (https://github.com/tiann/hapi/pull/1627)
- #1625 [UNKNOWN] fix(web): provide exact PWA icon sizes for Windows notifications @ 9aa1668bc6f76e6d205b1f26e677902c2bec5f59 (https://github.com/tiann/hapi/pull/1625)
- #1621 [UNKNOWN] fix(sessions): make title generation discoverable @ e56cecc6ebc759c37ec4680b19c723f7fc968d7b (https://github.com/tiann/hapi/pull/1621)
- #1620 [CLEAN] fix(web): coalesce symlink path spellings in session list groups @ 725fd69452ad2eb660b2af419f28c72e43de29c0 (https://github.com/tiann/hapi/pull/1620)
- #1618 [CLEAN] feat(peer): nametag-only ping_peer reply attribution @ c1a2384009e868c922ebfa183d1586db2c26ea9a (https://github.com/tiann/hapi/pull/1618)
- #1617 [UNKNOWN] fix(web): unify sync session menu labels @ 2f2396ff8d5948de76b183601e26395d9b6d9b8e (https://github.com/tiann/hapi/pull/1617)
- #1616 [UNKNOWN] fix(web): reuse existing PWA window for notification clicks @ 455917d62f10cbc2034dc08de5b51ee957ee18ee (https://github.com/tiann/hapi/pull/1616)
- #1615 [UNKNOWN] feat(hub): add optional WxPusher completion notifications @ 1732dcfc1edf4c879f483a2c0ee6c04d46169c3b (https://github.com/tiann/hapi/pull/1615)
- #1614 [UNKNOWN] Make web terminals persistent and attachable @ 5d638beae5d2c0ca26d6944063cda2de42fbb18c (https://github.com/tiann/hapi/pull/1614)
- #1613 [CLEAN] fix(cursor): isolate HAPI MCP overlay to project mcp.json @ 82caab248e7a20255eea0059432edd9f2a9af88f (https://github.com/tiann/hapi/pull/1613)
- #1611 [UNKNOWN] fix(scratchlist): persist manual ordering and improve draft actions @ b0b38439a14a2fbf0b3dbcc77eead44defb5f335 (https://github.com/tiann/hapi/pull/1611)
- #1610 [DIRTY] feat(cli,web): per-queued-message Steer for Codex and Cursor mid-turn (#888) @ 2c46a9d0664899e2d0266ab81e940e3bd58cc78d (https://github.com/tiann/hapi/pull/1610)
- #1607 [UNKNOWN] feat(web,hub): right-click context menu for sidebar project groups (#881) @ 17d22112e96917d0ff0ffdfe95de750f571b823c (https://github.com/tiann/hapi/pull/1607)
- #1605 [CLEAN] feat(claude): discover models and context window from the CLI @ 69e276ee3be69014c299da1a2dd4ffc01e66b412 (https://github.com/tiann/hapi/pull/1605)
- #1604 [UNKNOWN] fix(codex): gate history actions until native thread is ready @ 426b84dec54bd78b8d03da379f7f4acb680f90d9 (https://github.com/tiann/hapi/pull/1604)
- #1603 [UNKNOWN] fix(web): align Fork/Rewind confirmation dialogs @ 2fbdb4f1f4c5e89da4890e1244e9be93dd70bb71 (https://github.com/tiann/hapi/pull/1603)
- #1600 [draft] feat(attachments): add durable attachment storage and previews @ 96f7f3560b22688d6e61084226cb36b622d1e3eb (https://github.com/tiann/hapi/pull/1600)
- #1599 [UNKNOWN] fix(web): consolidate tool card display settings @ fffbe5dedf8fe33874174e01905d689de68a4b0f (https://github.com/tiann/hapi/pull/1599)
- #1598 [UNKNOWN] feat(web,hub): add opt-in search for session message content @ bf5a068b798aef67394d9627e6502901288c79a0 (https://github.com/tiann/hapi/pull/1598)
- #1597 [UNKNOWN] feat(web): assistant response navigation with window-store-safe jumps (#1093 + #1587) @ 55db80dd5b67d774e5c5dba7bf120188cedec7f4 (https://github.com/tiann/hapi/pull/1597)
- #1592 [UNKNOWN] fix(web): apply reasoning collapse preference to history @ 67112915c48b949df6f2311d4de7cf040c1019aa (https://github.com/tiann/hapi/pull/1592)
- #1585 [CLEAN] fix(agy): show Gemini 3.7 Flash in the agy model list @ 3ec75e28365f3eb9efa5f18b4f3a0f6d3c487357 (https://github.com/tiann/hapi/pull/1585)
- #1581 [UNKNOWN] fix(web): clear stale drafts after delayed queued sends @ ac2750164e3b10b49e99b190bab4eb57ad489b32 (https://github.com/tiann/hapi/pull/1581)
- #1567 [UNKNOWN] feat: add Reasonix ACP integration @ aa7fdf0f5bfbacf811cf745409ae7aacb9c84bc3 (https://github.com/tiann/hapi/pull/1567)
- #1564 [CLEAN] feat(cli): Cursor-only display_links MCP for unmangled URLs @ 05556714d4b52dae4fd0b6ab53ec72c7eb9a90ae (https://github.com/tiann/hapi/pull/1564)
- #1543 [UNKNOWN] fix(web): preserve wrapped inline code backgrounds in shared images @ 2d6dbd4de8e78209d0ac06c57fc27dcc6ec8a373 (https://github.com/tiann/hapi/pull/1543)
- #1542 [UNKNOWN] fix(web): keep loaded older history in the window while a session streams @ 7d8c12c4d4d363f3cc7b2ee6f06fa0969b5e24b3 (https://github.com/tiann/hapi/pull/1542)
- #1537 [UNKNOWN] feat: add peer tools exposure toggle (#1401) @ 693aed6e40beed850caeb65ac32fb4e6d68442d5 (https://github.com/tiann/hapi/pull/1537)
- #1528 [UNKNOWN] fix(hub): make session timeout and reconnect state durable and consistent @ 3517c527077d71033ec3782185ca4cf6d280d0f4 (https://github.com/tiann/hapi/pull/1528)
- #1527 [UNKNOWN] feat(cli): survive terminal hangup by switching the session to remote mode @ 597c28d6bcb5dd2fc8938197d60e5dea9d327821 (https://github.com/tiann/hapi/pull/1527)
- #1525 [UNKNOWN] test(cli): make the suite pass on macOS hosts @ 85e5ec888140097893bdf30dfe1b101145d2c54e (https://github.com/tiann/hapi/pull/1525)
- #1523 [UNKNOWN] fix(web): unify agent task status presentation @ c786745be13f42b18acc0d04927356ac95bd4237 (https://github.com/tiann/hapi/pull/1523)
- #1517 [UNKNOWN] Fix Telegram Mini App polish and file tree state @ d9767f92f0beb3a245ed2329030126441676e8e0 (https://github.com/tiann/hapi/pull/1517)
- #1512 [UNKNOWN] fix(web): use latest assistant replies for session recency @ b14c4f702832186583c3b7e4d48b01999da77268 (https://github.com/tiann/hapi/pull/1512)
- #1511 [draft] feat(cli): spawn-peer CLI + MCP spawn_peer for peer spawn with remit @ e905d633b9c583b14d4a06bae25d5baea37df701 (https://github.com/tiann/hapi/pull/1511)
- #1468 [UNKNOWN] feat(usage): record ACP cost and surface per-agent reporting availability @ 2936e0f780032eea5d6eb86173b47b3694369d22 (https://github.com/tiann/hapi/pull/1468)
- #1451 [UNKNOWN] feat(web): configure Create agent visibility @ 8921610632f477c985d36efedaae16d8e2cb9fb0 (https://github.com/tiann/hapi/pull/1451)
- #1447 [CLEAN] feat(web): add separate option to pin active sessions @ 19daba6f54b3bc99d4645dd3be25cdc6d2be7b4b (https://github.com/tiann/hapi/pull/1447)
- #1443 [DIRTY] feat: restore mid-turn steer for Codex and Cursor @ 1888de0e1e3fd9ae84001d49e56e8d607b4b67f8 (https://github.com/tiann/hapi/pull/1443)
- #1436 [UNKNOWN] feat(web): persist and send voice input message across session navigation (#1435) @ 155ec33a04b8b748279f0495ed0bd7518c98eee3 (https://github.com/tiann/hapi/pull/1436)
- #1429 [CLEAN] feat(claude): import local session history @ 5d3f41bb10bb22e7186d1abc0fc45e5659be479d (https://github.com/tiann/hapi/pull/1429)
- #1424 [DIRTY] feat: show progress bar on session for hours-long jobs @ 8cf9e0d17c7e50dc842cf9294d16bc9c4ab9d856 (https://github.com/tiann/hapi/pull/1424)
- #1422 [UNKNOWN] fix(web): make long file errors expandable @ 825d3a6e95ccec7896bc45782e906fe3201b1b1a (https://github.com/tiann/hapi/pull/1422)
- #1421 [UNKNOWN] feat(web): remember all launch settings options in NewSession preferences @ b8024da4a89f1ec2e0e3cebf5f522e152cad15c0 (https://github.com/tiann/hapi/pull/1421)
- #1419 [UNKNOWN] feat(web): add direct send button during active voice session @ cb64200637941ed429855a82ffcf2db977610416 (https://github.com/tiann/hapi/pull/1419)
- #1418 [UNKNOWN] feat(web): drag sessions into composer mentions @ dd0d0331e4af8282d5e756ecc894b05ca23e2b59 (https://github.com/tiann/hapi/pull/1418)
- #1414 [UNKNOWN] fix(web): hide redundant machine labels on single-machine pinned rows @ 53c1f9669caedc37aa0daa44cbfd3b6a2379e0a3 (https://github.com/tiann/hapi/pull/1414)
- #1361 [UNKNOWN] Fix/codex sync idle active @ d59a9ec6a753f0485817b8d7f65fac4a2a6d6ee7 (https://github.com/tiann/hapi/pull/1361)
- #1360 [CLEAN] feat: add notification preferences and customizable web push copy @ b9c9975ae1afa1455385fdd69509c3f8c169c728 (https://github.com/tiann/hapi/pull/1360)
- #1351 [UNKNOWN] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1309 [draft] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [UNKNOWN] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [UNKNOWN] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [UNKNOWN] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ 999f1d1170d382cc4fd5e5fdf6e0a6ab4a0bf65f (https://github.com/tiann/hapi/pull/1193)
- #1189 [UNKNOWN] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [UNKNOWN] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [CLEAN] feat(session): opt-in GitHub PR awareness + explicit attach @ 3f1ecf92a7e70136e7a804b485b989a610f2bd7f (https://github.com/tiann/hapi/pull/1163)
- #1158 [UNKNOWN] fix(web): unify session header display labels @ b00e39794e707d3bdbd6ab1029b5a6576b3cf985 (https://github.com/tiann/hapi/pull/1158)
- #1126 [DIRTY] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1099 [UNKNOWN] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [UNKNOWN] feat(web): add assistant response navigation @ b2cbe6cc1a41f114de12371103382c55ba9efb86 (https://github.com/tiann/hapi/pull/1093)
- #1092 [UNKNOWN] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [UNKNOWN] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [UNKNOWN] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [UNKNOWN] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [CLEAN] feat(cursor): detect inline model errors, surface, notify, and bridge (#878) @ 3df619d38431329030e6f3d5aa5fe76c9b7e46c7 (https://github.com/tiann/hapi/pull/987)
- #975 [UNKNOWN] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ 4bb7c7e0e75475b4c2d6c8a3d2414272bcd3c1ec (https://github.com/tiann/hapi/pull/945)
- #942 [UNKNOWN] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
- #847 [CLEAN] Codex usage indicator with cross-flavor budget gauge shape (rebase of #537) @ ad2210cef9551f35570a855289247e99e8d56bc9 (https://github.com/tiann/hapi/pull/847)
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
- #312 [DIRTY] 增加飞书支持 @ 572d489bbd359fe1ca9b4eb96a852804e42e69ac (https://github.com/tiann/hapi/pull/312)

## Required decisions

Record every open PR as carry, defer, or drop with its reviewed SHA before rebuilding.
Normal carries require ready CI/merge state, clear maintainer signal, latest-head HAPI Bot no-findings, proportional or evidenced scope, and preserved or accepted behavior.
Personal PRs authored by swear01 are auto-carry; record and report every failed quality rule after integration.
Official upstream is authoritative; upstreamed PRs are accepted and are not replayed.

## Selection decisions

- All current open PR heads are deferred for this fixed-base release; no open head is replayed automatically.
- `#1091` and `#1093` remain dropped by operator ruling.
- `#1320` is accepted from the official `v0.29.0` base and is not replayed or removed.
- Existing fork-only behavior retained in the final tree was re-audited against the integrated tests and is recorded in `manifest.tsv`; this is separate from selecting new open PR heads.
