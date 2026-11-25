# Project Progress

## Pricing

**Pricing Corrected: 999 One-Time for One Student.** ৳999 is a one-time all-access payment for one student until the HSC exam.

## AI Workspace

**AI Workspace = Connect Your NotebookLM (No API, No Gemini, Link + New Tab method - Google blocks iframe)**

Chapter detail pages and `video-player.html` let students save and open NotebookLM links. `workspace.html` lists connected notebooks and chapter sources, with local source downloads. No in-site AI chat or backend API is used.

## Final low-storage architecture

- `links.json` is the central active link map; `data/questions.json` stores sample practice questions.
- `video-player.html` is the one-page Video / Notes / NotebookLM chapter view. `workspace.html` is the three-column sources / connected notebook / guide page.
- `api/payment.js` verifies bKash or SSLCOMMERZ references and supports small progress and NotebookLM records through a Sheet webhook. No AI API exists.
- `js/progress.js` and `dashboard.html` store/display only the required per-student chapter progress fields; without a webhook, localStorage is used and marked Demo.
- Payment/provider credentials and `SHEET_WEBHOOK_URL` remain unset. The Worker fails closed until those secrets and webhook actions are configured. Empty notes/tests links in `links.json` must be replaced with real admin links.

## Files changed

- Added: `links.json`, `data/questions.json`, `api/payment.js`, `js/progress.js`, `dashboard.html`, `scorecard.html`, `revision.html`, `test.html`, `css/dashboard-dark.css`, `css/dashboard.css`, `js/dashboard.js`, `.env.example`.
- Updated: `config.js`, `data/academic.json`, `js/notebooklm.js`, `video-player.html`, `workspace.html`, `css/video-player.css`, `bundles/index.html`, `js/app.js`, `js/site-data.js`, `index.html`, `full-platform.html`, `pricing.html`, `pricing/index.html`, `courses/index.html`, `courses/all/index.html`, 29 `courses/*.html` detail pages, `wrangler.jsonc`, `.assetsignore`, `AUDIT-REPORT.md`, `PROGRESS.md`.
- Deleted: `videos.json`, `api/chat.js`, `js/chat.js`, and eight dead bundle redirects (`science.html`, `humanities.html`, `business-studies.html`, `compulsory-subjects.html`, `compulsory_subjects.html`, `business_studies.html`, `full-platform.html`, `all/index.html`).

## Validation status

Static HTML was opened in the integrated browser, but root-relative scripts and JSON cannot load from `file://`. A local HTTP server, build, and command-line validation could not run because the shell sandbox lacks `slirp4netns`. Production payment/cloud sync also remain unverified until the webhook and Cloudflare secrets are configured.


## Complete Dark Dashboard Rebuild (Way To IAS & PrelimsAI Inspired)
- **Design System**: Dark dashboard theme (#0F0F1A background, #1A1A2E cards, #7C3AED violet accent, #FFC800 yellow CTAs, Hind Siliguri font, Bengali language).
- **Navigation Layout**: Fixed left sidebar + scrollable main content area with responsive mobile drawer.
- **Pages Created/Updated**:
  - `dashboard.html` — Main HSC Academic Hub dashboard (greeting, popular courses, practice row, 3-column HSC/Board/Preparation, free plan box, ৳999 one-time upgrade cards, continue section, score tabs, syllabus coverage grid, footer).
  - `scorecard.html` — Performance analytics page (overall accuracy svg ring, stat tiles, trend area, subject/source breakdown, weak topic fixes, revision test entry).
  - `revision.html` — Bookmark-based revision review system (filter by subject, test launch per question, batch revision test trigger).
  - `test.html` — Interactive MCQ question runner engine (option A/B/C/D with real-time feedback, detailed explanation area, bookmark wrong answers, result summary with score saving).
  - `js/dashboard.js` — IIFE engine powering test flow, localStorage state (`hscDashboardProgress`, `hscBookmarks`), sidebar navigation, tab switching, and score persistence.
  - `css/dashboard.css` — Complete dark dashboard stylesheet.

## Repositioning Complete
- **Positioning Change**: Teacher language → Consultant / HSC Study System
- **Accountability**: #1 feature - Streak, Daily Check-In, Focus Timer
- **5 Core MVP Features**: Profile Setup → Smart Routine → Daily Check-In → Weekly Report → Mini Quiz
- **Content Rule**: Transform NCTB syllabus into daily tasks, don't create new content
- **Target**: First group only — Science HSC students who have coaching but can't study at home
- **Pricing**: ৳999 ONE-TIME, not monthly. Free tier added
- **Dashboard**: Rebuilt as Consultant Dashboard
- **Removed from hero**: Live Class, Dedicated Teacher, 1-on-1 Video Call
- **Section #1**: Accountability - এটাই আমাদের আসল পার্থক্য

## Hermes Audit Fixes (2026-11-25) — All 6 Categories Complete
- ✅ **Typo check**: No "আমরামরা" typo found anywhere.
- ✅ **Dead links fixed**: 9 href="#" replaced across dashboard.html (planner/chapter/milestone pages).
- ✅ **New pages created**: `planner.html` (daily task tracker + focus timer + streak), `chapter.html` (chapter-level video player + NotebookLM connect).
- ✅ **Testimonials fixed**: 3 Unsplash photos replaced with Bengali-initial avatar circles + Beta Student labels + disclaimer.
- ✅ **Demo messaging**: api/payment.js returns `{_mode:"demo"}` responses; bundles/index.html shows inline yellow warning + handles demo submission gracefully.
- ✅ **OG meta tags**: Added to index.html, pricing.html, bundles/index.html, dashboard.html, scorecard.html, chapter.html.
- ✅ **.env.example**: Added BKASH_MERCHANT_ID and FIREBASE_CONFIG entries.
- ✅ **AUDIT-REPORT.md & PROGRESS.md**: Updated with full audit fix log.
