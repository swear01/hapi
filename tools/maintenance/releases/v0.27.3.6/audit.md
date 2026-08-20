# HAPI maintained release audit

Previous maintained release: v0.27.3.5

Official release: v0.27.3

Personal PR owner: swear01

Origin main (pre-push): 21f172194
Upstream main: 901f17d0c

## Fork-only commits

- ee5a18554 chore(release): prepare v0.27.3.6 (version bump, release notes, drop #1093, 4 carries) + carry cherry-picks (#1584 #1585 #1592 #1595)
- 546da465e revert: drop fork-carried PR #1093 assistant response navigation (13 files)
- (earlier overlay commits from v0.27.3.5)

## Decisions this cycle

- Dropped from tree: pr-1093 (assistant response navigation) — operator ruling 2026-08-15; implementation removed (MessageActions NavigationButton, HappyThread jumpToPrompt/scrollToConversationStart/ConversationStartStatus, context members, icons, 8 locale keys, tests). Upstream PR #1093 stays open; issue #1587 closed; #1586 re-scoped to four official buttons.
- New carries (4): #1584 (status summaries follow conversation language; bot clean at head 4607962d), #1585 (AGY Gemini 3.7 Flash; clean 87a7dbfa), #1592 (reasoning collapse in history; clean 95dfb7dc), #1595 (Ctrl+A select-all; clean 8a0ec888).
- Deferred: #1590 (quiet active pinned section) — conflicts with fork overlay (ProjectGroupHeader #955 context menu, attached-jobs pin mode, machine-label UX); #1574/#1572/#1571/#1597/#1598 bot findings; #1591 Major; etc.
- Standing: #1091 drop (2026-08-13 ruling), #1320 permanent exclusion.

## Merge resolutions

- #1584 × fork #1548 locale tests: both kept (sessionSummaryInstruction.test.ts).
- #1592 × fork reasoning tests: #1592 changes default to preference-off=expanded; fork tests updated to set STORAGE_KEY.
- reasoning.test.tsx both-side merge needed manual brace completion.

## Verification

- typecheck clean; shared 316 / hub 1329 / web 2738 / cli 2797 (12 skip)
- Release Actions 31903032870 + Test 31903032857 success; 9 assets
- Deployed 7/7 at 0.27.3.6; oracle PM2 recovery (orphan 569549); sessions survived
