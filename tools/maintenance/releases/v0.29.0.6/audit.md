# HAPI maintained release audit

Previous maintained release: v0.29.0.5

Official release: v0.29.0

Personal PR owner: swear01

Origin main: 7a89deefb2cbca900ba54eed1f4e399fada52bb2
Upstream main: 980a921ba15665c54998a6ddb658103d467ff4cb

## Fork-only commits

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

- #1774 [CLEAN] docs: explain execution-host sleep in remote sessions @ 1008e1bbbc48926d74648928712f1b6d13600dad (https://github.com/tiann/hapi/pull/1774)
- #1773 [CLEAN] feat(web): add bulk mark-all-read session action @ 0438118b0d7a6d0ca8922b6c4f10805e117229d5 (https://github.com/tiann/hapi/pull/1773)
- #1772 [CLEAN] feat(web): add combined session list filters @ 6c5753be294fde3ae33144828829e0786aac3134 (https://github.com/tiann/hapi/pull/1772)
- #1771 [CLEAN] feat: add prompt-free session control workflow @ 2315387c80780047f59c72f868bf4af886a09981 (https://github.com/tiann/hapi/pull/1771)
- #1770 [CLEAN] fix(web): center inactive session notice text @ 91dfb5b90d62fe00306fde2afba250b98e75af76 (https://github.com/tiann/hapi/pull/1770)
- #1766 [CLEAN] fix(web): preserve the visible chat window during rewind @ ae95c6a270cf4739c0c783eeb99f5d2e57cf9cb4 (https://github.com/tiann/hapi/pull/1766)
- #1762 [draft] feat(web): in-session message content search @ 30b531a4f494b1df058f14e75e3d04e2318e471c (https://github.com/tiann/hapi/pull/1762)
- #1761 [CLEAN] fix(web): remember file browser tab preference @ abc627096819353aec191d05ba8a369fd8233646 (https://github.com/tiann/hapi/pull/1761)
- #1760 [CLEAN] fix(web): clarify session summary setting copy @ 113e321bca63fd80065123f3bcf7820ce1a74257 (https://github.com/tiann/hapi/pull/1760)
- #1759 [CLEAN] feat(web): add opt-in PWA taskbar unread badge @ 50c842d4e61dd259b9ed0332e26723404eac9dad (https://github.com/tiann/hapi/pull/1759)
- #1758 [CLEAN] feat(web): add pin-in-progress session layout modes @ 7586340d9d8703f147311392eea0717119d96d20 (https://github.com/tiann/hapi/pull/1758)
- #1757 [CLEAN] fix(web): compact recent path labels @ 2763682dcc12e14cab7c94c91bd9e6faa5e90cd0 (https://github.com/tiann/hapi/pull/1757)
- #1755 [CLEAN] fix(cli): identify the Windows runner process through CIM @ 90063c1384974d228c8839d65461fef080a0f9ef (https://github.com/tiann/hapi/pull/1755)
- #1754 [CLEAN] feat(web): add word wrap to file source previews @ 99abf602c215dbb81ad54d6de60b62ed650b7c50 (https://github.com/tiann/hapi/pull/1754)
- #1753 [CLEAN] fix(runner): reject a spawn model missing from the machine's catalog @ d5fa8963fa91b825a04af6532a9d870dbd466088 (https://github.com/tiann/hapi/pull/1753)
- #1751 [CLEAN] feat(web,ios,android): let Claude pick a permission mode when creating a session @ ce3756a347e98cd1bf71ae506bcf628e810bdb41 (https://github.com/tiann/hapi/pull/1751)
- #1750 [CLEAN] fix(hub): keep ambiguous queued-message cancels indeterminate @ 19bbd1db1df82e65209033efad9bdf0b4141a67e (https://github.com/tiann/hapi/pull/1750)
- #1748 [CLEAN] fix(codex): ignore late app-server writes during disconnect @ 6138637337bf0e54182664cf7eb3810393e1c005 (https://github.com/tiann/hapi/pull/1748)
- #1747 [CLEAN] feat(web): add collapsible session sidebar @ a8e8d6e91b8c6f8a8b3495fb6ba214cdc8594eb6 (https://github.com/tiann/hapi/pull/1747)
- #1745 [CLEAN] perf(hub): stop heartbeat replay from scanning session history @ 8a12664aad7124a05d1ee707dd6c52b1e4b8d8fc (https://github.com/tiann/hapi/pull/1745)
- #1742 [CLEAN] fix(web): let the installed Android status bar follow the system @ 37207319f814a96d7c41c49c79b77daf903847e0 (https://github.com/tiann/hapi/pull/1742)
- #1741 [CLEAN] fix(web): keep streamed reasoning/text block ids stable across snapshot rows @ c22780ba5588340ff2813f9e139f2abaa35f7e65 (https://github.com/tiann/hapi/pull/1741)
- #1738 [CLEAN] fix(hub): capture AGENT_NOTIFY_SUMMARY from peer user-role deliveries @ 5a695fbd1bd367fe15835f9f9742cc37fe9fc160 (https://github.com/tiann/hapi/pull/1738)
- #1733 [CLEAN] feat(web): session-list scrollbar tick for open session position @ ef4636a9fa07932dabaeec76a6e8263d21bfdd78 (https://github.com/tiann/hapi/pull/1733)
- #1730 [CLEAN] feat(web): auto-hide primary session scrollbars @ ea03e477e79bbcc26db781c3d36d8fe40650f758 (https://github.com/tiann/hapi/pull/1730)
- #1729 [CLEAN] fix(web): Enter inserts newline when composer is expanded @ f04288cacaae35ee2c50b381bc4db5604eb03f80 (https://github.com/tiann/hapi/pull/1729)
- #1728 [CLEAN] fix(web): collapse expanded composer immediately on submit @ 7a93bb406734417589da0be5d344161cdd0723b9 (https://github.com/tiann/hapi/pull/1728)
- #1727 [CLEAN] fix(hub,cli): keep inactive file previews available through runner @ db93a3f26c2daa3fa906094001af822527af5d96 (https://github.com/tiann/hapi/pull/1727)
- #1726 [CLEAN] fix(web): align file preview content around scrollbars @ 582a7badd67bdd3f53a09b5e610ec3461f334105 (https://github.com/tiann/hapi/pull/1726)
- #1725 [CLEAN] fix(cli): auto-Continue on Cursor post-tool interrupt; Blocked only on give-up @ fa9a3dbaa757574260607dde3e09cfd78c833f83 (https://github.com/tiann/hapi/pull/1725)
- #1722 [CLEAN] fix(web): allow retrying failed attachment uploads @ 694c7e0cefaad5baeeed3d01ba08b072ab186f2a (https://github.com/tiann/hapi/pull/1722)
- #1721 [CLEAN] fix(pi): support Windows npm command shims @ 02840df43b4f07bbb8ce60ea55264199287dd295 (https://github.com/tiann/hapi/pull/1721)
- #1720 [CLEAN] fix(web): keep mobile code gutters clear across renderers @ 3d7fdb1cada8c896a4104a77c57f4762778b9f94 (https://github.com/tiann/hapi/pull/1720)
- #1719 [CLEAN] feat(pi): auto-title Pi sessions via bundled hapi_change_title extension @ eb5d0f02e29d3554f36dc1939d9399705ee449ae (https://github.com/tiann/hapi/pull/1719)
- #1718 [CLEAN] fix(web,hub): friendly file preview when session CLI is offline @ bbc8d25f05b4e082330ec772ae598748da277293 (https://github.com/tiann/hapi/pull/1718)
- #1716 [CLEAN] fix(opencode): expose model-specific reasoning effort options @ 4bf45206924a7f0c09832edb025164b7dad1240c (https://github.com/tiann/hapi/pull/1716)
- #1715 [CLEAN] fix(pi): render images returned in pi tool results @ bfbde726b9e5dcb9f5f6ad18ce666419135405ae (https://github.com/tiann/hapi/pull/1715)
- #1714 [UNSTABLE] feat(codex): select provider profiles for web sessions @ a227310e3e7438b5940089748367339d060536b1 (https://github.com/tiann/hapi/pull/1714)
- #1713 [CLEAN] feat(web): add mobile attachment source picker @ f95fe0ad169cfd644c16448785bd3cde7ff46691 (https://github.com/tiann/hapi/pull/1713)
- #1712 [CLEAN] feat(workspace): add HAPI Recycle Bin for deleted files @ 073de1de51b051dcbe63355a43d68413ee3c66f0 (https://github.com/tiann/hapi/pull/1712)
- #1711 [CLEAN] feat(web): make detail headers horizontally scrollable @ 36dcc12b3bf6f66d84b33ca087e85f2fa2a7d6f8 (https://github.com/tiann/hapi/pull/1711)
- #1708 [UNSTABLE] feat(cli): auto-steer ping_peer messages into an active turn @ 73630bbd3f3058b3eca9f77df0fe392ca1c4940e (https://github.com/tiann/hapi/pull/1708)
- #1707 [CLEAN] fix(codex): fail closed on ambiguous Web Rewind boundaries @ 710c01c2ae2ff631d41b48c9ad74fb9687b6149a (https://github.com/tiann/hapi/pull/1707)
- #1706 [UNSTABLE] fix(hub): verify runner before trusting archiveSession's dead-CLI fallback @ 26c1615ae754ddb16b43fdbae4850f90ea7d6d85 (https://github.com/tiann/hapi/pull/1706)
- #1704 [CLEAN] feat(web): add independent session header Agent icon toggle @ 7bd0a9bde5378166b9c1865a3a32da872765b6ce (https://github.com/tiann/hapi/pull/1704)
- #1702 [CLEAN] fix(web): debounce and cancel stale file searches @ af8667d9a94f1f0c112920bf2360c7d70e7e3496 (https://github.com/tiann/hapi/pull/1702)
- #1695 [CLEAN] feat(web): add fullscreen preview for shared turns @ de2f96ad729263a7ab2960773e35e42b2d819986 (https://github.com/tiann/hapi/pull/1695)
- #1694 [CLEAN] feat(web): add scroll-to-bottom button @ ec7f502fbdeaf4ebe2a2e72df43dbe4271b56c4a (https://github.com/tiann/hapi/pull/1694)
- #1693 [CLEAN] feat(web): add fullscreen table preview and export actions @ 80b2a3c80eb144c6fbf95fecebb13ba978574227 (https://github.com/tiann/hapi/pull/1693)
- #1692 [CLEAN] feat(agent): add provider-specific agent detail inventories @ 6823582d16dd83331f802a04e342d043a0c3cbee (https://github.com/tiann/hapi/pull/1692)
- #1691 [CLEAN] feat(cli): show Claude compaction as a summary card with token delta @ 8486600423596f0c7b9c84d8fde18cb571ba6053 (https://github.com/tiann/hapi/pull/1691)
- #1685 [CLEAN] fix(web): show Codex round usage metadata @ 283e3153e380b0b7cfb4234060bee462115d89f8 (https://github.com/tiann/hapi/pull/1685)
- #1684 [CLEAN] feat(attachments): persist original attachments in Hub @ b477f2655f1faab45446824fa6f400d7f828badc (https://github.com/tiann/hapi/pull/1684)
- #1683 [CLEAN] feat(hub): add generic webhook notification channel @ 08fa9726e8d0dce5a5a263987fb54cb2ce649d21 (https://github.com/tiann/hapi/pull/1683)
- #1680 [CLEAN] Add Build Remote Agent phone pairing (gbr/1) @ 62a2218d4458559374e52302a2c6f0f2f76e578e (https://github.com/tiann/hapi/pull/1680)
- #1679 [CLEAN] feat(claude): support conversation rewind via native session truncation @ 4db160525bb65016758f333a6969d29888a5cc47 (https://github.com/tiann/hapi/pull/1679)
- #1678 [CLEAN] fix(web): make composer session mention pills ellipsize @ c4c28624db1da06f27bee573d83201692ab7c778 (https://github.com/tiann/hapi/pull/1678)
- #1677 [CLEAN] feat(opencode): import local session history @ 1279cb64d47613c40842b67bd8639fc54dea4234 (https://github.com/tiann/hapi/pull/1677)
- #1676 [CLEAN] feat(opencode): wire session fork via the server HTTP API @ 14a379802b5963cd65b11a700784ae0793d7cff2 (https://github.com/tiann/hapi/pull/1676)
- #1675 [CLEAN] feat(web): surface opencode /compact and /clear in the slash command menu @ a816ff9bc70cb0294e8c6fbde5a84bba19ba42c2 (https://github.com/tiann/hapi/pull/1675)
- #1673 [CLEAN] feat(web): show a fork preview dialog before forking a conversation @ 1eb1265f4c9a9e14baca2a2fe5d1ed0a25454460 (https://github.com/tiann/hapi/pull/1673)
- #1672 [CLEAN] feat(acp): re-enable change_title for ACP launchers with manual title precedence @ 8d6e67d2061e402728cc609ade172ff3d6af2985 (https://github.com/tiann/hapi/pull/1672)
- #1671 [CLEAN] fix(claude): accept first fork child prompt on SessionStart:fork hook @ a5635e594e340cc950511c2567245401fe7ecfa3 (https://github.com/tiann/hapi/pull/1671)
- #1668 [CLEAN] feat(opencode): show round usage metadata @ d729baf5290f63e40079a1d9a059ba8d2e06484f (https://github.com/tiann/hapi/pull/1668)
- #1666 [CLEAN] fix(web): improve generated media retry and sizing @ e32370634d51ec93a8caf5d5ca278f0bba98eb73 (https://github.com/tiann/hapi/pull/1666)
- #1665 [CLEAN] fix(web): improve fullscreen image preview toolbar layout @ 7dd55a12888166b2197ddd349a620039768250db (https://github.com/tiann/hapi/pull/1665)
- #1664 [CLEAN] fix(web): keep machine health visible for single-machine layouts @ dac80dd1d94060889d786df9b9416216b07b0547 (https://github.com/tiann/hapi/pull/1664)
- #1662 [CLEAN] feat(web): unify composer model and effort controls @ a97f6ebd9a2d5026691b18bc728c01d98afece1f (https://github.com/tiann/hapi/pull/1662)
- #1660 [CLEAN] fix(web): support RMB symbol aliases for skill autocomplete @ bf182f8ced3ddeb4a474c9a86b2396dd0c472e56 (https://github.com/tiann/hapi/pull/1660)
- #1659 [CLEAN] feat(web): add frontend composer history for loaded session messages @ d743a300bb512d8e10d7c5edb1c2fd4898096507 (https://github.com/tiann/hapi/pull/1659)
- #1658 [CLEAN] feat(web): add Alt+S shortcut to send messages @ 36df9164850c72a2edd4c9fe4f99e53db0dd305e (https://github.com/tiann/hapi/pull/1658)
- #1657 [CLEAN] fix(web): improve deferred generated-file download controls @ 410c2acd1a8c12a2b76712072f3034e7d912d84b (https://github.com/tiann/hapi/pull/1657)
- #1656 [CLEAN] fix(web): avoid session misclicks during live reordering @ fb962536e280b94f643aeb66f9b0de8cf873eb72 (https://github.com/tiann/hapi/pull/1656)
- #1644 [CLEAN] fix: render opencode edit/write/read tool calls through the shared views @ d608fb3d9d916ee943af2b7805c8ae94ee131ff3 (https://github.com/tiann/hapi/pull/1644)
- #1642 [CLEAN] fix(agy): report the failure reason instead of echoing the answer @ ccc098bf7bb5df49acc5e432a93fe132c4a06dcb (https://github.com/tiann/hapi/pull/1642)
- #1640 [DIRTY] feat: add lightweight shared Agent Studios @ b86a3b6c16c90ab80636a99f07ae9ca58bc129a4 (https://github.com/tiann/hapi/pull/1640)
- #1637 [CLEAN] feat(web): add desktop session sidebar toggle @ f72aaa79c77939d7ded12dfc74660b6018b8e5b2 (https://github.com/tiann/hapi/pull/1637)
- #1636 [CLEAN] fix(web): prevent session navigation on right-click @ 60db9468d95b5197cbc49984f022256057f25dbe (https://github.com/tiann/hapi/pull/1636)
- #1635 [CLEAN] feat(web): show project in session header @ 6c65104bb7c8878c232cb20c22669b9998cd6fb5 (https://github.com/tiann/hapi/pull/1635)
- #1633 [CLEAN] fix(codex): preserve context config in remote sessions @ 4e597e4739022eabadc49d328148ae4d01392d97 (https://github.com/tiann/hapi/pull/1633)
- #1629 [UNSTABLE] fix(agy): stop delivering the same answer twice when deltas are mangled @ a084ba83b531ec4436786d6f703e9ca7ff9b0fd5 (https://github.com/tiann/hapi/pull/1629)
- #1625 [CLEAN] fix(web): provide exact PWA icon sizes for Windows notifications @ 9aa1668bc6f76e6d205b1f26e677902c2bec5f59 (https://github.com/tiann/hapi/pull/1625)
- #1621 [CLEAN] fix(sessions): make title generation discoverable @ ed16db47cd02a8a6ee3691111ef270c043d2b63b (https://github.com/tiann/hapi/pull/1621)
- #1620 [CLEAN] fix(web): coalesce symlink path spellings in session list groups @ 725fd69452ad2eb660b2af419f28c72e43de29c0 (https://github.com/tiann/hapi/pull/1620)
- #1618 [UNSTABLE] feat(peer): nametag-only ping_peer reply attribution @ 70b9174470b1cb2fe4da2f6b21882897bb22433c (https://github.com/tiann/hapi/pull/1618)
- #1617 [CLEAN] fix(web): unify sync session menu labels @ ea5ec5c3c1dc240dee87ab54282e4a47622ee3f0 (https://github.com/tiann/hapi/pull/1617)
- #1616 [CLEAN] fix(web): reuse existing PWA window for notification clicks @ 455917d62f10cbc2034dc08de5b51ee957ee18ee (https://github.com/tiann/hapi/pull/1616)
- #1615 [CLEAN] feat(hub): add optional WxPusher completion notifications @ 1732dcfc1edf4c879f483a2c0ee6c04d46169c3b (https://github.com/tiann/hapi/pull/1615)
- #1614 [CLEAN] Make web terminals persistent and attachable @ 64770fb335544e95bbbc549c55e3d587b428d8d0 (https://github.com/tiann/hapi/pull/1614)
- #1613 [CLEAN] fix(cursor): isolate HAPI MCP overlay to project mcp.json @ 82caab248e7a20255eea0059432edd9f2a9af88f (https://github.com/tiann/hapi/pull/1613)
- #1611 [CLEAN] fix(scratchlist): persist manual ordering and improve draft actions @ b4523eb5265a53e4cd7bcfed23e3f6e441045623 (https://github.com/tiann/hapi/pull/1611)
- #1610 [CLEAN] feat(cli,web): per-queued-message Steer for Codex and Cursor mid-turn (#888) @ 39ebb03180f998e143826d1e9dd85864af420ce3 (https://github.com/tiann/hapi/pull/1610)
- #1607 [CLEAN] feat(web,hub): right-click context menu for sidebar project groups (#881) @ f6cb2324fddb8bf3062faa6d077bcd0917311384 (https://github.com/tiann/hapi/pull/1607)
- #1605 [CLEAN] feat(claude): discover models and context window from the CLI @ 067ce9248bc8ea1ddf98900801942859ae93373c (https://github.com/tiann/hapi/pull/1605)
- #1604 [CLEAN] fix(codex): gate history actions until native thread is ready @ 365cb88345014d9a0e152e38faad4548dba4d61f (https://github.com/tiann/hapi/pull/1604)
- #1603 [CLEAN] fix(web): align Fork/Rewind confirmation dialogs @ 2fbdb4f1f4c5e89da4890e1244e9be93dd70bb71 (https://github.com/tiann/hapi/pull/1603)
- #1599 [CLEAN] fix(web): consolidate tool card display settings @ cc28570fc5fee2527f6f62d0c8690c747f0c0f23 (https://github.com/tiann/hapi/pull/1599)
- #1598 [CLEAN] feat(web,hub): add opt-in search for session message content @ 14ed44c4d58eecbd8cf7547de48bc31118174221 (https://github.com/tiann/hapi/pull/1598)
- #1597 [CLEAN] feat(web): assistant response navigation with window-store-safe jumps (#1093 + #1587) @ 263807f87ec00e4771447ba1590e7792d14421ef (https://github.com/tiann/hapi/pull/1597)
- #1592 [CLEAN] fix(web): apply reasoning collapse preference to history @ 67112915c48b949df6f2311d4de7cf040c1019aa (https://github.com/tiann/hapi/pull/1592)
- #1581 [CLEAN] fix(web): clear stale drafts after delayed queued sends @ e44672f506450804dfbeadad3572dd00786cc451 (https://github.com/tiann/hapi/pull/1581)
- #1567 [DIRTY] feat: add Reasonix ACP integration @ aa7fdf0f5bfbacf811cf745409ae7aacb9c84bc3 (https://github.com/tiann/hapi/pull/1567)
- #1564 [CLEAN] feat(cli): Cursor-only display_links MCP for unmangled URLs @ 6e9620f7bfe5f0295c589a6ed794174657f13f22 (https://github.com/tiann/hapi/pull/1564)
- #1543 [CLEAN] fix(web): preserve shared turn layout and generated file downloads @ 1853ca8e6f6cb5330675a73139741baaaa78807b (https://github.com/tiann/hapi/pull/1543)
- #1542 [CLEAN] fix(web): keep loaded older history in the window while a session streams @ 7d8c12c4d4d363f3cc7b2ee6f06fa0969b5e24b3 (https://github.com/tiann/hapi/pull/1542)
- #1537 [DIRTY] feat: add peer tools exposure toggle (#1401) @ 693aed6e40beed850caeb65ac32fb4e6d68442d5 (https://github.com/tiann/hapi/pull/1537)
- #1528 [UNSTABLE] fix(hub): make session timeout and reconnect state durable and consistent @ 3517c527077d71033ec3782185ca4cf6d280d0f4 (https://github.com/tiann/hapi/pull/1528)
- #1527 [UNSTABLE] feat(cli): survive terminal hangup by switching the session to remote mode @ 597c28d6bcb5dd2fc8938197d60e5dea9d327821 (https://github.com/tiann/hapi/pull/1527)
- #1525 [DIRTY] test(cli): make the suite pass on macOS hosts @ 85e5ec888140097893bdf30dfe1b101145d2c54e (https://github.com/tiann/hapi/pull/1525)
- #1523 [CLEAN] fix(web): unify agent task status presentation @ 9cb4ec763a34c377979f29b676d99875ca63fa6f (https://github.com/tiann/hapi/pull/1523)
- #1517 [DIRTY] Fix Telegram Mini App polish and file tree state @ d9767f92f0beb3a245ed2329030126441676e8e0 (https://github.com/tiann/hapi/pull/1517)
- #1512 [CLEAN] fix(web): use latest assistant replies for session recency @ 46939c05fb8eb4515c6845d472d71a21a31fe201 (https://github.com/tiann/hapi/pull/1512)
- #1511 [UNSTABLE] feat(cli): spawn-peer CLI + MCP spawn_peer for peer spawn with remit @ 52c51ba51c0d13a7c56b99ac0be161d5e4eebefe (https://github.com/tiann/hapi/pull/1511)
- #1468 [CLEAN] feat(usage): record ACP cost and surface per-agent reporting availability @ 2936e0f780032eea5d6eb86173b47b3694369d22 (https://github.com/tiann/hapi/pull/1468)
- #1451 [CLEAN] feat(web): configure Create agent visibility @ c6f4021e33d03cbf28a9b887cb2bb2e880f88431 (https://github.com/tiann/hapi/pull/1451)
- #1447 [CLEAN] feat(web): add separate option to pin active sessions @ 19daba6f54b3bc99d4645dd3be25cdc6d2be7b4b (https://github.com/tiann/hapi/pull/1447)
- #1443 [DIRTY] feat: restore mid-turn steer for Codex and Cursor @ 1888de0e1e3fd9ae84001d49e56e8d607b4b67f8 (https://github.com/tiann/hapi/pull/1443)
- #1436 [CLEAN] feat(web): persist and send voice input message across session navigation (#1435) @ 37406027425a084c4f106ca94ccaf7c8084cd853 (https://github.com/tiann/hapi/pull/1436)
- #1429 [DIRTY] feat(claude): import local session history @ 5d3f41bb10bb22e7186d1abc0fc45e5659be479d (https://github.com/tiann/hapi/pull/1429)
- #1424 [CLEAN] feat: show progress bar on session for hours-long jobs @ 67d3a037dbefd41e47c6db1637a76f70d3ebd69a (https://github.com/tiann/hapi/pull/1424)
- #1422 [CLEAN] fix(web): make long file errors expandable @ 825d3a6e95ccec7896bc45782e906fe3201b1b1a (https://github.com/tiann/hapi/pull/1422)
- #1421 [CLEAN] feat(web): remember all launch settings options in NewSession preferences @ 23d0a8d65dcbfadca4ef586d01b827a0fdedf2f9 (https://github.com/tiann/hapi/pull/1421)
- #1419 [CLEAN] feat(web): add direct send button during active voice session @ cb64200637941ed429855a82ffcf2db977610416 (https://github.com/tiann/hapi/pull/1419)
- #1418 [CLEAN] feat(web): drag sessions into composer mentions @ dd0d0331e4af8282d5e756ecc894b05ca23e2b59 (https://github.com/tiann/hapi/pull/1418)
- #1414 [CLEAN] fix(web): hide redundant machine labels on single-machine pinned rows @ b7230bd4b9809abdc30345ed37fd5f7e734b26bf (https://github.com/tiann/hapi/pull/1414)
- #1361 [CLEAN] Fix/codex sync idle active @ e1e7e8c3fbcfcdaaff872398c1d08758d3dcef0f (https://github.com/tiann/hapi/pull/1361)
- #1360 [CLEAN] feat: add notification preferences and customizable web push copy @ b9c9975ae1afa1455385fdd69509c3f8c169c728 (https://github.com/tiann/hapi/pull/1360)
- #1351 [DIRTY] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1309 [draft] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [DIRTY] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [DIRTY] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [DIRTY] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ 999f1d1170d382cc4fd5e5fdf6e0a6ab4a0bf65f (https://github.com/tiann/hapi/pull/1193)
- #1189 [DIRTY] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [DIRTY] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [CLEAN] feat(session): opt-in GitHub PR awareness + explicit attach @ b4e0f589d6167e88769765ab968f808bd1f10fd1 (https://github.com/tiann/hapi/pull/1163)
- #1158 [CLEAN] fix(web): unify session header display labels @ b00e39794e707d3bdbd6ab1029b5a6576b3cf985 (https://github.com/tiann/hapi/pull/1158)
- #1126 [DIRTY] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1099 [DIRTY] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [CLEAN] feat(web): add assistant response navigation @ 505872ecaafb64bfc002daf393adb62571c433cd (https://github.com/tiann/hapi/pull/1093)
- #1092 [DIRTY] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [DIRTY] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [DIRTY] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [UNSTABLE] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [CLEAN] feat(cursor): detect inline model errors, surface, notify, and bridge (#878) @ 0648c56eee5ad94ab641a8446eecb3f1ef97def8 (https://github.com/tiann/hapi/pull/987)
- #975 [DIRTY] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #945 [UNSTABLE] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ 95b53c80c96c0f76c18e69edb9cb7691f62a2ba8 (https://github.com/tiann/hapi/pull/945)
- #942 [DIRTY] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
- #847 [UNSTABLE] Codex usage indicator with cross-flavor budget gauge shape (rebase of #537) @ 34b315d82712e173f0e2aa92e9136bbf0c67efcd (https://github.com/tiann/hapi/pull/847)
- #663 [DIRTY]   feat: support Codex local goal sync and remote approvals @ 5dbf6d406a6bb8507dc07598ba2aecc8cd98ee0f (https://github.com/tiann/hapi/pull/663)
- #658 [DIRTY] fix(cli): preserve permission mode after ExitPlanMode + sidechain UUID chain fix @ f7d8ca3ea0f8ae47245443ce2c0cfec612263e62 (https://github.com/tiann/hapi/pull/658)
- #553 [DIRTY] feat(hub): add WeCom bot push notification channel @ 6e3da463f4fb213afc6a95d3005232e647f39ec6 (https://github.com/tiann/hapi/pull/553)
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
Official upstream is authoritative; upstreamed PRs are accepted and are not replayed.

