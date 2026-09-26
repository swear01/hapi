# HAPI maintained release audit

Previous maintained release: v0.30.7.2

Official release: v0.30.7

Personal PR owner: swear01

Origin main: 4f702af4f3236ccd2de61d630ea090b35c5d8c2b
Upstream main: 86c88df93baf5d1f738dd4b202078bdf6dec376e

## Fork-only commits

- 4f702af4f3236ccd2de61d630ea090b35c5d8c2b Merge pull request #23 from swear01/policy/exclude-closed-prs-20260925
- 7a48fb52ba6f651d5533ec090d8ef2a8ec485d7c docs(maintenance): exclude closed unmerged upstream PRs
- f59b8f311f1251feb6c23e4087d781a5582020e7 Merge pull request #24 from swear01/fix/share-turn-linux-snapshot-20260926
- d6a13e983d641ab9113311cc884e4ad475f60d53 fix(test): refresh Linux share-turn snapshot for LaTeX fixture
- cad711291a1c4659a46ff452ef0b78006bdc577f chore(release): prepare maintained v0.30.7.2
- 9d361352be2f0adccca88987a9143af782da57ea fix(web): memoize thread list snapshot and bind state subscription to prevent scroll update loop
- 76ead245432147454d2d4c86fb9bf56392839f9a chore(release): record v0.30.7.1 overlay patches and audit
- 9f770015ac232dddcb8e3f79f957259ea2368b0c chore(release): add v0.30.7.1 release notes and support parent ancestor pin
- ff2651cac359256a74d48634545577a29d69799f feat(web): integrate PR #1436 voice dictation direct-send and cross-session delivery
- abf77cd9a4f43ea4465a9c6910e67a2ace3677ef Merge tag 'v0.30.7' into release/v0.30.7.1
- 0239edf38e2da653d662f31039e24ccea04c7837 Release version 0.30.7
- 76d578dcaa6c8dd7cc0d3a6ce56eb2513da397c7 chore(release): refresh v0.30.4.1 overlay after Android review fixes
- b63056866835a874b1b489a092baf11e6aee09d0 fix(android): keep Codex plan spinner visible and CAS retries
- 2da551a8b127539da6cd3d61e3f91935ca1faf4e chore(release): refresh v0.30.4.1 overlay patch after lockfile pin
- 5522db78aa138b5c9cd03053e1bc89b743663148 fix(release): refresh bun.lock so tar 7.5.x matches Bun 1.4.0
- f6d1574036e2d4a7e337ea49ee0c0f8743e74eaa chore(release): record v0.30.4.1 overlay patches and audit
- 8e85eb769a957e71369f81b59fab50bb568fc028 rebuild maintained v0.30.4.1 onto official v0.30.4
- 13c718e68af06560a6a20f4b8bbc03625a5bbf65 fix(android): isolate grapheme merge so Matcher.end() stays valid
- 9b03324b83c9f363c09f0d9effae7b9cae56103a fix(android): keep TextPaging matcher.end() behind a successful find
- cb78c88c974650b31dff92c586f098cc43686c83 fix(release): unblock v0.30.2.1 CI test and Android review
- 3c4ebc844f95f803108a8c98c8b744de98618a08 chore(release): refresh v0.30.2.1 PR heads for rehearsal
- c080b06900630f4de0901948405b6afce8cf0d82 chore(release): record v0.30.2.1 overlay patches and audit
- d39f10553eae2c7492228536ec1d0495342d8e40 chore(release): rebuild maintained v0.30.1.1 onto official main

## Open upstream pull requests

