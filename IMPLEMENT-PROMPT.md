# HSC Academic Hub - 5 REA Facilities Implementation

## Project Context
- Path: /home/olevel/MEGA/My project/my-project
- Brand: HSC Academic Hub | hsctutorbd.com | WhatsApp: 01616200174
- Price: ৳999 ONE-TIME (NOT monthly)
- Architecture: NO Big Storage, NO Database, NO Gemini AI. Videos = YouTube Only. Notes = Google Drive Only. Tests = External Quizizz/Google Form links. Progress = localStorage only. Admin = Edit links.json only.
- Language: Bangla Bangladesh ONLY (no Hindi, no Devanagari). English subject names allowed.
- UI: Black/white + dark theme, mobile responsive, Bengali initials avatar, NO stock photos, NO fake testimonials.

## Rules (DO NOT BREAK)
1. Do NOT invent YouTube/Drive links. If link is empty in links.json, show "ভিডিও আসছে" / "Drive নোট আসছে"
2. Do NOT add any external AI API calls (no Gemini, no /api/chat)
3. Keep existing design system consistent (--bg-dark, --bg-card, --accent-violet, --cta-yellow colors)
4. All text must be in Bengali (Bangla script) - NEVER Hindi
5. Price stays ৳999 ONE-TIME everywhere - remove any "মাসে"/"monthly" pricing language if you find it
6. No big libraries - use plain JS, CSS, no Chart.js or similar

## STEP 1: Review Current State
Read these files first and summarize what exists vs what's needed:
- planner.html
- dashboard.html  
- scorecard.html
- revision.html
- test.html
- js/progress.js
- links.json

For each file, note: What progress/task/score logic exists? What needs to be added?

## STEP 2: Implement ALL 5 Facilities

### FACILITY 1: Daily Check-In System
**File: planner.html** - Add Evening Check-In section below existing tasks:

```html
<!-- NEW: Evening Check-In Section -->
<div class="planner-card">
  <h3>🌙 রাতের Check-In</h3>
  <p style="color:var(--text-secondary);font-size:13px;">আজকের টাস্কগুলো পূরণ হলো?</p>
  <div id="evening-checkin-options">
    <button class="checkin-btn" data-status="yes" onclick="submitCheckIn('yes')">✅ হ্যাঁ, সম্পূর্ণ করেছি</button>
    <button class="checkin-btn" data-status="partial" onclick="submitCheckIn('partial')">⚠️ আংশিক করেছেছি</button>
    <button class="checkin-btn" data-status="no" onclick="showWhyNot()">❌ হয়নি</button>
  </div>
  <div id="why-not-section" style="display:none;margin-top:16px;">
    <p style="font-size:14px;font-weight:600;color:var(--text-primary);">কেন হয়নি?</p>
    <select id="why-dropdown" style="width:100%;padding:12px;background:var(--bg-hover);border:1px solid var(--border-subtle);border-radius:8px;color:var(--text-primary);font-size:14px;">
      <option value="">-- কারণ বাছাই করো --</option>
      <option value="no-time">সময় পাইনি</option>
      <option value="hard">কঠিন লেগেছে</option>
      <option value="forgot">ভুলে গেছি</option>
      <option value="other">অন্য</option>
    </select>
    <button class="btn btn-yellow" style="width:100%;margin-top:12px;" onclick="recoverTask()">➕ আগামীকালের প্ল্যানে যোগ করো</button>
  </div>
  <div id="checkin-result" style="display:none;text-align:center;padding:16px;"></div>
</div>
```

**Streak Logic (JS):**
- Save check-in to localStorage key: `hsc_checkin_YYYY-MM-DD`
- Track streak: `hsc_streak` integer
- Show on dashboard: "🔥 X দিন টানা" badge
- If no check-in by 9 PM, show banner on dashboard: "আজকের Check-In বাকি - ২ মিনিটে শেষ করো"

### FACILITY 2: Wrong Answer Revision Queue
**File: revision.html** - Add WRONG QUEUE section at top (before existing bookmarks):

```html
<!-- NEW: Wrong Answer Revision Queue -->
<div class="rev-card" id="wrongQueueSection">
  <div class="rev-card-title">🔄 ভুল উত্তর - আবার চেষ্টা করো</div>
  <div class="rev-stats">
    <div class="rev-stat">বাকি রিভিশন <strong id="queuePending">০</strong></div>
    <div class="rev-stat">পারফেক্ট <strong id="queueMastered">০</strong></div>
  </div>
  <div id="wrongQueueList"></div>
  <button class="cta-btn cta-outline" style="margin-top:12px;font-size:11px;padding:6px 14px;" onclick="clearWrongDemo()">Demo - Clear</button>
</div>
```

