# REDUCE-REPORT.md — Frontend Rebuild & Code Reduction Report

## Summary
The legacy frontend composed of 65 static HTML, CSS, and JS files with heavy copy-paste layout code was completely rebuilt into a single modular React + TypeScript + Vite + Tailwind CSS SPA (`frontend-react/`).

Old static HTML files have been safely backed up in `/old-html-backup/`.

---

## Line Count Comparison

| Metric | Legacy Frontend (HTML/CSS/JS) | Rebuilt React Frontend (frontend-react/) | Difference / Saved |
|---|---|---|---|
| **Total Source Files** | 65 files | 16 files | **49 files removed (-75.3%)** |
| **Total Lines of Code** | **12,271 lines** | **896 lines** | **11,375 lines saved (-92.7%)** |

---

## What Changed & Modularized

1. **Mainframe Hero Spec Implementation:**
   - **Background Video Scrubbing:** Smooth mousemove scrub tracking on full-screen Cloudfront MP4 video.
   - **Custom Fonts:** Integrated `HelveticaNowDisplay-Medium` and `HelveticaNowDisplayW01-Rg`.
   - **Typewriter Hook:** Extracted custom `useTypewriter` React hook (38ms speed, 600ms start delay) with animated blinking cursor.
   - **Action Pills:** 4 solid white action pills (Direct navigation to Planner, Syllabus, Revision, Scorecard) + 1 outline WhatsApp pill with 1-click clipboard copy (`navigator.clipboard.writeText`).
   - **Navbar:** Responsive layout with desktop links, WhatsApp CTA, and animated mobile hamburger overlay.

2. **Bangladeshi Students Animation Section (`components/BangladeshiStudents.tsx`):**
   - Animated cards representing students from Dhaka, Chattogram, and Sylhet (Rahat, Mim, Sakib) with Bangla initial avatars.
   - Live CSS animated progress bars, streak counters, check-in statuses, and ৳999 one-time payment callouts.

3. **Single Source of Truth CSS:**
   - Replaced multiple duplicate stylesheet files (`styles.css`, `dashboard.css`, `additional.css`) with Tailwind CSS utility classes and 1 concise 30-line `index.css`.

4. **Unified API & Router Layer:**
   - Client routes (`/`, `/dashboard`, `/planner`, `/chapter`, `/syllabus`, `/scorecard`, `/pricing`) using `react-router-dom`.
   - Integrated with Node.js fast dashboard backend (`http://127.0.0.1:3000/api/dashboard`) and Python Flask logic backend (`http://127.0.0.1:5000/api/payment`).
