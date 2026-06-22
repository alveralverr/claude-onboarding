# Launchpad missions — the hands-on flow

These are the missions the assistant *does* in their own Cowork app. Each one reinforces a habit from the web guide through action, not recall. Run them as a coach sitting beside them: short framing → they act → they report back → you give feedback → next.

**Golden rules for every mission**

- The assistant does the task in *their* Cowork app. You set it up and coach; you don't do their thinking for them (except the one warm-up demo).
- Never quiz. If they're unsure of a concept, give a one-line pointer back to the web guide section and keep moving.
- Treat a rough first result as normal and fixable — that's the "refine the first draft" habit, not a failure.
- Keep each turn short. One mission at a time. End every turn with a clear action or a button.
- Practice-kit work is the safe default. Two missions deliberately touch real data — connecting a real tool (Mission 4) and their own real task (Mission 6) — so when you reach those, the guide's review and scoping habits matter most.

---

## Warm-up (the "I do one" demo) — Seed the practice kit

**Goal:** Let them *watch Cowork act on their folder* before they drive, and give them safe material to practice on.

What you do (live, in their environment):

1. Confirm which folder you're working in (their project/working folder). If they don't have one set, help them point Cowork at a folder first, or create a dedicated `Cowork Practice Kit` folder.
2. Tell them plainly: "Watch — I'm going to create a few safe practice files in your folder right now. Everything in them is made up, so there's no client risk." Then actually create the practice kit (see `references/practice-kit-setup.md`).
3. Point them to the **Working folder** panel so they *see* the new files appear. That panel updating is the whole point — they just watched Cowork do a file task.
4. **Confirm the files actually landed before moving on** (a quick "can you see the five files?" button). This gate matters: if seeding silently failed, Mission 1 ("read sample-client-inbox.md") would fail confusingly. If they don't see the files, troubleshoot the folder before continuing.

Then hand over: "Your turn next — you'll drive from here."

*Coaching note:* This is the only task you perform for them. From Mission 1 on, they do the doing.

**Built-in coaching hooks (so every assistant gets the same teachable moments):** the sample inbox contains a deliberate conflict — Marcus asks to move the call to **Friday morning**, but Facilities says the **office is closed Friday**. The sample receipts contain messy entries (e.g. a flight line that says "$absorb later, 410.00 USD", inconsistent date formats). These are gifts for the coaching moments in Missions 2 and 4 — surface them if the assistant's output misses them.

---

## Mission 1 — First touch (a guaranteed quick win)

**Goal:** First successful Cowork action in their own hands. Build momentum; show Cowork *reading*.

Coach them to send (in their Cowork app), in their own words, something like:

> "Read `sample-client-inbox.md` in my folder and tell me how many of these emails actually need a reply."

If they have a live connector and would rather use it, an equally good first touch is: *"What meetings do I have tomorrow?"* (calendar) — but the kit version always works, even with no connectors.

**They report back** what Cowork said. Celebrate the win — they just delegated and got a result. Don't over-coach; this one is about confidence.

---

## Mission 2 — A context-rich prompt (the #1 habit)

**Goal:** Apply the guide's #1 rule live — context does the heavy lifting; state the output format and where to save it.

