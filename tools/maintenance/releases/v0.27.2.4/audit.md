# HAPI maintained release audit

Previous maintained release: v0.27.2.3

Official release: v0.27.2

Personal PR owner: swear01

Origin main: 901d84a1d4d8d8efe5728e6ccd63929974cf8468
Upstream main: 11964b4b0d5388c7ab98b8645f43a078d1917b34

## Fork-only commits

- 901d84a1d4d8d8efe5728e6ccd63929974cf8468 Merge pull request #4 from swear01/fix/codex-usage-rate-limit-fields
- 0f8139c5aad62d82c3962982d6651e1fdf9f4d61 fix(codex-usage): parse real app-server rate-limit fields (closes tiann/hapi#1514)
- ecfce85951af58947b326bec0ac8d73c2f927ab6 fix: repair fork-main merge — restore #1468 usage cost columns, #1093 MessageActions navigation, #1480 steer real-mutation, dedupe rpcGateway/codexLocalLauncher
- ae345cef83c642e409824caa21e8a5a1bd396155 merge: fork main (hub storage breakdown vacuum + Gemini review method) into v0.27.2.3
- 688a0c01f739bdf1c292605953d244fccf7acdb7 merge: v0.27.2.2 baseline (resolve ours — rebuilt content is newer)
- e653f7a747a018fd2f7f1aa7f9e1566bad83b33c docs(release): correct v0.27.2.3 notes — #1473 deferred, not carried
- ebd2b2988dff56eaaaf9ad4496925d451bb07e1c chore(release): v0.27.2.3 manifest + pr-audit (35 carried, #1473 deferred, #1462 absorbed)
- a8286dbe0cc9109f0868e4a4ac1696c54171c6e1 fix(web): guard markMessagesConsumed localId/invokedAt nullability in steer invoked reconcile
- 7181d608457d3332f11e2656d57c7e276c1f600a fix: web test alignment (#1480 steer hook real-mutation, #1475 toolbar order, #1501 dictation recordingFailed guard) + restore Linux-only agy guards (#1406) + keep #906 modelError flush with #1484 anchoring
- 1aacf66fb63bcd27b13b4c2337d1db10da3d50d4 fix: hub merge fixes (autoBridge reconcile, fleetUpgrade live-RPC + coalescing, opencodeClear job transfer, mergeSessions redirect reclaim)
- b12c9b713cff1e0f7992b5af50f9b6af4ce6f0c4 fix: UsageEventRow cost columns
- f6c5e7eb95231afdf27a5279273d8ae1e2751c0f fix: map cost/contextOnly in toUsageEvent
- a077128b36249a7ad13a26ff2fb949bbe98f115a fix: extend UsageEvent with cost/contextOnly (#1468)
- db64ea6a7f42e855486e20c69a7902eadcaef480 fix: usageService cost/agents (#1468), callPiRpc (#1480)
- 3320108f4e17a83911803288c9de0145bf6c20a2 fix: hub (dup import, autoBridge write import, callPiRpc, usage costs)
- 253440fc44324528dd5f0a18540558ad3e5ccf3e fix: hub fixes (rpcGateway dup, autoBridge apply method, push return shape, claudeImportState fields)
- b9c221528403434a849e0cd435679e752f280a9d fix: add model/effort toolbar label keys
- e1c4d81e361e53f324bca0813b18fd0fa7a8ffe2 fix: ComposerButtons useLongPress import + allowQueueGesture prop + toolbar ids
- 3f31db76261833802facc2390b52ceba24ba285b fix: web fixes (App imports, toolbar ids, fixtures, locales, useNarrowViewport, QueuedMessagesBar steer refs)
- 21368c56f64e4ddfbd85b9586b4c42f3fa448013 fix: repair steerQueuedMessage/steerMessage methods in client.ts
- fd98e01fc2e5020af7ae467f3b77779e195823de fix: await listLocalClaudeSessionSummaries in ACP handler
- aa2411217e90197aa0ae4a58ef91bdbf062f79a8 fix: add stateUpdate constant (#1468) and await claude session page (#1429); claudeRemote timeout
- 9f3832fbc395785e51170e2ceaed40167f915fca fix: dedupe handleAgentMessage signature in cursorAcpRemoteLauncher
- 57f54e4360f177a1d57cf0f6f065344635175f53 chore(release): prepare v0.27.2.3 (version bump + release notes)
- 205fdf9aed4b092c219c1a80cb49620917ee883a fix: resolve useSteerQueuedMessage to generic steer (#906); keep api.steerMessage for Pi
- 9420a97b8b374de67f55d8d1b3ada1f809f298a3 carry: 37-pr-1484 ACP between-turn straggler flush (merged with #1487 thinking + #906 steer)
- 0b003637b687f84fc5d16cd25b458ce68511e04c carry: 36-pr-1480 pi queue mid-turn steer (merged with #906 generic steer)
- 61d70b99f77c81704d28aac2d4b0c517cb96a325 carry: 34-pr-1471
- d844d73825a620b11ed2c34e4cf6e839b4ca678a carry: 32-pr-1490
- aa8cf1279382857c3206a2fdf37269322ff9390a carry: 31-pr-1495
- 8893508a006d6377ad1fe3e2eb1d9339c08f9348 carry: 30-pr-1496 Telegram Mini App chrome
- 11dab8c63015e18d580b00722dc9188efcd44d1f carry: 29-pr-1497
- 1fe312606f1657853d985f965af0fee8f27d935b carry: 28-pr-1498
- 1ff95f1b013e09b8943f5ff3703514a6f0f8fcd1 carry: 27-pr-1501
- a98ca9986286c183835695ddfc7aa30fb3ec9187 carry: 23-pr-1477 (resolved from v0.27.2.2)
- bbbde89e4e52c6358b70a7c6b94ba3722a5ab741 carry: 15-pr-1419 (resolved from v0.27.2.2)
- c8ffebd4ff694333a03637605e8f29751241df22 carry: 24-pr-1447 (resolved from v0.27.2.2)
- e9cd65422cf301cf064b2ebb0121c682879e2c6b carry: 21-pr-1451 (resolved from v0.27.2.2)
- 28698aaa18961d927f6c596837778961bcd593eb carry: 14-pr-1421 (resolved from v0.27.2.2)
- efcf484d952e9c1f8273461eeb1627dd805f29a9 carry: 12-pr-906 (resolved from v0.27.2.2 + upstream #1487 thinking-bump)
- 0f558ab28b8126bf17fafbe633f5b3550939dca5 carry: 11-pr-955 (resolved from v0.27.2.2)
- 3750b5a7638a0b357a6abf1d834dc0395d744177 carry: 10-pr-1158 (resolved from v0.27.2.2)
- 32c2288c496ce5c0828aa67cc30e1bc7bd05d098 carry: 09-pr-1413 (resolved from v0.27.2.2)
- 1a15c8f545a5c3c49224058dff762cb2b04033c8 carry: 08-pr-1414 (resolved from v0.27.2.2)
- fec27beb9aaa7df2ca0d990271b28a61dacf3d4f carry: 07-pr-1422 (resolved from v0.27.2.2)
- c521e7ce5d12d910659a636239e28f6b48b1abdf carry: 06-pr-1424 (resolved from v0.27.2.2)
- c18855f2d06f79393fa78e7c4156747977f0d678 carry: 05-pr-1108 (resolved from v0.27.2.2)
- ac1af9a25d028b6b9d90f1178f7a9f7c9c53ce15 carry: 04-pr-847 (resolved from v0.27.2.2)
- 6749caed19008376c4f0d57971ab6bb6446d6676 carry: 03-pr-986 (resolved from v0.27.2.2)
- 8d19f063077c4a5a5ad3e2e49698230cee2a98da carry: 02-pr-987 (resolved from v0.27.2.2)
- 7b2beec2d403a119689ab51a540229ffd31e373c carry: 01-pr-1091 (resolved from v0.27.2.2)
- d748724cdf01e0505e85a4ca647becfc9f43b82f Merge pull request #3 from swear01/chore/fork-review-method
- 169e06b8add041e2f51975622d96b18de5fcbe3f chore(ci): drop OpenAI-codex PR review on the fork; GitHub-native Gemini bot is the fork review method
- b5ba80f85ecb94badf21eba17463ef04b74018e3 Merge pull request #2 from swear01/feat/hub-storage-breakdown-vacuum
- b7991be8b2fa29bbbb8b2502e49036bfe7ceccf8 test(hub): tolerate empty-table omission in storage breakdown fallback
- 26109761f9f2f7c41c036dc95ba999066651592b fix(hub): fall back to content-length table estimates when dbstat is unavailable
- 0622001ce6bdbbcd911d2ca0c50764e7e872beff chore(web): drop macOS case-collision workaround; rely on helper rename to storageUsageSlices
- f5a4d1b9e1ab959e0ff33e7779ad89e53f75c9ea feat(hub+web): show logical SQLite usage breakdown and add manual VACUUM cleanup
- e089989e326a47c16d0d2854b948270304078ae2 fix(web): rename storageUsagePie helper to storageUsageSlices to avoid macOS case-collision with StorageUsagePie.tsx
- 25faf4f190390bd10d02229e81934d4ab895ff6a fix(hub): V27→V28 repair migration creates A2A events ledger when skipped by pre-V23 fork DBs
- 506344260108975e8d1b165b39a055aa6c471ae5 fix(fork): reject CLI sessions outside machine workspace roots (HAPI_FORK_ENFORCE_SESSION_ROOTS=1 default, from parallel release)
- 43fda2c97c60ea94150cf5ce2cc64b1c9ae12bae fix: push.test helper returns {sent,failed,subscriptions}
- 2094925188d177cd8bf460f803ce2b9d260af29e fix: web test fixes (useDictation #1436 version, PermissionField mock, claude api mock, QueryClientProvider in mobile-scroll, SessionList pin gate)
- a9f088ca533b41ded25ab8b145028baed50d9a82 fix: align cursor transport_closed transient expectation with #987 head
- 670ebd4517650172f4f33ebed528bc5246b9bdb4 fix: re-apply Linux-only skipIf guards to agy carrier tests
- 2213be0ea4a922273d2068ea6c38fec137d7e839 fix: hub-session-jobs PUT rejects client-supplied heartbeatAt
- f37b1eba1dc5588f330b0276f7e20d58dae9f55b fix: hub test fixes (push 503 mock, machines arg index, opencodeClear args, session route stubs, tunwg timeout)
- e82c6a6ad3539a6474caee91c7230a91fd490858 fix: align pushService test and test-push route with {sent,failed,subscriptions} return
- 6313ad81a72d0221c570fb2207693db40ab53933 fix: dedupe syncEngine session-job methods
- fc3c66457bf7726ac79c5a1e22e0c6ee7fcecdc3 fix: remove duplicate upsert/patchSessionJob in syncEngine; align with outcome-returning API
- 509f6462229d14e0853dd2db16a94688613839f7 fix: repair notificationHub.test structure (restore missing test closes)
- 6fe9448d856bff0fa4cf006a5367193721c4634f fix: rewrite hubSettings.test.ts with all three settings covered
- c2475f428bb390dc0d0ea0c8d191fd47c4b947c3 fix: repair hub settings.ts doc comment and hubSettings.test merge
- 1d0044b4433bd2cab2ad17914ddd9afe4ed9ec5c fix: add deliveryMode to useDictation sendOnFinishRef type
- a7b08efd075379b7732b9b26e28ba0687374d88f fix: resolve web typecheck errors (voice deliveryMode wiring, settings mocks, locales dupes, fixtures, SettingsPageContent title)
- 7879696803aeb1d82b9fa22f7a13c1c425a82e34 fix: wire voice deliveryMode through dictation; fix storageUsage casing; update HappyChatContext fixture
- 35b1e234703ec29914b9ad300f277cf48e062456 fix: restore v0.27.2.1 resolutions for useLongPress and SessionSummary fixtures; dedupe SessionList import
- 3f5137b35e04a33e6635b4bac0189b0c5c9aad2e fix: repair merge debris in App.tsx toasts, NewSession claude import, SessionList buckets, SessionList test
- df2ce5abfb334bf23feb7b21c3e022c7d27e9f93 fix: remove stray brace in codexLocalLauncher action loop
- 3a967213e0198b3099ada35ff4c5905781ea244c fix: adapt codexLocalLauncher to CodexConversionAction[] API; remove duplicate claudeRemote test timeout
- f61301cef88df377e6e3448ac54c2179bd8e27a9 fix: clean leftover merge markers from patch 12/25 partial applies (MessageQueue2 types, startHub, presentation/useSSE tests, codexLocalLauncher)
- 8c5cf8ac60732989a5790a18a5a00d84f5e2d3b5 chore(maintenance): drop pr-1443 patch (superseded by pr-906)
- 756c74b2cc0bb8291c66d531831dc756d30e1b0d chore(maintenance): record v0.27.2.2 release audit and patch manifest
- 1d8fbb34f850dcf337bc716d3c505ac1ee2c198c chore(release): prepare v0.27.2.2 (version bump, release notes, audit manifest)
- c23d905264dd4e7cde9030e597bcd64cc74d1d49 carry: PR #1093 assistant response navigation
- 5571f9c2eed495609b777c06b7a35e030217dbd9 carry: PR #1360 notification preferences (V26→V27 migration ported; resolved on f63d4bb8)
- 4280ec2fac62e13ecee3c28f4c17be3e7404f264 carry: PR #1429 claude import local session history (resolved on f63d4bb8)
- 164879cc6c649eb8e815d19507e82d090fa0dab1 carry: PR #1447 pin active sessions (integrated with mode-based pin-in-progress; resolved on f63d4bb8)
- 14f06016b4ea4d3044a38bf353757a88dd99e8cb carry: PR #1477 AGENT_NOTIFY_SUMMARY chat display settings (resolved on f63d4bb8)
- 3be69d867c78fac91e412097e46f10cbbe02b22d carry: 22-pr-1418
- 5dd67a5d73cdf4d1509f766071661def72b4070b carry: PR #1451 Create agent visibility (resolved on f63d4bb8)
- 6835d25e5e4d0806ffc5aa9547083ba0a5fe0a3b carry: PR #1468 ACP cost usage (V25→V26 migration ported; resolved on f63d4bb8)
- 97f6e9e931f7f8d814d450f205787af769ad915c carry: PR #1469 unified agent configuration descriptors (resolved on f63d4bb8)
- 820b8426f333e6e738fae78ce49fcdbafd669e1b carry: 18-pr-1474
- 86501f132cd54744931b704013e0db3f78147ba6 carry: PR #1475 composer model/effort value buttons
- 49e8b377aaaa45cb83100bfd98111339e9f608b7 carry: PR #769 desktop launcher (resolved on f63d4bb8; incl. four-part version + bun-layout template fixes)
- f1a2ff2d40e87bb599a552db1f0ea08353f70780 carry: PR #1419 voice direct send (resolved on f63d4bb8)
- 26adc12a14de9dadfeb53bf7aab3d8bad2fb1e19 carry: PR #1421 remember all launch settings (resolved on f63d4bb8)
- 82c3f7b84d8c2cf747ba4cf02029e6a5f0709e28 carry: PR #1436 voice message persistence (resolved on f63d4bb8)
- 4ef904145ac83a910bb94b25088aefb9b018b099 carry: PR #906 per-queued-message steer (resolved on f63d4bb8)
- 225ffac5be9b02037a5bf0573e8dc8514ae26127 carry: PR #955 project groups (resolved on f63d4bb8)
- 0499a3125525078a9c639e0fe78aa16da22752e4 carry: PR #1414 machine labels + PR #1413 share ingest + PR #1158 session header (resolved on f63d4bb8)
- 8f1a5634c9c3f189f5d61df9410c5a9a938ad96a carry: PR #1422 expandable file errors
- 0ed32cfe7c8aecc7be1adcea3f72078c1390400d fix(test): resolve leftover codexLocalLauncher test harness merge (keep both messageEvents and usagePayloads)
- 616ef14a4829fc32ff597dd2cf5d6e553c5800ca carry: PR #1424 session-attached jobs (resolved on f63d4bb8)
- 06a6018e2fd09c5a468a878e131b4dcc429c6f44 carry: PR #1108 fleet runner version governance (resolved on f63d4bb8)
- c90525ef14e635ca71105694e8663c77f7965474 carry: PR #986 searchable share + PR #847 codex budget (resolved on f63d4bb8)
- e68541bf2933b957e3df90898fe42e9a345206db carry: PR #987 notifications + model-error bridge (resolved on f63d4bb8)
- 20a16ba52de44cbf893bce35248a6b4748acc4cd carry: PR #1091 managed agent API profiles (resolved on f63d4bb8)

## Open upstream pull requests

- #1521 [UNSTABLE] fix(test): stop runner integration suite from leaking detached process trees (#1515) @ 19e9661ccce13fd76a5555f18b2b854a097aeaab (https://github.com/tiann/hapi/pull/1521)
- #1519 [CLEAN] fix(web): fail-closed scheme-less markdown file links @ 7a16256d8221a95df17f1c94467a825423bd50dc (https://github.com/tiann/hapi/pull/1519)
- #1518 [CLEAN] fix(cursor): close ACP list-models race and false exit 143 window @ 22fc20343b08baf661852b1490d1af15b84d5b51 (https://github.com/tiann/hapi/pull/1518)
- #1517 [draft] Fix Telegram Mini App polish and file tree state @ 187f6c7de303094e0a49f114db24089482e41aba (https://github.com/tiann/hapi/pull/1517)
- #1512 [CLEAN] fix(web): use latest assistant replies for session recency @ 2268c6653034ce55fc6aee5909ba3ad1a109558c (https://github.com/tiann/hapi/pull/1512)
- #1511 [CLEAN] feat(cli): spawn-peer CLI + MCP spawn_peer for peer spawn with remit @ e905d633b9c583b14d4a06bae25d5baea37df701 (https://github.com/tiann/hapi/pull/1511)
- #1503 [CLEAN] fix(cursor): stop session-list spinner flicker from ACP state_update @ 81af5350e0fff54421b8d48ad56fc3237963fee6 (https://github.com/tiann/hapi/pull/1503)
- #1501 [CLEAN] fix(web): restore scroll chaining from reasoning panel to chat viewport @ da7b37c66aecae4da2b5c03108baa844c73f06dd (https://github.com/tiann/hapi/pull/1501)
- #1495 [CLEAN] fix(web): hide chat viewport focus outline after Home/End @ a0de77881531f3df564a42860ddcc992813ff109 (https://github.com/tiann/hapi/pull/1495)
- #1490 [CLEAN] fix(web): normalize Windows file search query separators @ df02f89bc3815e5c4fe96156acb82e21757b7b34 (https://github.com/tiann/hapi/pull/1490)
- #1477 [CLEAN] feat(web): settings for AGENT_NOTIFY_SUMMARY chat display (default hide) @ 64fb4b227bf7e4b60f099d8ace4ecbe655679cdb (https://github.com/tiann/hapi/pull/1477)
- #1475 [DIRTY] feat(web): composer model/effort value buttons and first-class permission (part of #1438) @ 4591052676fce788a213a44dcc21f0bb256cbfba (https://github.com/tiann/hapi/pull/1475)
- #1473 [CLEAN] feat(peer): attribute ping_peer deliveries with trusted provenance @ 0ea80c99641f1817efa9d88ca5906e177384f359 (https://github.com/tiann/hapi/pull/1473)
- #1471 [CLEAN] fix(web): keep single tildes literal in markdown @ bf96cf679f2d568702a509a4ba6ec76f00fd33c0 (https://github.com/tiann/hapi/pull/1471)
- #1469 [CLEAN] feat: unified agent configuration descriptors (session config consolidation) @ c912274f4946d8b6c515aafd750068444c7827e8 (https://github.com/tiann/hapi/pull/1469)
- #1468 [UNSTABLE] feat(usage): record ACP cost and surface per-agent reporting availability @ fd2e0775c42463bb122f40b0c7b2c4872a729308 (https://github.com/tiann/hapi/pull/1468)
- #1462 [DIRTY] feat(web): render AGENT_NOTIFY_SUMMARY as compact metadata @ 882e74071fe4cfbe46a5c920ea71c6112ff7a1a9 (https://github.com/tiann/hapi/pull/1462)
- #1451 [DIRTY] feat(web): configure Create agent visibility @ f489209f15333faf17666cbadfdd6a219a7d6d74 (https://github.com/tiann/hapi/pull/1451)
- #1447 [DIRTY] feat(web): add separate option to pin active sessions @ 1f42793d05aa3f12471019175e75b3a358c235b6 (https://github.com/tiann/hapi/pull/1447)
- #1443 [DIRTY] feat: restore mid-turn steer for Codex and Cursor @ 7155e7ff2fe7937aae5df1cb85b97f56562d6812 (https://github.com/tiann/hapi/pull/1443)
- #1436 [CLEAN] feat(web): persist and send voice input message across session navigation (#1435) @ d2f3f698fcc1c68c5293d6c2fef38b08f531e9f4 (https://github.com/tiann/hapi/pull/1436)
- #1429 [DIRTY] feat(claude): import local session history @ b48a8a7630daece19f8e49058e7f52db08434eb1 (https://github.com/tiann/hapi/pull/1429)
- #1424 [CLEAN] feat: show progress bar on session for hours-long jobs @ eee95c52759d69aea944718abf80074b4fbb6c1b (https://github.com/tiann/hapi/pull/1424)
- #1422 [CLEAN] fix(web): make long file errors expandable @ 5ae02d6caed360298761decc20e1f23db6d880da (https://github.com/tiann/hapi/pull/1422)
- #1421 [CLEAN] feat(web): remember all launch settings options in NewSession preferences @ ed7c7cf5e39907e18aaf34fb86b01f0fd72ddf03 (https://github.com/tiann/hapi/pull/1421)
- #1419 [DIRTY] feat(web): add direct send button during active voice session @ adb0ad029640aeae8dd821d62af7ee790ec95b12 (https://github.com/tiann/hapi/pull/1419)
- #1418 [CLEAN] feat(web): drag sessions into composer mentions @ b556e137cf3971b432902b0b88b028715b7337e0 (https://github.com/tiann/hapi/pull/1418)
- #1414 [CLEAN] fix(web): hide redundant machine labels on single-machine pinned rows @ 242beb9e6bd400804aa0057e862e50f94d34bcc2 (https://github.com/tiann/hapi/pull/1414)
- #1361 [UNSTABLE] Fix/codex sync idle active @ 9ab90d3e4be976a839bfcfe296dfb65487ddeb20 (https://github.com/tiann/hapi/pull/1361)
- #1360 [CLEAN] feat: add notification preferences and customizable web push copy @ eb2db235e2c61e271405099d439afe2df1a7c401 (https://github.com/tiann/hapi/pull/1360)
- #1351 [DIRTY] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1309 [draft] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [CLEAN] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [DIRTY] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [DIRTY] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ 999f1d1170d382cc4fd5e5fdf6e0a6ab4a0bf65f (https://github.com/tiann/hapi/pull/1193)
- #1189 [DIRTY] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [DIRTY] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [draft] feat(session): opt-in GitHub PR awareness + explicit attach @ 71849b493376ae9346b173c4995704d12f4f39b0 (https://github.com/tiann/hapi/pull/1163)
- #1158 [DIRTY] fix(web): unify session header display labels @ 9ea45c1497bb1a15b796ee23fd4059dcb3e7b2c2 (https://github.com/tiann/hapi/pull/1158)
- #1157 [draft] feat(web): add configurable tool grouping mode @ b62788b053616a9b2f02b118116a917bec253be9 (https://github.com/tiann/hapi/pull/1157)
- #1126 [DIRTY] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1099 [DIRTY] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [CLEAN] feat(web): add assistant response navigation @ 68a0525f376f2ead44c99985cb40e6ba3f246f07 (https://github.com/tiann/hapi/pull/1093)
- #1092 [DIRTY] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [DIRTY] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [DIRTY] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [UNSTABLE] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [CLEAN] feat(cursor): detect inline model errors, surface, notify, and bridge (#878) @ 743d8775519e3fd5a7c9fd33d69166e1832a0278 (https://github.com/tiann/hapi/pull/987)
- #975 [DIRTY] feat: add OMP (Oh My Pi) coding agent support @ 344c6009b53e20829978e44367fa50b5870986fe (https://github.com/tiann/hapi/pull/975)
- #955 [UNSTABLE] feat(web): right-click context menu for sidebar project groups (#881) @ f6a624251cb125182965dc343351c362035d071a (https://github.com/tiann/hapi/pull/955)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ 41d772c1998872cbcd468aee7ec2fa12a3833eae (https://github.com/tiann/hapi/pull/945)
- #942 [DIRTY] feat: import existing Claude Code sessions (+ fork-resume for live sessions) @ f1f93474f042381818f0d605b1d64b3fb42cb02b (https://github.com/tiann/hapi/pull/942)
- #906 [DIRTY] feat(web+cli): per-queued-message Steer for Codex and Cursor (mid-turn) @ d652eafdb885d5b2e09ff76461564f3f316b78e1 (https://github.com/tiann/hapi/pull/906)
- #847 [CLEAN] Codex usage indicator with cross-flavor budget gauge shape (rebase of #537) @ 939a9d1e61853e6b3720852f7d902575a94fb8f2 (https://github.com/tiann/hapi/pull/847)
- #769 [DIRTY] feat(desktop): add HAPI desktop launcher @ 60c11607ce3bba734f38b6fcf87be07b32298683 (https://github.com/tiann/hapi/pull/769)
- #663 [DIRTY]   feat: support Codex local goal sync and remote approvals @ 5dbf6d406a6bb8507dc07598ba2aecc8cd98ee0f (https://github.com/tiann/hapi/pull/663)
- #658 [CLEAN] fix(cli): preserve permission mode after ExitPlanMode + sidechain UUID chain fix @ f7d8ca3ea0f8ae47245443ce2c0cfec612263e62 (https://github.com/tiann/hapi/pull/658)
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
Hard exclusion: PR #1320 (Antigravity) must be recorded as drop and must not be replayed.