## Selection and integration

161 current open PRs: 59 carry, 98 defer, 4 drop. All prior heads were compared with a fresh GitHub snapshot, live checks, latest-head HAPI Bot reviews, and maintainer comments. Nine heads are new or changed since v0.29.0.5.

carry: pr-1776, pr-1773, pr-1771, pr-1770, pr-1766, pr-1761, pr-1760, pr-1757, pr-1755, pr-1754, pr-1750, pr-1748, pr-1741, pr-1729, pr-1728, pr-1727, pr-1726, pr-1721, pr-1720, pr-1715, pr-1707, pr-1702, pr-1694, pr-1685, pr-1683, pr-1679, pr-1678, pr-1671, pr-1666, pr-1664, pr-1662, pr-1660, pr-1656, pr-1644, pr-1637, pr-1636, pr-1635, pr-1633, pr-1621, pr-1620, pr-1616, pr-1615, pr-1610, pr-1607, pr-1604, pr-1592, pr-1581, pr-1543, pr-1542, pr-1468, pr-1451, pr-1436, pr-1424, pr-1422, pr-1421, pr-1419, pr-1418, pr-1414, pr-1158.

defer: pr-1774, pr-1772, pr-1762, pr-1759, pr-1758, pr-1753, pr-1751, pr-1747, pr-1745, pr-1742, pr-1738, pr-1733, pr-1730, pr-1725, pr-1722, pr-1719, pr-1718, pr-1716, pr-1714, pr-1713, pr-1712, pr-1711, pr-1708, pr-1706, pr-1704, pr-1695, pr-1693, pr-1692, pr-1691, pr-1684, pr-1677, pr-1676, pr-1675, pr-1673, pr-1672, pr-1668, pr-1665, pr-1659, pr-1658, pr-1657, pr-1642, pr-1640, pr-1629, pr-1625, pr-1618, pr-1617, pr-1614, pr-1613, pr-1611, pr-1605, pr-1603, pr-1599, pr-1598, pr-1567, pr-1564, pr-1537, pr-1528, pr-1527, pr-1525, pr-1523, pr-1517, pr-1512, pr-1511, pr-1447, pr-1443, pr-1429, pr-1361, pr-1360, pr-1351, pr-1309, pr-1257, pr-1242, pr-1212, pr-1193, pr-1189, pr-1188, pr-1163, pr-1126, pr-1099, pr-1092, pr-1059, pr-1054, pr-987, pr-975, pr-945, pr-942, pr-847, pr-663, pr-658, pr-553, pr-536, pr-535, pr-518, pr-490, pr-484, pr-394, pr-325, pr-312.

