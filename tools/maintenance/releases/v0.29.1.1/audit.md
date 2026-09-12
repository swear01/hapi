# HAPI maintained release audit

Previous maintained release: v0.29.0.6

Official release: v0.29.1

Personal PR owner: swear01

Origin main: 806a39190a83242dc670168f32bd11840a266947
Upstream main: a729456682d4604dd65b75236c6a29a04ede9801

## Fork-only commits

- 806a39190a83242dc670168f32bd11840a266947 Merge pull request #19 from swear01/next/252-runner-pid-reuse-20260910
- b504181880383af8e37a5908ac4c7cd0b2e3bfc6 fix(runner): bound stale lock retries
- 3f3cca240dc748a632ad6348281dd8990e14d240 fix(runner): reject reused PID lock owners
- cc45252848ba0033d1927e24c1121f821eb5b68d fix(release): preserve independent CLI fixes when excluding jobs
- b1117882a9a0c1e8cf7518cf7e9ae94417486b5f chore(release): temporarily exclude session jobs from v0.29.0.6
- ce6bc95d892b45eaddd0a49747f2dd52f8298d7d Preserve shared remit batches and restore app-shell cache policy
- ff9568410518d15962867f4f38673803fb7da5e0 Preserve remit completion and local storage failure boundaries
- 7812c02ec7d10809b9bbed3b3d379a046f928a8e Return HTTP conflict for reused spawn remit IDs
- 05c1182ba6ce7640f611bcb0f2471729eed939b3 Fix undispatched spawn cleanup and cumulative remit results
- 184f356f174496434e2802c373f4196f11dd5083 fix: avoid invoked remit redelivery and align effort guidance
- 2fa2c0b1ca43a6748a0ba014570ba93f6e45d369 fix: refresh managed runtime skills and enforce remit boundaries
- cf257e304ad07335b04255cdc87df6625674c41a fix(cli): preserve ambiguous spawn correlation and supported effort
- f964e7121664476e9c2225a6ee98cbfd9efcb54f docs: record stable post-test Windows artifact fingerprint
- 92ff3e042d91f34011ce48ae4b5b64405dd803a2 fix: preserve spawn readiness and sidebar viewport for v0.29.0.6
- b09df5181a2e961eff40f7a364061462790a8116 fix(cli): recover interrupted native skill installation
- a82cb247e94ac6a524c1ab77f20a63dfdb392dfd chore(maintenance): retain prior release ancestry for review
- 71bc29dc35c6243cc01c741c81d057783a02b758 chore(maintenance): record v0.29.0.6 release audit
- 410f2ca8e656d8ebc996ece36118a47d0fb29427 fix(upgrade): fingerprint bundled native session skills
- 92e025f26460815da6de6b4397010c7d8ebab6d3 chore(release): prepare maintained v0.29.0.6 source
- 7a89deefb2cbca900ba54eed1f4e399fada52bb2 chore(maintenance): update v0.29.0.5 review audit
- 214c96d8d12fce7e292bb859e5eddb060ad7642e fix: address v0.29.0.5 review findings
- 3f71dcc36e7d9343c5406acdec6987ac1060c1a4 chore(maintenance): record v0.29.0.5 release audit
- 4123b2d2e7827f225224a2182c2f6553ca8fc5c7 chore(release): prepare maintained v0.29.0.5 source
- 81ed6b7569da9a05a73da08add8d34d210c987c9 docs(hub): document title provider max_tokens/timeout env knobs
- 12c986b9c50abd6d5643fcd86e28a32bcb24f4d9 feat(hub): make title provider max_tokens and timeout env-tunable
- 61f7361d8f33ef03c73743e4648d342cb43c741a fix(web): pin blank stream-id identity contract in golden fixtures
- 35cda5d15867ee53ca27639e52d1169bd9a57913 fix(ios): use normalized stream id for block construction identity
- 998fe0a2d32683fa53530ebf1ae9a9436175093a fix(web,ios,android): reject blank stream ids as block identity
- 247043ac5e87b4b99f7408349c8e49110b1d7316 fix(ios,android): mirror stream-stable block ids in native chat ports
- d128d9070c27769d41f9e6395e444ade3f61e1b3 fix(web): keep streamed reasoning/text block ids stable across snapshot rows
- dbd150922d491b3e126725c1eb1a8b5c26714d82 chore(maintenance): record v0.29.0.4 release audit
- af7ae7808ba6853d728dcbe837060be265f1eecf fix: harden release fallback semantics
- 508489a19abba4980797f5dca08d384489fb72bb fix: fail closed on ambiguous runner stops
- f3a0eb183c3ea71707cd00ab1b0ded1e98e03a4f fix: clarify release review edge cases
- b47f2803419778b6b8e075af3d83d47ca1ca65c3 fix: address v0.29.0.4 review findings
- 60fd5eea1ea2adff77835b95f96e2bd318cce5fa test(e2e): use platform-native clipboard shortcuts
- 7a4b83d278078be99816a706f0da453c8ab6ea29 test(web): align maintained voice handoff mocks
- 8147c5aa14bd1060abdbb23c059d2a34eb54a33c chore(release): prepare maintained v0.29.0.4 source
- 9c700fe3cb2bed4fb40a2f286fdc3af1e7cf28d5 fix: refine summary copy and remember file-browser tabs (#1760 #1761)
- cd82d26aba72338d2913d9cebdbaee2b46ba19cb fix: expose full recent paths and clarify summary settings (#1757 #1760)
- 39a5f7c039e45530c2edacb5222cae2ad272f1b9 fix: harden Windows runner stop and compact recent paths (#1755 #1757)
- 8b4d68a5bd78a2c14230927365fed9221cc9b2b8 fix: integrate Codex disconnect, cancel, and file-wrap updates (#1748 #1750 #1754)
- b3983e91354647c3818c0c32906423ea105f97f5 fix(web): keep shared file responses current and accessible (tiann/hapi#1543)
- 6f2a485b1cc4e873cbde9003a2eafa5d785d6951 fix(web): preserve generated file controls in shared previews (tiann/hapi#1543)
- 7948157da9d660ee8cdb739754d146fab157327a fix(web): merge source drafts on failed voice resume (tiann/hapi#1436)
- d2fd7d2b39875bcf64968ca0e1c77a24857ee84e fix(web): transfer follow-up drafts after voice resume (tiann/hapi#1436)
- 59131892ab732bdf578ccee5c9e1eab88d077986 fix(web): preserve dictation audio constraints (tiann/hapi#1436)
- a6a0c03d210379216a0b5314998d94131d7e40b1 chore(maintenance): record v0.29.0.3 release audit
- e2354c7e51e57900c3bde80c686f9bdbab756395 chore(release): prepare maintained v0.29.0.3 source

## Open upstream pull requests

- #1819 [CLEAN] fix(cursor): pin Auto to CLI --model auto instead of account default @ a311f7180f7976d03efdb3e58e902f35cb19c860 (https://github.com/tiann/hapi/pull/1819)
- #1816 [CLEAN] docs(agents): add a bounded PR review-wait and auto-fix loop @ 8e9c565f6b58ccb9ff67f221fb1d0a73a67c6f12 (https://github.com/tiann/hapi/pull/1816)
- #1809 [UNSTABLE] fix(web): render cold sessions from a small initial page @ 8f28b20634daac32960d81e3275e97faba65c8c2 (https://github.com/tiann/hapi/pull/1809)
- #1801 [CLEAN] feat(web): add include and exclude session search modes @ 1a3cb18b84850c11648db504503db375a56e39ec (https://github.com/tiann/hapi/pull/1801)
- #1798 [CLEAN] feat(web): add unavailable Agent visibility toggle @ e26502e1cc02b6ccc9e349e00b261e6807cc9ea4 (https://github.com/tiann/hapi/pull/1798)
- #1797 [CLEAN] fix(web): allow directory collapse during session search @ 14df9508dd684702ec5368161e2943b72dab2b1e (https://github.com/tiann/hapi/pull/1797)
- #1793 [CLEAN] feat(web): absolute datetime tooltips on relative ages @ a2f8f3a8298ea4a82c08d721696027c9a6a0e415 (https://github.com/tiann/hapi/pull/1793)
- #1791 [CLEAN] feat(web): add bilingual release history to Settings > About @ d45a4fb9d059e3cd3490ecc21a2ca97537501f53 (https://github.com/tiann/hapi/pull/1791)
- #1788 [DIRTY] feat(web): expose agent quota queries in settings and context display @ 6f225d9bde5f9e37464a84309c307c2e2494abcc (https://github.com/tiann/hapi/pull/1788)
- #1787 [CLEAN] feat(runner): add safe agent quota query infrastructure @ 8199cd3ea3e9c888864dceb3ed22ff1f7075e931 (https://github.com/tiann/hapi/pull/1787)
- #1783 [CLEAN] fix(codex): let forked sessions run alongside their source @ 1abe9d1ed3b9830e6dd47415200888c64e33f27f (https://github.com/tiann/hapi/pull/1783)
- #1778 [DIRTY] fix(files): optimize exact path and directory search @ ce23fb1881324094f09ca580d13c137a9573f276 (https://github.com/tiann/hapi/pull/1778)
- #1772 [DIRTY] feat(web): add combined session list filters @ b91f74428541fad1c106bce663af36f06c4d02e8 (https://github.com/tiann/hapi/pull/1772)
- #1771 [DIRTY] feat: add prompt-free session control workflow @ 7f88aed3d925bdcc4a8bfeb98e3c1fccffe62bf6 (https://github.com/tiann/hapi/pull/1771)
- #1762 [draft] feat(web): in-session message content search @ 30b531a4f494b1df058f14e75e3d04e2318e471c (https://github.com/tiann/hapi/pull/1762)
- #1758 [CLEAN] feat(web): add pin-in-progress session layout modes @ e756d30a11117fcccb621e4201b6f3b39f7de531 (https://github.com/tiann/hapi/pull/1758)
- #1753 [CLEAN] fix(runner): reject a spawn model missing from the machine's catalog @ d5fa8963fa91b825a04af6532a9d870dbd466088 (https://github.com/tiann/hapi/pull/1753)
- #1747 [DIRTY] feat(web): add collapsible session sidebar @ a8e8d6e91b8c6f8a8b3495fb6ba214cdc8594eb6 (https://github.com/tiann/hapi/pull/1747)
- #1738 [CLEAN] fix(hub): capture AGENT_NOTIFY_SUMMARY from peer user-role deliveries @ 5a695fbd1bd367fe15835f9f9742cc37fe9fc160 (https://github.com/tiann/hapi/pull/1738)
- #1733 [DIRTY] feat(web): session-list scrollbar tick for open session position @ ef4636a9fa07932dabaeec76a6e8263d21bfdd78 (https://github.com/tiann/hapi/pull/1733)
- #1730 [CLEAN] feat(web): auto-hide primary session scrollbars @ 731727c9ec8d4cfcd991dea163284d59dd5338ad (https://github.com/tiann/hapi/pull/1730)
- #1729 [CLEAN] fix(web): Enter inserts newline when composer is expanded @ f04288cacaae35ee2c50b381bc4db5604eb03f80 (https://github.com/tiann/hapi/pull/1729)
- #1728 [CLEAN] fix(web): collapse expanded composer immediately on submit @ 7a93bb406734417589da0be5d344161cdd0723b9 (https://github.com/tiann/hapi/pull/1728)
- #1727 [DIRTY] fix(hub,cli): keep inactive file previews available through runner @ db93a3f26c2daa3fa906094001af822527af5d96 (https://github.com/tiann/hapi/pull/1727)
- #1726 [CLEAN] fix(web): align file preview content around scrollbars @ 582a7badd67bdd3f53a09b5e610ec3461f334105 (https://github.com/tiann/hapi/pull/1726)
- #1725 [CLEAN] fix(cli): auto-Continue on Cursor post-tool interrupt; Blocked only on give-up @ fa9a3dbaa757574260607dde3e09cfd78c833f83 (https://github.com/tiann/hapi/pull/1725)
- #1722 [CLEAN] fix(web): allow retrying failed attachment uploads @ 694c7e0cefaad5baeeed3d01ba08b072ab186f2a (https://github.com/tiann/hapi/pull/1722)
- #1721 [UNKNOWN] fix(pi): support Windows npm command shims @ 02840df43b4f07bbb8ce60ea55264199287dd295 (https://github.com/tiann/hapi/pull/1721)
- #1720 [CLEAN] fix(web): keep mobile code gutters clear across renderers @ 3d7fdb1cada8c896a4104a77c57f4762778b9f94 (https://github.com/tiann/hapi/pull/1720)
- #1718 [DIRTY] fix(web,hub): friendly file preview when session CLI is offline @ bbc8d25f05b4e082330ec772ae598748da277293 (https://github.com/tiann/hapi/pull/1718)
- #1715 [CLEAN] fix(pi,agents): tool-result images + provider-qualified set-session-config + live model catalogs @ cf5ab674cb5aeca4af38a599b36fb2ee118205dc (https://github.com/tiann/hapi/pull/1715)
- #1714 [UNKNOWN] feat(codex): select provider profiles for web sessions @ a227310e3e7438b5940089748367339d060536b1 (https://github.com/tiann/hapi/pull/1714)
- #1713 [CLEAN] feat(web): add mobile attachment source picker @ f95fe0ad169cfd644c16448785bd3cde7ff46691 (https://github.com/tiann/hapi/pull/1713)
- #1712 [DIRTY] feat(workspace): add HAPI Recycle Bin for deleted files @ 4983461f20b580b17ae3f7a74a8c2ec22b7b7c92 (https://github.com/tiann/hapi/pull/1712)
- #1711 [CLEAN] feat(web): make detail headers horizontally scrollable @ 9d197485474de77fddd8297e5e00a8a8c84110a5 (https://github.com/tiann/hapi/pull/1711)
- #1708 [UNKNOWN] feat(cli): auto-steer ping_peer messages into an active turn @ 73630bbd3f3058b3eca9f77df0fe392ca1c4940e (https://github.com/tiann/hapi/pull/1708)
- #1706 [UNSTABLE] fix(hub): verify runner before trusting archiveSession's dead-CLI fallback @ 26c1615ae754ddb16b43fdbae4850f90ea7d6d85 (https://github.com/tiann/hapi/pull/1706)
- #1704 [CLEAN] feat(web): add independent session header Agent icon toggle @ 19c888c0d0664d1111937471c5a475954b57941f (https://github.com/tiann/hapi/pull/1704)
- #1702 [CLEAN] fix(web): debounce and cancel stale file searches @ af8667d9a94f1f0c112920bf2360c7d70e7e3496 (https://github.com/tiann/hapi/pull/1702)
- #1695 [CLEAN] feat(web): add fullscreen preview for shared turns @ de2f96ad729263a7ab2960773e35e42b2d819986 (https://github.com/tiann/hapi/pull/1695)
- #1693 [DIRTY] feat(web): add fullscreen table preview and export actions @ 80b2a3c80eb144c6fbf95fecebb13ba978574227 (https://github.com/tiann/hapi/pull/1693)
- #1692 [CLEAN] feat(agent): add provider-specific agent detail inventories @ 1f512d71240b2f14368520cac79a2abaa208b54c (https://github.com/tiann/hapi/pull/1692)
- #1691 [CLEAN] feat(cli): show Claude compaction as a summary card with token delta @ 8486600423596f0c7b9c84d8fde18cb571ba6053 (https://github.com/tiann/hapi/pull/1691)
- #1684 [DIRTY] feat(attachments): persist original attachments in Hub @ 5e8d6a814b0b2d69842a695e7cc19af147d1d9b9 (https://github.com/tiann/hapi/pull/1684)
- #1683 [UNKNOWN] feat(hub): add generic webhook notification channel @ 08fa9726e8d0dce5a5a263987fb54cb2ce649d21 (https://github.com/tiann/hapi/pull/1683)
- #1680 [UNKNOWN] Add Build Remote Agent phone pairing (gbr/1) @ 62a2218d4458559374e52302a2c6f0f2f76e578e (https://github.com/tiann/hapi/pull/1680)
- #1679 [CLEAN] feat(claude): support conversation rewind via native session truncation @ 4db160525bb65016758f333a6969d29888a5cc47 (https://github.com/tiann/hapi/pull/1679)
- #1678 [CLEAN] fix(web): make composer session mention pills ellipsize @ c4c28624db1da06f27bee573d83201692ab7c778 (https://github.com/tiann/hapi/pull/1678)
- #1677 [CLEAN] feat(opencode): import local session history @ a832355bc2ea1aed9a703d38838282e7f40b29ea (https://github.com/tiann/hapi/pull/1677)
- #1676 [CLEAN] feat(opencode): wire session fork via the server HTTP API @ aacc2580dea8e29397df88026fcfeac19545ae44 (https://github.com/tiann/hapi/pull/1676)
- #1675 [UNKNOWN] feat(web): surface opencode /compact and /clear in the slash command menu @ a816ff9bc70cb0294e8c6fbde5a84bba19ba42c2 (https://github.com/tiann/hapi/pull/1675)
- #1673 [CLEAN] feat(web): show a fork preview dialog before forking a conversation @ f6c846ac2a002b236c94515902d04a5e881eb251 (https://github.com/tiann/hapi/pull/1673)
- #1672 [CLEAN] feat(acp): re-enable change_title for ACP launchers with manual title precedence @ 8d6e67d2061e402728cc609ade172ff3d6af2985 (https://github.com/tiann/hapi/pull/1672)
- #1668 [CLEAN] feat(opencode): show round usage metadata @ 483b4467f597e5c1be1e30c3ea78356dc927b834 (https://github.com/tiann/hapi/pull/1668)
- #1666 [CLEAN] fix(web): improve generated media retry and sizing @ e32370634d51ec93a8caf5d5ca278f0bba98eb73 (https://github.com/tiann/hapi/pull/1666)
- #1665 [CLEAN] fix(web): improve fullscreen image preview toolbar layout @ 7dd55a12888166b2197ddd349a620039768250db (https://github.com/tiann/hapi/pull/1665)
- #1664 [UNKNOWN] fix(web): keep machine health visible for single-machine layouts @ dac80dd1d94060889d786df9b9416216b07b0547 (https://github.com/tiann/hapi/pull/1664)
- #1662 [UNKNOWN] feat(web): unify composer model and effort controls @ a97f6ebd9a2d5026691b18bc728c01d98afece1f (https://github.com/tiann/hapi/pull/1662)
- #1660 [CLEAN] fix(web): support RMB symbol aliases for skill autocomplete @ bf182f8ced3ddeb4a474c9a86b2396dd0c472e56 (https://github.com/tiann/hapi/pull/1660)
- #1659 [CLEAN] feat(web): add frontend composer history for loaded session messages @ d743a300bb512d8e10d7c5edb1c2fd4898096507 (https://github.com/tiann/hapi/pull/1659)
- #1658 [CLEAN] feat(web): add Alt+S shortcut to send messages @ 36df9164850c72a2edd4c9fe4f99e53db0dd305e (https://github.com/tiann/hapi/pull/1658)
- #1657 [CLEAN] fix(web): improve deferred generated-file download controls @ 410c2acd1a8c12a2b76712072f3034e7d912d84b (https://github.com/tiann/hapi/pull/1657)
- #1656 [CLEAN] fix(web): avoid session misclicks during live reordering @ fb962536e280b94f643aeb66f9b0de8cf873eb72 (https://github.com/tiann/hapi/pull/1656)
- #1644 [CLEAN] fix: render opencode edit/write/read tool calls through the shared views @ d608fb3d9d916ee943af2b7805c8ae94ee131ff3 (https://github.com/tiann/hapi/pull/1644)
- #1642 [CLEAN] fix(agy): report the failure reason instead of echoing the answer @ ccc098bf7bb5df49acc5e432a93fe132c4a06dcb (https://github.com/tiann/hapi/pull/1642)
- #1640 [DIRTY] feat: add lightweight shared Agent Studios @ b86a3b6c16c90ab80636a99f07ae9ca58bc129a4 (https://github.com/tiann/hapi/pull/1640)
- #1637 [CLEAN] feat(web): add desktop session sidebar toggle @ e67e35fc99ef50e5edecab5ca356109d04b9db76 (https://github.com/tiann/hapi/pull/1637)
- #1636 [CLEAN] fix(web): prevent session navigation on right-click @ 60db9468d95b5197cbc49984f022256057f25dbe (https://github.com/tiann/hapi/pull/1636)
- #1635 [UNKNOWN] feat(web): show project in session header @ 6c65104bb7c8878c232cb20c22669b9998cd6fb5 (https://github.com/tiann/hapi/pull/1635)
- #1629 [UNKNOWN] fix(agy): stop delivering the same answer twice when deltas are mangled @ a084ba83b531ec4436786d6f703e9ca7ff9b0fd5 (https://github.com/tiann/hapi/pull/1629)
- #1625 [CLEAN] fix(web): provide exact PWA icon sizes for Windows notifications @ 9aa1668bc6f76e6d205b1f26e677902c2bec5f59 (https://github.com/tiann/hapi/pull/1625)
- #1621 [CLEAN] fix(sessions): make title generation discoverable @ c94bfc04b538c6605290b2e7f4d0ffa79101d440 (https://github.com/tiann/hapi/pull/1621)
- #1620 [CLEAN] fix(web): coalesce symlink path spellings in session list groups @ 9c756e0919d9c99c8a0589a50f328d88ed4c06cc (https://github.com/tiann/hapi/pull/1620)
- #1618 [UNSTABLE] feat(peer): nametag-only ping_peer reply attribution @ 70b9174470b1cb2fe4da2f6b21882897bb22433c (https://github.com/tiann/hapi/pull/1618)
- #1617 [CLEAN] fix(web): unify sync session menu labels @ ea5ec5c3c1dc240dee87ab54282e4a47622ee3f0 (https://github.com/tiann/hapi/pull/1617)
- #1616 [CLEAN] fix(web): reuse existing PWA window for notification clicks @ 455917d62f10cbc2034dc08de5b51ee957ee18ee (https://github.com/tiann/hapi/pull/1616)
- #1615 [CLEAN] feat(hub): add optional WxPusher completion notifications @ 1732dcfc1edf4c879f483a2c0ee6c04d46169c3b (https://github.com/tiann/hapi/pull/1615)
- #1614 [UNKNOWN] Make web terminals persistent and attachable @ 64770fb335544e95bbbc549c55e3d587b428d8d0 (https://github.com/tiann/hapi/pull/1614)
- #1613 [CLEAN] fix(cursor): isolate HAPI MCP overlay to project mcp.json @ 82caab248e7a20255eea0059432edd9f2a9af88f (https://github.com/tiann/hapi/pull/1613)
- #1611 [DIRTY] fix(scratchlist): persist manual ordering and improve draft actions @ ab80734b11a76e48ba0e505179cdf154dd82cbf2 (https://github.com/tiann/hapi/pull/1611)
- #1610 [UNKNOWN] feat(cli,web): per-queued-message Steer for Codex and Cursor mid-turn (#888) @ 39ebb03180f998e143826d1e9dd85864af420ce3 (https://github.com/tiann/hapi/pull/1610)
- #1607 [UNKNOWN] feat(web,hub): right-click context menu for sidebar project groups (#881) @ f6cb2324fddb8bf3062faa6d077bcd0917311384 (https://github.com/tiann/hapi/pull/1607)
- #1605 [CLEAN] feat(claude): discover models and context window from the CLI @ 0627b477a77c9f3005dfff3bc465d49b65c4c76b (https://github.com/tiann/hapi/pull/1605)
- #1604 [CLEAN] fix(codex): gate history actions until native thread is ready @ 0d7c280c4b17c22e68948fd329b8334fd107c70b (https://github.com/tiann/hapi/pull/1604)
- #1603 [CLEAN] fix(web): align Fork/Rewind confirmation dialogs @ 2fbdb4f1f4c5e89da4890e1244e9be93dd70bb71 (https://github.com/tiann/hapi/pull/1603)
- #1599 [CLEAN] fix(web): consolidate tool card display settings @ fcf3df241de50481dd275c40220001cebefba11f (https://github.com/tiann/hapi/pull/1599)
- #1598 [DIRTY] feat(web,hub): add opt-in search for session message content @ 918d41c18fc6b7d7e1192a1118a6be2bb89d5c16 (https://github.com/tiann/hapi/pull/1598)
- #1597 [UNKNOWN] feat(web): assistant response navigation with window-store-safe jumps (#1093 + #1587) @ 263807f87ec00e4771447ba1590e7792d14421ef (https://github.com/tiann/hapi/pull/1597)
- #1592 [CLEAN] fix(web): apply reasoning collapse preference to history @ 67112915c48b949df6f2311d4de7cf040c1019aa (https://github.com/tiann/hapi/pull/1592)
- #1581 [DIRTY] fix(web): clear stale drafts after delayed queued sends @ aa6afcf8a09ea55a23dbf5feb9c5ba8e64c9b418 (https://github.com/tiann/hapi/pull/1581)
- #1567 [UNKNOWN] feat: add Reasonix ACP integration @ aa7fdf0f5bfbacf811cf745409ae7aacb9c84bc3 (https://github.com/tiann/hapi/pull/1567)
- #1564 [CLEAN] feat(cli): Cursor-only display_links MCP for unmangled URLs @ 72fa04fa53a0a48c621365407ee4fbb3a789350f (https://github.com/tiann/hapi/pull/1564)
- #1543 [CLEAN] fix(web): preserve shared turn layout and generated file downloads @ 650ca3c40caba4941ed6cf894a4c9446b89c706f (https://github.com/tiann/hapi/pull/1543)
- #1542 [UNKNOWN] fix(web): keep loaded older history in the window while a session streams @ 7d8c12c4d4d363f3cc7b2ee6f06fa0969b5e24b3 (https://github.com/tiann/hapi/pull/1542)
- #1537 [UNKNOWN] feat: add peer tools exposure toggle (#1401) @ 693aed6e40beed850caeb65ac32fb4e6d68442d5 (https://github.com/tiann/hapi/pull/1537)
- #1528 [UNKNOWN] fix(hub): make session timeout and reconnect state durable and consistent @ 3517c527077d71033ec3782185ca4cf6d280d0f4 (https://github.com/tiann/hapi/pull/1528)
- #1527 [UNKNOWN] feat(cli): survive terminal hangup by switching the session to remote mode @ 597c28d6bcb5dd2fc8938197d60e5dea9d327821 (https://github.com/tiann/hapi/pull/1527)
- #1525 [UNKNOWN] test(cli): make the suite pass on macOS hosts @ 85e5ec888140097893bdf30dfe1b101145d2c54e (https://github.com/tiann/hapi/pull/1525)
- #1523 [DIRTY] fix(web): unify agent task status presentation @ a53f4a48d8ad64408374f5f5f82a9aff22cfb719 (https://github.com/tiann/hapi/pull/1523)
- #1517 [DIRTY] Fix Telegram Mini App polish and file tree state @ d9767f92f0beb3a245ed2329030126441676e8e0 (https://github.com/tiann/hapi/pull/1517)
- #1512 [DIRTY] fix(web): use latest assistant replies for session recency @ 0794851c5f5dd30a215154b6c88685f3ffd90376 (https://github.com/tiann/hapi/pull/1512)
- #1511 [DIRTY] feat(cli): spawn-peer CLI + MCP spawn_peer for peer spawn with remit @ 52c51ba51c0d13a7c56b99ac0be161d5e4eebefe (https://github.com/tiann/hapi/pull/1511)
- #1468 [UNKNOWN] feat(usage): record ACP cost and surface per-agent reporting availability @ 2936e0f780032eea5d6eb86173b47b3694369d22 (https://github.com/tiann/hapi/pull/1468)
- #1451 [DIRTY] feat(web): configure Create agent visibility @ c6f4021e33d03cbf28a9b887cb2bb2e880f88431 (https://github.com/tiann/hapi/pull/1451)
- #1447 [DIRTY] feat(web): add separate option to pin active sessions @ 19daba6f54b3bc99d4645dd3be25cdc6d2be7b4b (https://github.com/tiann/hapi/pull/1447)
- #1443 [DIRTY] feat: restore mid-turn steer for Codex and Cursor @ 1888de0e1e3fd9ae84001d49e56e8d607b4b67f8 (https://github.com/tiann/hapi/pull/1443)
- #1436 [UNKNOWN] feat(web): persist and send voice input message across session navigation (#1435) @ 37406027425a084c4f106ca94ccaf7c8084cd853 (https://github.com/tiann/hapi/pull/1436)
- #1429 [DIRTY] feat(claude): import local session history @ 5d3f41bb10bb22e7186d1abc0fc45e5659be479d (https://github.com/tiann/hapi/pull/1429)
- #1424 [CLEAN] feat: show progress bar on session for hours-long jobs @ 44bb0abf41c4e387d2f90d5a40d3436ca203a23a (https://github.com/tiann/hapi/pull/1424)
- #1422 [DIRTY] fix(web): make long file errors expandable @ fd03fa2ec5d684b78ff9d6540a3ad55f4b174abf (https://github.com/tiann/hapi/pull/1422)
- #1421 [UNKNOWN] feat(web): remember all launch settings options in NewSession preferences @ 23d0a8d65dcbfadca4ef586d01b827a0fdedf2f9 (https://github.com/tiann/hapi/pull/1421)
- #1419 [UNKNOWN] feat(web): add direct send button during active voice session @ cb64200637941ed429855a82ffcf2db977610416 (https://github.com/tiann/hapi/pull/1419)
- #1418 [UNKNOWN] feat(web): drag sessions into composer mentions @ 14104017aa3390de0fa7ac61cc49e68923ebd3d7 (https://github.com/tiann/hapi/pull/1418)
- #1414 [CLEAN] fix(web): hide redundant machine labels on single-machine pinned rows @ ef5579e5fa2dedf0ceae7363b6a90b75f69cb703 (https://github.com/tiann/hapi/pull/1414)
- #1361 [UNKNOWN] Fix/codex sync idle active @ e1e7e8c3fbcfcdaaff872398c1d08758d3dcef0f (https://github.com/tiann/hapi/pull/1361)
- #1360 [DIRTY] feat: add notification preferences and customizable web push copy @ b9c9975ae1afa1455385fdd69509c3f8c169c728 (https://github.com/tiann/hapi/pull/1360)
- #1351 [UNKNOWN] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1309 [draft] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [UNKNOWN] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [UNKNOWN] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [UNKNOWN] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ 999f1d1170d382cc4fd5e5fdf6e0a6ab4a0bf65f (https://github.com/tiann/hapi/pull/1193)
- #1189 [UNKNOWN] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [UNKNOWN] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [CLEAN] feat(session): opt-in GitHub PR awareness + explicit attach @ e051711127e8829fb71259e1f3e398060e0f929f (https://github.com/tiann/hapi/pull/1163)
- #1158 [CLEAN] fix(web): unify session header display labels @ b00e39794e707d3bdbd6ab1029b5a6576b3cf985 (https://github.com/tiann/hapi/pull/1158)
- #1126 [DIRTY] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1099 [UNKNOWN] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [CLEAN] feat(web): add assistant response navigation @ 14888e040dc6027a0e1b6132185379998d250bfb (https://github.com/tiann/hapi/pull/1093)
- #1092 [UNKNOWN] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [UNKNOWN] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [UNKNOWN] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [DIRTY] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [CLEAN] feat(cursor): detect inline model errors, surface, notify, and bridge (#878) @ d5af51d9edb385f811f24bc323f20838b47c08ff (https://github.com/tiann/hapi/pull/987)
- #975 [UNKNOWN] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ 80a1705bb869f5e92c2e1186fdffafc82cb1026c (https://github.com/tiann/hapi/pull/945)
- #942 [UNKNOWN] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
- #847 [CLEAN] Codex usage indicator with cross-flavor budget gauge shape (rebase of #537) @ 0739b887da32e1ebae32a512303023728b7ab5ce (https://github.com/tiann/hapi/pull/847)
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

## Live refresh before publication

Historical `v0.29.0.*` overlay patch blobs are not nested into this release (GitHub rejects a 100MB+ concatenated patch). Prior audit TSV/markdown records remain.

Official `main` moved `1ccd638afda85205828b22ab6a3d40a9f81ddd8e` → `a729456682d4604dd65b75236c6a29a04ede9801` during freeze (`fix(ios): prevent long user messages from blocking chat`, `fix(claude): answer local permission prompts from web`). Overlay was rebased onto that tip; the only content conflict was `cli/src/claude/session.ts` (kept `requestRemoteRestart` plus the official permission-bridge comment).

Open-PR set at push time: 149. Live refresh:

- #1824, #1822, #1821 opened after the approved selection; recorded as defer (do not expand carry after approval).
- #1819 moved `a311f7180f7976d03efdb3e58e902f35cb19c860` → `7f77be104e856279398a72963bdacfcc39397bfe`. Latest-head HAPI Bot is now clean; still deferred this round.
- #1421, #1451, and #1610 closed without merge during freeze. They are removed from the open-PR audit. Overlay still retains the already-integrated #1421/#1451 behavior; #1610 was deferred and stays out.

Final selection: 27 carry, 118 defer, 4 drop. Carry PRs are integrated in the regenerated overlay, not replayed as individual `git am` patches.

PERSONAL_PR_POLICY_EXCEPTION on carried rows: #1771 (merge-dirty, exception scope, native session-runtime skill), #1635 (merge-dirty), #1419 ready personal carry. Closed #1451/#1421 remain in the overlay from the approved integration. #1468/#1662/#1436 remain deferred.
