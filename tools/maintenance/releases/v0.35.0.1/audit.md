# HAPI maintained release audit

Previous maintained release: v0.30.7.7

Official release: v0.35.0

Personal PR owner: swear01

Origin main: 702fea01c9746d9d8b4453ce0f1ea8fa1aee4029
Upstream main: 06d9e51f5c6a3812ddf84bfdb4782596b392fbf1

## Fork-only commits

- 702fea01c9746d9d8b4453ce0f1ea8fa1aee4029 chore(audit): record replayable v0.30.7.7 candidate
- d4f55723ef3cdd044047f471c860daa916dc07f2 chore(release): prepare audited maintenance version 0.30.7.7
- b04d7f80f314347c2949cfa6eb2e4b868565970e test(web): expand collapsed groups in carried sidebar tests
- 3768d42784196f2f992e2c4993ef184d8cc77f80 test(hub): use background-task snapshots in carried #1942 tests
- bf4143aeefd39a654f3f00d0e7068587004d5ecc test(web): match current Codex sync action label
- bbdeb059ccc83305399eaf8aca3a889c75c7ce79 fix(release): stabilize Bun desktop lockfile
- 9a39d30bda34dbc7bc719a8313b3e82558160c93 chore(release): carry desktop packaging and fork workflow guards
- 8a55189e687c5783acc9ed6d8b99d0b55c2b32cf fix(android): keep grapheme Matcher state valid
- fe1b6a9b05d2caf45ef626d5738daed7cd92ed92 fix(android): retain Codex plan spinner and retry CAS
- e357215a5206ec8963d7f13b85f2ed2ab5119a9c carry(upstream): PR #2165 perf(web): stop hidden and unchanged sidebar rows from re-rendering
- 055834c5150d8490563bea414795013fb09db0a5 carry(upstream): PR #2159 fix(claude): pass the session permission mode to the local TUI
- d90e54862e6bfbb912cd5b2f57981e2bdda0591b carry(upstream): PR #2158 fix(claude): keep remote permission downgrades effective
- a79848e12cb9c2b58203fb5ddb877cbf9b7de66e carry(upstream): PR #2153 feat(claude): offer the four current Claude models, drop the 1M presets
- 4b261a743f78f6931f0e72e35b9eb3e9f9f328d0 carry(upstream): PR #1981 feat(opencode): support mid-turn steering
- cdbbcba0273a4381fa6150f2dae833f52fb6a1a3 carry(upstream): PR #2075 feat(hub): generate fallback titles after the first completed turn
- 30d2b0fdc2991fa16279946a095013723f04a028 carry(upstream): PR #2072 feat(sessions): add explicit per-session title locks
- 7472e7b59c304bc42379cc1bdb55420efdbd00c1 carry(upstream): PR #2080 feat(web,hub): sync session read/unread state across devices
- d9e886b9d9348ab64cafcd0f3d863908ad36169e carry(upstream): PR #2056 feat: hub-wide peer-tools toggle in web Settings (stacked on #2052)
- 35dfef1bc4483208172cf09d718cc108fd0417aa carry(upstream): PR #2052 feat(cli): HAPI_DISABLE_PEER_TOOLS — hide peer-session tools from wrapped agents
- 4977e1a9b3d2fd66c5340d5dcedd8832bfbf9fc1 carry(upstream): PR #1597 feat(web): assistant response navigation with window-store-safe jumps (#1093 + #1587)
- 274fc8f84eda89fba44b3e71b0c13de54c0e4961 carry(upstream): PR #1418 feat(web): drag sessions into composer mentions
- c56154f23324c5bf2209dc864176a86d954e7043 carry(upstream): PR #1607 feat(web,hub): right-click context menu for sidebar project groups (#881)
- c7becb1bd0c621f425fd37ae1dff80315ec75b15 carry(upstream): PR #1662 feat(web): unify composer model and effort controls
- 0c2acdb218ad141b090e7d8d7e69551fbcf691e7 carry(upstream): PR #1468 feat(usage): record ACP cost and surface per-agent reporting availability
- 9f8df5935cc846190c99111a1db70c9df00528a0 fix(web): keep loaded older history in the window while a session streams
- ca7511aa54c69c36ae5a637e885ae1bb74e315a0 carry(upstream): PR #1916 fix(cli): discover DSH skills from the DeepSeek Harness home
- 516a65a8a804aabf8fc272f39d555b5b07426d05 carry(upstream): PR #1921 fix(hub): typed errors for undeliverable permission answers and aborts
- 06517c188f6b3f09185939cd43993a4d778befe3 carry(upstream): PR #1849 fix(cli): let agent titles replace Fork seed summaries
- 109f1873d52797e11d7bda2e8e8b328dba2e248b carry(upstream): PR #1604 fix(codex): gate history actions until native thread is ready
- 97a7cb7f29a9f8bed4bf05b541f447e02bbb8f78 carry(upstream): PR #1664 fix(web): keep machine health visible for single-machine layouts
- ad7adc23c8b1c6a4a16f3c992399ee4b07a2f579 carry(upstream): PR #1718 fix(web,hub): friendly file preview when session CLI is offline
- f52f1f2c2cd175022955d4267ad8e3383fc67fc7 carry(upstream): PR #1726 fix(web): align file preview content around scrollbars
- de125f4068071331d47927f820aeb3732875a024 carry(upstream): PR #1844 fix(hub): keep notify-cause ingest bounded by advancing the resume watermark
- 957f5acf0e2cc6ec71e2b7a5c4d9bc6de75e394b carry(upstream): PR #1898 fix(cli): flush buffered ACP assistant text after an idle gap
- a16c75c45af4d3308683841bd160abf488aee02e carry(upstream): PR #1903 fix(web): synthesize answerable card for pending permissions dropped by the tracer
- 7cce388fed45a4e88161f356af27ce029d42f292 carry(upstream): PR #1920 fix(cli): report the inline-media shell fallback as not applicable in packaged installs
- b88fe3e4c1d09a844795641bcf35160eaa9e11dd carry(upstream): PR #2099 fix(codex): do not re-insert legacy history on shared resume
- f5a9b9d8dc2090c9ce5663b77623766d3cede9d0 carry(upstream): PR #2096 fix(codex): include inherited fork history when syncing Codex transcripts
- 0a7b86cf8e55c6e1b6fe48dde2632a03dc0d3cef carry(upstream): PR #2095 feat(cli): add hapi set-mode to change a session's permission mode (#2094)
- 1dc7c3fa6ee7811d2e01e241d446a1ad64e8ae9f fix(codex): fail closed when a shared rewind cannot complete
- 2417ea6b048bdc36e1940e011c34c06990e797ff fix(claude): keep mid-turn steers recoverable until Claude takes them
- dbdebc1f41039cc5bca935b83cbdc33491ee540b carry(upstream): PR #2008 feat(cli): support mid-turn steer for Claude remote sessions
- 3baee3812c0d2591a2457fe4294cc482d45aa8c0 carry(upstream): PR #2077 fix(web): contain transient scrollbar overflow during resize
- cd935aebc3bc7b6ed6c828166539bfa8c03e606d carry(upstream): PR #2078 fix(runner): preserve slow Codex sessions across startup deadlines
- d61ab93532d3942da9135e36d6ee4e9e262ad7c8 carry(upstream): PR #2092 fix(codex): restore Web Rewind for shared sessions
- 77914a430e0ed9dcd891885f8decb215a4f07f3b carry(upstream): PR #2091 fix(cli): forward Claude Code 2.x subagent transcripts in local mode (#1904)
- e03a7a3a6118da66fed4a15fa8d214e474d0125a carry(upstream): PR #2090 feat(codex): expose Approve for me as a permission mode (#2016)
- 11bb22ab5eb7489dfbe4488533b7149d51f44082 carry(upstream): PR #2089 fix(hub): judge liveness by hub receive time, not runner clock (#1986)
- bd7bcc7bd6fd464dcc60cf70cef120e828275352 carry(upstream): PR #2088 fix(claude): seed local-mode context window from the configured model (#1858)
- f71990149b6380563bfd3c5009325100a57b7b03 carry(upstream): PR #2087 fix(cli): forward Claude API error records with null service_tier (#1857)
- 33ff072e79f55abe14608eee061b34558020aff9 carry(upstream): PR #2070 fix(web): preserve composer image previews across updates
- bab14d22f7b9cc2590758727feca61c3658fc5c8 carry(upstream): PR #2069 fix(hub): mint a localId for user messages sent without one
- 5760fbf67dd9f870eb64ae6800a92c6eaac19612 carry(upstream): PR #2066 fix(runner): add webhook timeout configuration hint
- 531e5bc53cd442c9f31985b5611d3c287546847d carry(upstream): PR #2065 fix(web): explain redirected hub requests instead of "Failed to fetch"
- 5e9e7002c54061a0eb0230fac51c135f72cc0289 carry(upstream): PR #2061 fix(web,cli): clarify archive cleanup progress and bound shutdown waits
- 0b408b0a3ab83165fd8c9f9b450d6bca99180058 carry(upstream): PR #2060 feat(pi): display inline tool-result images
- eb9023baa1857f62e456304090c0c4afdb674ec9 carry(upstream): PR #2046 perf(cli): reduce Windows process probes during session shutdown
- 77122bc49513038f317c9e4571d5600738d7a809 carry(upstream): PR #2035 fix(runner): prevent Windows process probes from blocking session lifecycle
- cfb1c4de933dd6500a5725576f5b410e34c7135c carry(upstream): PR #2032 fix(hub): single-flight cache for session enumeration RPCs
- bbf43c001f6d7ff67d1386ba2056e8afd7f8b79a carry(upstream): PR #2031 fix(dsh): default ACP entrypoint to the official dsh CLI
- 3fb26f20c443dd6017727334ab2f338844d4ad24 carry(upstream): PR #2027 fix(dsh): abort via session/close when the agent has no cancel capability
- 35573232ebbb5d03781aa123551682e4a9fe1f6a carry(upstream): PR #2025 fix(codex): persist Round duration across session reloads
- 9ccfdafb159bde1a0add26062da8c52ab4d0f229 carry(upstream): PR #2012 feat(web): To agent control for terminal scrollback or selection into composer
- b024b9ec7390a82f4a8d560228bd7d5b490ed0c5 carry(upstream): PR #1960 fix(web): keep tail following through layout-driven scroll
- 1bc8a69127f8d3f35017d9ada44fd8c9e4125b32 carry(upstream): PR #1955 fix(web): allow retrying failed abort requests
- f836130fbbac66e085fcaaeae96d4d6d30533e3e carry(upstream): PR #1944 fix(web): keepalive-idle indicators in the sidebar and retirement of lost subagent traces
- a37525ae0d6b64c0204a4e2b2b8e5592e2fd8f1e carry(upstream): PR #1943 fix(runner): adopt untracked runner webhooks only from the reporting process generation
- fc5584c6ee7bdb110d396b074dab1deefedb96e6 carry(upstream): PR #1942 fix(hub): make keepalive-idle reconciliation robust against metadata churn, replays and retries
- 63b22650b02f50906f5687da9dd0d84fa29429a8 carry(upstream): PR #1940 fix(runner): reconnect live Codex roots on resume
- 74cfe77f339f642636aaf5f2436c9b2d52d29595 carry(upstream): PR #1938 fix(codex): reuse live model catalogs and extend discovery cache
- 2ecdb37d1be6e037507efe3b0666cab2e68a50a4 carry(upstream): PR #1932 fix(cli): release stdin before handing terminal to local-mode child
- b782c22e2bd5017080b8ea4b1f52c6e6407ed74b fix(runner): confirm archived Codex root after tracking loss
- 17bb6904888f95264eddc03d30348b4e023a589d carry(upstream): PR #1797
- e8a64cce2f4b36c99dd5185caa576b81b67304e4 carry(upstream): PR #1771 feat: add prompt-free session control workflow
- bb239db972153fcb26afbb8ffc79d2ea92580ff0 carry(upstream): PR #1729
- 122901f1c7941c633dceed0974a2ce391b43ed02 carry(upstream): PR #1728
- 7617b41981cca98be875f73787b92a6ce2fc8eec carry(upstream): PR #1721
- 77125d94929adbb87d20f93e9f325a65fa55ee6b carry(upstream): PR #1720
- fdc0d887b4a751cfd3968f6d8e592d55af44c57e carry(upstream): PR #1702
- 79493f6b584058153fbda8cc80475de29aecd538 carry(upstream): PR #1678
- 5be35a8b346815f4a1727329015ecdf78329caa3 carry(upstream): PR #1666
- d92153eceb82a8c6118114e4507e5a2da9cff044 carry(upstream): PR #1660
- d98edea13878bc8491cb98625be17b2ae3ed8379 carry(upstream): PR #1656
- 72ef943d09eafec871ec2b41f3ce78af25b7246f carry(upstream): PR #1636
- 3b0dc84c7fcc5089f3494cb6239bf6c26fbc2120 carry(upstream): PR #1635 project labels
- 239f9a8a385d7b48035703ef0ce13ca35ccdfa51 carry(upstream): PR #1625 PWA icon sizes
- 1df8106fc411cee1c9d5c1712c18ec65aa312107 carry(upstream): PR #1620 path grouping
- 6f0d14d14ab273e56e8cadc75eefcf5bd09e477a carry(upstream): PR #1617
- 808ba02befd6bfde5c1c639215e02fb51f5e5779 carry(upstream): PR #1616
- c2240a330478747e994135fd60824199c6d38c84 carry(upstream): PR #1615
- 249a4614fce8d130cb89fbf01a28430a761424c2 carry(upstream): PR #1603
- 16c26e5be27bb43a24eeceaee43c63dff128c866 carry(upstream): PR #1592
- af84a7b7787e77e77f0dd8f4bfb494530339fe06 carry(upstream): PR #1436 feat(web): persist and send voice input message across session navigation (#1435)
- 43a3acc5bc41fdd7080bca2b89249f9493965deb carry(upstream): PR #1414
- 851452f264ae870141e2a8564b1cd93dc25ad44b carry(upstream): PR #1158