drop: pr-1680, pr-1597, pr-1093, pr-1091.

Upstream remains 980a921ba15665c54998a6ddb658103d467ff4cb. The previous origin delta was audited with git cherry; all 30 prior fork commits are accounted for in the regenerated source overlay, including prior release metadata and review fixes. No historical queue was replayed.

The resolved source integrates PR 1771 with existing job and upgrade capabilities, hub-owned metadata protections, permission boundaries, context-window settings, and archived-group running-job guards. Removed HAPI summary/locale prompt injection supersedes those parts of older carries; user-authored prompts and display/capture remain. The built-in native skill is named hapi-session-runtime to coexist with user-owned Skillshare hapi-session-control symlinks; ownership and shadowing checks remain fail-closed. A symlink coexistence regression verifies no overwrite.

PR 1607 uses DELETE RETURNING id while preserving the running-job NOT EXISTS predicate. PR 1766 retains maintained rewind/fork fallback and history-boundary callbacks. Spawn-with-remit uses Zod safeExtend to retain the existing resume-flavor refinement; a regression verifies it.

PR 1771 manual scope map: CLI/MCP exact-ID commands and retry identity; native skill installation/runtime assets; Hub atomic spawn/remit state and restart reconciliation; lifecycle stop/archive/delete separation; prompt-removal across agent adapters; Grok permission-mode parity across Web/iOS/Android fixtures. Personal policy accepts its size; exact-head HAPI Bot is clean.