- #1922 [CLEAN] feat(peer): spawn-peer remit + rename-proof Parent UUID stamps @ 44c7994f5c414ab548e94bb8dcb40bb5e576b608 (https://github.com/tiann/hapi/pull/1922)
- #1921 [CLEAN] fix(hub): typed errors for undeliverable permission answers and aborts @ b46689bcac9f47f556bee7a6474e5230b9af1e0b (https://github.com/tiann/hapi/pull/1921)
- #1920 [CLEAN] fix(cli): report the inline-media shell fallback as not applicable in packaged installs @ fd7cd5844d24df4533b8969c6d7ffab2af9205c0 (https://github.com/tiann/hapi/pull/1920)
- #1916 [CLEAN] fix(cli): discover DSH skills from the DeepSeek Harness home @ 630c9fc7f0768080fbd101d02b728b79f7ddeef2 (https://github.com/tiann/hapi/pull/1916)
- #1909 [CLEAN] fix(cursor): in-place relaunch when switching live session to Auto @ df015641a9ccbf6cd1ba826e8507a680bd63be99 (https://github.com/tiann/hapi/pull/1909)
- #1907 [CLEAN] test(ios): make SessionSplit width assertion responsive @ 80eb8c632666327379a6e44e18d9c6a8daf2ce31 (https://github.com/tiann/hapi/pull/1907)
- #1903 [CLEAN] fix(web): synthesize answerable card for pending permissions dropped by the tracer @ 2389d9b391df9e4ad054838eee34e6273ef82680 (https://github.com/tiann/hapi/pull/1903)
- #1901 [CLEAN] feat(codex): thin Codex budget gauge in composer (replaces #847) @ ac5d2f9ad068c68c3ec5f7d6641af2c343799141 (https://github.com/tiann/hapi/pull/1901)
- #1898 [CLEAN] fix(cli): flush buffered ACP assistant text after an idle gap @ bd6ffb5fe8cb20a8f2ca6a58ebae6175dffafc43 (https://github.com/tiann/hapi/pull/1898)
- #1897 [DIRTY] runner: adopt self-reported concurrent-clients roots into the resume registry @ 85c63822e722cbc15f3b18967d4e19b4f06bed41 (https://github.com/tiann/hapi/pull/1897)
- #1892 [CLEAN] fix(spawn-peer): treat permissionMode default as omit so stock yolo wins @ 362b5ac821b9dbdd75a2f622f9d986c0ae91d197 (https://github.com/tiann/hapi/pull/1892)
- #1890 [CLEAN] fix(cli): bound path-policy symlink resolution with a deadline @ 05c87b3e933fb6094479ab5827735960fbce7c01 (https://github.com/tiann/hapi/pull/1890)
- #1889 [CLEAN] fix(hub): treat message traffic as session liveness evidence @ 74f6765eb17cdade37bfb745c225bf76add4de94 (https://github.com/tiann/hapi/pull/1889)
- #1886 [CLEAN] perf(hub): page usage backfill instead of loading session history at once @ 736fcc7831327e882ec8722e9280a2fbbe2b1d3c (https://github.com/tiann/hapi/pull/1886)
- #1885 [UNSTABLE] fix(hub): repair hub URLs/CORS origins and accept same-host handshakes @ d5b78a3e33fbb217cdad46366a5eee3217796863 (https://github.com/tiann/hapi/pull/1885)
- #1881 [CLEAN] Nudge runner to reconnect idle session sockets when messages arrive @ 257cee4310b22867aa39e34f1b209bb7f66758e9 (https://github.com/tiann/hapi/pull/1881)
- #1880 [DIRTY] Hard resume-size guard for oversized sessions (prevent hub OOM on resume) @ f70e1582260c7a46938145b365020be59d400c48 (https://github.com/tiann/hapi/pull/1880)
- #1879 [CLEAN] feat(cli): honor standard proxy env vars for hub egress @ 04a7489036e6c837f680cc93288988a3cb139ddf (https://github.com/tiann/hapi/pull/1879)
- #1878 [CLEAN] hub: keep sessions online while the runner still sees a live agent process @ c3d2198632177b4df577dee6521f740537fbcc07 (https://github.com/tiann/hapi/pull/1878)
- #1877 [CLEAN] fix(hub): extend the offline-detection grace for thinking sessions @ 3351b6d213bfe033a271ae32a2cfa382b922add2 (https://github.com/tiann/hapi/pull/1877)
- #1876 [UNSTABLE] fix(web): avoid running state for child traces without lifecycle @ a16cd59c60035241150e43548d6f447190c16b3a (https://github.com/tiann/hapi/pull/1876)
- #1875 [CLEAN] fix(hub): skip side effects for replayed message IDs @ 1ea30933c68456c3c62ac26eec0af0119248f4a3 (https://github.com/tiann/hapi/pull/1875)
- #1871 [UNSTABLE] feat(web): group action menu with pin, rename, and copy path @ d2a0e7c1b654aa09a469f7460a40a8ae88b7283c (https://github.com/tiann/hapi/pull/1871)
- #1869 [CLEAN] fix(test): use portable `ps axeww` in test-process audit @ fe68899a6a78accf76706395713c4c787ec2b2e9 (https://github.com/tiann/hapi/pull/1869)
- #1867 [UNSTABLE] fix(cli): stamp test hub with HAPI_TEST_MARKER for orphan reap @ 50cfa158ac51ff3ca64b63096b977a01cce8c48a (https://github.com/tiann/hapi/pull/1867)
- #1852 [UNSTABLE] fix(attachments): journal interrupted attachment creations @ ce9596df1650a0b178eca7be759a7fac8f8c9f06 (https://github.com/tiann/hapi/pull/1852)
- #1849 [CLEAN] fix(cli): let agent titles replace Fork seed summaries @ 7fbd675f3f1e27d6c81a6b1134b032c9720a1050 (https://github.com/tiann/hapi/pull/1849)
- #1844 [CLEAN] fix(hub): keep notify-cause ingest bounded by advancing the resume watermark @ bb24e6b6254b1f210703a7e024bd5a6e0f44e31c (https://github.com/tiann/hapi/pull/1844)
- #1838 [DIRTY] feat(preview): nginx-style preview_* MCP tools mounted on the hub port @ f33c573efb81495b3c27b09a33678bdb28d0fd4e (https://github.com/tiann/hapi/pull/1838)
- #1836 [DIRTY] feat(codex): offer Luna Reserve as a manual model choice @ 3fe0ec5072c41f0445e13f63f822c278d0095054 (https://github.com/tiann/hapi/pull/1836)
- #1831 [CLEAN] feat(pi): inject hapi_display_image and render inline tool-result images @ 0ab08bfca124dc75e2c6b3671f2feb2cd0759565 (https://github.com/tiann/hapi/pull/1831)
- #1826 [CLEAN] fix(pi): keep imported transcript titles out of metadata.name @ 2317b3328b5f65ce374349e3fbf4250048d73d9e (https://github.com/tiann/hapi/pull/1826)
- #1825 [CLEAN] feat(cli): auto-steer ping_peer into active turn (takeover #1708) @ bb2fb712ca3d437df51fe6c73df6c6efe6c9c9af (https://github.com/tiann/hapi/pull/1825)
- #1822 [DIRTY] fix(cursor): keep ACP wire ids spawn-safe and apply effort (#1818) @ 5b78b7313f110bdbb54f47a5a6c0045d461ad0ee (https://github.com/tiann/hapi/pull/1822)
- #1816 [CLEAN] docs(agents): add a bounded PR review-wait and auto-fix loop @ 9f8a4afb86600d91f6b931a2f3837dbff765c021 (https://github.com/tiann/hapi/pull/1816)
- #1801 [CLEAN] feat(web): add include and exclude session search modes @ dfd8df6d298272d8556b30d06364471551aca48a (https://github.com/tiann/hapi/pull/1801)
- #1798 [CLEAN] feat(web): show unavailable Agents on demand @ 578241ad604b0de6581c79fe0ce7d7543b07f754 (https://github.com/tiann/hapi/pull/1798)
- #1797 [CLEAN] fix(web): allow directory collapse during session search @ 14df9508dd684702ec5368161e2943b72dab2b1e (https://github.com/tiann/hapi/pull/1797)
- #1793 [CLEAN] feat(web): absolute datetime tooltips on relative ages @ a2f8f3a8298ea4a82c08d721696027c9a6a0e415 (https://github.com/tiann/hapi/pull/1793)
- #1791 [CLEAN] feat(web): add bilingual release history to Settings > About @ 2212dfe050ea23b1edb293347d9e2879e199ac73 (https://github.com/tiann/hapi/pull/1791)
- #1788 [CLEAN] feat(web): expose agent quota queries in settings and context display @ b76e0dc1d0a90d5ff76e40b390ccdfc988ea4518 (https://github.com/tiann/hapi/pull/1788)
- #1787 [CLEAN] feat(runner): add safe agent quota query infrastructure @ 7771ed305317ee964ae21a8fa468db24a060e239 (https://github.com/tiann/hapi/pull/1787)
- #1778 [CLEAN] fix(files): optimize exact path and directory search @ d4f2d098aa5e23e24697dfb05a80bd0b023d294d (https://github.com/tiann/hapi/pull/1778)
- #1772 [CLEAN] feat(web): add combined session list filters @ b7c5961d5786d576076124f3efd842e3e8c0463e (https://github.com/tiann/hapi/pull/1772)
- #1771 [DIRTY] feat: add prompt-free session control workflow @ 95558c3a3b61486d48217b5fc8caa627cff3de68 (https://github.com/tiann/hapi/pull/1771)
- #1762 [draft] feat(web): in-session message content search @ 30b531a4f494b1df058f14e75e3d04e2318e471c (https://github.com/tiann/hapi/pull/1762)
- #1758 [CLEAN] feat(web): add pin-in-progress session layout modes @ b9c69bd2194cfc24211b48ef6afac8b477fe23f5 (https://github.com/tiann/hapi/pull/1758)
- #1753 [CLEAN] fix(runner): reject a spawn model missing from the machine's catalog @ d5fa8963fa91b825a04af6532a9d870dbd466088 (https://github.com/tiann/hapi/pull/1753)
- #1747 [DIRTY] feat(web): add collapsible session sidebar @ a8e8d6e91b8c6f8a8b3495fb6ba214cdc8594eb6 (https://github.com/tiann/hapi/pull/1747)
- #1738 [CLEAN] fix(hub): capture AGENT_NOTIFY_SUMMARY from peer user-role deliveries @ 5a695fbd1bd367fe15835f9f9742cc37fe9fc160 (https://github.com/tiann/hapi/pull/1738)
- #1733 [DIRTY] feat(web): session-list scrollbar tick for open session position @ ef4636a9fa07932dabaeec76a6e8263d21bfdd78 (https://github.com/tiann/hapi/pull/1733)
- #1729 [CLEAN] fix(web): Enter inserts newline when composer is expanded @ f04288cacaae35ee2c50b381bc4db5604eb03f80 (https://github.com/tiann/hapi/pull/1729)
- #1728 [CLEAN] fix(web): collapse expanded composer immediately on submit @ 7a93bb406734417589da0be5d344161cdd0723b9 (https://github.com/tiann/hapi/pull/1728)
- #1727 [CLEAN] fix(hub,cli): keep inactive file previews available through runner @ 51084ca52b89d0627c7606200ad39ae5121d447a (https://github.com/tiann/hapi/pull/1727)
- #1726 [CLEAN] fix(web): align file preview content around scrollbars @ 32d49896062b1a463815fee1614feb503b8d9cee (https://github.com/tiann/hapi/pull/1726)
- #1725 [CLEAN] fix(cli): auto-Continue on Cursor post-tool interrupt; Blocked only on give-up @ fa9a3dbaa757574260607dde3e09cfd78c833f83 (https://github.com/tiann/hapi/pull/1725)
- #1722 [CLEAN] fix(web): allow retrying failed attachment uploads @ 97f2636f81939185e195c27291e5997be20506bd (https://github.com/tiann/hapi/pull/1722)
- #1721 [CLEAN] fix(pi): support Windows npm command shims @ 02840df43b4f07bbb8ce60ea55264199287dd295 (https://github.com/tiann/hapi/pull/1721)
- #1720 [CLEAN] fix(web): keep mobile code gutters clear across renderers @ 26d533fc5e0fb8c4afd62df76bd8652ce7be2ac8 (https://github.com/tiann/hapi/pull/1720)
- #1718 [CLEAN] fix(web,hub): friendly file preview when session CLI is offline @ 4bd39ff866aa40f4d0eae4bb69cffcfeb60f5063 (https://github.com/tiann/hapi/pull/1718)
- #1715 [CLEAN] fix(pi,agents): tool-result images + provider-qualified set-session-config + live model catalogs @ 8eea473175ea5b94f2d29fd19bffbfaeb93e9dbd (https://github.com/tiann/hapi/pull/1715)
- #1714 [DIRTY] feat(codex): select provider profiles for web sessions @ a227310e3e7438b5940089748367339d060536b1 (https://github.com/tiann/hapi/pull/1714)
- #1713 [CLEAN] feat(web): add mobile attachment source picker @ f95fe0ad169cfd644c16448785bd3cde7ff46691 (https://github.com/tiann/hapi/pull/1713)
- #1712 [CLEAN] feat(workspace): add HAPI Recycle Bin for deleted files @ c3f917116144e753fa17cf239d900144fbca735c (https://github.com/tiann/hapi/pull/1712)
- #1711 [CLEAN] feat(web): make detail headers horizontally scrollable @ 06ece12999a8180d0d71c4605ab05af44da5e5c7 (https://github.com/tiann/hapi/pull/1711)
- #1708 [DIRTY] feat(cli): auto-steer ping_peer messages into an active turn @ 73630bbd3f3058b3eca9f77df0fe392ca1c4940e (https://github.com/tiann/hapi/pull/1708)
- #1706 [DIRTY] fix(hub): verify runner before trusting archiveSession's dead-CLI fallback @ 26c1615ae754ddb16b43fdbae4850f90ea7d6d85 (https://github.com/tiann/hapi/pull/1706)
- #1704 [CLEAN] feat(web): add independent session header Agent icon toggle @ eaafd0975c206158f06dc94f6617551dd8cdf330 (https://github.com/tiann/hapi/pull/1704)
- #1702 [CLEAN] fix(web): debounce and cancel stale file searches @ d4918bbb60920f6c60fc47a26fd9cf6793f80d6b (https://github.com/tiann/hapi/pull/1702)
- #1695 [CLEAN] feat(web): add fullscreen preview for shared turns @ 26699be34cd90d44cbe9a645a8bdb03bdd7fbfd9 (https://github.com/tiann/hapi/pull/1695)
- #1693 [DIRTY] feat(web): add fullscreen table preview and export actions @ 00e4e993c72e527e9e64ec4e55799e2efe5563ae (https://github.com/tiann/hapi/pull/1693)
- #1692 [CLEAN] feat(agent): add provider-specific agent detail inventories @ fd9dafc1aec6d5e0fc28507e256ba32877ddf4d9 (https://github.com/tiann/hapi/pull/1692)
- #1691 [CLEAN] feat(cli): show Claude compaction as a summary card with token delta @ 8486600423596f0c7b9c84d8fde18cb571ba6053 (https://github.com/tiann/hapi/pull/1691)
- #1684 [UNSTABLE] feat(attachments): persist original attachments in Hub @ 8df0545568572b4ddf11fb8955da6bc55fffd262 (https://github.com/tiann/hapi/pull/1684)
- #1683 [DIRTY] feat(hub): add generic webhook notification channel @ 08fa9726e8d0dce5a5a263987fb54cb2ce649d21 (https://github.com/tiann/hapi/pull/1683)
- #1679 [CLEAN] feat(claude): support conversation rewind via native session truncation @ 4db160525bb65016758f333a6969d29888a5cc47 (https://github.com/tiann/hapi/pull/1679)
- #1678 [CLEAN] fix(web): make composer session mention pills ellipsize @ c4c28624db1da06f27bee573d83201692ab7c778 (https://github.com/tiann/hapi/pull/1678)
- #1677 [CLEAN] feat(opencode): import local session history @ a832355bc2ea1aed9a703d38838282e7f40b29ea (https://github.com/tiann/hapi/pull/1677)
- #1676 [CLEAN] feat(opencode): wire session fork via the server HTTP API @ aacc2580dea8e29397df88026fcfeac19545ae44 (https://github.com/tiann/hapi/pull/1676)
- #1675 [CLEAN] feat(web): surface opencode /compact and /clear in the slash command menu @ a816ff9bc70cb0294e8c6fbde5a84bba19ba42c2 (https://github.com/tiann/hapi/pull/1675)
- #1673 [DIRTY] feat(web): show a fork preview dialog before forking a conversation @ f6c846ac2a002b236c94515902d04a5e881eb251 (https://github.com/tiann/hapi/pull/1673)
- #1672 [DIRTY] feat(acp): re-enable change_title for ACP launchers with manual title precedence @ 8d6e67d2061e402728cc609ade172ff3d6af2985 (https://github.com/tiann/hapi/pull/1672)
- #1668 [CLEAN] feat(opencode): show round usage metadata @ 483b4467f597e5c1be1e30c3ea78356dc927b834 (https://github.com/tiann/hapi/pull/1668)
- #1666 [CLEAN] fix(web): improve generated media retry and sizing @ e32370634d51ec93a8caf5d5ca278f0bba98eb73 (https://github.com/tiann/hapi/pull/1666)
- #1665 [CLEAN] fix(web): improve fullscreen image preview toolbar layout @ eb4fa6c75c451e0cefd8a72a4143c7338abc549c (https://github.com/tiann/hapi/pull/1665)
- #1664 [CLEAN] fix(web): keep machine health visible for single-machine layouts @ 440e8e294172b14c4f764c0f2c5614f7486d4233 (https://github.com/tiann/hapi/pull/1664)
- #1662 [DIRTY] feat(web): unify composer model and effort controls @ 192a41353545b9ad70ce5150311d363bd6f74ffb (https://github.com/tiann/hapi/pull/1662)
- #1660 [CLEAN] fix(web): support RMB symbol aliases for skill autocomplete @ bf182f8ced3ddeb4a474c9a86b2396dd0c472e56 (https://github.com/tiann/hapi/pull/1660)
- #1659 [CLEAN] feat(web): add frontend composer history for loaded session messages @ 6ac0a32204d47b14fe3815835de909c64f2d61c3 (https://github.com/tiann/hapi/pull/1659)
- #1658 [CLEAN] feat(web): add Alt+S shortcut to send messages @ 6a86371be75cb5c4cc6989130a59802826d6bcce (https://github.com/tiann/hapi/pull/1658)
- #1657 [CLEAN] fix(web): improve deferred generated-file download controls @ 410c2acd1a8c12a2b76712072f3034e7d912d84b (https://github.com/tiann/hapi/pull/1657)
- #1656 [CLEAN] fix(web): avoid session misclicks during live reordering @ fb962536e280b94f643aeb66f9b0de8cf873eb72 (https://github.com/tiann/hapi/pull/1656)
- #1644 [CLEAN] fix: render opencode edit/write/read tool calls through the shared views @ d608fb3d9d916ee943af2b7805c8ae94ee131ff3 (https://github.com/tiann/hapi/pull/1644)
- #1642 [CLEAN] fix(agy): report the failure reason instead of echoing the answer @ ccc098bf7bb5df49acc5e432a93fe132c4a06dcb (https://github.com/tiann/hapi/pull/1642)
- #1640 [DIRTY] feat: add lightweight shared Agent Studios @ b86a3b6c16c90ab80636a99f07ae9ca58bc129a4 (https://github.com/tiann/hapi/pull/1640)
- #1637 [CLEAN] feat(web): add desktop session sidebar toggle @ d0242a648d5b5641eb1501dd3491b6372c2b968d (https://github.com/tiann/hapi/pull/1637)
- #1636 [CLEAN] fix(web): prevent session navigation on right-click @ 60db9468d95b5197cbc49984f022256057f25dbe (https://github.com/tiann/hapi/pull/1636)
- #1635 [CLEAN] feat(web): show project in session header @ 0ccf36f6df615e26f8a5cab1d5ca9861e0ba6b26 (https://github.com/tiann/hapi/pull/1635)
- #1629 [UNSTABLE] fix(agy): stop delivering the same answer twice when deltas are mangled @ a084ba83b531ec4436786d6f703e9ca7ff9b0fd5 (https://github.com/tiann/hapi/pull/1629)
- #1625 [CLEAN] fix(web): provide exact PWA icon sizes for Windows notifications @ 9aa1668bc6f76e6d205b1f26e677902c2bec5f59 (https://github.com/tiann/hapi/pull/1625)
- #1621 [CLEAN] fix(sessions): make title generation discoverable @ 9bcd50d04a7e6c20bd14fb9e05f1e747a56da622 (https://github.com/tiann/hapi/pull/1621)
- #1620 [CLEAN] fix(web): coalesce symlink path spellings in session list groups @ 72bd413a1c90a67f55e568c5b1097c3f8c46a8bd (https://github.com/tiann/hapi/pull/1620)
- #1618 [CLEAN] feat(peer): nametag-only ping_peer reply attribution @ 5fa5696566c1831a6803d70b3d20ae0eb5ba8dcb (https://github.com/tiann/hapi/pull/1618)
- #1617 [CLEAN] fix(web): unify sync session menu labels @ ea5ec5c3c1dc240dee87ab54282e4a47622ee3f0 (https://github.com/tiann/hapi/pull/1617)
- #1616 [CLEAN] fix(web): reuse existing PWA window for notification clicks @ 455917d62f10cbc2034dc08de5b51ee957ee18ee (https://github.com/tiann/hapi/pull/1616)
- #1615 [CLEAN] feat(hub): add optional WxPusher completion notifications @ 131aafd2e94680cfa1ec2baefe78281d4ccab0b2 (https://github.com/tiann/hapi/pull/1615)
- #1614 [CLEAN] Make web terminals persistent and attachable @ 64770fb335544e95bbbc549c55e3d587b428d8d0 (https://github.com/tiann/hapi/pull/1614)
- #1613 [CLEAN] fix(cursor): isolate HAPI MCP overlay to project mcp.json @ 82caab248e7a20255eea0059432edd9f2a9af88f (https://github.com/tiann/hapi/pull/1613)
- #1611 [UNSTABLE] fix(scratchlist): persist manual ordering and improve draft actions @ 0530c4a99ab68ff74780b8be963db584a7ace5cf (https://github.com/tiann/hapi/pull/1611)
- #1607 [CLEAN] feat(web,hub): right-click context menu for sidebar project groups (#881) @ 311e55bb9d54d49ce5ba39ac20852bb673de37b5 (https://github.com/tiann/hapi/pull/1607)
- #1605 [DIRTY] feat(claude): discover models and context window from the CLI @ 1b3093ee0963044f1b5112c3e4e3200f263b2312 (https://github.com/tiann/hapi/pull/1605)
- #1604 [CLEAN] fix(codex): gate history actions until native thread is ready @ 5292741259f26524fbee9d1eac836d9fce196976 (https://github.com/tiann/hapi/pull/1604)
- #1603 [CLEAN] fix(web): align Fork/Rewind confirmation dialogs @ 2fbdb4f1f4c5e89da4890e1244e9be93dd70bb71 (https://github.com/tiann/hapi/pull/1603)
- #1599 [CLEAN] fix(web): consolidate tool card display settings @ 6da3c37d2944f862f06b12273e274e765d8e12c9 (https://github.com/tiann/hapi/pull/1599)
- #1598 [CLEAN] feat(web,hub): add opt-in search for session message content @ 19e40337b46343520eba83a29416f0e045269a87 (https://github.com/tiann/hapi/pull/1598)
- #1597 [DIRTY] feat(web): assistant response navigation with window-store-safe jumps (#1093 + #1587) @ 17972547187d34df74038a531ce9758b06e78d6f (https://github.com/tiann/hapi/pull/1597)
- #1592 [CLEAN] fix(web): apply reasoning collapse preference to history @ 67112915c48b949df6f2311d4de7cf040c1019aa (https://github.com/tiann/hapi/pull/1592)
- #1581 [CLEAN] fix(web): clear stale drafts after delayed queued sends @ 93729d27611d18e975ff96e417f798d461f789e3 (https://github.com/tiann/hapi/pull/1581)
- #1567 [DIRTY] feat: add Reasonix ACP integration @ aa7fdf0f5bfbacf811cf745409ae7aacb9c84bc3 (https://github.com/tiann/hapi/pull/1567)
- #1564 [UNSTABLE] feat(cli): Cursor-only display_links MCP for unmangled URLs @ e8cbc5a005057ac0a5b2224a93d9e787509030c4 (https://github.com/tiann/hapi/pull/1564)
- #1543 [CLEAN] fix(web): preserve shared turn layout and generated file downloads @ 4a6dc6cbe68b33c04a1afcef605bfe365f7bac9a (https://github.com/tiann/hapi/pull/1543)
- #1542 [DIRTY] fix(web): keep loaded older history in the window while a session streams @ f8953d241b82621f7f455fe05ba9f8a3929047bd (https://github.com/tiann/hapi/pull/1542)
- #1537 [DIRTY] feat: add peer tools exposure toggle (#1401) @ 693aed6e40beed850caeb65ac32fb4e6d68442d5 (https://github.com/tiann/hapi/pull/1537)
- #1528 [DIRTY] fix(hub): make session timeout and reconnect state durable and consistent @ 3517c527077d71033ec3782185ca4cf6d280d0f4 (https://github.com/tiann/hapi/pull/1528)
- #1527 [DIRTY] feat(cli): survive terminal hangup by switching the session to remote mode @ 597c28d6bcb5dd2fc8938197d60e5dea9d327821 (https://github.com/tiann/hapi/pull/1527)
- #1525 [DIRTY] test(cli): make the suite pass on macOS hosts @ 85e5ec888140097893bdf30dfe1b101145d2c54e (https://github.com/tiann/hapi/pull/1525)
- #1523 [CLEAN] fix(web): unify agent task status presentation @ cef9e46a9ac0580ee241950634a69bf2deeadde9 (https://github.com/tiann/hapi/pull/1523)
- #1517 [DIRTY] Fix Telegram Mini App polish and file tree state @ d9767f92f0beb3a245ed2329030126441676e8e0 (https://github.com/tiann/hapi/pull/1517)
- #1512 [UNSTABLE] fix(web): use latest assistant replies for session recency @ b1c8d69d84d64131abee91000c27b6e9b0505e51 (https://github.com/tiann/hapi/pull/1512)
- #1468 [CLEAN] feat(usage): record ACP cost and surface per-agent reporting availability @ 8f2d931d9ceb7573007df954276747338cd2a585 (https://github.com/tiann/hapi/pull/1468)
- #1447 [DIRTY] feat(web): add separate option to pin active sessions @ 19daba6f54b3bc99d4645dd3be25cdc6d2be7b4b (https://github.com/tiann/hapi/pull/1447)
- #1443 [DIRTY] feat: restore mid-turn steer for Codex and Cursor @ 1888de0e1e3fd9ae84001d49e56e8d607b4b67f8 (https://github.com/tiann/hapi/pull/1443)
- #1436 [CLEAN] feat(web): persist and send voice input message across session navigation (#1435) @ 66772e61dbe0dda0a6bd9c853ff190eedbbd0698 (https://github.com/tiann/hapi/pull/1436)
- #1429 [DIRTY] feat(claude): import local session history @ 5d3f41bb10bb22e7186d1abc0fc45e5659be479d (https://github.com/tiann/hapi/pull/1429)
- #1424 [CLEAN] feat: show progress bar on session for hours-long jobs @ 9649af00c3d4b7860b8df58a5395179905d2ca40 (https://github.com/tiann/hapi/pull/1424)
- #1422 [CLEAN] fix(web): make long file errors expandable @ 0d027bfbb3b1356d03e7856c78619c9e8627674e (https://github.com/tiann/hapi/pull/1422)
- #1419 [UNSTABLE] feat(web): add direct send button during active voice session @ cb64200637941ed429855a82ffcf2db977610416 (https://github.com/tiann/hapi/pull/1419)
- #1418 [DIRTY] feat(web): drag sessions into composer mentions @ f3e42f832905d0744c5aa28cd1e239910d15f287 (https://github.com/tiann/hapi/pull/1418)
- #1414 [CLEAN] fix(web): hide redundant machine labels on single-machine pinned rows @ ef5579e5fa2dedf0ceae7363b6a90b75f69cb703 (https://github.com/tiann/hapi/pull/1414)
- #1361 [CLEAN] Fix/codex sync idle active @ e1e7e8c3fbcfcdaaff872398c1d08758d3dcef0f (https://github.com/tiann/hapi/pull/1361)
- #1360 [DIRTY] feat: add notification preferences and customizable web push copy @ b9c9975ae1afa1455385fdd69509c3f8c169c728 (https://github.com/tiann/hapi/pull/1360)
- #1351 [DIRTY] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1309 [draft] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [DIRTY] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [DIRTY] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [DIRTY] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ 999f1d1170d382cc4fd5e5fdf6e0a6ab4a0bf65f (https://github.com/tiann/hapi/pull/1193)
- #1189 [DIRTY] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [DIRTY] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [CLEAN] feat(session): opt-in GitHub PR awareness + explicit attach @ dfeccfef4c2c6adec90f3ba6e69f4a689a6e2db0 (https://github.com/tiann/hapi/pull/1163)
- #1158 [CLEAN] fix(web): unify session header display labels @ b00e39794e707d3bdbd6ab1029b5a6576b3cf985 (https://github.com/tiann/hapi/pull/1158)
- #1126 [DIRTY] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1099 [DIRTY] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [CLEAN] feat(web): add assistant response navigation @ 14888e040dc6027a0e1b6132185379998d250bfb (https://github.com/tiann/hapi/pull/1093)
- #1092 [DIRTY] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [DIRTY] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [DIRTY] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [DIRTY] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [UNSTABLE] feat(cursor): detect inline model errors, surface, notify, and bridge (#878) @ 2c28a1365f2102c5cd1b7156b4af2207d3cb7192 (https://github.com/tiann/hapi/pull/987)
- #975 [DIRTY] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ 80a1705bb869f5e92c2e1186fdffafc82cb1026c (https://github.com/tiann/hapi/pull/945)
- #942 [DIRTY] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
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