## Open upstream pull requests

- #2423 [UNSTABLE] fix(hub): avoid 502/504 so Cloudflare Tunnel keeps JSON error bodies @ c8fc675719a0d02daaef82fe3cffac0c5adb114d (https://github.com/tiann/hapi/pull/2423)
- #2421 [UNSTABLE] feat: preview forks and rewinds with the boundary the fork will use @ 5a51beb22882663c793bf38d8552075e1f53d763 (https://github.com/tiann/hapi/pull/2421)
- #2420 [CLEAN] fix(web): keep running sessions from looking finished when output is unread @ 3a2661b39e231a5f886cb241cf28e07c7dd7382d (https://github.com/tiann/hapi/pull/2420)
- #2418 [CLEAN] fix(pi): register peer tools directly when registerMcpServer is absent @ be554e7cdd7f283e6be08ffca2bbffec35ff2b29 (https://github.com/tiann/hapi/pull/2418)
- #2417 [CLEAN] feat(claude): fork and rewind a conversation at a message @ 63fb0bc53b9a0b029117e956794179cf2fcd24df (https://github.com/tiann/hapi/pull/2417)
- #2416 [UNSTABLE] feat(cli): lean prompt layer via runtime attachment fallback and duration inference @ a39591839de9e6e4364c802bd42fa9db012cd5f1 (https://github.com/tiann/hapi/pull/2416)
- #2415 [CLEAN] fix(cli,hub): clear stale permission required when request is inactive @ fc711d888c9ed6775f51e494a375477ddd742573 (https://github.com/tiann/hapi/pull/2415)
- #2413 [CLEAN] fix(web): auto-load chat history when switching sessions in concise view @ 0877de3b45e634e1a70a44c587d0eb5379155aee (https://github.com/tiann/hapi/pull/2413)
- #2412 [CLEAN] fix(web): show background-only work as a static blue dot @ 804f531b341baa3cdf96c77d26d4c77c9b0e6b9d (https://github.com/tiann/hapi/pull/2412)
- #2411 [draft] feat(web,cli): improve Markdown image failure states and retry loading @ 4b3865f6c3743e674a0a73f6f27d051574fe5169 (https://github.com/tiann/hapi/pull/2411)
- #2410 [CLEAN] docs(cli): note that worktree spawn-peer needs a git repository @ ccb58b050d4c2eca3dfdfad1112ee3be56510733 (https://github.com/tiann/hapi/pull/2410)
- #2405 [CLEAN] feat(agy): show the round turn count and running background commands @ 5c7f16a1ba6583a6848c8903ddc61bc32bdddec1 (https://github.com/tiann/hapi/pull/2405)
- #2404 [CLEAN] perf(cli): load command modules on demand @ 96f44cac313099c421d85ff42c7f5d42305c35aa (https://github.com/tiann/hapi/pull/2404)
- #2403 [CLEAN] fix(cli): handle ACP stdin stream errors @ 2c7ab3ef0a6a347402f3c14b8d4eb2ff3ab7f741 (https://github.com/tiann/hapi/pull/2403)
- #2402 [CLEAN] fix(web): distinguish and navigate pending requests @ 79ca075bed213280776834a58e84f38842f29327 (https://github.com/tiann/hapi/pull/2402)
- #2401 [CLEAN] fix(agy): handle stale errors and missing session titles @ 1ffd2b6583d960dfbdba63756731c9db4bb13485 (https://github.com/tiann/hapi/pull/2401)
- #2399 [CLEAN] fix(agy): map always-proceed to --dangerously-skip-permissions and remove hidden wakeup prompts @ 837ac526893cfcc783e85d14c469fc3d95b0c632 (https://github.com/tiann/hapi/pull/2399)
- #2397 [CLEAN] fix(web): count the waiting time on question cards created before the transcript arrives @ ab79e9c8356f997884374d8afa527aaa5baceb1c (https://github.com/tiann/hapi/pull/2397)
- #2396 [CLEAN] fix(cli): isolate claude.test.ts resume-identity tests from HAPI_INVOKED_CWD @ d1a81e0d90ffad320627bc37593ecd3b3686b351 (https://github.com/tiann/hapi/pull/2396)
- #2395 [CLEAN] feat(web): open Markdown images in fullscreen preview @ 2153f6a7a093cf41e24a5121921d775d2c12183d (https://github.com/tiann/hapi/pull/2395)
- #2386 [CLEAN] fix(dsh): respawn dead ACP children, recover closed sessions, sandbox modes, inline images, reasoning effort @ 5b70e38801310dbc5d554fd7d4f2c9cd334deaac (https://github.com/tiann/hapi/pull/2386)
- #2385 [CLEAN] fix(acp): correlate request_permission with drained tool calls, handle config_option_update, extract tool-result images @ af21957e8c8fb7b708087e1caec5099ab7efd90c (https://github.com/tiann/hapi/pull/2385)
- #2384 [UNSTABLE] feat(cli): ask_user_question over the hapi MCP bridge — interactive cards on every client @ af6eab1888a3d053f62d9fe78050f4e1abb55d07 (https://github.com/tiann/hapi/pull/2384)
- #2382 [DIRTY] feat(cli): demote agent session scheduling so load storms cannot starve the runner @ caa6d56242bd524fb63a49c63c3b4aefd206b7be (https://github.com/tiann/hapi/pull/2382)
- #2381 [DIRTY] feat(runner): external liveness watchdog heals frozen event loops @ 166fad2cdc779f57ed659919372acf02bd0462de (https://github.com/tiann/hapi/pull/2381)
- #2376 [CLEAN] feat(web): Active + Working lenses in session list filter menu @ b6ae3dd2849ff4cdda012e6ea5867df6d3e531a1 (https://github.com/tiann/hapi/pull/2376)
- #2375 [CLEAN] test(web): pin the residency fade off tooltip-bearing containers @ ea1006e1124a20af2c7c2ae21a75a303d6844c44 (https://github.com/tiann/hapi/pull/2375)
- #2372 [UNSTABLE] fix: retry the gap-recovery row refresh after a failure and advance idle progress on merged tool-call ticks @ 703ff99e70a0ade93af82e9646b93ef972e461d7 (https://github.com/tiann/hapi/pull/2372)
- #2363 [DIRTY] fix(cli): keep launchd-lineage agent children alive (ulimit nofile bump) @ 5205f62a416f9329dad41b51d77dce8a8ca69e80 (https://github.com/tiann/hapi/pull/2363)
- #2346 [CLEAN] fix(runner): verified exit must confirm stop despite unrelated protected wrapper @ 7d956460484399553397ad4ea8f64b7778d71d82 (https://github.com/tiann/hapi/pull/2346)
- #2342 [DIRTY] perf(hub): index uninvoked local message lookup @ c50dc8966711dc3bcd23042abb7874f6d15301a5 (https://github.com/tiann/hapi/pull/2342)
- #2337 [CLEAN] fix(web): preserve lightbox view across equivalent size updates @ 3446798b762f8be8dbfbef9bf544a89428051029 (https://github.com/tiann/hapi/pull/2337)
- #2334 [CLEAN] fix(web): clear unread markers over HTTP @ 6e8e0b6e171abecac5cc46322de3998f16f7c151 (https://github.com/tiann/hapi/pull/2334)
- #2333 [CLEAN] fix(web): generate read-state operation ids without crypto.randomUUID @ 11fc26920b82011975366656612b1cff105afba8 (https://github.com/tiann/hapi/pull/2333)
- #2332 [CLEAN] fix(agy): concatenate ACP text chunks as deltas @ b4809a06b7afdf2b9b321835a419b1b7254f1ae6 (https://github.com/tiann/hapi/pull/2332)
- #2331 [CLEAN] fix(agy): keep empty edit/write strings and the question card's free-text limit @ 2df74a1d064ad69e0292bbad4b372c9734efd73a (https://github.com/tiann/hapi/pull/2331)
- #2329 [CLEAN] feat(cli): add Berry Agent flavor over ACP @ d606c7bac741f2a0dd053db5cffacd622ea6028e (https://github.com/tiann/hapi/pull/2329)
- #2324 [CLEAN] fix(hub): title fallback on every session end + prompt titles from transcript echoes @ 5f6a2bb6759d45f5e71d3e05d3b7a2b40fb3bcfe (https://github.com/tiann/hapi/pull/2324)
- #2320 [CLEAN] feat(cli): add Hermes agent flavor over ACP @ e0085d041c85fa44405695134eab080f64ae4fa6 (https://github.com/tiann/hapi/pull/2320)
- #2317 [DIRTY] feat(hub): per-turn title fallback for flavors without native rename tools @ 42ad831e0bf1dc631ad2b31d6afaab0cc9021245 (https://github.com/tiann/hapi/pull/2317)
- #2316 [CLEAN] fix(hub): page title conversation collection past tool-noise windows @ fe4263d511c0564687a26278e04d4065b3e536bc (https://github.com/tiann/hapi/pull/2316)
- #2302 [CLEAN] feat(hub): watchdog that force-reconnects runners wedged at the app layer @ e1aef307a40ee4266b5683ee9edc9c9446c1666a (https://github.com/tiann/hapi/pull/2302)
- #2251 [DIRTY] feat(peer): attribute handoffs and resolve durable agentSessionId @ 90b9066d2673237fa3fdcccb7b00a72b66b75962 (https://github.com/tiann/hapi/pull/2251)
- #2247 [CLEAN] feat: branch a conversation at a user turn with harness and model selection @ 350fc5c7f314d9b1b56671f2e65af607d7de6acb (https://github.com/tiann/hapi/pull/2247)
- #2236 [draft] feat(pi): share native terminal sessions with HAPI @ a62a828c472bc85df15d3c433f4f401bbcdb1220 (https://github.com/tiann/hapi/pull/2236)
- #2220 [DIRTY] feat(android): chat settings subpage (enter behavior, fold defaults, surface tints) @ d40921a748c30fd4e6fd8d2e4542f9b072d91e2d (https://github.com/tiann/hapi/pull/2220)
- #2219 [DIRTY] feat(android): display settings subpage (list prefs, header metadata, font scale) @ 0e7e48cf87035d51bdcefbb1a537f0f11eeb5370 (https://github.com/tiann/hapi/pull/2219)
- #2202 [CLEAN] feat(android): share a question-and-answer turn as an image @ cd9249d4a944dad666ed0914d64ebbc8ff5d3f60 (https://github.com/tiann/hapi/pull/2202)
- #2196 [CLEAN] feat(android): conversation outline jump panel @ 26f0f6a0159ec1fdcf31d02882a4aa3d28633b81 (https://github.com/tiann/hapi/pull/2196)
- #2195 [CLEAN] feat(android): subagent team roster panel @ 54e0634601ad4b9837549966807ee4172c8f0496 (https://github.com/tiann/hapi/pull/2195)
- #2194 [CLEAN] feat(android): live session status panel (goal/todos/subagents/terminals) @ 42e7bd1bbc744ff934154f31b60e7d3b53dd95d1 (https://github.com/tiann/hapi/pull/2194)
- #2188 [CLEAN] feat(android): chat-embedded agent PTY panel over /terminal namespace @ dfaba689473502ae77c366001028db65341e829b (https://github.com/tiann/hapi/pull/2188)
- #2187 [CLEAN] feat(android): interactive remote terminal (emulator + socket.io client + screen) @ 73944b9e6cec22180cacd51c3b6db9f1326b2e78 (https://github.com/tiann/hapi/pull/2187)
- #2182 [DIRTY] feat(android): streaming dictation with deepgram realtime transcription @ 64949352dd07f820632f5c7d8b16f74456af9e2b (https://github.com/tiann/hapi/pull/2182)
- #2181 [CLEAN] feat(android): scratchlist promote actions and composer scratchlist mode @ 6b89489521c5b5bdc9882f351a1f64f2e3883b04 (https://github.com/tiann/hapi/pull/2181)
- #2180 [CLEAN] feat(android): fork and rewind conversation history at message boundaries @ f7238ae742c5616fc0227ec73e3ec7fb4c4434c3 (https://github.com/tiann/hapi/pull/2180)
- #2168 [CLEAN] feat(web): remember project group expansion across reloads @ b0cc248f3a14e46d1e27275e7ecdb19db99385ee (https://github.com/tiann/hapi/pull/2168)
- #2166 [DIRTY] fix(modes): rename Claude's default permission mode to manual @ d7f5a6cbdebd90b4db20d4c81486d485d95f2f0d (https://github.com/tiann/hapi/pull/2166)
- #2164 [DIRTY] fix(mcp): display_image/video/media tell the wrong flavors to call the wrong tool name @ 944d4b4c0522fabf4b1a77cffecb7cf3acdd22da (https://github.com/tiann/hapi/pull/2164)
- #2157 [CLEAN] feat(android): render inline markdown images with authed Coil loading @ 5a69f77238bde928ab74af767b4becdd1afa1a89 (https://github.com/tiann/hapi/pull/2157)
- #2151 [CLEAN] feat(android): Pi session import (list + dialog + continue-now) @ 71d011ffdc5b823ee9b7ba648fc9c411aec0548d (https://github.com/tiann/hapi/pull/2151)
- #2150 [CLEAN] feat(android): Codex duplicate-merge confirm + archive/restart @ 6d4c733f4f7a15e9e45c48213ce19c1ec206fdae (https://github.com/tiann/hapi/pull/2150)
- #2149 [CLEAN] feat(android): Codex session import (sync dialog + inline history) @ 1c90669d03a9e8903f2a93ec5d3e27cdbe7dd0dc (https://github.com/tiann/hapi/pull/2149)
- #2147 [CLEAN] feat: Boards — track and create GitHub work without leaving HAPI @ e24e7f45ea2eb1afb99508f4a2d6849e95cfad16 (https://github.com/tiann/hapi/pull/2147)
- #2146 [CLEAN] feat(android): per-flavor config sections in the session sheet @ 806a11a7f4741d27fa2e982c74d96c3a0eaa9935 (https://github.com/tiann/hapi/pull/2146)
- #2145 [CLEAN] feat(android): per-flavor model and effort pickers on the NewSession form @ cbbc4be02cc67be4613be08e6a782aff3bbe3438 (https://github.com/tiann/hapi/pull/2145)
- #2143 [DIRTY] feat(android): cursor chat-store reopen gate and migration banner @ 2c9b6acc0f6c70c3b313ecc4326d6a6d935da5be (https://github.com/tiann/hapi/pull/2143)
- #2142 [DIRTY] feat(android): session export with JSON/Markdown formats, save and share outlets @ 950f528f4d67356da917af4bd15e2a016998fd97 (https://github.com/tiann/hapi/pull/2142)
- #2140 [CLEAN] feat(android): machines settings screen and dictation overrides @ 606f10662ae3ac2e11997b37374100e47cf0a8ee (https://github.com/tiann/hapi/pull/2140)
- #2139 [CLEAN] feat(android): git badges, persisted show-hidden in directory browser + foreground toasts @ b94ac50307149aad68065e44b5f8adf95e6eb7c0 (https://github.com/tiann/hapi/pull/2139)
- #2137 [DIRTY] feat(android): carded thinking + vector tool glyphs, retire transcript emoji @ 7d11fde626f111cf01648c1e3899ab502721af47 (https://github.com/tiann/hapi/pull/2137)
- #2136 [DIRTY] feat(android): composer quick-action row — Files/Scratchlist/Park one thumb away @ 3ab89db826707822806bfed864312dfae3668598 (https://github.com/tiann/hapi/pull/2136)
- #2135 [DIRTY] feat(android): collapsible directory groups in the session list @ 60889e167ffd42272c8545fc8d6f5053657281c5 (https://github.com/tiann/hapi/pull/2135)
- #2133 [CLEAN] feat(android): align scratchlist session-delete hint and any-type attachments @ 687bcfdfe98cbf9a78e20b7fd0cd040f9a133208 (https://github.com/tiann/hapi/pull/2133)
- #2131 [DIRTY] feat(android): shared zoomable image viewer + SVG support @ c3643d5b6e51ed4bbe95476a1070af9c4fa8eee7 (https://github.com/tiann/hapi/pull/2131)
- #2130 [DIRTY] feat(android): files persistence (expand/scroll state, markdown preview mode, code wrap) @ 6486de2b8bfa228ebdb10428699905da793b5956 (https://github.com/tiann/hapi/pull/2130)
- #2129 [DIRTY] feat(android): files screen actions (download, copy paths, add-to-composer, sort) @ 871db1e6d84732d29346f26fcbcbb16fb7cfc1fd (https://github.com/tiann/hapi/pull/2129)
- #2121 [DIRTY] feat(android): steered badge + send-failure reopen card @ eff404e8eeb042d01df557edcfd680a5db28941a (https://github.com/tiann/hapi/pull/2121)
- #2120 [DIRTY] feat(android): composer attachment drag-to-reorder + paste-to-attach @ 810ad2cc60415f694ce8d18bff432fe8115af727 (https://github.com/tiann/hapi/pull/2120)
- #2119 [DIRTY] feat(android): code-block wrap toggle + session citation links @ a28d657ee3f002eed9052acb753c0f985d8390b4 (https://github.com/tiann/hapi/pull/2119)
- #2117 [CLEAN] feat(web): add opt-in local search history @ 7f60121a342a4b1f758f8dbd9d5e435c4a7e63fc (https://github.com/tiann/hapi/pull/2117)
- #2114 [DIRTY] feat(android): owner hub settings switches — web Settings→General parity @ 122952e403531a3991f153178cb860bb6b88b7b5 (https://github.com/tiann/hapi/pull/2114)
- #2112 [DIRTY] feat(android): directory-grouped session home with flat-list toggle @ 45bac3219d7e478ec5b1a70297ce7194d6214768 (https://github.com/tiann/hapi/pull/2112)
- #2111 [DIRTY] feat(android): skills autocomplete in composer — web $skills parity @ eb2de429a375fe112b9a24eb9ff4cf2a5682ace6 (https://github.com/tiann/hapi/pull/2111)
- #2109 [DIRTY] feat(android): session actions parity — copy reference, AI title suggestion, active-gated archive/delete @ f74590be7a6055975e1bddde8816e35d01a1bce5 (https://github.com/tiann/hapi/pull/2109)
- #2107 [DIRTY] android(app): machine filter rows carry CPU/mem health @ 53a4422eed26d92c2846d0c6850eba56acc16029 (https://github.com/tiann/hapi/pull/2107)
- #2106 [DIRTY] android: active-only lens and pin-in-progress running buckets @ 267506b990e539c2bf230aa5a616d528fdb4405f (https://github.com/tiann/hapi/pull/2106)
- #2105 [DIRTY] feat(android): unread system — unread-only lens, mark unread, mark all read @ 246cf3305b118cc9bd229b54126d74e1b61669e6 (https://github.com/tiann/hapi/pull/2105)
- #2103 [DIRTY] Axgu/local workspace @ c8c4cdb1c4341141a3842b33d74cf77ef2760c98 (https://github.com/tiann/hapi/pull/2103)
- #2099 [DIRTY] fix(codex): do not re-insert legacy history on shared resume @ 49bf5b50f8f5d298145cee8d0a72be3c9941489e (https://github.com/tiann/hapi/pull/2099)
- #2096 [CLEAN] fix(codex): include inherited fork history when syncing Codex transcripts @ a8f04fefce5894b8617bf08ef7d7ab49f04b32a3 (https://github.com/tiann/hapi/pull/2096)
- #2093 [CLEAN] feat(web): add project session sorting options @ 1f71af18f8d5ae5f7162fe94f9be26d877cb8dea (https://github.com/tiann/hapi/pull/2093)
- #2092 [CLEAN] fix(codex): restore Web Rewind for shared sessions @ 01a02f53afa7c87c7969b8efdd61bee58e451973 (https://github.com/tiann/hapi/pull/2092)
- #2076 [DIRTY] fix(cli): stream Claude and Codex assistant text @ 1f87080bb392a6c1874389e62f6fc91c25faa4df (https://github.com/tiann/hapi/pull/2076)
- #2074 [CLEAN] feat(hub): notify external channels when sessions need attention @ bf1e8c9f228f36fbc0dd108aec2655b58b5b117b (https://github.com/tiann/hapi/pull/2074)
- #2056 [DIRTY] feat: hub-wide peer-tools toggle in web Settings @ 7ea30c9ab02cc70f4c94a34ada2d1f7f8bd656df (https://github.com/tiann/hapi/pull/2056)
- #2051 [CLEAN] fix(codex): allow explicit resolution of indeterminate delivery blocking forks @ f8872a0bf46deeb63b1c54f34fe19c23cb953898 (https://github.com/tiann/hapi/pull/2051)
- #2049 [DIRTY] Add agent chat creation with shared New Chat defaults @ 489e9394edea5e86df9f1208b36e27a318f7f639 (https://github.com/tiann/hapi/pull/2049)
- #2048 [draft] Fix blank chats behind hidden history pages @ 44a4a35aca386222b6e7b6d578a253bcea9fb91c (https://github.com/tiann/hapi/pull/2048)
- #2047 [draft] Add agent self-archive and peer archive tools @ 7a04c6f6c3a29760a1790be2b48265f4f88f5297 (https://github.com/tiann/hapi/pull/2047)
- #2043 [DIRTY] feat(dsh): permission modes via the shared ACP permission bridge @ 03f91d337e9b5241c68887664e0dc714ea4968d4 (https://github.com/tiann/hapi/pull/2043)
- #2036 [CLEAN] fix(codex): stabilize cold restore and deduplicate history acknowledgements @ ec286b4600d9bd1c9f2f6b0ce730579b80414caa (https://github.com/tiann/hapi/pull/2036)
- #2035 [CLEAN] fix(runner): prevent Windows process probes from blocking session lifecycle @ caf0baf7d42d88fce62d3cace9a403642e2f45f2 (https://github.com/tiann/hapi/pull/2035)
- #2029 [DIRTY] ci(android): publish debug APK artifacts and allow manual builds @ da13057e29e746eacda6ede4212da5f720df7775 (https://github.com/tiann/hapi/pull/2029)
- #2028 [DIRTY] feat(dsh): resume stored ACP sessions across runner restarts @ ebdc2dd30aab48061eceb97fb37d1b6ff2833168 (https://github.com/tiann/hapi/pull/2028)
- #2027 [DIRTY] fix(dsh): abort via session/close when the agent has no cancel capability @ 81f59872306e80dfe3b35a5aa10d4e3d23172707 (https://github.com/tiann/hapi/pull/2027)
- #2026 [DIRTY] fix(web): allow pasting non-image files into the composer @ 7ea3d1497821c404556f5fb4fe5fd1bf68728bc9 (https://github.com/tiann/hapi/pull/2026)
- #2021 [DIRTY] feat(cli+hub): archive_peer MCP/CLI soft stand-down (#2020) @ de758a55bd691f956c065b566d87a6dd1d311947 (https://github.com/tiann/hapi/pull/2021)
- #2018 [DIRTY] feat(web): scroll the selected session row into view on navigation @ 1156d2822374fad7bdb2b33eec5830b94d29d0b5 (https://github.com/tiann/hapi/pull/2018)
- #2010 [DIRTY] feat(cli,hub): search_peers beyond list_peers recency @ 86f2bccc96ff39bb9b12401e086b9b03ffc15456 (https://github.com/tiann/hapi/pull/2010)
- #2009 [DIRTY] fix(codex): support async questions, waiting input and steering @ 1453114952028065aef7733d9770cf8b76f02004 (https://github.com/tiann/hapi/pull/2009)
- #2008 [DIRTY] feat(cli): support mid-turn steer for Claude remote sessions @ bbc64d00b769d2f1e381f267baaf83abeeda23fb (https://github.com/tiann/hapi/pull/2008)
- #2005 [CLEAN] fix(hub): reap machine-spawn stubs that never booted @ 66f86f420ca91e976a029d3d2d4a57fd3f75e3bd (https://github.com/tiann/hapi/pull/2005)
- #2001 [CLEAN] feat(android): add Wear OS companion module (:wear) @ 9b7eb0f1432f1a8a26c470856c2340adea19c53b (https://github.com/tiann/hapi/pull/2001)
- #1997 [DIRTY] feat(cli): cap live sessions at a configurable default of 20 @ bdbd7f541436fea2469e6881d46e7db7fab96af7 (https://github.com/tiann/hapi/pull/1997)
- #1994 [DIRTY] fix(codex): preserve explicit permissions during shared startup @ f05680a06b54722594ede61558658f0be68cbf92 (https://github.com/tiann/hapi/pull/1994)
- #1992 [CLEAN] fix: preserve native CLI stop behavior @ 48cb03fd11ee22fc8e1460a02f5feec390c01479 (https://github.com/tiann/hapi/pull/1992)
- #1990 [DIRTY] feat(web): labeled dual-pole sliders for settings binary rows @ 9d2a9fa720e10bebf977ace14f0d60e81cb4d47a (https://github.com/tiann/hapi/pull/1990)
- #1988 [CLEAN] feat(auth): support optional Cloudflare Access web sign-in @ 582e8f73074abdae3ece7636555161427a2884f3 (https://github.com/tiann/hapi/pull/1988)
- #1987 [UNSTABLE] docs: add HAPI Chat VS Code community integration @ de62024efdf0916a74abe326266719472ed58333 (https://github.com/tiann/hapi/pull/1987)
- #1985 [DIRTY] feat(opencode): independent primary-agent selection (create + mid-session) @ 1003149b50c8edda3f341439d0e140af966a638f (https://github.com/tiann/hapi/pull/1985)
- #1980 [UNSTABLE] fix(web): keep iPhone PWA session toolbar below blurred strip @ 997fcf4997387a97a9c938291ce89298ed677149 (https://github.com/tiann/hapi/pull/1980)
- #1979 [DIRTY] Add a Queue/Steer preference for new Codex sessions @ 2d0f1dc189ec71616c771bd37110c18af2ee59c2 (https://github.com/tiann/hapi/pull/1979)
- #1976 [DIRTY] feat(hub,cli,web): opt-in per-turn session title updates with manual-rename lock @ bd36fc2247828660c3cec732099d98fe02063c5f (https://github.com/tiann/hapi/pull/1976)
- #1972 [DIRTY] fix(web): route hardcoded UI strings through i18n @ e35f2c3f536b346dfb7a215d6af2d69fc23d82ff (https://github.com/tiann/hapi/pull/1972)
- #1962 [CLEAN] feat(website): add Russian locale @ 0a9832313b6d16481a4ca4a4334cf315fc3add64 (https://github.com/tiann/hapi/pull/1962)
- #1961 [DIRTY] feat(hub): localize Telegram and web-push notifications @ 702e0abed28dfba042e398f7800387ef6659db15 (https://github.com/tiann/hapi/pull/1961)
- #1955 [DIRTY] fix(web): allow retrying failed abort requests @ 58faa21e6420662ec8a306944b3aafd562992385 (https://github.com/tiann/hapi/pull/1955)
- #1953 [UNSTABLE] fix(cli): doctor fails closed on Cursor HAPI MCP invoke path @ 1055c70b4ce24f7de787df3150fdd9a4b2f76113 (https://github.com/tiann/hapi/pull/1953)
- #1946 [DIRTY] fix(hub): map engine RPC failures to typed statuses (resume/reopen/archive/paths/pi-models) @ 1d56f7c96bf3de71dd770cf9525f477fc63a324c (https://github.com/tiann/hapi/pull/1946)
- #1944 [DIRTY] fix(web): keepalive-idle indicators in the sidebar and retirement of lost subagent traces @ 530ce5982ba7eb50575ebb34f359d3ce6a7580e8 (https://github.com/tiann/hapi/pull/1944)
- #1942 [DIRTY] fix(hub): make keepalive-idle reconciliation robust against metadata churn, replays and retries @ 971b11c8070fc9caa1a2aca695a90898edb4f906 (https://github.com/tiann/hapi/pull/1942)
- #1940 [DIRTY] fix(runner): reconnect live Codex roots on resume @ 6e5455b135b0c38cdaf9272dcd9ffda73868be21 (https://github.com/tiann/hapi/pull/1940)
- #1934 [DIRTY] fix(cli,hub): refuse Claude resume id overwrite and probe transcripts @ 6ea0bd703b29953f6c2ab87fb22306f9097d0b2a (https://github.com/tiann/hapi/pull/1934)
- #1927 [CLEAN] fix(dsh): archive sessions when the ACP process exits @ 3378e4af5a597fc3543e60f0b5088f4dd23c78b1 (https://github.com/tiann/hapi/pull/1927)
- #1921 [CLEAN] fix(hub): typed errors for undeliverable permission answers and aborts @ 8ae040618997de85f55d165671d9cafd5f5ebae5 (https://github.com/tiann/hapi/pull/1921)
- #1920 [CLEAN] fix(cli): report the inline-media shell fallback as not applicable in packaged installs @ fd7cd5844d24df4533b8969c6d7ffab2af9205c0 (https://github.com/tiann/hapi/pull/1920)
- #1901 [DIRTY] feat(codex): thin Codex budget gauge in composer (replaces #847) @ d94482f3fe0275e9b09afdadb638a135567bbc41 (https://github.com/tiann/hapi/pull/1901)
- #1892 [CLEAN] fix(spawn-peer): treat permissionMode default as omit so stock yolo wins @ ff9bef872b3bb2161346186cb8405bd8c189cd8b (https://github.com/tiann/hapi/pull/1892)
- #1890 [CLEAN] fix(cli): bound path-policy symlink resolution with a deadline @ 03ee6edffd17998fa9789c93f1364c8e08df584b (https://github.com/tiann/hapi/pull/1890)
- #1889 [CLEAN] fix(hub): treat message traffic as session liveness evidence @ c14373464eddbcfd653287291dcf481c8af005a9 (https://github.com/tiann/hapi/pull/1889)
- #1886 [DIRTY] perf(hub,cli): stop unbounded session-history loads @ e45c382577bce06866e3555244122e88837ba240 (https://github.com/tiann/hapi/pull/1886)
- #1885 [DIRTY] fix(hub): repair hub URLs/CORS origins and accept same-host handshakes @ d5b78a3e33fbb217cdad46366a5eee3217796863 (https://github.com/tiann/hapi/pull/1885)
- #1881 [CLEAN] Nudge runner to reconnect idle session sockets when messages arrive @ 2cabd57ec60ff3841aa32cb8e818397b35de78df (https://github.com/tiann/hapi/pull/1881)
- #1879 [DIRTY] feat(cli): honor standard proxy env vars for hub egress @ 04a7489036e6c837f680cc93288988a3cb139ddf (https://github.com/tiann/hapi/pull/1879)
- #1878 [DIRTY] hub: keep sessions online while the runner still sees a live agent process @ c1fc4164e01cedb1d556906cf2df22dcce253055 (https://github.com/tiann/hapi/pull/1878)
- #1876 [UNSTABLE] fix(web): avoid running state for child traces without lifecycle @ a16cd59c60035241150e43548d6f447190c16b3a (https://github.com/tiann/hapi/pull/1876)
- #1875 [DIRTY] fix(hub): skip side effects for replayed message IDs @ 1ea30933c68456c3c62ac26eec0af0119248f4a3 (https://github.com/tiann/hapi/pull/1875)
- #1871 [DIRTY] feat(web): group action menu with pin, rename, and copy path @ 90361a589d0b9e8ce4cea733bf336f6c99a848c1 (https://github.com/tiann/hapi/pull/1871)
- #1867 [UNSTABLE] fix(cli): stamp test hub with HAPI_TEST_MARKER for orphan reap @ 50cfa158ac51ff3ca64b63096b977a01cce8c48a (https://github.com/tiann/hapi/pull/1867)
- #1849 [CLEAN] fix(hub): generate fork titles with the configured title provider @ 5f25cb86e1cfee69ff4f60a3bac82eba4fafbd46 (https://github.com/tiann/hapi/pull/1849)
- #1825 [DIRTY] feat(cli): auto-steer ping_peer into active turn (takeover #1708) @ bb2fb712ca3d437df51fe6c73df6c6efe6c9c9af (https://github.com/tiann/hapi/pull/1825)
- #1801 [CLEAN] feat(web): add include and exclude session search modes @ 520f4f98c59cccc32dd54674b6d0e1d80980786f (https://github.com/tiann/hapi/pull/1801)
- #1793 [DIRTY] feat(web): absolute datetime tooltips on relative ages @ a2f8f3a8298ea4a82c08d721696027c9a6a0e415 (https://github.com/tiann/hapi/pull/1793)
- #1791 [CLEAN] feat(web): add bilingual release history to Settings > About @ 03db2a3139125bf8befe1efb8013737b4db4a6ee (https://github.com/tiann/hapi/pull/1791)
- #1788 [CLEAN] feat(web): expose agent quota queries in settings and context display @ 75ac8c308e20ffb73d38caf1e99dc940370e2953 (https://github.com/tiann/hapi/pull/1788)
- #1787 [CLEAN] feat(runner): add safe agent quota query infrastructure @ 7112c5d3ded228ed574b58153018204c67b8a2c4 (https://github.com/tiann/hapi/pull/1787)
- #1772 [CLEAN] feat(web): add combined session list filters @ 61d72d98c36ac9a010831245399384982beb3800 (https://github.com/tiann/hapi/pull/1772)
- #1762 [draft] feat(web): in-session message content search @ 30b531a4f494b1df058f14e75e3d04e2318e471c (https://github.com/tiann/hapi/pull/1762)
- #1758 [CLEAN] feat(web): add pin-in-progress session layout modes @ ab6864f903bb58037b2e100eda7216c1e458440e (https://github.com/tiann/hapi/pull/1758)
- #1753 [CLEAN] fix(runner): reject a spawn model missing from the machine's catalog @ d5fa8963fa91b825a04af6532a9d870dbd466088 (https://github.com/tiann/hapi/pull/1753)
- #1747 [DIRTY] feat(web): add collapsible session sidebar @ a8e8d6e91b8c6f8a8b3495fb6ba214cdc8594eb6 (https://github.com/tiann/hapi/pull/1747)
- #1738 [DIRTY] fix(hub): capture AGENT_NOTIFY_SUMMARY from peer user-role deliveries @ 5a695fbd1bd367fe15835f9f9742cc37fe9fc160 (https://github.com/tiann/hapi/pull/1738)
- #1733 [CLEAN] feat(web): session-list scrollbar tick for open session position @ 7e86f4f93b2d174e35a65a5f25098790a661f676 (https://github.com/tiann/hapi/pull/1733)
- #1729 [CLEAN] fix(web): Enter inserts newline when composer is expanded @ f04288cacaae35ee2c50b381bc4db5604eb03f80 (https://github.com/tiann/hapi/pull/1729)
- #1725 [CLEAN] fix(cli): auto-Continue on Cursor post-tool interrupt; Blocked only on give-up @ cfa9b93e537ead98af5b07ca600fb437d3e82eb5 (https://github.com/tiann/hapi/pull/1725)
- #1721 [UNSTABLE] fix(pi): support Windows npm command shims @ d6e801fbda0089e4d42c85f43dc5096352dabc10 (https://github.com/tiann/hapi/pull/1721)
- #1718 [DIRTY] fix(web,hub): friendly file preview when session CLI is offline @ 4bd39ff866aa40f4d0eae4bb69cffcfeb60f5063 (https://github.com/tiann/hapi/pull/1718)
- #1715 [DIRTY] fix(pi,agents): tool-result images + provider-qualified set-session-config + live model catalogs @ 8eea473175ea5b94f2d29fd19bffbfaeb93e9dbd (https://github.com/tiann/hapi/pull/1715)
- #1714 [DIRTY] feat(codex): select provider profiles for web sessions @ a227310e3e7438b5940089748367339d060536b1 (https://github.com/tiann/hapi/pull/1714)
- #1711 [CLEAN] feat(web): make detail headers horizontally scrollable @ 63e71b35614a6b9f5bb97b3b2bf6e116fd3361f7 (https://github.com/tiann/hapi/pull/1711)
- #1708 [DIRTY] feat(cli): auto-steer ping_peer messages into an active turn @ 73630bbd3f3058b3eca9f77df0fe392ca1c4940e (https://github.com/tiann/hapi/pull/1708)
- #1706 [DIRTY] fix(hub): verify runner before trusting archiveSession's dead-CLI fallback @ 26c1615ae754ddb16b43fdbae4850f90ea7d6d85 (https://github.com/tiann/hapi/pull/1706)
- #1704 [CLEAN] feat(web): add independent session header Agent icon toggle @ 6173098bb0046cffc6bb53dded1a4bab9697838e (https://github.com/tiann/hapi/pull/1704)
- #1702 [CLEAN] fix(web): debounce and cancel stale file searches @ 2305ea9c82c5c544e3ee3156cd13251724803e6b (https://github.com/tiann/hapi/pull/1702)
- #1695 [CLEAN] feat(web): add fullscreen preview for shared turns @ 1477c9ae3f06e75caf883cb7b0c76f6cdc893338 (https://github.com/tiann/hapi/pull/1695)
- #1693 [CLEAN] feat(web): add fullscreen table preview and export actions @ a43bc305dfb3b677f1b6045204ac87477c6e20e6 (https://github.com/tiann/hapi/pull/1693)
- #1692 [CLEAN] feat(agent): add provider-specific agent detail inventories @ 96d9ab90a1aa330a9367026354ae6d416955643f (https://github.com/tiann/hapi/pull/1692)
- #1684 [CLEAN] feat(attachments): persist original attachments in Hub @ 01266a81a8dc09f2e8a63599659f81cdd66ed9ce (https://github.com/tiann/hapi/pull/1684)
- #1683 [DIRTY] feat(hub): add generic webhook notification channel @ 08fa9726e8d0dce5a5a263987fb54cb2ce649d21 (https://github.com/tiann/hapi/pull/1683)
- #1666 [CLEAN] fix(web): improve generated media retry and sizing @ eb6043fb96d6c53947d74b2c7fdbc9fd2fe298ad (https://github.com/tiann/hapi/pull/1666)
- #1660 [CLEAN] fix(web): support RMB symbol aliases for skill autocomplete @ 761becdc3ffe30b3e8267c24dd8874cac295fc3a (https://github.com/tiann/hapi/pull/1660)
- #1659 [CLEAN] feat(web): add frontend composer history for loaded session messages @ 55e090a9736a90f36d3fed0a2f7283d9bb808ec7 (https://github.com/tiann/hapi/pull/1659)
- #1658 [CLEAN] feat(web): add Alt+S shortcut to send messages @ e629d6e4898562e7a3684b02093dca06fad6a776 (https://github.com/tiann/hapi/pull/1658)
- #1657 [CLEAN] fix(web): improve deferred generated-file download controls @ 7021088a91f8bf2100f34e27c4ae2cf4e21b3bcf (https://github.com/tiann/hapi/pull/1657)
- #1640 [DIRTY] feat: add lightweight shared Agent Studios @ b86a3b6c16c90ab80636a99f07ae9ca58bc129a4 (https://github.com/tiann/hapi/pull/1640)
- #1637 [CLEAN] feat(web): add desktop session sidebar toggle @ 4f331ef01a31c80cfedb0355d180317e239fc0c7 (https://github.com/tiann/hapi/pull/1637)
- #1629 [DIRTY] fix(agy): stop delivering the same answer twice when deltas are mangled @ a084ba83b531ec4436786d6f703e9ca7ff9b0fd5 (https://github.com/tiann/hapi/pull/1629)
- #1621 [CLEAN] fix(sessions): make title generation discoverable @ dad5a84386d99134a1e07de57658c0b1b733afb5 (https://github.com/tiann/hapi/pull/1621)
- #1620 [DIRTY] fix(web): coalesce symlink path spellings in session list groups @ 72bd413a1c90a67f55e568c5b1097c3f8c46a8bd (https://github.com/tiann/hapi/pull/1620)
- #1618 [DIRTY] feat(peer): nametag-only ping_peer reply attribution @ 5fa5696566c1831a6803d70b3d20ae0eb5ba8dcb (https://github.com/tiann/hapi/pull/1618)
- #1617 [CLEAN] fix(web): unify sync session menu labels @ ea5ec5c3c1dc240dee87ab54282e4a47622ee3f0 (https://github.com/tiann/hapi/pull/1617)
- #1616 [CLEAN] fix(web): reuse existing PWA window for notification clicks @ f73210d5c474e9a802dd453c84292b8254d21e86 (https://github.com/tiann/hapi/pull/1616)
- #1615 [CLEAN] feat(hub): add optional WxPusher completion notifications @ 160ee10487734d6c7552d57f37ac8e894e096cd1 (https://github.com/tiann/hapi/pull/1615)
- #1614 [DIRTY] Make web terminals persistent and attachable @ 64770fb335544e95bbbc549c55e3d587b428d8d0 (https://github.com/tiann/hapi/pull/1614)
- #1613 [DIRTY] fix(cursor): isolate HAPI MCP overlay to project mcp.json @ 957a3d00a110de0ecfda509d1ca458acfe43b9ed (https://github.com/tiann/hapi/pull/1613)
- #1611 [CLEAN] fix(scratchlist): persist manual ordering and improve draft actions @ d56dd6fdf51460f93ba8ade6df282b06a5e0e72c (https://github.com/tiann/hapi/pull/1611)
- #1592 [CLEAN] fix(web): apply reasoning collapse preference to history @ 9cdbbdc1dcd17541ef14ef4e16e21daebfe8ed57 (https://github.com/tiann/hapi/pull/1592)
- #1581 [CLEAN] fix(web): clear stale drafts after delayed queued sends @ 061ec055ccbfee1ecd5127b9cc3e22299e5642f6 (https://github.com/tiann/hapi/pull/1581)
- #1567 [DIRTY] feat: add Reasonix ACP integration @ aa7fdf0f5bfbacf811cf745409ae7aacb9c84bc3 (https://github.com/tiann/hapi/pull/1567)
- #1564 [DIRTY] feat(cli): Cursor-only display_links MCP for unmangled URLs @ e8cbc5a005057ac0a5b2224a93d9e787509030c4 (https://github.com/tiann/hapi/pull/1564)
- #1537 [DIRTY] feat: add peer tools exposure toggle (#1401) @ 693aed6e40beed850caeb65ac32fb4e6d68442d5 (https://github.com/tiann/hapi/pull/1537)
- #1528 [DIRTY] fix(hub): make session timeout and reconnect state durable and consistent @ 3517c527077d71033ec3782185ca4cf6d280d0f4 (https://github.com/tiann/hapi/pull/1528)
- #1527 [DIRTY] feat(cli): survive terminal hangup by switching the session to remote mode @ 597c28d6bcb5dd2fc8938197d60e5dea9d327821 (https://github.com/tiann/hapi/pull/1527)
- #1525 [DIRTY] test(cli): make the suite pass on macOS hosts @ 85e5ec888140097893bdf30dfe1b101145d2c54e (https://github.com/tiann/hapi/pull/1525)
- #1523 [CLEAN] fix(web): unify agent task status presentation @ 65e9853eb2ee7e288db71f13f58e208055a89392 (https://github.com/tiann/hapi/pull/1523)
- #1517 [DIRTY] Fix Telegram Mini App polish and file tree state @ d9767f92f0beb3a245ed2329030126441676e8e0 (https://github.com/tiann/hapi/pull/1517)
- #1447 [DIRTY] feat(web): add separate option to pin active sessions @ 19daba6f54b3bc99d4645dd3be25cdc6d2be7b4b (https://github.com/tiann/hapi/pull/1447)
- #1443 [DIRTY] feat: restore mid-turn steer for Codex and Cursor @ 1888de0e1e3fd9ae84001d49e56e8d607b4b67f8 (https://github.com/tiann/hapi/pull/1443)
- #1429 [DIRTY] feat(claude): import local session history @ 5d3f41bb10bb22e7186d1abc0fc45e5659be479d (https://github.com/tiann/hapi/pull/1429)
- #1418 [CLEAN] feat(web): drag sessions into composer mentions @ aa7e51f1d2e722bfbd7cc1d7079d4478536d4b1a (https://github.com/tiann/hapi/pull/1418)
- #1414 [CLEAN] fix(web): hide redundant machine labels on single-machine pinned rows @ ad5682b5b6ba6277eb9e1701b46e062a148bd321 (https://github.com/tiann/hapi/pull/1414)
- #1361 [DIRTY] Fix/codex sync idle active @ e1e7e8c3fbcfcdaaff872398c1d08758d3dcef0f (https://github.com/tiann/hapi/pull/1361)
- #1360 [DIRTY] feat: add notification preferences and customizable web push copy @ b9c9975ae1afa1455385fdd69509c3f8c169c728 (https://github.com/tiann/hapi/pull/1360)
- #1351 [DIRTY] feat(claude): steer mid-turn messages instead of queueing them @ feb70174798df546512ebd9096768c94ddead945 (https://github.com/tiann/hapi/pull/1351)
- #1309 [draft] feat(web): customize session list toolbar @ 01a98c4efd4ddcfb0b8278c936ddd346f7e30936 (https://github.com/tiann/hapi/pull/1309)
- #1257 [DIRTY] fix(web): budget subagent messages separately from top-level history @ 6957978424f74209dca9295699137179282e80ad (https://github.com/tiann/hapi/pull/1257)
- #1242 [DIRTY] feat(web): show status and platform on the machines settings page @ 2c7a46f98f49a23e638f5188a6960ddc937cade3 (https://github.com/tiann/hapi/pull/1242)
- #1212 [DIRTY] feat(web): quote selected text from a message into the composer @ 93d8678da8535c3a812e166f43961c1c4ff50f92 (https://github.com/tiann/hapi/pull/1212)
- #1193 [draft] feat(codex): support app-server profile configuration @ 999f1d1170d382cc4fd5e5fdf6e0a6ab4a0bf65f (https://github.com/tiann/hapi/pull/1193)
- #1189 [DIRTY] fix(codex): accept thread-matching stale terminal events during same-thread recovery @ 5f949783ad2123d865d758a921681245683f899d (https://github.com/tiann/hapi/pull/1189)
- #1188 [DIRTY] fix(cli): run SDK metadata extraction in a temp cwd @ 1f23f857e4173a25f969879ef139487ec1c9955e (https://github.com/tiann/hapi/pull/1188)
- #1163 [CLEAN] feat(session): opt-in GitHub PR awareness + explicit attach @ 6adaad77e4118236ae821ca57924b868680e6c6d (https://github.com/tiann/hapi/pull/1163)
- #1158 [CLEAN] fix(web): unify session header display labels @ b00e39794e707d3bdbd6ab1029b5a6576b3cf985 (https://github.com/tiann/hapi/pull/1158)
- #1126 [DIRTY] fix(web): preserve loaded history during streaming @ 31ce48080df1a62150e9fe7e0a86fde511ef3cc2 (https://github.com/tiann/hapi/pull/1126)
- #1099 [DIRTY] fix(web): avoid session misclicks during live reordering @ 91116cd9089107625d95ae2bc99fa615ef87d6a6 (https://github.com/tiann/hapi/pull/1099)
- #1093 [CLEAN] feat(web): add assistant response navigation @ cdf22810efb2ecf6ebdd231cf257cec0694d687e (https://github.com/tiann/hapi/pull/1093)
- #1092 [DIRTY] feat(workspace): add scoped file and Git controls @ 4427e6e08b2fed4429c793af2841f7f47fb70bac (https://github.com/tiann/hapi/pull/1092)
- #1091 [DIRTY] feat(providers): add managed agent API profiles @ 0cf0d70310e9c58c5a41509793260a003822a9b4 (https://github.com/tiann/hapi/pull/1091)
- #1059 [DIRTY] fix(pi): remove PiModelPanel/PiThinkingLevelPanel @ 37deeeba5263ceb402429c069e911eac96eb406e (https://github.com/tiann/hapi/pull/1059)
- #1054 [DIRTY] fix(web): local-mode permission UX + stop OpenCode 500 spam @ 9cbe9b1fa24edec152bb610e0b1049930c723432 (https://github.com/tiann/hapi/pull/1054)
- #987 [CLEAN] feat(cursor): detect inline model errors, surface, notify, and bridge (#878) @ cdd6bcbc02009a19f7778fb734a06f1108cb525b (https://github.com/tiann/hapi/pull/987)
- #945 [CLEAN] feat(hub,cli,web): estate-wide multi-agent session import (Codex | Cursor | Claude) @ 67f01d6b2b4326c3b4e43d4fa41faa179e3ebdc4 (https://github.com/tiann/hapi/pull/945)
- #663 [DIRTY]   feat: support Codex local goal sync and remote approvals @ 5dbf6d406a6bb8507dc07598ba2aecc8cd98ee0f (https://github.com/tiann/hapi/pull/663)
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

