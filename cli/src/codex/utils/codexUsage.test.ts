commit 0f8139c5aad62d82c3962982d6651e1fdf9f4d61
Author: swear01 <stanley.yellow1@gmail.com>
Date:   Tue Aug 11 16:44:47 2026 +0000

    fix(codex-usage): parse real app-server rate-limit fields (closes tiann/hapi#1514)
    
    Codex app-server serializes RateLimitWindow as
    { usedPercent, windowDurationMins, resetsAt } (verified via
    'codex app-server generate-json-schema' on 0.145.0 and codex-rs tags
    0.120-0.147), but the normalizer only matched window_minutes/windowMinutes
    and reset_at/resetAt, so both 5h/weekly buckets were silently dropped.
    
    With the windows gone, isCodexUsageBlocked saw noTimeWindows=true and a
    Pro account's normal zero top-up balance ('0.0000000000') as exhausted,
    rendering a red 100% 'Blocked: subscription window and credits both
    exhausted' gauge for accounts with full quota remaining.
    
    Add the real field names to the key lists; internal normalized shape
    unchanged. Also drop a stray committed conflict marker in
    hub/src/web/server.ts that broke hub typecheck on fork main.
    
    Via [HAPI](https://hapi.run)

diff --git a/cli/src/codex/utils/codexUsage.test.ts b/cli/src/codex/utils/codexUsage.test.ts
index 6b2877b10..957983f5e 100644
--- a/cli/src/codex/utils/codexUsage.test.ts
+++ b/cli/src/codex/utils/codexUsage.test.ts
@@ -78,6 +78,64 @@ describe('normalizeCodexUsage', () => {
         });
     });
 
+    it('parses the real codex app-server rate-limit wire shape (camelCase windowDurationMins/resetsAt)', () => {
+        // Regression for tiann/hapi#1514: the codex app-server serializes
+        // RateLimitWindow as { usedPercent, windowDurationMins, resetsAt }
+        // (verified via `codex app-server generate-json-schema`, codex >= 0.120).
+        // The old key lists only matched window_minutes/windowMinutes and
+        // reset_at/resetAt, silently dropping both buckets so the web gauge
+        // misread healthy Pro accounts as blocked.
+        const usage = normalizeCodexUsage({
+            info: {
+                rate_limits: {
+                    limitId: 'codex',
+                    limitName: null,
+                    primary: {
+                        usedPercent: 0,
+                        windowDurationMins: 300,
+                        resetsAt: 1_774_278_000
+                    },
+                    secondary: {
+                        usedPercent: 12,
+                        windowDurationMins: 10080,
+                        resetsAt: 1_774_278_000
+                    },
+                    credits: {
+                        hasCredits: true,
+                        unlimited: false,
+                        balance: '0.0000000000'
+                    },
+                    individualLimit: null,
+                    spendControlReached: false,
+                    planType: 'pro',
+                    rateLimitReachedType: null
+                }
+            }
+        }, { now: 1_000_000 });
+
+        expect(usage).toMatchObject({
+            rateLimits: {
+                fiveHour: {
+                    usedPercent: 0,
+                    windowMinutes: 300,
+                    resetAt: 1_774_278_000_000
+                },
+                weekly: {
+                    usedPercent: 12,
+                    windowMinutes: 10080,
+                    resetAt: 1_774_278_000_000
+                }
+            },
+            credits: {
+                hasCredits: true,
+                unlimited: false,
+                balance: '0.0000000000'
+            },
+            planType: 'pro',
+            limitId: 'codex'
+        });
+    });
+
     it('falls back to input+output when total_tokens is omitted (cached/reasoning are subsets)', () => {
         const usage = normalizeCodexUsage({
             info: {