## Local validation

Bun 1.4.0, macOS arm64. Fresh `bun typecheck` exited 0 for all five targets. Fresh `bun run test` exited 0: CLI 2937 pass/13 skip, Hub 1557 pass/3 skip, Web 3290 pass, Shared 333 pass, Relay 80 pass, Desktop 5 pass (8202 passed, 16 skipped, zero failures). Runner integration: 14 passed/1 skipped, final process audit passed. Maintenance safety tests: 42 passed. Required Playwright terminal-wrap and composer-copy: 7/7 passed. Additional browser suite: 24 passed; one share-export image comparison requires the Linux snapshot and will be verified by exact-head Linux CI, because no Darwin baseline exists. No baseline was manufactured.

Fixtures regenerated without drift beyond the intentional Grok mode catalog change. Darwin arm64 and Windows x64 standalone binaries build successfully; the Darwin binary reports 0.29.0.6 and exposes the new JSON peer command help. Native platform CI remains required.

Pre-push review: full upstream delta and prior-release integration boundaries reviewed against `.github/prompts/codex-pr-review.md` and the shared logic checklist. Resolved refinement inheritance, summary-display stale references, native skill symlink collision, capability-aware test doubles, and cascading row-count behavior. No unresolved Major finding. User-managed skills, live session state, and production checkout remain untouched.

