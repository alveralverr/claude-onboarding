# Pilot Feedback Form — Google Form Spec

Target: **under 3 minutes**, 9 questions, only 2 require typing (both optional).
Once built, replace the placeholder link in `index.html` line 1498 (`https://forms.gle/placeholder`).

**Form title:** Claude Cowork Pilot — Quick Feedback
**Description:** 3 minutes, mostly clicks. Your answers shape what we roll out to the next group of assistants.

Settings: collect email automatically (signed-in @getmagicea.com), one response per person, progress bar on.

---

## Section 1 · Your usage (5 questions)

**1. How often have you used Cowork since onboarding?** *(required, multiple choice)*
- Daily
- A few times a week
- Once or twice total
- Not yet → *branch: skip to Q4*

**2. What have you used it for?** *(checkboxes)*
- Email triage / drafting
- Calendar & scheduling
- Research / client briefings
- Writing docs, decks, or reports
- Data extraction (receipts, spreadsheets)
- Scheduled / recurring tasks
- Other: ___

**3. Did Cowork's output reach your client (after your review)?** *(multiple choice)*
- Yes, regularly
- Yes, once or twice
- No — output needed too much rework
- No — only used it for internal/personal tasks

**4. What's your biggest blocker?** *(required, multiple choice)*
- Rate limits
- Setup, connectors, or permissions issues
- Output quality / too generic
- Not sure what to use it for
- No time to learn it
- Nothing — it's working well

**5. What one thing would make you use Cowork more?** *(short answer, optional)*

## Section 2 · The onboarding guide (4 questions)

**6. Did you complete the guide?** *(required, multiple choice)*
- Yes, all sections
- Partly
- Barely started

**7. After finishing it, how ready did you feel to run a real task?** *(linear scale 1–5)*
1 = Not ready at all · 5 = Fully ready

**8. Which section helped you most?** *(dropdown — mirrors the site's ToC)*
- What's Different / Claude Cowork intro
- Setup (invite, app, connectors, skills)
- Using Cowork (skills, connectors, scheduled tasks)
- Prompting
- Choosing a model
- Safety
- Learning resources

**9. What was confusing, missing, or too long?** *(paragraph, optional)*

---

## Design rationale

- Two open-text fields max, both optional — every required question is one click.
- Q1 branching spares non-users seven irrelevant questions and tells you *why* via Q4.
- Q3 measures the metric that matters (client-ready output), not just activity.
- Q7 measures the guide's actual job (readiness), not enjoyment.
- Q8/Q9 map answers straight onto guide sections so revisions are targeted.
