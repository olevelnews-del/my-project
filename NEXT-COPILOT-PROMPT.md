# NEXT COPILOT PROMPT - P0 Facility Implementation

```
You are building the HSC Academic Hub platform. Implement these P0 facilities in /home/olevel/MEGA/My project/my-project/:

PROJECT CONTEXT:
- Brand: HSC Academic Hub (hsctutorbd.com)
- Pricing: ৳999 ONE-TIME per student (until HSC exam)
- Positioning: Consultant/Study System, NOT Teacher
- Tech Stack: HTML/CSS/JS, localStorage for progress, external links for tests/resources

IMPLEMENT THESE P0 FACILITIES IN ORDER:

1. DAILY CHECK-IN SYSTEM
   File: js/daily-checkin.js + update dashboard.html
   - Morning task assignment panel ("আজকের ৩টি কাজ")
   - Evening confirmation button ("আজকের পড়া শেষ")
   - localStorage key: hscDailyCheckIn
   - Store: date, tasks_completed, check_in_time, streak_count

2. WRONG ANSWER REVISION QUEUE
   File: js/revision-queue.js + update revision.html
   - Auto-capture wrong answers from test attempts
   - Display as "To Revise" card on dashboard
   - Button: "Start Revision Session"
   - localStorage key: hscRevisionQueue

3. SYLLABUS COVERAGE TRACKER
   File: js/syllabus-tracker.js + update dashboard.html
   - Visual grid showing 0/X topics per subject
   - Click to mark topic complete
   - localStorage key: hscSyllabusProgress
   - Subjects: Physics, Chemistry, Biology, Math, Accounts, Business

4. SUBJECT-WISE ANALYTICS
   File: js/analytics.js + update scorecard.html
   - Accuracy percentage per subject
   - Trend line chart (last 7 days)
   - localStorage key: hscDashboardProgress
   - Show: Total tests, Questions answered, Accuracy %, Weak topics

5. SMART ROUTINE GENERATOR
   File: js/routine-generator.js + update dashboard.html
   - Generate "Today's 3 Tasks" based on:
     * User's weak subjects (from profile)
     * Upcoming HSC exam date
     * Time available today
     * Revision queue backlog
   - localStorage key: hscDailyRoutine
   - Display on dashboard header

TECH CONSTRAINTS:
- NO external APIs or databases
- ALL data stored in localStorage
- Use vanilla JavaScript (no frameworks)
- Mobile-responsive CSS (Tailwind already loaded)
- Bengali language throughout UI
- WhatsApp number: 01616200174

DELIVERABLES:
1. Create/update these JS files with full implementation
2. Update dashboard.html to show new widgets
3. Ensure all localStorage operations work correctly
4. Test on mobile viewport (320px width minimum)

START CODING NOW.
```

---

## SUMMARY: What Are the Top 5 Facilities You MUST Copy for HSC?

1. **Daily Check-In System** - Morning tasks + evening confirmation creates accountability loop that no competitor offers in HSC space

2. **Wrong Answer Revision Queue** - Auto-captures mistakes and forces revisit until mastered (proven by PrelimsAI conversion rates)

3. **Syllabus Coverage Grid** - Visual 0/X tracker creates completion pressure and clear progress indicator (WayToIAS pattern works)

4. **Subject-Wise Analytics** - Immediate feedback after each test drives improvement behavior and justifies upgrade decision

5. **Smart Routine Generator** - Personalized daily tasks based on weakness + timeline eliminates decision paralysis for students

---

## FILES CREATED IN THIS AUDIT

| File | Path | Purpose |
|------|------|---------|
| REA-REPORT.md | /home/olevel/MEGA/My project/my-project/ | Full reverse engineering analysis of 3 sites |
| REA-HERMES-REVIEW.md | /home/olevel/MEGA/My project/my-project/ | Hermes validation and corrections |

## STATUS: COMPLETE

✅ Used Claude Code for initial analysis  
✅ Verified findings manually  
✅ Created REA-REPORT.md  
✅ Created Hermes Review with score and corrections  
✅ Provided Top 5 facilities prioritization  
✅ Provided exact Copilot prompt for P0 implementation  

**Next Action:** Copy the "NEXT COPILOT PROMPT" section above and paste it into your Copilot session to begin building the P0 facilities.

---

*Audit complete by Hermes Agent*  
*November 25, 2026*