Native local gate: `swift test --package-path ios/Packages/HapiKit` passed 627 tests in 64 suites.

Pre-review fingerprint integration: include cli/skills in both content and stat input enumeration. Fresh typecheck and full unit gate passed again: 8203 passed / 16 skipped / zero failures (Hub now 1558). Source fingerprint 26d3071d34f6760da93fd5251157794cb1e5e3dc725df2b9df208bb0141c8800; Windows runner-only artifact SHA-256 988aeb0abe9db0190a89cd4eb46997601826242865127a184c8305a3e1d66265. Source patch was split at file boundaries into two sub-100MB mail patches plus this final focused patch. Full initial replay tests and split replay tree equality passed; final replay checks the exact tested source tree.


Review repair: Gemini reproduced startup refusal when an interrupted first native-skill install left an empty directory. The installer now claims only a new or empty directory under the existing lock; nonempty unmanaged directories and symlinks remain protected. The empty-directory regression failed before the fix and all 19 skill tests passed afterward. Fresh typecheck passed. Final package verification: CLI 2939 passed / 13 skipped, Hub 1558 passed / 3 skipped, Web 3290 passed with `bun run --cwd web test --maxWorkers=2`, shared 333, relay 80, desktop 5; total 8205 passed / 16 skipped / zero failures. Default-parallel local runs encountered timing failures under observed load averages above 50; the unchanged Web suite passed in full at two workers without increasing timeouts. Fresh exact-head CI remains required before release.

