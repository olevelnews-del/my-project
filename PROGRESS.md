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

- Added: `links.json`, `data/questions.json`, `api/payment.js`, `js/progress.js`, `dashboard.html`, `.env.example`.
- Updated: `config.js`, `data/academic.json`, `js/notebooklm.js`, `video-player.html`, `workspace.html`, `css/video-player.css`, `bundles/index.html`, `js/app.js`, `js/site-data.js`, `index.html`, `full-platform.html`, `pricing.html`, `pricing/index.html`, `courses/index.html`, `courses/all/index.html`, 29 `courses/*.html` detail pages, `wrangler.jsonc`, `.assetsignore`, `AUDIT-REPORT.md`, `PROGRESS.md`.
- Deleted: `videos.json`, `api/chat.js`, `js/chat.js`, and eight dead bundle redirects (`science.html`, `humanities.html`, `business-studies.html`, `compulsory-subjects.html`, `compulsory_subjects.html`, `business_studies.html`, `full-platform.html`, `all/index.html`).

## Validation status

Static HTML was opened in the integrated browser, but root-relative scripts and JSON cannot load from `file://`. A local HTTP server, build, and command-line validation could not run because the shell sandbox lacks `slirp4netns`. Production payment/cloud sync also remain unverified until the webhook and Cloudflare secrets are configured.