## Selection decisions (2026-11-13)

Official base moved from 4233bf87 (v0.30.7 train) to 06d9e51f5 (official
release v0.35.0, 772 commits). The queue was rebuilt from the live PR heads on
the new base; the v0.30.7.7 queue was not replayed.

- Merged by official main (no patch, 49 PRs): every earlier carry whose
  upstream PR is now merged, including #1930, #1932, #1938, #1943, #1960,
  #2012, #2025, #2031, #2032, #2046, #2052, #2060, #2061, #2065, #2066,
  #2069, #2070, #2072, #2075, #2077, #2078, #2087-#2091, #2095, #2153, #2158,
  #2159 and #2165. The planned #1771 replacements #2054 and #2167 (spawn_peer /
  ping_peer `waitForReply`) are official too.
- #1771 is NOT carried (closed unmerged; superseded by official #2167). Its
  fork-only process stop/remit layer caused two production bugs that this
  release removes: spawn-with-remit failures surfaced as HTTP 502 through
  Cloudflare (tiann/hapi#2409) and `reconcileSpawnRemitCleanups` re-sent
  StopSession every 5 s for rows whose cleanup failed (tiann/hapi#2408). The
  fork `hapi-session-control` skill overlay (fork/session-control-skill
  3efcb7ec) is re-stacked on official main after #2167. Consequence: the
  `hapi stop-peer`, `--remit-id` and hub `/sessions/:id/stop` surfaces are gone;
  old-session migration for this upgrade runs `stop-peer` on the v0.30.7.7
  CLI/Hub before the Hub is replaced.
- Closed unmerged, never carried: #1468, #1597 (operator: not wanted), #1607,
  #1662, #1771, #2080 (official read state replaced it), #1542, #1836, #847.
- Carried (20): personal PRs #1418, #2096, #2346, #2410, #2423, #2432 (all
  latest-head HAPI Bot clean); previously carried PRs that still apply to
  v0.35.0 with latest-head HAPI Bot no findings: #1158, #1414, #1592, #1615,
  #1616, #1617, #1660, #1666, #1702, #1729, #1849, #1920, #1921, #2092.
  #1921 was hand-merged with #1702 in `rpcGateway.rpcCall` (abort signal plus
  typed RpcTimeoutError); #2092 with #1849 (imports, live e2e list).