The fourth replay patch preserves this repair. Rehearsal passed with canonical source tree `cdc616aa9f56d8c1c674b805558c2d7b4d917f59`; source generation is `297f56d095f17f2bc3f8c0c9256eae3ce31792ad92839afd78951de4c7cf20b1`. Rebuilt Windows runner-only artifact SHA-256 is `372969f3651b68c8e4dea18e22d4199c520c10591ab325cfea06cde9a7df1af3` (141225984 bytes), independently verified after transfer to mazu.

Final live audit additionally found personal PR #1776 at 20594f7115b16908ceb8ca70d9fede12630e3353, with current-head CI and HAPI Bot clean. Its viewport snapshot component is integrated while retaining session dragging and project group actions. All ten new Chromium regressions pass with native anchoring enabled and disabled; the required browser total is 17/17.

Codex review repairs wait within the existing readiness deadline for delayed runtime settings, retain the CLI remit_conflict code, and reject localId retries that change scheduling or promote queue to steer. The existing steer-to-queue safe retry remains supported. Gemini's worktree finding is fixed using Node path containment, including normalized repository subdirectories and Windows drives; unrelated, sibling, traversal, and relative base paths are rejected. Regressions reproduced the reported failures before repair.

The five-patch replay passed live PR-set/head gates and reproduced canonical source tree 5eb42eab259638f9711b326db9c9be16d0bed62b. This replay used --skip-tests only after the earlier full clean replay; the final candidate runs the entire unit gate separately with bounded CLI/Web workers. Maintenance tests passed 42/42; fresh Runner integration passed 14 with 1 existing skip.

