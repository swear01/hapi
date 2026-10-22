# HAPI maintained release audit

Previous maintained release: v0.30.7.5

Official release: v0.30.7

Personal PR owner: swear01

Origin main: 6c3e23c40c48f733c6756dc9ef3a712556e2d1cd
Upstream main: 5d8deb201189dc1f183c4f5bf38c87ec4d34dd70

## Fork-only commits

- 6c3e23c40c48f733c6756dc9ef3a712556e2d1cd chore(audit): record replayable v0.30.7.5 candidate
- 16a047266d0a26fb12bcda67ce8ff0746bb323cb chore(release): prepare audited maintenance version 0.30.7.5
- ecd320a39925d23cebb88b883cdad737d24d882a test(web): match current Codex sync action label
- dcc0d949d079459f83e6bcf7c895a85a0c2c30ec fix(release): stabilize Bun desktop lockfile
- 804127c04b5195b8a4b479932512d29b659d95c0 chore(release): carry desktop packaging and fork workflow guards
- d61c125b96a03a1b1d0cc77ec33ee5305fc06f52 fix(android): keep grapheme Matcher state valid
- 40cf496a059bf62381efe532470fe7df973799ce fix(android): retain Codex plan spinner and retry CAS
- d97188dfe37107c660580b095b9fed3f616f9c0a carry(upstream): PR #2070 fix(web): preserve composer image previews across updates
- 053868b002f45b1fe60aa9f216e96d46ff849dba carry(upstream): PR #2069 fix(hub): mint a localId for user messages sent without one
- 92f82e3d58d129a11b6acc1f9bd0c653abb150d7 carry(upstream): PR #2066 fix(runner): add webhook timeout configuration hint
- 83e787bacb33e8812d7238720067163733e7ed07 carry(upstream): PR #2065 fix(web): explain redirected hub requests instead of "Failed to fetch"
- 45fc638e6c3dadbaa1c18d70632235fca93862cf carry(upstream): PR #2061 fix(web,cli): clarify archive cleanup progress and bound shutdown waits
- ee8ac63f2310ab7f4e15cb560ee7cfc12b74a16b carry(upstream): PR #2060 feat(pi): display inline tool-result images
- 91ed9ef6c79ba720b3a3e75ed18a95125a0e058c carry(upstream): PR #2046 perf(cli): reduce Windows process probes during session shutdown
- e3f1e1024ac2028ee09875fd6be8d06721fb4e23 carry(upstream): PR #2035 fix(runner): prevent Windows process probes from blocking session lifecycle
- 0d61c52eab297b19af58db47119bde38ea439631 carry(upstream): PR #2032 fix(hub): single-flight cache for session enumeration RPCs
- f85dd5c875a9045bb350a420ca52323395effed7 carry(upstream): PR #2031 fix(dsh): default ACP entrypoint to the official dsh CLI
- 8b3e7cb388b7e9a7283f9db7776b590322c5de11 carry(upstream): PR #2027 fix(dsh): abort via session/close when the agent has no cancel capability
- 9bdeca94b42007552b4a15e80628b014621888b4 carry(upstream): PR #2025 fix(codex): persist Round duration across session reloads
- bd5b4d200ae50957a07fc0bfb1efe6c9a64d63a1 carry(upstream): PR #2012 feat(web): To agent control for terminal scrollback or selection into composer
- 7d2eabe527c2791b3219b772f7aab7b5aeebc17a carry(upstream): PR #1960 fix(web): keep tail following through layout-driven scroll
- a7f3ff91d31ac4566e8ff49acd206daa81c5827a carry(upstream): PR #1955 fix(web): allow retrying failed abort requests
- a905f14c2734542d09b5921ebf7293038c400884 carry(upstream): PR #1944 fix(web): keepalive-idle indicators in the sidebar and retirement of lost subagent traces
- 90fd8656dd2a006073140ddb0ffb4c95c0bf8c3d carry(upstream): PR #1943 fix(runner): adopt untracked runner webhooks only from the reporting process generation
- 73864ad64ac82a0293a4b7dbf57ce3503297c251 carry(upstream): PR #1942 fix(hub): make keepalive-idle reconciliation robust against metadata churn, replays and retries
- 79e7f6cc46269ed3dbabe426a60c0248cfaa201f carry(upstream): PR #1940 fix(runner): reconnect live Codex roots on resume
- effd3d80a449b6269943dfb017a99b13f7ce464d carry(upstream): PR #1938 fix(codex): reuse live model catalogs and extend discovery cache
- deea4b2e5d9df87ca7c69c60bb1a11cc388c15e9 carry(upstream): PR #1932 fix(cli): release stdin before handing terminal to local-mode child
- a3c2d3bb9b6289b6781469080375f6fa4ce35d26 fix(runner): confirm archived Codex root after tracking loss
- d78d6890b18e4713b57a5f608c3326ecffcab123 carry(upstream): PR #1797
- 0745c2250c79869573ce586cfc608fea47ecde6c carry(upstream): PR #1771 feat: add prompt-free session control workflow
- 8abe697d47d9ef281cc4613e05663652a03a1f07 carry(upstream): PR #1729
- 12b973e288b1ded55b1edf6be4408d5fde7ef36d carry(upstream): PR #1728
- bf48c5d86ed23225c7d04f93d88aedb733b444a6 carry(upstream): PR #1721
- 30af9d8e736798d86a6f1785bd2f2434303d0d91 carry(upstream): PR #1720
- ea6f452a69a07cff071b385986bd6831c117a916 carry(upstream): PR #1702
- fa898da881a989a9c3485c5d11910a63b6a2f8ac carry(upstream): PR #1678
- a41542ea45bdae86938026002d89b84f2e962542 carry(upstream): PR #1666
- 5ec34d820ba5d5eb5d61a96e4c1c36f527f8304d carry(upstream): PR #1660
- a2c3035ec16ed211138f39d800bbc02e6f52064c carry(upstream): PR #1656
- 811d264668b9fb767d004300682f179c27ca51bd carry(upstream): PR #1636
- 83580f5331a91b72c5ce647c7dd006ed8031125c carry(upstream): PR #1635 project labels
- 86b26109d4e0688b7825e0c6c832f74b3d2ed8da carry(upstream): PR #1625 PWA icon sizes
- e299b83c34eee87fcb7524ea96b4b1325c136775 carry(upstream): PR #1620 path grouping
- e2b76db588dd8f885df049971bd66afb9e5bcc07 carry(upstream): PR #1617
- 3c9e42c8a7449e00e882ad56dbc7c2598a075ab5 carry(upstream): PR #1616
- 3ea041255001e3e172327542319be1adfb1bf727 carry(upstream): PR #1615
- e1a36add3bc94b3ba16cef073c5322760fe431d0 carry(upstream): PR #1603
- 9fc1c0283256cc1bdbd7ef95cbc82c405c67b0a3 carry(upstream): PR #1592
- 4cbee7c9d26462a5dc1a1460aedd147c38d3ec94 carry(upstream): PR #1436 feat(web): persist and send voice input message across session navigation (#1435)
- aead8290bd3cf4a6611e69bdce2299dfafc49a42 carry(upstream): PR #1414
- 75c37ab9f20affc61fcb57c2188f9a94ae82fee1 carry(upstream): PR #1158

## Open upstream pull requests