- Release-day refresh (2026-11-14): official main moved to 58c9e80d8 while
  fork Actions were disabled. #1414, #1616, #2346, #2410 and #2423 were merged
  officially after the v0.35.0 base; their audited heads equal the merged PR
  heads, so the manifest records them as `backport-official-pr-N` regenerate
  rows and they leave `pr-audit.tsv` (closed). Authors rebased #1615, #1849 and
  #2092 onto newer official main; each new head has a latest-head HAPI Bot
  "All stages passed" review and was re-applied to v0.35.0 (#1849 and #2092
  keep only their own hunks where the rebase dragged in post-base official
  code). #2035's new head depends on post-base official runner stop code
  (`prepareSessionStop`, signal deadlines) and conflicts in `run.ts`,
  `process.ts` and `windowsProcessStop.ts`, so it is deferred rather than
  hand-merged. #2429 (2,002 additions) opened after the candidate audit and is
  deferred pending official acceptance. Personal #2432 (steering denies pending
  Claude permission requests, tiann/hapi#2431; 74 additions) opened during the
  release window with a clean latest-head HAPI Bot review and passing CI, and is
  carried.
- Personal open PRs skipped: #2099 and #2166 (conflict with official main),
  #2342 (hub schema V35 collides with official V35 `session_redirects`; a
  fork-only V36 would repeat the fork V27-V29 hazard).