Final pre-push gate: all five typecheck targets passed; CLI 2940 passed/13 skipped, Hub 1568 passed/3 skipped, Web 3290 passed, Shared 333, Relay 80, Desktop 5. Total 8216 passed, 16 existing skips, zero failures. Full CLI/Web suites used two workers with unchanged test timeouts. Windows runner generation 76bffbe8803e44d9caef851fc648b8183637875682511f019bf8715f077bb2c0, SHA-256 2f8c99604e7664636d29f3436fa5a666625c74b18c2aa28dc9c89ff7721e4a7b, 141229056 bytes. Hub bundle and embedded Web assets rebuilt.

Second Codex review repair: every post-spawn failure retains the original remit ID, including intermediary HTTP 502/504 and mismatched response IDs. Intermediary errors explicitly report an unknown spawn outcome so callers can safely retry the identical request. Effort validation reuses shared supportsEffort, restoring Kimi and Copilot support in both CLI and MCP. Regressions failed before repair, then all 20 spawn tests passed. Fresh full typecheck and package gate passed: 8218 passed, 16 existing skips, zero failures. Six-patch replay matches canonical source tree c4acd769ed5d00b7acaa0760a244e7952943ee15. The stable post-test Windows artifact has generation d5b2997e583a13f6d223ef9b8b17ed72f3d3e4327035062007e3ce2b2a4b5cc8, SHA-256 d75ecb209a6b20e49d159df649fffb758caeafe007be8a97f1d61ed3a11dd473, 141229568 bytes; before/after source fingerprints match.

