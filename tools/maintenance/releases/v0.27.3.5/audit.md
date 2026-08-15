# HAPI maintained release audit

Previous maintained release: v0.27.3.4

Official release: v0.27.3

Personal PR owner: swear01

Origin main (pre-push): e0430dd860ae5476cc979fece959ce3618412d49
Upstream main: 901f17d0cadf5fd1736ff1cc9124a9682d4a6339

## Fork-only commits (origin-only, from previous release + this cycle)

- 69e2be101 chore(release): bump to v0.27.3.5 (overlay copy carried v0.27.3.4 version)
- 056f0c883 fix(hub): rebuild sessionCache from fork overlay + official updateSessionSummary
- 92559f6b0 fix(hub): complete method separations in merged syncEngine
- 213cf50d3 fix(web): drop duplicate showSessionSummaryInChat per PR #1582
- 128ae975e fix(web): complete markdown-a fixture merge
- 08dadaed3 chore(release): prepare v0.27.3.5 (version bump, release notes, UFR merge + 3 carries)
- 3f4fbc3dd merge: rebuild v0.27.3.5 from upstream 901f17d0c with maintained overlay
- (carries) d0cb52b4d #1582, 89bdd1865 #1582, 56209d03a #1581, 97e6cba03 #1581, fecfe7d42 #1581, 0d9d2058d #1581, f656a2817 #1581, 8d1a1428d #1573, … (cherry-picked PR commits)

## Decisions this cycle

- Carry (new, 3): #1573 (Fork action preservation; bot clean at head 5ffdee3c89), #1581 (stale drafts after delayed queued sends; bot clean at head ac2750164e), #1582 (fork PR #7 compact-summary mapping; personal, bot clean at head 4ecb4b31e7).
- Officially merged upstream (superseded carried patches, recorded drop): #1471 #1490 #1495 #1530 #1544 #1546 #1547 #1550 #1562 (fork PR #5) #1565 #1568 #1569 #1570 (fork PR #6).
- In-tree carries retained via overlay (not merged upstream): #1541 #1543 #1548 #1552 #1557 #1560 #1563 #906 #1422 #1414 #847 #987 #945 #1447 #1158 #1424 #1469 #1418 #955.
- Drop: #1091 (operator ruling 2026-08-13), #1320 (permanent exclusion).
- Deferred (58): all remaining open PRs — #1574 (DSH, Major), #1572 (2x Major), #1571 (findings), #1564/#1566 (Major), personal #1542/#1534/#1475/#1436/#1421/#1468/#1451/#1419 (bot findings or dirty), #1567 (huge Reasonix), etc.

## Notable merge resolutions (UFR overlay)

- runPi.ts / runPi.test.ts: official #1570 complete version taken (supersedes fork's older carried #1570 + #1563 content, which is present in the official version).
- apiSession.ts / syncEngine.ts / sessions.test.ts / markdown-a.test.tsx: both sides kept (official new methods + fork #906 modelError overlay).
- sessionCache.ts: fork version + official updateSessionSummary (#1577) re-inserted.
- App.tsx: official titleSuggestion effect + fork NamespaceLocaleSync kept.
- docs/guide/agents.md: official (compact-summary block wording).
- HappyThread.test.tsx: fork ConversationStartStatus tests kept (fork-only component).
- shared/src/schemas.ts + sessionJob modules: fork-only session-jobs (#1404) overlay restored.

## Verification

- typecheck clean (cli/web/hub/desktop)
- shared 316 / hub 1329 / web 2739 / cli 2786 (12 skip) all pass
- Release Actions 31882444797 + Test 31882444806 success (first Release attempt 31882378406 failed: tag/version mismatch — overlay copy carried v0.27.3.4; fixed at 69e2be101)
- 9 assets + curated notes on GitHub Release v0.27.3.5