- Previously carried, dropped this release: #1620, #1718, #1940, #1942, #1944,
  #1955, #2008 (and its fork steer-recovery fix), #2026, #2027, #2056 (all
  conflict with official main), #1721 (no review on the live head).
- Fork overlays kept: codex shared-rewind fail-closed fix (paired with #2092;
  the hub half is now covered by #2092's stricter check), hapi-session-control
  skill, two Android fixes, desktop packaging and fork workflow guards, Bun
  1.4.4 pin (official `packageManager`), carried-test mock/label refresh,
  test stability overlay (Node 26 webstorage, macOS temp
  realpaths, `HAPI_INVOKED_CWD` pinned in claude resume tests), version 0.35.0.1.
- Inherited from the official base (operator rule: officially merged code is
  accepted): Antigravity (#1320 and follow-ups #2309, #2319, #2330) and
  session-attached Jobs (#1424, #1489). Earlier releases excluded both; they are
  no longer replayed or reverted, they are simply official behavior now.

## Hub database migration

Production Hub DB is fork schema 29 (fork V27 `steered`, V28 ACP cost, V29
`session_read_states`). Official v0.35.0 numbers V27-V35 differently. A
backup-API copy of the live mazu DB (5.2 GB, 1,489 sessions, 2.0 M messages)
was migrated with this tree: user_version 29 -> 35, `quick_check=ok`, all
sessions kept, 9 min 43 s on mazu. Compared with a fresh v0.35.0 schema, the
only gap is the partial index `idx_messages_future_scheduled_queued` (official
V26->V27 step, skipped because the fork DB was already past 26); the
deployment creates it once with `CREATE INDEX IF NOT EXISTS` after the Hub
migrates. Extra fork columns/tables (`messages.steered`, `sessions.personality`,
`usage_events.cost*`, `session_read_states`, `notification_preferences`) have
defaults and are left in place. Rollback needs the pre-upgrade DB backup.

## Candidate verification (2026-11-14, Mac arm64)

- Bun 1.4.4 `bun install --frozen-lockfile`: no changes. `bun typecheck`
  (CLI, web, hub, relay, desktop): pass.
- Full tests, 0 failures: CLI 4,988 pass / 28 skip; web 4,484 pass / 1
  expected fail; hub 1,865; shared 458; relay 118; desktop 5. The six
  failures seen on 2026-11-13 were environment leaks in official tests, fixed
  by the test stability overlay: Node 26's built-in `localStorage` shadowed
  jsdom (`sessionLastSeen` 3, `markdown-a` 2), the ss parser test ran the
  host's platform branch, macOS `/var` vs `/private/var` temp paths (cursor
  notify overlay 3) and an inherited `HAPI_INVOKED_CWD` (claude resume 1;
  official #2396 fixes the same leak after the base). One agy driver test
  failed once under full-suite load and passed 3/3 in isolation.
- Maintenance Python checks: 43 pass (Bun pin assertion updated to 1.4.4).
- Isolated rehearsal against live open PR heads (207 open PRs, 0 stale):
  expected_source_tree=ea8caf0b08d9fb1e2e4a251f7762ea5aeb6f88cf; REHEARSAL_OK.
- Personal policy exceptions: #2346 `status-checks-failed` (one cancelled
  `pr-review` run; the latest-head review passed) and #2423
  `status-merge-unstable`; both were merged officially on 2026-11-13.
- e2e, runner integration, Android and iOS gates run in fork CI on the exact
  release head.
- The first tag run (98230b28f) never started `sign-macos`: GitHub retired
  the `macos-14` image ("configuration 'macos-14-arm64-us-default' is not
  supported"). The workflow overlay now pins `macos-26` (newest GA arm64 image; `macos-latest` points to it); the unpublished tag
  was moved to the corrected head.