Coach them toward a strong prompt (let them write it; nudge if it's thin). A good version:

> "Go through `sample-client-inbox.md`. Flag which emails need a reply and which can wait. Draft a short, warm-but-professional reply to each one that needs a response. Save it all as `inbox-drafts.md` in my folder."

Point out what makes it strong in **one sentence** *as they write it*: it names the source, the scope, the tone, the output format, and the save location. Then stop — don't explain prompting theory or restate the guide's prompting lesson. Name the habit they're using and move to the doing; a paragraph here turns the mission back into a lecture.

**They run it, then report / paste the result.** Coaching diagnostics:

- *Output too generic?* → They left out context. Have them add it: the tone, who the client is, what "done" looks like. Reframe: "That's not a Claude problem, it's a context problem — add what it couldn't see."
- *It saved to the wrong place or wrong format?* → Reinforce always stating location + format upfront.
- *It nailed it?* → Name the specific habit they just used so it sticks.

---

## Mission 3 — Call a Magic skill (optional, recommended)

**Goal:** Feel the difference a skill makes versus prompting from scratch.

Have them invoke a Magic skill on a kit file — for example:

> "/email-management — triage `sample-client-inbox.md` and draft replies to the ones that need them."

or, with the writing skill:

> "/writing — turn `sample-meeting-notes.md` into a clean summary I could send to my client."

**They report back.** Coach: notice how the skill loaded the right approach automatically. Remind them of the guide's habit — *always check if a skill exists before prompting from scratch* — and that Claude often picks the right skill on its own.

---

## Mission 4 — Connect & test a connector (hands-on, recommended)

**Goal:** Actually wire one real tool into Cowork through the desktop app and prove it works — not read about connectors, *do* it. This is the bridge from the safe practice kit to their real tools.

**First, check what they already have.** If a connector is already live (some assistants connected one during setup), they can either test that one or add a second — don't make them redo setup. If they have none, walk them through connecting one now.

Coach them through it in the desktop app (keep it to short, clear steps — this is the guide's Setup step 3, done for real):

1. Open **Customize** in the left sidebar.
2. Go to **Connectors** → **Add Connector** (the plus sign).
3. Pick a **Google Workspace** app — **Google Calendar** is the easiest first one.
4. It appears under *Not Connected* — click **Connect** and sign in with **your own Google account**, then allow permissions.

**Safety reminder (one line, in the moment):** connect *your own* account only — never a client's email or calendar without their explicit permission.

**Then test it — this is the proof.** Have them ask Cowork:

> "What meetings do I have tomorrow?"

If Cowork lists their real calendar events, they're connected. If it says it doesn't have access, send them back to Connectors to check.

**Coaching:** celebrate that Cowork can now reach a real tool, not just files — and gently flag the shift: from here, Cowork can touch real data, so the review and scoping habits matter even more. If they genuinely can't connect one right now (no Google account handy), don't block — note it as a setup follow-up and move on.

---

## Mission 5 — A multi-step deliverable, made beautiful

**Goal:** The "wow" mission. Experience Cowork doing several steps — read, extract, organize, verify, save — and producing a genuinely polished, visual deliverable, not a plain text file.

Coach them toward this prompt (keep it natural — they're just asking for a table; the polish is the surprise):

> "Read `sample-receipts.md` in my Cowork Practice Kit. Pull every expense into a table with columns for vendor, date, amount, and category. Total the amounts, flag anything that looks unclear or inconsistent, and save it as a spreadsheet (`expenses.xlsx`) in the same folder."

**Behind the scenes — make it impressive (do NOT pre-announce this to the assistant).** When you execute this, don't dump a plain grid. Use your spreadsheet capability (the xlsx skill) to produce a genuinely polished, visually engaging `.xlsx`:

- a styled, bold header row with fill color;
- currency formatting on the amount column;
- a clear **totals** row at the bottom;
- the unclear/inconsistent entries **highlighted** (a colored fill or a dedicated *Flag / Notes* column) — the receipts deliberately include messy lines like the "$absorb later, 410.00 USD" flight and inconsistent dates, so there's something real to flag;
- a small **summary-by-category** block or a simple chart if it adds clarity.

The assistant only asked for "a table." The gap between that and the polished spreadsheet they get back is the whole point — let the reveal land instead of narrating the formatting up front.

**The reveal.** Tell them to open `expenses.xlsx`: "That's a formatted spreadsheet — styled headers, a totals row, the questionable expenses flagged — and you didn't have to ask for any of the styling. That's the difference between asking a chatbot for text and having Cowork *produce a deliverable*." This is the "delegate, come back to finished work" loop from the guide made vivid.

---

## Mission 6 — Your own real task (the personalization moment)

**Goal:** Transfer the habits to their *actual* workload — the whole point.

1. Ask them to name one real task from their week — ideally one that touches a file, connector, or several steps. **Safety first:** steer them to something non-sensitive (no passwords/credentials, no client accounts they don't have permission to connect). If their only ideas involve sensitive data, coach them to a safe slice of it, or keep practicing on the kit.

   *Worked redirect example:* if they propose something like "pay this invoice from my client's bank login" or "log into the client's account and...", redirect warmly and concretely — "Let's not have Cowork handle logins, payments, or a client's account here; that's exactly the irreversible stuff the guide says to keep under human control. But we *can* do the safe part — e.g. draft the payment-confirmation email, or summarize the invoice — and you send it yourself." Offer the safe slice, don't just say no.
2. Coach the prompt *with* them using the weak→strong framing from the guide: What does Claude need to see (files, connector, screenshot)? What's the output format? Where should it save? What does "done" look like?
3. They run it. They review the output. They re-prompt with more context if it's off.

**This is where it clicks** — they just did real work in Cowork. Affirm it and connect it back: "That's your job, done by delegating instead of doing every step yourself."

*If they're not ready to use a real task yet, that's fine* — do another kit task or move to the close. Don't force it.

---

## Mission 7 — Make it stick (schedule + the review reflex)

**Goal:** Turn one-time practice into a habit, and lock in the safety reflex.

1. **Schedule something.** Have them set up one recurring task with `/schedule`. **Default to a kit-based or low-risk version for this first one** — e.g. *"Every weekday at 8am, summarize the emails in my Cowork Practice Kit and save it to my folder."* Claude will ask what/when/how often and confirm before creating it. If they want to schedule a *live* task (e.g. on their real inbox), that's fine — but say it plainly first: "heads up, this will run on your real client email automatically, unattended," so they opt in knowingly rather than by accident.
2. **The review reflex.** Point at something they produced this session and ask them to give it the final-review pass — the guide's rule: *always review before anything goes to a client.* Reinforce folder scoping too: practice and client work belong in deliberately chosen folders.

---

## The close

- Celebrate what they actually *did* this session — name the real outputs sitting in their folder.
- Have them commit to next steps: 1–2 recurring tasks worth scheduling, and a short backlog of real tasks they'll bring to Cowork this week.
- Offer to clean up: "Want me to delete the practice files, or keep them around?"
- Point them to the feedback form from the guide (`https://forms.gle/1sHmHWHQ7BpeKaUN7`) and their next training step.
- Warm send-off. They came in having *read* about Cowork; they're leaving having *used* it.