- #2133 [UNSTABLE] feat(android): align scratchlist session-delete hint and any-type attachments @ 33ac79ee7f80911ada4cec61ca6fb3b9c9a6c080 (https://github.com/tiann/hapi/pull/2133)
- #2132 [CLEAN] feat(android): add scratchlist row move, copy, and delete-confirm actions @ dc70802f5bc3db5055b362822ad8880465724882 (https://github.com/tiann/hapi/pull/2132)
- #2131 [CLEAN] feat(android): shared zoomable image viewer + SVG support @ 23310d42ce7fca3e067316442d73256122137ae2 (https://github.com/tiann/hapi/pull/2131)
- #2130 [CLEAN] feat(android): files persistence (expand/scroll state, markdown preview mode, code wrap) @ 3a38fa6254d9e8f3b5742e4797bb4484984e9174 (https://github.com/tiann/hapi/pull/2130)
- #2129 [CLEAN] feat(android): files screen actions (download, copy paths, add-to-composer, sort) @ f76d23e6a78cdb605903db59b9584db165d07acc (https://github.com/tiann/hapi/pull/2129)
- #2128 [CLEAN] fix(web): remove composer attachments without waiting for cleanup @ c024b64b72fff89ac9fb96ef5dbac85437103005 (https://github.com/tiann/hapi/pull/2128)
- #2127 [CLEAN] feat(android): permission input semantics parity (editor inputType, URL confirm, grok auto gate) @ a3b1ea3ec31f93ac12f2e340212dad8453f9d0ab (https://github.com/tiann/hapi/pull/2127)
- #2126 [CLEAN] fix(cli,hub): prevent premature archive failures on Windows @ ffae800dccde244175e44e625a24826745f21f2e (https://github.com/tiann/hapi/pull/2126)
- #2125 [CLEAN] feat(android): persistent permission-mode chip + inactive gating @ 9067f6193ccb51da22b0b97ac9bdc1b746a24f58 (https://github.com/tiann/hapi/pull/2125)
- #2124 [CLEAN] fix(web): stop composer image previews from dragging after release @ 26aabf9adc55ea5088567e30ee67bce1ead0d4a5 (https://github.com/tiann/hapi/pull/2124)
- #2123 [CLEAN] feat(android): settled permission verdict details @ a0b5f38934fb275b28b7ab7d6453129e229d8b30 (https://github.com/tiann/hapi/pull/2123)
- #2122 [CLEAN] perf(hub): cached settings reads (SWR + single-flight) for hot paths @ 504d1927f6cd028cd4949f3033942412346874fc (https://github.com/tiann/hapi/pull/2122)
- #2121 [CLEAN] feat(android): steered badge + send-failure reopen card @ 070a507408290e3677cb696c5231b5553f77c316 (https://github.com/tiann/hapi/pull/2121)
- #2120 [CLEAN] feat(android): composer attachment drag-to-reorder + paste-to-attach @ 4994d02a0edd115804567dc2c76934385c718db9 (https://github.com/tiann/hapi/pull/2120)
- #2119 [CLEAN] feat(android): code-block wrap toggle + session citation links @ b2498d03c22e8c62c043f6721be56aacefa4fef2 (https://github.com/tiann/hapi/pull/2119)
- #2117 [CLEAN] feat(web): add opt-in local search history @ f55d065bf79c2528f2f061929e33190bd342c88d (https://github.com/tiann/hapi/pull/2117)
- #2116 [CLEAN] fix(web): contain image preview labels to prevent chat layout shifts @ be4815402bc8c451ec7c9e4e65c82f421aa50757 (https://github.com/tiann/hapi/pull/2116)
- #2115 [CLEAN] fix(codex): distinguish compaction waits from unknown delivery @ 4135ffe9d4a52d0485d42410d21952e586f7ae54 (https://github.com/tiann/hapi/pull/2115)
- #2114 [CLEAN] feat(android): owner hub settings switches — web Settings→General parity @ cac4b4a389ad67d8b1a52781561595de1f6aa61d (https://github.com/tiann/hapi/pull/2114)
- #2112 [CLEAN] feat(android): directory-grouped session home with flat-list toggle @ fbdf78af9a812a0db5b6d21ed70cba45840e1fa9 (https://github.com/tiann/hapi/pull/2112)
- #2111 [CLEAN] feat(android): skills autocomplete in composer — web $skills parity @ 89f0f0cc369c2e74af440e3af4552c1b334a12ad (https://github.com/tiann/hapi/pull/2111)
- #2109 [UNSTABLE] feat(android): session actions parity — copy reference, AI title suggestion, active-gated archive/delete @ dab728987448fb68ed250aa36765e4e59e1232ae (https://github.com/tiann/hapi/pull/2109)
- #2107 [CLEAN] android(app): machine filter rows carry CPU/mem health @ 9fa3963d1ab0c832b1d40a187cd518487d2390ac (https://github.com/tiann/hapi/pull/2107)
- #2106 [CLEAN] android: active-only lens and pin-in-progress running buckets @ d60534f1374d615854648921e8b578232d486e25 (https://github.com/tiann/hapi/pull/2106)
- #2105 [CLEAN] feat(android): unread system — unread-only lens, mark unread, mark all read @ bb9b6635bac0337c0bb7e11581d18d318762308c (https://github.com/tiann/hapi/pull/2105)
- #2104 [CLEAN] feat(android): session-list sidebar parity — dedup, stub hiding, relevance search @ 12cc1d28f66e05a2a1c5e37067f9dd1390008ecc (https://github.com/tiann/hapi/pull/2104)
- #2103 [DIRTY] Axgu/local workspace @ 51707952794ac431db9bf987d5da2ed48309028a (https://github.com/tiann/hapi/pull/2103)
- #2093 [CLEAN] feat(web): add project session sorting options @ e381d5ba97b4e864376247f8b1488317b5c8ade6 (https://github.com/tiann/hapi/pull/2093)
- #2102 [CLEAN] fix: show Claude sessions waiting on background tasks (#2100) @ 647d68edebd3542943d7d0051e0775b344558aa4 (https://github.com/tiann/hapi/pull/2102)
- #2101 [CLEAN] fix(web): ignore pending requests on archived sessions in the sidebar @ 3450a4cbfc81c5e9c95b2a7236b9c7d4c44ba582 (https://github.com/tiann/hapi/pull/2101)
- #2099 [UNSTABLE] fix(codex): do not re-insert legacy history on shared resume @ 49448adc337f1ed557ee181cadac3e8e47751089 (https://github.com/tiann/hapi/pull/2099)
- #2098 [CLEAN] fix(web): load one older page when the cold tail is tool-only @ c16df1e3bc7a4195c6a8afee66a35af974a57739 (https://github.com/tiann/hapi/pull/2098)
- #2097 [CLEAN] fix(web): give the rich composer its own undo history @ 5782c607be243fdd789cbe56e0bd7b9f207e5778 (https://github.com/tiann/hapi/pull/2097)
- #2096 [CLEAN] fix(codex): include inherited fork history when syncing Codex transcripts @ 1c11481eab5e42084e67a0a25ddcf13150fc32d5 (https://github.com/tiann/hapi/pull/2096)
- #2095 [CLEAN] feat(cli): add hapi set-mode to change a session's permission mode (#2094) @ 0fadc1fc6b5035780792247f50cee4fff8e00b09 (https://github.com/tiann/hapi/pull/2095)
- #2092 [CLEAN] fix(codex): restore Web Rewind for shared sessions @ a7a48cf504922c8396d50b7373b7e7e5b7302428 (https://github.com/tiann/hapi/pull/2092)
- #2091 [CLEAN] fix(cli): forward Claude Code 2.x subagent transcripts in local mode (#1904) @ 9a72d238a44f6dcadf6130799543136382bc842a (https://github.com/tiann/hapi/pull/2091)
- #2090 [CLEAN] feat(codex): expose Approve for me as a permission mode (#2016) @ e73a1d06be46942e3b81983ba30e6de4279654e6 (https://github.com/tiann/hapi/pull/2090)
- #2089 [CLEAN] fix(hub): judge liveness by hub receive time, not runner clock (#1986) @ 1c3ed4c7a896a428eeebeae43f0ec713334c8239 (https://github.com/tiann/hapi/pull/2089)
- #2088 [CLEAN] fix(claude): seed local-mode context window from the configured model (#1858) @ 5ab4922e84d3afb46e746d718da5b14d3f5cccb0 (https://github.com/tiann/hapi/pull/2088)
- #2087 [CLEAN] fix(cli): forward Claude API error records with null service_tier (#1857) @ b2ffc9c355af96621704d75e415f34cde84c9a40 (https://github.com/tiann/hapi/pull/2087)
- #2080 [CLEAN] feat(web,hub): sync session read/unread state across devices @ 00d034ca52cee9432710b7c66b98f47e2b1e5c4c (https://github.com/tiann/hapi/pull/2080)
- #2078 [CLEAN] fix(runner): preserve slow Codex sessions across startup deadlines @ a3670eff684344aa38df1a55168d936d27987745 (https://github.com/tiann/hapi/pull/2078)
- #2077 [CLEAN] fix(web): contain transient scrollbar overflow during resize @ 09d5a69257eb10e2f10ecad1b96d52fb06e7705b (https://github.com/tiann/hapi/pull/2077)
- #2076 [CLEAN] fix(cli): stream Claude and Codex assistant text @ 9b332b38ab4c05b4ff8611741bad564508d93630 (https://github.com/tiann/hapi/pull/2076)
- #2075 [CLEAN] feat(hub): generate fallback titles after the first completed turn @ 2bff198909e8b2ac620e9da193ec305864e00679 (https://github.com/tiann/hapi/pull/2075)
- #2074 [CLEAN] feat(hub): notify external channels when sessions need attention @ 10ccc866ed030a6e86e51e71a9bfd4cc759b083f (https://github.com/tiann/hapi/pull/2074)
- #2072 [CLEAN] feat(sessions): add explicit per-session title locks @ 59b1db63ef9361dd77b0327ee677916c5fdbc283 (https://github.com/tiann/hapi/pull/2072)
- #2071 [CLEAN] fix(peer): preserve identity and consumption state of peer messages @ 8b09ee8d30341fd065bda1aab878ed51343f9aaa (https://github.com/tiann/hapi/pull/2071)
- #2070 [CLEAN] fix(web): preserve composer image previews across updates @ 6f897d332aec316bd93a4e0c523ccec69a47b216 (https://github.com/tiann/hapi/pull/2070)
- #2069 [CLEAN] fix(hub): mint a localId for user messages sent without one @ 2bf3b254c9fb6e52fefe6aef23e9f7643daa3833 (https://github.com/tiann/hapi/pull/2069)
- #2066 [CLEAN] fix(runner): add webhook timeout configuration hint @ c8c1a58fd0bbc291eefd36d5cdd09469a6395d86 (https://github.com/tiann/hapi/pull/2066)
- #2065 [CLEAN] fix(web): explain redirected hub requests instead of "Failed to fetch" @ b7e4223da2d1a8eeb91c510849c51fb58c7a57e2 (https://github.com/tiann/hapi/pull/2065)
- #2061 [CLEAN] fix(web,cli): clarify archive cleanup progress and bound shutdown waits @ a29b6496e46ca14e81be2e94f47729089c2f7c8a (https://github.com/tiann/hapi/pull/2061)
- #2060 [CLEAN] feat(pi): display inline tool-result images @ 3d9ebb3e04f04baffe3702c2479776eb05330e0d (https://github.com/tiann/hapi/pull/2060)
- #2056 [CLEAN] feat: hub-wide peer-tools toggle in web Settings (stacked on #2052) @ e62ca723d1e6ea89ff104896dc71de759c19c024 (https://github.com/tiann/hapi/pull/2056)
- #2052 [CLEAN] feat(cli): HAPI_DISABLE_PEER_TOOLS — hide peer-session tools from wrapped agents @ f40f0084819ad10d775b6566c29240357e730f8b (https://github.com/tiann/hapi/pull/2052)
- #2051 [UNSTABLE] fix(codex): allow explicit resolution of indeterminate delivery blocking forks @ 91715d5f2ef31f7c747956f76bff778161c7fb4e (https://github.com/tiann/hapi/pull/2051)
- #2049 [CLEAN] Add agent chat creation with shared New Chat defaults @ 489e9394edea5e86df9f1208b36e27a318f7f639 (https://github.com/tiann/hapi/pull/2049)
- #2048 [draft] Fix blank chats behind hidden history pages @ 44a4a35aca386222b6e7b6d578a253bcea9fb91c (https://github.com/tiann/hapi/pull/2048)
- #2047 [draft] Add agent self-archive and peer archive tools @ 7a04c6f6c3a29760a1790be2b48265f4f88f5297 (https://github.com/tiann/hapi/pull/2047)
- #2046 [CLEAN] perf(cli): reduce Windows process probes during session shutdown @ 02137a0d4560e9bc793b02020e97f120d33f0006 (https://github.com/tiann/hapi/pull/2046)
- #2043 [UNSTABLE] feat(dsh): permission modes via the shared ACP permission bridge @ 2199f4ead93393db92a5ecf107b0087a1ddc6b9b (https://github.com/tiann/hapi/pull/2043)
- #2042 [CLEAN] feat(opencode): support OpenCode v2 alongside v1 sessions @ 8035b20e2b44e621b482d71acbfae5d1398114ae (https://github.com/tiann/hapi/pull/2042)
- #2036 [CLEAN] fix(codex): stabilize cold restore and deduplicate history acknowledgements @ db4496904f0fd384b073fb469b1ced0a3f11e9da (https://github.com/tiann/hapi/pull/2036)
- #2035 [CLEAN] fix(runner): prevent Windows process probes from blocking session lifecycle @ 80704bb2ca40a0924887d5de3ebf86f543feea2a (https://github.com/tiann/hapi/pull/2035)
- #2033 [CLEAN] feat(web): fixed session order display setting @ 6e685c45f3d3c34628975e79d877337370731481 (https://github.com/tiann/hapi/pull/2033)
- #2032 [CLEAN] fix(hub): single-flight cache for session enumeration RPCs @ d53d677e0b04bad682a803d264ac020d74a002f9 (https://github.com/tiann/hapi/pull/2032)
- #2031 [CLEAN] fix(dsh): default ACP entrypoint to the official dsh CLI @ 1b84313aaeb363fce713165c219ebf8ca4d69fc1 (https://github.com/tiann/hapi/pull/2031)
- #2030 [CLEAN] feat(dsh): model selection for DeepSeek Harness (ACP config options) @ 08cb2f31cec686307e71fe0cd7f8cc893575db8a (https://github.com/tiann/hapi/pull/2030)
- #2029 [UNSTABLE] ci(android): publish debug APK artifacts and allow manual builds @ da13057e29e746eacda6ede4212da5f720df7775 (https://github.com/tiann/hapi/pull/2029)
- #2028 [CLEAN] feat(dsh): resume stored ACP sessions across runner restarts @ 4240bfd5820cd63988eec5218a9fe03e9cb0416c (https://github.com/tiann/hapi/pull/2028)
- #2027 [CLEAN] fix(dsh): abort via session/close when the agent has no cancel capability @ f937755904a22683518d5c2eba717e56062ab133 (https://github.com/tiann/hapi/pull/2027)
- #2026 [CLEAN] fix(web): allow pasting non-image files into the composer @ 7ea3d1497821c404556f5fb4fe5fd1bf68728bc9 (https://github.com/tiann/hapi/pull/2026)
- #2025 [DIRTY] fix(codex): persist Round duration across session reloads @ cefea0cfb364c2b7f7d9d24deee3b2166277558e (https://github.com/tiann/hapi/pull/2025)
- #2024 [CLEAN] fix(cli): include localId when sending peer messages @ 110d381cac8661dda1290089ee186567e43d3b22 (https://github.com/tiann/hapi/pull/2024)
- #2021 [CLEAN] feat(cli+hub): archive_peer MCP/CLI soft stand-down (#2020) @ de758a55bd691f956c065b566d87a6dd1d311947 (https://github.com/tiann/hapi/pull/2021)
- #2018 [CLEAN] feat(web): scroll the selected session row into view on navigation @ 1156d2822374fad7bdb2b33eec5830b94d29d0b5 (https://github.com/tiann/hapi/pull/2018)
- #2012 [CLEAN] feat(web): To agent control for terminal scrollback or selection into composer @ 3b8597cc7f0b1dfacf4dcdfa593f4e4f9321e1c8 (https://github.com/tiann/hapi/pull/2012)
- #2010 [CLEAN] feat(cli,hub): search_peers beyond list_peers recency @ 86f2bccc96ff39bb9b12401e086b9b03ffc15456 (https://github.com/tiann/hapi/pull/2010)
- #2009 [CLEAN] fix(codex): support async questions, waiting input and steering @ 1453114952028065aef7733d9770cf8b76f02004 (https://github.com/tiann/hapi/pull/2009)
- #2008 [CLEAN] feat(cli): support mid-turn steer for Claude remote sessions @ 4c22ab471e767804784525fa2ef8740f5906d907 (https://github.com/tiann/hapi/pull/2008)
- #2005 [CLEAN] fix(hub): reap machine-spawn stubs that never booted @ 66f86f420ca91e976a029d3d2d4a57fd3f75e3bd (https://github.com/tiann/hapi/pull/2005)
- #2001 [CLEAN] feat(android): add Wear OS companion module (:wear) @ 9b7eb0f1432f1a8a26c470856c2340adea19c53b (https://github.com/tiann/hapi/pull/2001)
- #1997 [UNSTABLE] feat(cli): cap live sessions at a configurable default of 20 @ bdbd7f541436fea2469e6881d46e7db7fab96af7 (https://github.com/tiann/hapi/pull/1997)
- #1994 [UNSTABLE] fix(codex): preserve explicit permissions during shared startup @ f05680a06b54722594ede61558658f0be68cbf92 (https://github.com/tiann/hapi/pull/1994)
- #1992 [CLEAN] fix: preserve native CLI stop behavior @ 9d85e25b911e762cb48abbc848b893613e4c170d (https://github.com/tiann/hapi/pull/1992)
- #1990 [UNSTABLE] feat(web): labeled dual-pole sliders for settings binary rows @ 9d2a9fa720e10bebf977ace14f0d60e81cb4d47a (https://github.com/tiann/hapi/pull/1990)
- #1988 [CLEAN] feat(auth): support optional Cloudflare Access web sign-in @ 582e8f73074abdae3ece7636555161427a2884f3 (https://github.com/tiann/hapi/pull/1988)
- #1987 [UNSTABLE] docs: add HAPI Chat VS Code community integration @ de62024efdf0916a74abe326266719472ed58333 (https://github.com/tiann/hapi/pull/1987)
- #1985 [UNSTABLE] feat(opencode): independent primary-agent selection (create + mid-session) @ 1003149b50c8edda3f341439d0e140af966a638f (https://github.com/tiann/hapi/pull/1985)
- #1984 [UNSTABLE] docs(web): document session list and search behavior @ 97476b76426f64cc0d2acdfa3ca6e48378677485 (https://github.com/tiann/hapi/pull/1984)
- #1983 [UNSTABLE] docs(api): clarify session ordering and client parity @ 592594d55fcb56de3e6d3ee77442cf5cf1e99eb9 (https://github.com/tiann/hapi/pull/1983)
- #1981 [CLEAN] feat(opencode): support mid-turn steering @ a24ef380b84baade17ec86ab45794ad9aae2caf2 (https://github.com/tiann/hapi/pull/1981)
- #1980 [UNSTABLE] fix(web): keep iPhone PWA session toolbar below blurred strip @ 997fcf4997387a97a9c938291ce89298ed677149 (https://github.com/tiann/hapi/pull/1980)
- #1979 [CLEAN] Add a Queue/Steer preference for new Codex sessions @ 2d0f1dc189ec71616c771bd37110c18af2ee59c2 (https://github.com/tiann/hapi/pull/1979)
- #1978 [CLEAN] fix(web): do not claim Agents are missing when no machine is connected @ 3129a3fd0f38b5accd87f11ff508167b8659650d (https://github.com/tiann/hapi/pull/1978)
- #1976 [CLEAN] feat(hub,cli,web): opt-in per-turn session title updates with manual-rename lock @ 5d4d45067dd09edf3dcfef82695853448d0d3e77 (https://github.com/tiann/hapi/pull/1976)
- #1972 [DIRTY] fix(web): route hardcoded UI strings through i18n @ e35f2c3f536b346dfb7a215d6af2d69fc23d82ff (https://github.com/tiann/hapi/pull/1972)
- #1962 [CLEAN] feat(website): add Russian locale @ 0a9832313b6d16481a4ca4a4334cf315fc3add64 (https://github.com/tiann/hapi/pull/1962)
- #1961 [UNSTABLE] feat(hub): localize Telegram and web-push notifications @ 702e0abed28dfba042e398f7800387ef6659db15 (https://github.com/tiann/hapi/pull/1961)
- #1960 [CLEAN] fix(web): keep tail following through layout-driven scroll @ a3334977c6a0d20c84405c7d539a20d30819fce0 (https://github.com/tiann/hapi/pull/1960)
- #1957 [CLEAN] fix(web): dismiss composer settings before Escape aborts a turn @ 4a7f154942112c34fd0e9124c8665f0c8bc3191b (https://github.com/tiann/hapi/pull/1957)
- #1955 [CLEAN] fix(web): allow retrying failed abort requests @ 58faa21e6420662ec8a306944b3aafd562992385 (https://github.com/tiann/hapi/pull/1955)
- #1953 [UNSTABLE] fix(cli): doctor fails closed on Cursor HAPI MCP invoke path @ 1055c70b4ce24f7de787df3150fdd9a4b2f76113 (https://github.com/tiann/hapi/pull/1953)
- #1949 [CLEAN] perf(hub): index the session-list future-scheduled lookups (schema v27) @ 87fa9397ba8bda82e1de82c639fdf90a15aafe21 (https://github.com/tiann/hapi/pull/1949)
- #1948 [CLEAN] fix(claude): stop locking Claude sessions to three hard-coded model aliases @ a8d0b862c6edbf749964179b5d5a5ed659be59bc (https://github.com/tiann/hapi/pull/1948)
- #1946 [CLEAN] fix(hub): map engine RPC failures to typed statuses (resume/reopen/archive/paths/pi-models) @ daa3719cec9ad3edf082f0e2404b920f24c7dfb6 (https://github.com/tiann/hapi/pull/1946)
- #1944 [CLEAN] fix(web): keepalive-idle indicators in the sidebar and retirement of lost subagent traces @ 530ce5982ba7eb50575ebb34f359d3ce6a7580e8 (https://github.com/tiann/hapi/pull/1944)
- #1943 [CLEAN] fix(runner): adopt untracked runner webhooks only from the reporting process generation @ 3a8368b89bf3cbf42fffcb30c2c7eb58485369c0 (https://github.com/tiann/hapi/pull/1943)
- #1942 [CLEAN] fix(hub): make keepalive-idle reconciliation robust against metadata churn, replays and retries @ 971b11c8070fc9caa1a2aca695a90898edb4f906 (https://github.com/tiann/hapi/pull/1942)
- #1940 [CLEAN] fix(runner): reconnect live Codex roots on resume @ 6e5455b135b0c38cdaf9272dcd9ffda73868be21 (https://github.com/tiann/hapi/pull/1940)
- #1938 [CLEAN] fix(codex): reuse live model catalogs and extend discovery cache @ 3162a904d1568c5cccf119ad395c84b748725704 (https://github.com/tiann/hapi/pull/1938)
- #1934 [CLEAN] fix(cli,hub): refuse Claude resume id overwrite and probe transcripts @ 6ea0bd703b29953f6c2ab87fb22306f9097d0b2a (https://github.com/tiann/hapi/pull/1934)
- #1932 [CLEAN] fix(cli): release stdin before handing terminal to local-mode child @ 0f96944d07a58f789f093057036bfc8560220e69 (https://github.com/tiann/hapi/pull/1932)
- #1930 [CLEAN] fix(runner): confirm archived Codex root after tracking loss @ 86abb6b8a5667d055d5de0c355fd6a7c6a60c8b3 (https://github.com/tiann/hapi/pull/1930)
- #1927 [CLEAN] fix(dsh): archive sessions when the ACP process exits @ 3e819e062042dfb593758981adc36a2823700273 (https://github.com/tiann/hapi/pull/1927)
- #1926 [CLEAN] fix(dsh): resume DSH ACP sessions after HAPI restart @ 8be836026ca3e6bb1536014babe103e1bd2d5398 (https://github.com/tiann/hapi/pull/1926)
- #1922 [CLEAN] feat(peer): spawn-peer remit + rename-proof Parent UUID stamps @ ccc17c251950a789d327222d1c97a9adcf8b3508 (https://github.com/tiann/hapi/pull/1922)
- #1921 [CLEAN] fix(hub): typed errors for undeliverable permission answers and aborts @ b46689bcac9f47f556bee7a6474e5230b9af1e0b (https://github.com/tiann/hapi/pull/1921)
- #1920 [CLEAN] fix(cli): report the inline-media shell fallback as not applicable in packaged installs @ fd7cd5844d24df4533b8969c6d7ffab2af9205c0 (https://github.com/tiann/hapi/pull/1920)
- #1916 [CLEAN] fix(cli): discover DSH skills from the DeepSeek Harness home @ 630c9fc7f0768080fbd101d02b728b79f7ddeef2 (https://github.com/tiann/hapi/pull/1916)
- #1909 [CLEAN] fix(cursor): in-place relaunch when switching live session to Auto @ df015641a9ccbf6cd1ba826e8507a680bd63be99 (https://github.com/tiann/hapi/pull/1909)
- #1903 [CLEAN] fix(web): synthesize answerable card for pending permissions dropped by the tracer @ 2389d9b391df9e4ad054838eee34e6273ef82680 (https://github.com/tiann/hapi/pull/1903)
- #1901 [CLEAN] feat(codex): thin Codex budget gauge in composer (replaces #847) @ d94482f3fe0275e9b09afdadb638a135567bbc41 (https://github.com/tiann/hapi/pull/1901)
- #1898 [CLEAN] fix(cli): flush buffered ACP assistant text after an idle gap @ bd6ffb5fe8cb20a8f2ca6a58ebae6175dffafc43 (https://github.com/tiann/hapi/pull/1898)
- #1897 [DIRTY] runner: adopt self-reported concurrent-clients roots into the resume registry @ 85c63822e722cbc15f3b18967d4e19b4f06bed41 (https://github.com/tiann/hapi/pull/1897)
- #1892 [CLEAN] fix(spawn-peer): treat permissionMode default as omit so stock yolo wins @ ff9bef872b3bb2161346186cb8405bd8c189cd8b (https://github.com/tiann/hapi/pull/1892)
- #1890 [CLEAN] fix(cli): bound path-policy symlink resolution with a deadline @ 05c87b3e933fb6094479ab5827735960fbce7c01 (https://github.com/tiann/hapi/pull/1890)
- #1889 [CLEAN] fix(hub): treat message traffic as session liveness evidence @ 74f6765eb17cdade37bfb745c225bf76add4de94 (https://github.com/tiann/hapi/pull/1889)
- #1886 [UNSTABLE] perf(hub,cli): stop unbounded session-history loads @ e45c382577bce06866e3555244122e88837ba240 (https://github.com/tiann/hapi/pull/1886)
- #1885 [UNSTABLE] fix(hub): repair hub URLs/CORS origins and accept same-host handshakes @ d5b78a3e33fbb217cdad46366a5eee3217796863 (https://github.com/tiann/hapi/pull/1885)
- #1881 [CLEAN] Nudge runner to reconnect idle session sockets when messages arrive @ 257cee4310b22867aa39e34f1b209bb7f66758e9 (https://github.com/tiann/hapi/pull/1881)
- #1879 [CLEAN] feat(cli): honor standard proxy env vars for hub egress @ 04a7489036e6c837f680cc93288988a3cb139ddf (https://github.com/tiann/hapi/pull/1879)
- #1878 [CLEAN] hub: keep sessions online while the runner still sees a live agent process @ c3d2198632177b4df577dee6521f740537fbcc07 (https://github.com/tiann/hapi/pull/1878)
- #1877 [CLEAN] fix(hub): extend the offline-detection grace for thinking sessions @ 3351b6d213bfe033a271ae32a2cfa382b922add2 (https://github.com/tiann/hapi/pull/1877)
- #1876 [UNSTABLE] fix(web): avoid running state for child traces without lifecycle @ a16cd59c60035241150e43548d6f447190c16b3a (https://github.com/tiann/hapi/pull/1876)
- #1875 [CLEAN] fix(hub): skip side effects for replayed message IDs @ 1ea30933c68456c3c62ac26eec0af0119248f4a3 (https://github.com/tiann/hapi/pull/1875)
- #1871 [CLEAN] feat(web): group action menu with pin, rename, and copy path @ e9e94ce6438f64d1134649eacf0f38b9304e93b5 (https://github.com/tiann/hapi/pull/1871)
- #1869 [CLEAN] fix(test): use portable `ps axeww` in test-process audit @ fe68899a6a78accf76706395713c4c787ec2b2e9 (https://github.com/tiann/hapi/pull/1869)
- #1867 [UNSTABLE] fix(cli): stamp test hub with HAPI_TEST_MARKER for orphan reap @ 50cfa158ac51ff3ca64b63096b977a01cce8c48a (https://github.com/tiann/hapi/pull/1867)
- #1852 [UNSTABLE] fix(attachments): journal interrupted attachment creations @ ce9596df1650a0b178eca7be759a7fac8f8c9f06 (https://github.com/tiann/hapi/pull/1852)
- #1849 [CLEAN] fix(cli): let agent titles replace Fork seed summaries @ 7fbd675f3f1e27d6c81a6b1134b032c9720a1050 (https://github.com/tiann/hapi/pull/1849)
- #1844 [CLEAN] fix(hub): keep notify-cause ingest bounded by advancing the resume watermark @ bb24e6b6254b1f210703a7e024bd5a6e0f44e31c (https://github.com/tiann/hapi/pull/1844)
- #1838 [DIRTY] feat(preview): nginx-style preview_* MCP tools mounted on the hub port @ f33c573efb81495b3c27b09a33678bdb28d0fd4e (https://github.com/tiann/hapi/pull/1838)
- #1836 [CLEAN] feat(codex): offer Luna Reserve as a manual model choice @ a35e7b85d9de7f507cd2b6da35bb0d113fbff703 (https://github.com/tiann/hapi/pull/1836)
- #1831 [CLEAN] feat(pi): inject hapi_display_image and render inline tool-result images @ 0ab08bfca124dc75e2c6b3671f2feb2cd0759565 (https://github.com/tiann/hapi/pull/1831)
- #1826 [CLEAN] fix(pi): keep imported transcript titles out of metadata.name @ 2317b3328b5f65ce374349e3fbf4250048d73d9e (https://github.com/tiann/hapi/pull/1826)
- #1825 [CLEAN] feat(cli): auto-steer ping_peer into active turn (takeover #1708) @ bb2fb712ca3d437df51fe6c73df6c6efe6c9c9af (https://github.com/tiann/hapi/pull/1825)
- #1816 [CLEAN] docs(agents): add a bounded PR review-wait and auto-fix loop @ 9f8a4afb86600d91f6b931a2f3837dbff765c021 (https://github.com/tiann/hapi/pull/1816)
- #1801 [CLEAN] feat(web): add include and exclude session search modes @ 2b6340c10a851b26fb7265d8f28c880d5379ee2f (https://github.com/tiann/hapi/pull/1801)
- #1798 [CLEAN] feat(web): show unavailable Agents on demand @ 578241ad604b0de6581c79fe0ce7d7543b07f754 (https://github.com/tiann/hapi/pull/1798)
- #1797 [CLEAN] fix(web): allow directory collapse during session search @ 14df9508dd684702ec5368161e2943b72dab2b1e (https://github.com/tiann/hapi/pull/1797)
- #1793 [CLEAN] feat(web): absolute datetime tooltips on relative ages @ a2f8f3a8298ea4a82c08d721696027c9a6a0e415 (https://github.com/tiann/hapi/pull/1793)
- #1791 [CLEAN] feat(web): add bilingual release history to Settings > About @ 2212dfe050ea23b1edb293347d9e2879e199ac73 (https://github.com/tiann/hapi/pull/1791)
- #1788 [CLEAN] feat(web): expose agent quota queries in settings and context display @ b76e0dc1d0a90d5ff76e40b390ccdfc988ea4518 (https://github.com/tiann/hapi/pull/1788)
- #1787 [CLEAN] feat(runner): add safe agent quota query infrastructure @ 7771ed305317ee964ae21a8fa468db24a060e239 (https://github.com/tiann/hapi/pull/1787)
- #1778 [CLEAN] fix(files): optimize exact path and directory search @ d4f2d098aa5e23e24697dfb05a80bd0b023d294d (https://github.com/tiann/hapi/pull/1778)
- #1772 [CLEAN] feat(web): add combined session list filters @ 309281cf618e8b46371389bf0e90578812569d6c (https://github.com/tiann/hapi/pull/1772)
- #1771 [DIRTY] feat: add prompt-free session control workflow @ 8d34df9eac82c789f80b92132ed9e7efe54043c1 (https://github.com/tiann/hapi/pull/1771)
- #1762 [draft] feat(web): in-session message content search @ 30b531a4f494b1df058f14e75e3d04e2318e471c (https://github.com/tiann/hapi/pull/1762)
- #1758 [CLEAN] feat(web): add pin-in-progress session layout modes @ 956d821bd4636fa483012fcbf168655787070f28 (https://github.com/tiann/hapi/pull/1758)
- #1753 [CLEAN] fix(runner): reject a spawn model missing from the machine's catalog @ d5fa8963fa91b825a04af6532a9d870dbd466088 (https://github.com/tiann/hapi/pull/1753)
- #1747 [DIRTY] feat(web): add collapsible session sidebar @ a8e8d6e91b8c6f8a8b3495fb6ba214cdc8594eb6 (https://github.com/tiann/hapi/pull/1747)
- #1738 [CLEAN] fix(hub): capture AGENT_NOTIFY_SUMMARY from peer user-role deliveries @ 5a695fbd1bd367fe15835f9f9742cc37fe9fc160 (https://github.com/tiann/hapi/pull/1738)
- #1733 [DIRTY] feat(web): session-list scrollbar tick for open session position @ 11cd6b0b9829d029a486869487ebb48f19e1e6d0 (https://github.com/tiann/hapi/pull/1733)
- #1729 [CLEAN] fix(web): Enter inserts newline when composer is expanded @ f04288cacaae35ee2c50b381bc4db5604eb03f80 (https://github.com/tiann/hapi/pull/1729)
- #1728 [CLEAN] fix(web): collapse expanded composer immediately on submit @ 7a93bb406734417589da0be5d344161cdd0723b9 (https://github.com/tiann/hapi/pull/1728)
- #1727 [CLEAN] fix(hub,cli): keep inactive file previews available through runner @ 51084ca52b89d0627c7606200ad39ae5121d447a (https://github.com/tiann/hapi/pull/1727)
- #1726 [CLEAN] fix(web): align file preview content around scrollbars @ 32d49896062b1a463815fee1614feb503b8d9cee (https://github.com/tiann/hapi/pull/1726)
- #1725 [CLEAN] fix(cli): auto-Continue on Cursor post-tool interrupt; Blocked only on give-up @ fa9a3dbaa757574260607dde3e09cfd78c833f83 (https://github.com/tiann/hapi/pull/1725)
- #1722 [CLEAN] fix(web): allow retrying failed attachment uploads @ 7b584176d65746fa8fc1ee852b51a7fb2fe59e36 (https://github.com/tiann/hapi/pull/1722)
- #1721 [CLEAN] fix(pi): support Windows npm command shims @ 02840df43b4f07bbb8ce60ea55264199287dd295 (https://github.com/tiann/hapi/pull/1721)
- #1720 [CLEAN] fix(web): keep mobile code gutters clear across renderers @ 26d533fc5e0fb8c4afd62df76bd8652ce7be2ac8 (https://github.com/tiann/hapi/pull/1720)
- #1718 [CLEAN] fix(web,hub): friendly file preview when session CLI is offline @ 4bd39ff866aa40f4d0eae4bb69cffcfeb60f5063 (https://github.com/tiann/hapi/pull/1718)
- #1715 [CLEAN] fix(pi,agents): tool-result images + provider-qualified set-session-config + live model catalogs @ 8eea473175ea5b94f2d29fd19bffbfaeb93e9dbd (https://github.com/tiann/hapi/pull/1715)
- #1714 [DIRTY] feat(codex): select provider profiles for web sessions @ a227310e3e7438b5940089748367339d060536b1 (https://github.com/tiann/hapi/pull/1714)
- #1713 [CLEAN] feat(web): add mobile attachment source picker @ 84363a528f1d9ef76d020fb264bf457a9c97746b (https://github.com/tiann/hapi/pull/1713)
- #1712 [CLEAN] feat(workspace): add HAPI Recycle Bin for deleted files @ c3f917116144e753fa17cf239d900144fbca735c (https://github.com/tiann/hapi/pull/1712)
- #1711 [CLEAN] feat(web): make detail headers horizontally scrollable @ 06ece12999a8180d0d71c4605ab05af44da5e5c7 (https://github.com/tiann/hapi/pull/1711)
- #1708 [DIRTY] feat(cli): auto-steer ping_peer messages into an active turn @ 73630bbd3f3058b3eca9f77df0fe392ca1c4940e (https://github.com/tiann/hapi/pull/1708)
- #1706 [DIRTY] fix(hub): verify runner before trusting archiveSession's dead-CLI fallback @ 26c1615ae754ddb16b43fdbae4850f90ea7d6d85 (https://github.com/tiann/hapi/pull/1706)
- #1704 [CLEAN] feat(web): add independent session header Agent icon toggle @ eaafd0975c206158f06dc94f6617551dd8cdf330 (https://github.com/tiann/hapi/pull/1704)
- #1702 [CLEAN] fix(web): debounce and cancel stale file searches @ d4918bbb60920f6c60fc47a26fd9cf6793f80d6b (https://github.com/tiann/hapi/pull/1702)
- #1695 [CLEAN] feat(web): add fullscreen preview for shared turns @ 26699be34cd90d44cbe9a645a8bdb03bdd7fbfd9 (https://github.com/tiann/hapi/pull/1695)
- #1693 [DIRTY] feat(web): add fullscreen table preview and export actions @ 00e4e993c72e527e9e64ec4e55799e2efe5563ae (https://github.com/tiann/hapi/pull/1693)
- #1692 [CLEAN] feat(agent): add provider-specific agent detail inventories @ 316f4197f5e3da3b412bf530808d196e7b454d2c (https://github.com/tiann/hapi/pull/1692)
- #1691 [CLEAN] feat(cli): show Claude compaction as a summary card with token delta @ 41854e981e3af1443e58e14b82490c32ff399878 (https://github.com/tiann/hapi/pull/1691)
- #1684 [UNSTABLE] feat(attachments): persist original attachments in Hub @ 8df0545568572b4ddf11fb8955da6bc55fffd262 (https://github.com/tiann/hapi/pull/1684)
- #1683 [DIRTY] feat(hub): add generic webhook notification channel @ 08fa9726e8d0dce5a5a263987fb54cb2ce649d21 (https://github.com/tiann/hapi/pull/1683)
- #1679 [CLEAN] feat(claude): support conversation rewind via native session truncation @ 4db160525bb65016758f333a6969d29888a5cc47 (https://github.com/tiann/hapi/pull/1679)
- #1678 [CLEAN] fix(web): make composer session mention pills ellipsize @ c4c28624db1da06f27bee573d83201692ab7c778 (https://github.com/tiann/hapi/pull/1678)
- #1677 [CLEAN] feat(opencode): import local session history @ a832355bc2ea1aed9a703d38838282e7f40b29ea (https://github.com/tiann/hapi/pull/1677)
- #1676 [CLEAN] feat(opencode): wire session fork via the server HTTP API @ aacc2580dea8e29397df88026fcfeac19545ae44 (https://github.com/tiann/hapi/pull/1676)
- #1673 [CLEAN] feat(web): show a fork preview dialog before forking a conversation @ a4d0eb36044d6cfbdeb8c7ee7f214ba7493696a3 (https://github.com/tiann/hapi/pull/1673)
- #1672 [CLEAN] feat(acp): re-enable change_title for ACP launchers with manual title precedence @ 2d1ccf429cca9b3f19bec5bcab8ffbce54e802ab (https://github.com/tiann/hapi/pull/1672)
- #1668 [CLEAN] feat(opencode): show round usage metadata @ 483b4467f597e5c1be1e30c3ea78356dc927b834 (https://github.com/tiann/hapi/pull/1668)
- #1666 [CLEAN] fix(web): improve generated media retry and sizing @ e32370634d51ec93a8caf5d5ca278f0bba98eb73 (https://github.com/tiann/hapi/pull/1666)
- #1665 [CLEAN] fix(web): improve fullscreen image preview toolbar layout @ eb4fa6c75c451e0cefd8a72a4143c7338abc549c (https://github.com/tiann/hapi/pull/1665)
- #1664 [CLEAN] fix(web): keep machine health visible for single-machine layouts @ 2e8176d7b215020aa3b117f37936aa3845f26171 (https://github.com/tiann/hapi/pull/1664)
- #1662 [CLEAN] feat(web): unify composer model and effort controls @ e8ee5dc204bf64efec0eff6793b977c27776b8f9 (https://github.com/tiann/hapi/pull/1662)
- #1660 [CLEAN] fix(web): support RMB symbol aliases for skill autocomplete @ bf182f8ced3ddeb4a474c9a86b2396dd0c472e56 (https://github.com/tiann/hapi/pull/1660)
- #1659 [CLEAN] feat(web): add frontend composer history for loaded session messages @ 6ac0a32204d47b14fe3815835de909c64f2d61c3 (https://github.com/tiann/hapi/pull/1659)
- #1658 [CLEAN] feat(web): add Alt+S shortcut to send messages @ 6a86371be75cb5c4cc6989130a59802826d6bcce (https://github.com/tiann/hapi/pull/1658)
- #1657 [CLEAN] fix(web): improve deferred generated-file download controls @ 410c2acd1a8c12a2b76712072f3034e7d912d84b (https://github.com/tiann/hapi/pull/1657)
- #1656 [CLEAN] fix(web): avoid session misclicks during live reordering @ fb962536e280b94f643aeb66f9b0de8cf873eb72 (https://github.com/tiann/hapi/pull/1656)
- #1644 [CLEAN] fix: render opencode edit/write/read tool calls through the shared views @ d608fb3d9d916ee943af2b7805c8ae94ee131ff3 (https://github.com/tiann/hapi/pull/1644)
- #1642 [CLEAN] fix(agy): report the failure reason instead of echoing the answer @ ccc098bf7bb5df49acc5e432a93fe132c4a06dcb (https://github.com/tiann/hapi/pull/1642)
- #1640 [DIRTY] feat: add lightweight shared Agent Studios @ b86a3b6c16c90ab80636a99f07ae9ca58bc129a4 (https://github.com/tiann/hapi/pull/1640)
- #1637 [CLEAN] feat(web): add desktop session sidebar toggle @ c25cc017d9d5f91e1c80abe25a2c06898ff0bd62 (https://github.com/tiann/hapi/pull/1637)
- #1636 [CLEAN] fix(web): prevent session navigation on right-click @ 60db9468d95b5197cbc49984f022256057f25dbe (https://github.com/tiann/hapi/pull/1636)
- #1635 [DIRTY] feat(web): show project in session header @ 0ccf36f6df615e26f8a5cab1d5ca9861e0ba6b26 (https://github.com/tiann/hapi/pull/1635)
- #1629 [UNSTABLE] fix(agy): stop delivering the same answer twice when deltas are mangled @ a084ba83b531ec4436786d6f703e9ca7ff9b0fd5 (https://github.com/tiann/hapi/pull/1629)
- #1625 [CLEAN] fix(web): provide exact PWA icon sizes for Windows notifications @ 9aa1668bc6f76e6d205b1f26e677902c2bec5f59 (https://github.com/tiann/hapi/pull/1625)
- #1621 [CLEAN] fix(sessions): make title generation discoverable @ 8954d057a54d6696a91466bf6e493b63f1abf129 (https://github.com/tiann/hapi/pull/1621)
- #1620 [CLEAN] fix(web): coalesce symlink path spellings in session list groups @ 72bd413a1c90a67f55e568c5b1097c3f8c46a8bd (https://github.com/tiann/hapi/pull/1620)
- #1618 [CLEAN] feat(peer): nametag-only ping_peer reply attribution @ 5fa5696566c1831a6803d70b3d20ae0eb5ba8dcb (https://github.com/tiann/hapi/pull/1618)
- #1617 [CLEAN] fix(web): unify sync session menu labels @ ea5ec5c3c1dc240dee87ab54282e4a47622ee3f0 (https://github.com/tiann/hapi/pull/1617)
- #1616 [CLEAN] fix(web): reuse existing PWA window for notification clicks @ 455917d62f10cbc2034dc08de5b51ee957ee18ee (https://github.com/tiann/hapi/pull/1616)
- #1615 [CLEAN] feat(hub): add optional WxPusher completion notifications @ 131aafd2e94680cfa1ec2baefe78281d4ccab0b2 (https://github.com/tiann/hapi/pull/1615)
- #1614 [DIRTY] Make web terminals persistent and attachable @ 64770fb335544e95bbbc549c55e3d587b428d8d0 (https://github.com/tiann/hapi/pull/1614)
- #1613 [UNSTABLE] fix(cursor): isolate HAPI MCP overlay to project mcp.json @ 957a3d00a110de0ecfda509d1ca458acfe43b9ed (https://github.com/tiann/hapi/pull/1613)
- #1611 [UNSTABLE] fix(scratchlist): persist manual ordering and improve draft actions @ 0530c4a99ab68ff74780b8be963db584a7ace5cf (https://github.com/tiann/hapi/pull/1611)
- #1607 [CLEAN] feat(web,hub): right-click context menu for sidebar project groups (#881) @ 311e55bb9d54d49ce5ba39ac20852bb673de37b5 (https://github.com/tiann/hapi/pull/1607)
- #1604 [CLEAN] fix(codex): gate history actions until native thread is ready @ 5292741259f26524fbee9d1eac836d9fce196976 (https://github.com/tiann/hapi/pull/1604)
- #1603 [CLEAN] fix(web): align Fork/Rewind confirmation dialogs @ 2fbdb4f1f4c5e89da4890e1244e9be93dd70bb71 (https://github.com/tiann/hapi/pull/1603)
- #1599 [UNSTABLE] fix(web): consolidate tool card display settings @ 9a094c1f667037799ae68073d4c9f296533d03c0 (https://github.com/tiann/hapi/pull/1599)
- #1598 [CLEAN] feat(web,hub): add opt-in search for session message content @ 59e7d60923caeb03237cc5e94647ac3ae2c726f4 (https://github.com/tiann/hapi/pull/1598)
- #1597 [CLEAN] feat(web): assistant response navigation with window-store-safe jumps (#1093 + #1587) @ b5a1e463542d57f746399b4d074e774161bda3c1 (https://github.com/tiann/hapi/pull/1597)
- #1592 [CLEAN] fix(web): apply reasoning collapse preference to history @ 67112915c48b949df6f2311d4de7cf040c1019aa (https://github.com/tiann/hapi/pull/1592)
- #1581 [CLEAN] fix(web): clear stale drafts after delayed queued sends @ 7be4fe5f5e527a563ca049f0e0ceb3fa5240db95 (https://github.com/tiann/hapi/pull/1581)
- #1567 [DIRTY] feat: add Reasonix ACP integration @ aa7fdf0f5bfbacf811cf745409ae7aacb9c84bc3 (https://github.com/tiann/hapi/pull/1567)
- #1564 [UNSTABLE] feat(cli): Cursor-only display_links MCP for unmangled URLs @ e8cbc5a005057ac0a5b2224a93d9e787509030c4 (https://github.com/tiann/hapi/pull/1564)
- #1543 [CLEAN] fix(web): preserve shared turn layout and generated file downloads @ 4a6dc6cbe68b33c04a1afcef605bfe365f7bac9a (https://github.com/tiann/hapi/pull/1543)
- #1542 [CLEAN] fix(web): keep loaded older history in the window while a session streams @ 4868b97c9d5ac41e0a89e93604317b66ae75f773 (https://github.com/tiann/hapi/pull/1542)
- #1537 [DIRTY] feat: add peer tools exposure toggle (#1401) @ 693aed6e40beed850caeb65ac32fb4e6d68442d5 (https://github.com/tiann/hapi/pull/1537)
- #1528 [DIRTY] fix(hub): make session timeout and reconnect state durable and consistent @ 3517c527077d71033ec3782185ca4cf6d280d0f4 (https://github.com/tiann/hapi/pull/1528)
- #1527 [DIRTY] feat(cli): survive terminal hangup by switching the session to remote mode @ 597c28d6bcb5dd2fc8938197d60e5dea9d327821 (https://github.com/tiann/hapi/pull/1527)
- #1525 [DIRTY] test(cli): make the suite pass on macOS hosts @ 85e5ec888140097893bdf30dfe1b101145d2c54e (https://github.com/tiann/hapi/pull/1525)
- #1523 [CLEAN] fix(web): unify agent task status presentation @ 6c5236185bc6d7fc11adaa5d565b1c10aa10fbdf (https://github.com/tiann/hapi/pull/1523)
- #1517 [DIRTY] Fix Telegram Mini App polish and file tree state @ d9767f92f0beb3a245ed2329030126441676e8e0 (https://github.com/tiann/hapi/pull/1517)
- #1512 [CLEAN] fix(web): use latest assistant replies for session recency @ a2a7db30f8aa473dfd15f9e5636a7da7a333f14b (https://github.com/tiann/hapi/pull/1512)
- #1468 [CLEAN] feat(usage): record ACP cost and surface per-agent reporting availability @ 8f2d931d9ceb7573007df954276747338cd2a585 (https://github.com/tiann/hapi/pull/1468)
- #1447 [DIRTY] feat(web): add separate option to pin active sessions @ 19daba6f54b3bc99d4645dd3be25cdc6d2be7b4b (https://github.com/tiann/hapi/pull/1447)
- #1443 [DIRTY] feat: restore mid-turn steer for Codex and Cursor @ 1888de0e1e3fd9ae84001d49e56e8d607b4b67f8 (https://github.com/tiann/hapi/pull/1443)
- #1436 [CLEAN] feat(web): persist and send voice input message across session navigation (#1435) @ 45bf446d6f39748cb185530e92e08a811cdf7014 (https://github.com/tiann/hapi/pull/1436)
- #1429 [DIRTY] feat(claude): import local session history @ 5d3f41bb10bb22e7186d1abc0fc45e5659be479d (https://github.com/tiann/hapi/pull/1429)
- #1424 [CLEAN] feat: show progress bar on session for hours-long jobs @ a74ad66d6c92bdf019ac6829b686474ab682afae (https://github.com/tiann/hapi/pull/1424)
- #1422 [CLEAN] fix(web): make long file errors expandable @ 0d027bfbb3b1356d03e7856c78619c9e8627674e (https://github.com/tiann/hapi/pull/1422)
- #1418 [DIRTY] feat(web): drag sessions into composer mentions @ 80398b63f4f66170351c3538e8d8791231534c7e (https://github.com/tiann/hapi/pull/1418)
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
- #1163 [CLEAN] feat(session): opt-in GitHub PR awareness + explicit attach @ e3b3f82b8ca2f223d4d8c42737f3a0176e798d67 (https://github.com/tiann/hapi/pull/1163)
- #1158 [CLEAN] fix(web): unify session header display labels @ b00e39794e707d3bdbd6ab1029b5a6576b3cf985 (https://github.com/tiann/hapi/pull/1158)
- #1126 [DIRTY] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1099 [DIRTY] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [CLEAN] feat(web): add assistant response navigation @ 14888e040dc6027a0e1b6132185379998d250bfb (https://github.com/tiann/hapi/pull/1093)
- #1092 [DIRTY] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [DIRTY] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [DIRTY] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [DIRTY] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [UNSTABLE] feat(cursor): detect inline model errors, surface, notify, and bridge (#878) @ 2c28a1365f2102c5cd1b7156b4af2207d3cb7192 (https://github.com/tiann/hapi/pull/987)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ 0706f14b2bc5668d487b102f7a1a1bcbfeb53f8c (https://github.com/tiann/hapi/pull/945)
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

