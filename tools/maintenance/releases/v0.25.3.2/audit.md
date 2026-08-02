# HAPI v0.25.3.2 maintained release audit

Previous maintained release: v0.25.3.1
Official release: v0.25.3
Upstream main: abf9cb02a52280811ae9c06172efe32536dfba1a
Previous maintained main: f46dd8dda9c6e285807e6f8c902206fe34fb3752

This hotfix retains the complete audited v0.25.3.1 patch queue and adds one root-cause repair: `web/src/components/MarkdownRenderer.tsx` imports `react-markdown`, so `web/package.json` must declare it directly. Depending on workspace-hoisted transitive packages made clean `origin/main` typecheck behavior lock-layout dependent and surfaced missing `remark-stringify`, mdast, vfile, and hast types.

The v0.25.3.1 open-PR audit remains unchanged. Immediately before this hotfix, upstream main and official v0.25.3 were unchanged; PR #1320 remained CLEAN at `6d689a9fac43cb05cf80e34850e1fcf9c91ac097` with `test` and `pr-review` successful, and PR #1325 remained CLEAN at `0d1ca760740b5d3b988f6de9b2df7ed0aea710b8` with both checks successful.

Required gates:

- manifest test fails before the direct dependency and passes after it
- frozen install
- full typecheck
- targeted markdown tests
- full unit and Playwright suites
- isolated patch-queue rehearsal and exact tree match
- Release Actions, checksums, macOS signature, and seven-host fleet verification