**JS Logic:**
- When student marks question WRONG in test.html, save to `hsc_wrong_queue`:
  `{subject, chapter, question, options[], correctAnswer, attempts:0, status:'pending', lastAttempted:date}`
- Show queue items with: Question text + "আবার চেষ্টা করো" button + "পারলাম" / "আবার ভুল" buttons
- If "পারলাম" clicked 2 times consecutively → move to Mastered
- Show count on dashboard: "Revision Queue: X টি বাকি"
- Add DEMO DATA: 3 sample wrong questions for Physics/Bangla so user sees how it works

### FACILITY 3: Syllabus Coverage Grid
**New File: syllabus.html** AND update **dashboard.html** sidebar link:

Create `/syllabus.html` with grid layout:
- Rows: subjects from links.json chapters (Bangla, English, Physics, Chemistry, Biology, Math, ICT)
- Columns: chapters per subject
- Cell colors: Green (✓ done) / Yellow (◐ in-progress) / Grey (○ not started) / Red (✗ weak/from wrong queue)
- Top bar: "Syllabus Coverage: X / Y Chapters (Z%)" + progress bar
- Click cell → redirects to `chapter.html?subject=X&ch=Y`
- Data source: links.json chapters + localStorage progress + hsc_wrong_queue

Also update **dashboard.html**:
- Replace the simple 6-square syllabus grid with a summary card showing coverage % and linking to syllabus.html
- Add "Revision Queue: X টি বাকি" notification badge in topbar

### FACILITY 4: Subject-Wise Analytics
**File: scorecard.html** - Enhance Performance tab:

Add after the overall accuracy ring:
```html
<!-- NEW: Subject-wise Analytics Bars -->
<div class="sc-card">
  <div class="sc-card-title">বিষয়ভিত্তিক বিশ্লেষণ</div>
  <div id="analytics-bars" style="display:flex;flex-direction:column;gap:12px;"></div>
</div>

<!-- NEW: Post-Test Feedback -->
<div class="sc-card" id="testFeedbackCard" style="display:none">
  <div class="sc-card-title">পরবর্তী পদক্ষেপ</div>
  <p id="feedbackText" style="font-size:14px;color:var(--text-primary);margin-bottom:12px;"></p>
  <a href="/revision.html" class="cta-btn cta-violet" id="fixWeakBtn">দুর্বল বিষয়ে রিভিশন দেখো →</a>
</div>

<!-- NEW: Recent Tests Trend -->
<div class="sc-card">
  <div class="sc-card-title">সাম্প্রতিক ৫টি টেস্ট</div>
  <div id="recentTestsList"></div>
</div>
```

**JS Logic:**
- Bar chart: Pure HTML/CSS horizontal bars (NO library), one per subject with accuracy %
- Save test scores to `hsc_scores = [{date, subject, score, total}]`
- Auto-detect best/weakest subject from scores + wrong queue
- After test results page (test.html), inject feedback: "তুমি Physics এ 70%, Chemistry তে 45% - Chemistry তে বেশি সময় দাও"
- Button: "Chemistry Revision Queue দেখো" → goes to revision.html filtered

### FACILITY 5: Smart Routine Generator
**File: planner.html** - Add BEFORE the daily tasks section:

```html
<!-- NEW: Smart Routine Generator -->
<div class="planner-card">
  <h3>🧠 স্মার্ট রুটিন জেনারেটর</h3>
  <p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">তোমার দুর্বলতা + সময় + পরীক্ষার তারিখ বিবেচনায় আজকের প্ল্যান বানাও</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;">
    <div>
      <label style="font-size:12px;color:var(--text-muted);">বোর্ড</label>
      <select id="gen-board" style="width:100%;padding:10px;background:var(--bg-hover);border:1px solid var(--border-subtle);border-radius:8px;color:var(--text-primary);">
        <option value="Education">মাধ্যমিক ও উচ্চ মাধ্যমিক (শিক্ষা বোর্ড)</option>
        <option value="Technical">পাটপুর technical (প্রযুক্তি বোর্ড)</option>
        <option value="Madrasah">মাধ্যমিক ও উচ্চ মাধ্যমিক (মাদ্রাসা বোর্ড)</option>
      </select>
    </div>
    <div>
      <label style="font-size:12px;color:var(--text-muted);">গ্রুপ</label>
      <select id="gen-group" style="width:100%;padding:10px;background:var(--bg-hover);border:1px solid var(--border-subtle);border-radius:8px;color:var(--text-primary);">
        <option value="science">বিজ্ঞান</option>
        <option value="commerce">ব্যবসায় শিক্ষা</option>
        <option value="arts">মানবিক</option>
      </select>
    </div>
    <div>
      <label style="font-size:12px;color:var(--text-muted);">HSC বছর</label>
      <select id="gen-year" style="width:100%;padding:10px;background:var(--bg-hover);border:1px solid var(--border-subtle);border-radius:8px;color:var(--text-primary);">
        <option value="2026">২০২৬</option>
        <option value="2027">২০২৭</option>
      </select>
    </div>
    <div>
      <label style="font-size:12px;color:var(--text-muted);">দৈনিক পড়ার সময়</label>
      <select id="gen-time" style="width:100%;padding:10px;background:var(--bg-hover);border:1px solid var(--border-subtle);border-radius:8px;color:var(--text-primary);">
        <option value="1">১ ঘণ্টা</option>
        <option value="2">২ ঘণ্টা</option>
        <option value="3" selected>৩ ঘণ্টা</option>
        <option value="4">৪+ ঘণ্টা</option>
      </select>
    </div>
    <div>
      <label style="font-size:12px;color:var(--text-muted);">দুর্বল বিষয়</label>
      <select id="gen-weak" style="width:100%;padding:10px;background:var(--bg-hover);border:1px solid var(--border-subtle);border-radius:8px;color:var(--text-primary);">
        <option value="physics">পদার্থবিজ্ঞান</option>
        <option value="chemistry">রসায়ন</option>
        <option value="biology">জীববিজ্ঞান</option>
        <option value="math">গণিত</option>
        <option value="bangla">বাংলা</option>
        <option value="english">ইংরেজি</option>
      </select>
    </div>
  </div>
  <button class="btn btn-yellow" style="width:100%;margin-top:16px;" onclick="generateSmartRoutine()">🧠 স্মার্ট রুটিন বানাও</button>
  <div id="routine-result" style="display:none;margin-top:16px;"></div>
</div>
```

**JS Logic:**
- On Generate: Create Today's Plan = 3 Tasks
  - Task 1: Weak Subject (40% time) - specific chapter from links.json
  - Task 2: Strong Subject Revision (30%)
  - Task 3: MCQ Practice (30%)
  - Focus Timer: 25 min per task
- Save routine to `hsc_routine_today`
- Show on dashboard as "আজকের Smart Routine" card with checkboxes
- Pre-fill today's tasks in planner.html from `hsc_routine_today`

## STEP 3: Files to Edit/Create Summary

### EDIT These Files:
1. `planner.html` — Add Smart Routine Generator form + Evening Check-In section + JS logic
2. `dashboard.html` — Add streak badge in header, revision queue count, check-in banner at 9PM, syllabus coverage summary
3. `scorecard.html` — Add subject-wise analytics bars, post-test feedback card, recent tests list, JS logic for loading from localStorage
4. `revision.html` — Add Wrong Answer Queue section + JS logic
5. `test.html` — Add saving wrong answers to `hsc_wrong_queue` on mark-wrong, save score to `hsc_scores`

### CREATE These Files:
6. `syllabus.html` — Full syllabus coverage grid page with color-coded cells

## STEP 4: Verification Checklist
After implementing, verify:
- [ ] planner.html loads without errors, shows Smart Routine + Evening Check-In
- [ ] dashboard.html shows streak counter and revision queue count
- [ ] scorecard.html shows analytics bars when test data exists
- [ ] revision.html shows wrong answer queue
- [ ] syllabus.html shows color-coded grid
- [ ] test.html saves wrong answers to localStorage
- [ ] No Hindi text anywhere
- [ ] No monthly pricing language
- [ ] No invented YouTube/Drive links
- [ ] Mobile responsive (sidebar toggles correctly)
- [ ] All existing pages still load (index.html, pricing.html, bundles/index.html intact)

## OUTPUT FORMAT
When done, report:
1. List of all files created/modified
2. Key code additions (brief, 1-2 lines per file)
3. Any issues encountered
