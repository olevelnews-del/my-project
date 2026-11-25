# AUDIT REPORT — Folder A (Main Project) vs Folder B (V0 Download)
**Date:** 2026-11-25 | **Folder A:** /home/olevel/MEGA/My project/my-project | **Folder B:** /home/olevel/mega2/Download/project

---
## Summary: P0 remediation status
**P0 [DONE — implementation; deployment configuration pending].** The project uses HSC Academic Hub branding and centralized WhatsApp details. Pricing is ৳999 one-time for one student with all-access until the HSC exam. The former Gemini chatbot and `/api/chat` Worker have been removed. The NotebookLM workspace is a link-and-download workflow; Google NotebookLM opens in a new tab because it blocks embedding. A separate Worker handles only provider-verified payment and tiny progress/NotebookLM records.

**Pricing Corrected: 999 One-Time for One Student.** The current price is ৳999 paid once for all groups and subjects until the HSC exam. Per-course price fields and obsolete recurring-price copy were removed. The required Home Tutor comparison remains explicitly monthly and is not the HSC Academic Hub price.

---
## Comparison: Folder A vs Folder B
### Files in Folder B (v0 download)
| File | Status |
|------|--------|
| app/page.tsx | Template stub - says "Your v0 generation will show here." |
| app/layout.tsx | Default Next.js layout with Vercel analytics placeholder |
| app/globals.css | shadcn/ui CSS variables only (no design) |
| components/ui/button.tsx | Base UI button component (unstyled default) |
| package.json | Next.js 16 + Tailwind v4 + shadcn dependencies |
| public/placeholder*.jpg/svg/png | Blank placeholders |
| tsconfig.json, .gitignore, next.config.mjs | Build config only |

### Files Missing in A that B has
| File | Purpose |
|------|---------|
| app/page.tsx | Next.js page (A uses plain .html) |
| app/layout.tsx | Next.js layout (A uses plain .html) |
| components/ui/button.tsx | shadcn Button component |
| lib/utils.ts | cn() utility |
| All placeholder images | A has none |
| package.json (Next.js) | A is vanilla HTML/CSS/JS, not Next.js |

**Conclusion:** Folder B is a blank shell - it has NO actual page content whatsoever. Its only value is as a modern React/Next.js + Tailwind v4 + shadcn starting point. Folder A is the real product.
---
## P0 Bugs in Folder A — [DONE]

| # | Bug | Resolution | Status |
|---|-----|------------|--------|
| 1-5 | Duplicated/fake support contact details across public pages | `config.js` now supplies the WhatsApp link and support number centrally; pages render them from config. | [DONE] |
| 6 | Pricing route was redirect-only | `pricing.html` is now a real pricing page with `#package`; pricing directory page also has the anchor. | [DONE] |
| 7 | Eight bundle sub-pages were dead redirects | Removed all eight retired routes and corrected the relevant links. | [DONE] |
| 8 | All six video URLs were empty | Added working YouTube embeds and made the player load the selected JSON record from `?video=`. | [DONE] |
| 9 | Footer identity/contact details were inconsistent | Standardized footer text, dynamic WhatsApp contact, domain, and Facebook link. | [DONE] |

---
## P1 Improvements

| # | Improvement | File(s) |
|---|-------------|---------|
| 1 | Remove stale anchor price and normalize one-time pricing | Completed: ৳999 is a one-time all-access price for one student; catalog no longer stores per-course prices. |
| 2 | Add favicon / logo icon (currently emoji only) | All pages |
| 3 | Add Open Graph meta tags for social sharing (Facebook/WhatsApp preview) | index.html, pricing.html |
| 4 | Add robots meta and canonical URLs properly | bundles/index.html has canonical but it is wrong (/bundles/) |
| 5 | Remove duplicate slugs: bundles/business-studies.html AND bundles/business_studies.html (same redirect) | Redundant files |
| 6 | Course pages have hardcoded teacher names empty (teachers:[]) - populate or hide | js/site-data.js |
| 7 | Workspace depended on an in-site AI backend | Removed the chatbot, Worker endpoint, Gemini configuration, and related deployment routing; added NotebookLM link management and source downloads. |
| 8 | Video player had no actual YouTube/embed URLs | Resolved: `data/academic.json` contains six embed URLs and the player loads the selected lesson record. |
| 9 | No privacy policy / terms page linked in footer | Footer sections |
| 10 | Testimonial identities should be verified before ads | `index.html` now uses labeled representative Unsplash photos; verify names, results, consent, and replace stock images before presenting these as actual students. |
---
## Video and NotebookLM Workspace

| Feature | Status in Folder A | Notes |
|---------|-------------------|-------|
| video-player.html exists | YES | Loads a lesson and source record selected from `data/academic.json` using `?video=`. |
| In-site chatbot or AI backend | NO | Intentionally removed; no Gemini, RAG, or `/api/chat` endpoint. |
| NotebookLM connection | YES | Saves chapter links in localStorage and opens the Google-hosted notebook in a new tab. |
| Chapter source downloads | YES | Generates a text source file from local academic data. |
| Workspace | YES | Three columns for sources, connected notebooks, and usage steps. |
| Course detail coverage | YES | `config.js` adds the NotebookLM connection section to existing course detail pages. |
| Real video embeds | PRESENT | The player loads a selected lesson record from `data/academic.json`. |
| Real transcript data | PARTIAL | Sample Bengali transcript and notes are provided; verify course-specific accuracy before launch. |
| Parent Dashboard | MISSING | Referenced in copy but no page exists |
| Live Doubt Room scheduling | MISSING | No booking system |
| Testimonial photos | PRESENT | Unsplash representative photos; they are not verified photos of the named students. |