## Selection decisions (2026-10-22)

Official base unchanged from v0.30.7.5 (5d8deb20). The v0.30.7.5 queue was
replayed and these changes were applied:

- New carries (latest-head HAPI Bot clean, CI green): #2087, #2088, #2089, #2091
  (Claude fixes), #2090 (personal Codex "Approve for me" mode), #2092 (shared Codex
  Web Rewind), #2078 (slow Codex startups), #2077 (scrollbar overflow).
- Refreshed: #2061 to a29b6496.
- Operator-requested overlay: #2008 (Claude mid-turn Steer) at 4c22ab47 plus
  overlay 0055, which fixes the three open latest-head HAPI Bot findings:
  lifecycle-unknown startup steers, process stop before restoring steers on an
  early tool-abort return, and echo marker kept on rejected cancel. Its new
  regressions fail before the fix. Claude Code 2.1.302 was verified live to emit
  `command_lifecycle` queued/started before `result`.
- #2035 is retained at its audited v0.30.7.5 head as overlay 0038. The new head
  (80704bb2) conflicts with carried #1940 (`guard.run`) and #2046 (process
  snapshots) in `cli/src/runner/run.ts` and `cli/src/utils/process.ts`, so the
  refresh is deferred.
- Merge resolutions: #2092 with carried shared-root title/permission tests (kept
  both; the integration test keeps the EventEmitter MockSession). #2078 with
  carried #2066: the webhook-timeout hint now reports #2078's per-agent startup
  timeout. #2078 rpcGateway tests merged with the carried stop tests.