Third Codex review repairs: compare the embedded canonical skill content before accepting a same-version runtime cache; refresh existing HAPI-owned shared skill copies before native catalog verification while preserving unowned/symlinked content; remove unconditional MCP same-remit retry advice; reject resumeSessionId in the fresh-remit schema; and read remit messages before checking current thinking state. Five CLI regressions and the Codex resume schema regression reproduced before repair. All 51 targeted CLI and 16 schema tests pass. Fresh typecheck and full package gate: 8224 passed, 16 existing skips, zero failures. Fresh Runner integration: 14 passed/1 skipped. Seven-patch replay matches source tree 9f7efe089f1069ca090a80a3d0bf2e8910fdd460. Stable Windows generation 240c0baf34948b6ee6d5f929c477a5eb98dfb051af90580fb68be1ffb65d0aab, SHA-256 be54e8a5063185c50eb60b73482146c371ea9db55fd14dbf0c3e149739599fec, 141230592 bytes.

Fourth Codex review repairs: existing invoked localId rows return success without re-emitting to a restarted CLI, after payload conflict validation; uninvoked retry delivery is preserved. A fresh MessageService over the same durable store reproduces the previous duplicate execution path and now passes. Effort guidance is aligned across the bundled skill, CLI help, and README for Kimi/Copilot. Fresh full typecheck/package gate: 8225 passed, 16 existing skips, zero failures; actual spawn-peer --help output checked. Eight-patch replay matches e8c6b84cbbea5bd28ffed83499e963e31d5aa5ec. Stable Windows generation 2cbc30328ae4c1e01b750e25ebd62b382b1481960ad15235068816500f0428b6, SHA-256 cc9637cf2dbb70df4c715dad07abf04c26bf6fe3395c2368487556dc8e93ffe6, 141230592 bytes.

Fifth Codex review repair: the RPC gateway preserves proof that a spawn was never dispatched. Only this call's newly reserved session may then be archived without Runner exit evidence; reused pending reservations and ambiguous outcomes keep normal cleanup. Codex remit results reconcile cumulative snapshots by stable stream ID using the existing chat fixture. Both regressions failed before repair. Fresh full typecheck and package gate passed: CLI 2948/13 skipped, Hub 1572/3 skipped, Web 3290, Shared 334, Relay 80, Desktop 5; total 8229 passed, 16 existing skips, zero failures. Nine-patch replay passed live PR-set/head gates and matches canonical source tree ba6b7c58dc86caf1ff5d4efe893c0db55cf234e7. Post-test Windows generation a4957025cc81af425afd3c0f43c305742b58f1e3e82ecf4fc257c3d81464b51f, SHA-256 344002900ce91dca8cca50040e302ee281d2b3eeec6bee8896352329c549cde5, 141231616 bytes; before/after source fingerprints agree. Hub bundle rebuilt.

Sixth Codex review repair: conflicting spawn remit IDs now return HTTP 409 rather than 502; operational failures retain 502. The API contract and route regression cover both outcomes; the conflict regression failed before repair. Fresh full typecheck and package gate passed: CLI 2948/13 skipped, Hub 1574/3 skipped, Web 3290, Shared 334, Relay 80, Desktop 5; total 8231 passed, 16 existing skips, zero failures. Ten-patch replay passed live PR-set/head gates and matches canonical source tree f8b02a2a651b61fefe79d68ec697e4f537e4ba41. Post-test Windows generation a3938860d5708aae3b8dc68bcbcfc51b2bbf115734c01b465879042f0341fd7f, SHA-256 fe1bf129b4329d2fa966a5cda83d28253dde9513d55c4ce1e28c312089c84154, 141231616 bytes; before/after source fingerprints agree. Hub bundle rebuilt.

Seventh Codex review repair: inactive partial remit results require a durable following-turn boundary; otherwise wait-peer reports session_ended. Polling retries transport/5xx failures while deterministic HTTP failures stop immediately, and an AbortSignal bounds outstanding requests to the original deadline. Bulk mark-as-read requires every changed-store write to succeed and keeps its confirmation open with an error when storage fails; consumers still receive actual partial write changes. CLI and storage/UI regressions failed before repair, then passed, including real request cancellation. Storage spies cover both the test memory fallback and native Storage owner. Fresh full typecheck and package gate passed: CLI 2955/13 skipped, Hub 1574/3 skipped, Web 3294, Shared 334, Relay 80, Desktop 5; total 8242 passed, 16 existing skips, zero failures. Chromium 17/17 passed again. Eleven-patch replay passed live PR-set/head gates and matches canonical source tree 9685e9b92ab4920c9dc69da1c01768ac4fb3a99a. Web/embedded assets and Hub rebuilt. Post-test Windows generation ef15a5f023dc7d7236e027efd0f25928a6826122547f37bc4a60463cdee964d5, SHA-256 9349c7ef879894fe891563c05c512bc89fe498b241f1c23970f6ba35974cfe01, 141232640 bytes; before/after source fingerprints agree.

Eighth review/preflight repair: wait-peer compares user invocation timestamps so same-batch sibling messages do not terminate a result. A later invocation remains a boundary. Runtime preflight also found that HTML responses lacked the maintained no-store policy, including the live v0.29.0.5 origin; one shared middleware now covers source and compiled HTML serving without changing API or JS asset cache behavior. An isolated real-Hub regression failed before repair and passed for GET/HEAD, index, SPA fallback, API, and JS paths. Fresh full typecheck and package gate passed: CLI 2957/13 skipped, Hub 1575/3 skipped, Web 3294, Shared 334, Relay 80, Desktop 5; total 8245 passed, 16 existing skips, zero failures. Twelve-patch replay passed live PR-set/head gates and matches canonical source tree f7a6f3bf9ded3087543ce34dc8108baf01d88386. Post-test Windows generation 40b9968812921d380a6607516814eed30f0cacdb8600f5bcb8fbb75fa3dd85f8, SHA-256 dcb29b748af4472edcd3ecdad84da02577e9f7bb3cb4d71d019e8b779c63b4a3, 141233152 bytes; before/after source fingerprints agree. Hub bundle rebuilt.