## Candidate selection gate

This rebuild starts from official `upstream/main` at
`86c88df93baf5d1f738dd4b202078bdf6dec376e` and carries 24 reviewed open PRs
as separate commits. PR #847 is closed without merge. Its Codex budget schema,
scanner, indicator, and adapter are absent from the candidate source tree.

The previous maintained fork still has 111 source/test files under `cli/`,
`hub/`, `shared/`, and `web/` that this candidate lacks. Major missing feature
groups include fleet self-upgrade, notification preferences and model-error
copy, namespace settings, and Claude session import. Desktop packaging and
maintained release tooling were carried as separate fork changes. The
`@assistant-ui/core@0.2.23` scroll patch was omitted because this candidate
uses `@assistant-ui/core@0.3.20`; the current Web scroll tests pass.

On 2026-09-26 the owner explicitly accepted removal of these old fork-only
features for this and future self-use maintenance releases. They are disclosed
in the release notes. This acceptance does not change the closed-unmerged PR,
security, data preservation, or release verification gates.

## Local verification

- `bun install --frozen-lockfile`, `bun typecheck`, and `bun run test`: pass.
- `bun run test:cli:integration`: 16 pass, 1 opt-in stress test skipped.
- Playwright CI selection: 33 pass.
- `python3 -m unittest discover -s tools/maintenance/tests -p 'test_*.py'`: 43 pass.
- Desktop typecheck, five tests, and build: pass.
- `bun run gen:fixtures`: no tracked drift.
- Mac standalone build: pass; after local ad-hoc signing, `hapi --version` reports `0.30.7.3`.
- Android SDK is absent locally; Android CI has not run on this candidate.

## Replay and provenance

The manifest contains 36 separate patches for the current candidate, including
24 PR patches. It maps three selected fork changes to prior source commits and
explicitly drops the other 20 commits unique to the old origin history and
closed PR #847. The
large historical rebuild commit `d39f10553` is represented only by the
separately reviewed desktop distribution change; its other source is not copied.

`sync-from-upstream.sh --skip-tests` verified all 173 open PR audit rows against
live heads and replayed the patches in an isolated worktree. The source tree
matched `b9ad5fd41877a3550d337a0fe7a90ecd7e801f9b`; the rehearsal
worktree was removed. Personal PR policy exceptions: #1419 (merge unstable)
and #1771 (merge dirty). The local checks above ran separately on the candidate.

The previous pre-push hold for removal of legacy fork-only features is lifted
by the owner's explicit acceptance. No branch push, tag, GitHub Release, or
fleet update had been performed at the time of this audit update.
