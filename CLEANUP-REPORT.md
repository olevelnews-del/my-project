# HSC Academic Hub — Codebase Audit & Cleanup Report

## Summary
- **Total Files Audited:** 61 source code files (HTML, JS, CSS)
- **Total Initial Code Lines:** 11,938 lines
- **Audited Date:** 2026-11-26

---

## 1. Identified Duplicate & Redundant Code

### A. HTML Structural Duplication (~5,200 lines duplicated)
1. **Sidebar Navigation & Topbar Header:**
   - Repeated verbatim across 31 subject files in `courses/*.html` and core pages (`dashboard.html`, `planner.html`, `scorecard.html`, `revision.html`, `syllabus.html`, `chapter.html`).
   - Each course HTML file (~160 lines) is 85% duplicate markup, varying only in subject title, paper, and chapter links.
2. **Duplicated Page Clones:**
   - `courses/all/index.html` (88 lines) is a duplicate of `courses/index.html`.
   - `pricing/index.html` (84 lines) is a duplicate of `pricing.html`.
   - `bundles/index.html` (165 lines) is an unreferenced duplicate course listing.
   - `full-platform.html` (100 lines) is an unreferenced legacy landing clone.

### B. Obsolete & Dead Files (~650 lines)
1. `video-player.html` (82 lines) & `css/video-player.css` (83 lines) — Obsolete since moving to direct YouTube search redirect.
2. `workspace.html` (55 lines) — Unused development artifact.
3. `test.html` (276 lines) — Standalone static mock; integrated into API backend flow.
4. `css/additional.css` (34 lines) — Redundant inline overrides.
5. `js/pricing.js` (20 lines) — Merged into common JS handler.

### C. JS Logic Duplication (~450 lines)
1. `normalizePhone`, `escapeHTML`, and `localStorage` progress key handlers duplicated across `js/app.js`, `js/progress.js`, `js/dashboard.js`, and `api/payment.js`.
2. Mock payment state handling split inconsistently between `api/payment.js` Worker and frontend `js/app.js`.

---

## 2. Target Cleanup Plan
1. Centralize CSS into `static/css/common.css`.
2. Centralize JS utilities and API interactions into `static/js/common.js`.
3. Create reusable HTML layout component structure (`templates/header.html` and `templates/footer.html`).
4. Clean out obsolete files (`video-player.html`, `workspace.html`, `bundles/`, `pricing/`, `courses/all/`).
5. Wire frontend pages to Node.js & Python backend endpoints with `localStorage` offline fallback.