- Swear Review of fork PR #30 (d58ec323, 25 findings): overlay 0055 now also
  removes the caller-signal listener on every exit (`AbortSignal.any`), commits a
  started steer even if the output flush throws, and logs non-removed cancels
  correctly. Overlay 0056 fixes three #2092 findings: the hub now rejects a
  CLI `{ error }` reply to CompleteConversationRewind so the session is
  quarantined, a proven rejection clears the barrier token before unlinking, and
  a rejected notification gets no id-less error frame. Each has a regression
  that fails without the fix. Not changed: 11 findings in workflows, maintenance
  scripts and Android are unchanged since v0.30.7.5; #2092 design choices (crash
  leftover barrier needs manual reconciliation, completed rewind drops deferred
  native requests, nested ternary); #2091 meta.json race (falls back to prompt
  matching; holding the cursor would stop forwarding when meta.json never
  appears); #2008 restore on a cancelled reservation (restore is a no-op there);
  open `command_lifecycle` state union (wire data).
- Personal PRs opened after the first audit, auto-carried after the base rebuild
  (latest-head HAPI Bot clean, CI green): #2095 `hapi set-mode`, #2096, #2097,
  #2098, #2099, #2101, #2102. Merge resolutions: #2095 now takes the exact session
  UUID like the carried peer commands (the fork has no prefix resolver), and its
  tests use the fork Codex catalog (with `autoReview`). #2099 keeps #2092's
  rewind and divergence guard around the first history import. The legacy
  baseline is only finalized once that import runs. A completed rewind replays
  history with the baseline, and history replay emits no turn completion for
  baseline turns (fork #2025 projection). #2102 replaces the fork's
  background-task delta tests with snapshot equivalents and keeps the replay
  guard and abort clearing.
- Refreshed defer heads #1984, #1983, #1599, #2042 (now clean, still out of scope).
- Deferred despite clean review: new features #2093, #2080, #2075, #2074, #2072,
  #2056, #2052 (wait for maintainer acceptance). #2076 (Minor) has a
  latest-head finding.

## Selection decisions (2026-10-23)

After the Swear Review fixes, the operator asked for a re-inventory and chose
these additional open PRs. All were replayed on the 2026-10-22 queue at their
audited heads (live heads re-checked on 2026-10-23).

- Operator-requested overlays (non-personal PRs that do not pass every carry
  gate, so they replay as overlay patches like #2008; open gates are listed in
  pr-audit.tsv): fixes #1920, #1903, #1898, #1844, #1726, #1718, #1664 (0064-0070),
  Claude/Codex fixes #1948, #1604, #1849 (0071-0073), hub/CLI fixes #1921, #1916
  (0074-0075), peer tools switch #2052, #2056 (0083-0084), session management
  #2080, #2072, #2075 (0085-0087), OpenCode #2042, #1981 (0088-0089).
- Personal PRs: the operator reversed the earlier personal-feature omissions and
  asked for every open swear01 upstream PR. #1542, #1468, #1662, #1607, #1836,
  #1418 and #1597 are auto-carried (0076-0082); the rehearsal reports their
  failed gates as PERSONAL_PR_POLICY_EXCEPTION.
- Requested but not applied: #1875 (the fork already skips replayed-localId side
  effects through #1942 `addMessageWithStatus`), #1869 (the fork test-process
  audit already uses `-axo` on darwin), #2071 (the carried #1771 remit localIds
  already cover it; it conflicts in 5 files).