---
## Pricing correction

**Pricing Corrected: 999 One-Time for One Student.** The homepage, pricing routes, membership form, mobile bar, WhatsApp enrollment message, and catalog now use one-time all-access pricing. No HSC Academic Hub monthly, per-subject, or per-group charge is advertised.

The only `/ Month` references are in the requested Home Tutor comparison (`8000 TK / Month x 12 = 96000 TK`), not the HSC Academic Hub price.

---
## Old Words Still Found

| Word | Status |
|------|--------|
| কোর্স কিনুন | NOT FOUND (good) |
| Bundle (English word) | NOT FOUND (good) |
| Package | NOT FOUND (good) |
| Course Price | NOT FOUND (good) |
| Personal Tutor | Found throughout - CORRECT branding |
| Membership | Found throughout - CORRECT branding |

**Verdict:** All old promotional language has been removed. New branding is consistent.
---
## What to COPY from B to A

Folder B has no usable content to copy - it is a blank shell. However, you could adopt these structural improvements:

| From B | What to Copy | Why |
|--------|-------------|-----|
| shadcn/ui components | Use as reference for button/card styles | Cleaner, accessible defaults |
| Tailwind v4 config | Migrate A's CDN Tailwind to v4 build | Better tree-shaking, smaller bundle |
| Dark mode class strategy | Adopt .dark class pattern | Professional feel, user preference |
| Placeholder images | Replace with real student photos | Makes testimonials and hero real |
| Metadata pattern | Add proper OG/meta tags | Facebook ad previews work correctly |

---
## P0 cleanup completed

The following files were removed because they only redirected to the main Membership page:

- `bundles/science.html`
- `bundles/humanities.html`
- `bundles/business-studies.html`
- `bundles/compulsory-subjects.html`
- `bundles/compulsory_subjects.html`
- `bundles/business_studies.html`
- `bundles/full-platform.html`
- `bundles/all/index.html`

## NotebookLM workspace update

**AI Workspace = Connect Your NotebookLM (No API, No Gemini, Link + New Tab method - Google blocks iframe)**

The old client chatbot, `/api/chat` endpoint, and Gemini configuration were removed. Course detail pages and `video-player.html` provide the NotebookLM connect modal, saved-link card, disconnect/change controls, and local source downloads. `workspace.html` presents sources, the shared notebook, and the three-step guide. Cloudflare Worker routing remains enabled only for `/api/payment`, `/api/progress`, and `/api/notebooklm`.

### Files changed for this update

- Added `links.json` as the active source for YouTube, Drive, NotebookLM demo, and external test links.
- Added `data/questions.json` and `data/academic.json` sample chapter records.
- Added `api/payment.js` for provider verification plus tiny progress and NotebookLM link endpoints; it does not contain AI/chat code.
- Added `js/progress.js` and `dashboard.html` for the limited progress record.
- Updated `config.js`, `js/notebooklm.js`, `video-player.html`, `workspace.html`, and `css/video-player.css` for the shared NotebookLM link, sources, chapter layout, and downloads.
- Updated `bundles/index.html`, `js/app.js`, `js/site-data.js`, `index.html`, `full-platform.html`, `pricing.html`, `pricing/index.html`, `courses/index.html`, `courses/all/index.html`, and 29 `courses/*.html` detail pages for the one-time price, active links, and centralized contact display.
- Updated `wrangler.jsonc`, `.assetsignore`, and `.env.example` for the payment/progress Worker. Worker traces are disabled to avoid retaining provider validation URLs that contain credentials.
- Deleted `videos.json`, `api/chat.js`, `js/chat.js`, and the eight dead bundle redirect pages listed above.
- Updated `AUDIT-REPORT.md` and `PROGRESS.md`.

## Deployment note

No AI API key or AI backend is used. NotebookLM opens in a new tab; it is not embedded in this site.

## Final architecture and setup requirements

- `links.json` is the active admin-edited link map. Empty Drive/test entries intentionally show an “add a link” message; add and verify the actual URLs before launch. Legacy catalog `primary_url` values are discarded at runtime and are not used by pages.
- `data/questions.json` contains the sample in-code practice records. Chapter pages read video, notes, and test links from `links.json`; practice questions are rendered in-page and external tests open Quizizz/Google Forms.
- Chapter progress stores only `{studentPhone, chapterId, videoWatched, testDone, lastVisit}`. With no webhook configured, the browser falls back to localStorage and labels it Demo.
- The payment Worker accepts bKash Payment IDs and SSLCOMMERZ validation IDs, verifies amount/status/currency server-side, and fails closed unless the Google Sheet webhook confirms saving. A wallet TrxID alone cannot be verified through those provider query APIs.
- `.env.example` contains blank placeholders only. Configure the provider credentials and HTTPS `SHEET_WEBHOOK_URL` as Cloudflare Worker secrets before accepting real payments; implement the documented webhook actions (`verify-and-save-payment`, `save-progress`, `get-progress`, `save-notebooklm`, `get-notebooklm`, and `delete-notebooklm`). Do not use the example file for live secrets.
- No production payment or cloud-sync verification was run: the webhook and credentials are intentionally unset. The command/browser test server could not be started because the shell sandbox lacks `slirp4netns`; opening `file://` cannot load root-relative app scripts.