- Merge resolutions that change upstream behavior:
  - Hub schema is now 29. #1468's ACP cost columns are V27->V28 (fork V27 is the
    #1771 `steered` column) and #2080's `session_read_states` is V28->V29. V28
    clears `usage_events` and `usage_scan_state`; the hub rebuilds them by
    rescan. Rolling back the hub needs the pre-upgrade database backup.
  - #2052/#2056 apply to the fork peer tools: `inspect_peer`, `ping_peer` and
    `spawn_peer` (the fork has no `list_peers`). Upstream's system-prompt steer
    changes are dropped because the fork injects no peer prompts. The fork
    `spawnPeer` core also refuses with `disabled`, and MCP handlers pass the
    session snapshot to it.
  - #2075 starts the title turn after the fork retry guard, so a retry of an
    already-consumed message cannot open a turn that never completes.
  - #1981 keeps Claude in the steering flavor list (#2008 overlay).
  - Other conflicts were union merges of imports, tests, locale keys and e2e
    lists; details per PR are in pr-audit.tsv.
  - #1836's luna-reserve e2e now opens the model button at 1280px, where
    #1662's unified composer shows it directly instead of under Settings.
- The 27 PRs opened after this inventory (#2103-#2133, mostly Android parity
  work) are deferred without review. #2074 and #1621 heads moved during the
  rehearsal and stay deferred.

## Candidate verification (2026-10-23, oracle, 2 CPUs)

- Bun 1.4.0 frozen install (no changes) and typecheck (CLI, hub, web, relay, desktop): pass.
- Full tests: CLI 3,656 pass / 19 skip; hub 1,642 pass; web 3,846 pass; shared 346;
  relay 118; desktop 5.
- Maintenance Python checks: 43 pass. Generated shared fixtures: no drift.
- Isolated rehearsal: REPLAY_TREE_MATCHES=47dee910d64ee6fd68bd1f732436f01a318f602b;
  REHEARSAL_OK (the replayed tree passed the same suites).
- Browser e2e with `--timeout=120000`: the CI list plus the new
  load-earlier-running-session, luna-reserve, session-mention-drag,
  jump-navigation and session-title-lock specs, 58 pass after the luna-reserve
  fix (4 of 4 on rerun). session-read-sync needs a live hub and was not run.
- Runner integration was not rerun: this host fails its 10s runner-start wait
  on the unmodified v0.30.7.5 tree too (2026-10-22). Fork CI integration on the
  exact head is the gate.
- Earlier live check (2026-10-22): Claude Code 2.1.302 stream-json emits
  `command_lifecycle` queued/started before `result` for prompts that carry a uuid.
