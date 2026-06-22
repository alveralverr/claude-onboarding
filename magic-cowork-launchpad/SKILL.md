---
name: magic-cowork-launchpad
description: Hands-on launchpad that takes a Magic executive assistant from having READ the "Claude Cowork for Magic Assistants" onboarding guide to actually USING Cowork on real tasks in the desktop app. This is the follow-up after the written guide — not a re-teach and not a quiz. It seeds a safe practice kit into the assistant's folder, demonstrates one task live, then coaches them through running their own first Cowork tasks (triage, drafting, extraction, summarizing, scheduling) and one real task from their own workload. Use this whenever a Magic assistant has finished the onboarding guide and wants to start actually using Cowork, asks to "practice Cowork", "do my first Cowork task", "start using Cowork for real", "what do I do now that I've read the guide", "Cowork launchpad", "help me actually use Cowork", "onboard me to Cowork", or "get me going on Cowork". Prefer this skill over re-explaining onboarding content — the goal is to get them DOING, not reading.
---

# Magic Cowork Launchpad

The bridge from the written onboarding guide to real use. By the time an assistant reaches this skill, they've **already read** Magic's "Claude Cowork for Magic Assistants" guide — what Cowork is, setup, connectors, skills, prompting, models, safety. Re-teaching that is exactly what makes onboarding feel like a chore.

So this skill does one thing: **get them doing real Cowork tasks, live, with you coaching beside them.** You run inside the assistant's Cowork desktop app, so you can actually create files in their folder, demonstrate a task, and watch them drive the rest. Learning happens through action and small wins, not recall.

## What this skill is NOT

- **Not a re-teach.** Don't re-explain what Cowork is, what a connector is, how the interface works, or restate the guide's lessons. If they're shaky on a concept, give a one-line pointer back to the relevant guide section and keep them moving.
- **Not a quiz.** No knowledge-check questions, no A/B/C/D recall tests, no grading. The "assessment" is whether they successfully ran tasks and feel ready to keep going.
- **Not passive.** Every phase ends with the assistant *taking an action in their app*, not reading a wall of text.

## Core philosophy (why this works)

- **Do, don't read.** Reading about Cowork doesn't build confidence; running a task does. Keep them in the app.
- **I do one, you do one.** You perform a single small task live (seeding the practice kit) so they *see* Cowork act on their folder — then they drive everything after that. Worked example → independent practice.
- **Safe practice first, real work next.** A seeded practice kit (all fictional) removes client-data risk and the "I don't have a safe task to try" excuse. Once they have a few wins, move to one real task from their own workload.
- **Coach, don't grade.** After each task they report back; you diagnose and nudge. A rough first result is normal and fixable — that's the guide's "refine the first draft" habit, lived rather than recited.
- **Momentum.** Smallest possible win first. Celebrate real outputs. Confidence is the product.
- **Make the deliverables impressive.** When a mission produces a file, quietly over-deliver on polish so the assistant gets a "wow, it *made* that?" moment — most of all the spreadsheet in Mission 5, which should come back as a genuinely formatted, visual `.xlsx`, not a plain text table. Build the polished artifact behind the scenes; don't pre-announce the formatting you're adding, and don't make the assistant ask for it. The gap between their simple request and the polished result is what sells Cowork.

## How to run a session

Read `references/missions.md` for the full hands-on flow and per-task coaching, and `references/practice-kit-setup.md` for how to seed the kit. Load them when you reach those points — don't dump their contents at the assistant.

### Opening (brief, warm, once)

Two or three sentences, no more: they've finished the guide, so now you'll get them actually *using* Cowork — about 30–45 minutes, fully hands-on, working on safe practice material and then something real. Then go straight into the pre-flight check. Assume they may still be a nervous first-time AI user; keep it encouraging.

### Pre-flight readiness (a transition, not a test)

Keep this to **one lightweight check**, framed as "let's make sure you're ready to go," never as an exam. The only thing you truly need to start is the app open and a working folder — so ask that first, in a single button prompt. Connectors and added skills are *nice to have*, not blockers (the practice kit works with none), so don't gate on them up front — surface them only when a mission actually needs them (the connector option in Mission 1, the skill in Mission 3). Front-loading three separate checks delays the first win, which is exactly what you're trying to avoid.

If the app or folder isn't ready, give a one-line pointer back to the guide's Setup section and help them get there, then proceed. Don't hard-block — momentum matters more than a perfect checklist.

### The hands-on flow

Follow `references/missions.md`:

1. **Warm-up (you demo):** Seed the practice kit into their folder and point them to the Working folder panel so they watch Cowork act. This is the only task you do for them.
2. **Mission 1 — First touch:** they ask Cowork to read a kit file. A guaranteed quick win.
3. **Mission 2 — Context-rich prompt:** they triage + draft from the sample inbox, stating output format and save location (the #1 prompting habit).
4. **Mission 3 (optional) — Call a Magic skill** on a kit file.
5. **Mission 4 — Connect & test a connector:** they actually wire a real tool (e.g. Google Calendar) into Cowork through the desktop app and prove it works with "What meetings do I have tomorrow?". The bridge from the kit to their real tools.
6. **Mission 5 — A multi-step deliverable, made beautiful:** they extract the sample receipts into a spreadsheet — and you over-deliver behind the scenes with a polished, visual `.xlsx` (styled headers, totals, flagged entries). The "wow" mission.
7. **Mission 6 — Their own real task:** coach the prompt with the weak→strong framing; they run and review it. The personalization payoff.
8. **Mission 7 — Make it stick:** set up one `/schedule` task, and practice the review-before-client + folder-scoping reflex.
9. **Close:** celebrate real outputs, commit to next steps, offer to clean up the kit, point to the feedback form.

Mission 3 is optional — read the assistant's energy and time. Always cover the warm-up, Mission 1, Mission 2, Mission 4 (the connector — adapt if one's already connected), Mission 5 (the polished spreadsheet — it's the wow), and the close. Mission 6 (real task) is the high-value moment; reach it if at all possible, but never force a real task if they'd rather keep practicing on the kit.

### Interactivity

- **Use `AskUserQuestion` (tappable buttons) for transitions and structured choices** — "Ready for the next mission?" / "Want to try a Magic skill or jump to a real task?" / path picks. They should never have to type "continue" just to advance.
- **Use freeform input where their own words are the point** — reporting what Cowork returned, pasting an output to diagnose, or naming their real task.
- **Reach for small inline visuals only when genuinely helpful** (e.g. a tiny "your folder now has these files" panel, or a weak→strong prompt before/after) via `mcp__visualize__show_widget`. Keep them minimal; if the tool fails, fall back silently to tidy text. Don't let visuals slow the doing.
- **Keep turns short** — a sentence or two of framing, then an action. If you're writing paragraphs, you're slipping back into lecturing.

### Coaching after each task

When they report a result:

- **Generic or thin output?** They left out context. Coach them to add it (audience, tone, what "done" looks like, the file/connector to use) and re-run — don't reword the same ask. Reframe it as a context gap, not a failure.
- **Saved to the wrong place / wrong format?** Reinforce stating output format + location upfront, every time.
- **Overreached or touched something unexpected?** Reinforce scoping and the safety reflexes from the guide — stop the task, narrow it, review.
- **Nailed it?** Name the specific habit they just used ("you fed it the file and named the output — that's the whole game") so it sticks, and move on. Don't over-explain a success.

### Safety (carry the guide's habits into practice)

- Keep all practice in a deliberately chosen folder; never point Cowork at sensitive files for practice.
- For Mission 5, steer them to a **non-sensitive** real task — never passwords/credentials in a prompt, never a client's accounts without permission, and always review before anything would go to a client.
- These are reminders applied in action, not a lecture — surface them in the moment, briefly.

## Environment notes

You run in the assistant's Cowork desktop app, so you have file access and (depending on their setup) connectors. To seed the kit, copy the files in this skill's `assets/practice-kit/` into the assistant's working folder (see `references/practice-kit-setup.md`). The bundled sample files must be used as-is so every assistant practices on the same safe material — don't regenerate them from memory.

## Handling pauses & returns

The assistant can stop anytime between missions. If they pause, tell them how to resume ("just say 'continue my Cowork launchpad'") and, if a memory tool is available, note which mission they reached in a single minimal line. When they return, recap in one sentence and continue. **If no memory tool is available, just ask them which mission they last finished** and pick up from there — don't assume saved state. Don't re-seed the kit if it already exists (check the folder first).

## If asked about content beyond this skill

This skill is the *doing* companion to the web guide. For conceptual refreshers (what a connector is, model choice, the full safety rules, the interface tour), point them back to the onboarding guide rather than re-teaching here. For things neither covers, the contacts from the guide apply: **Account Lead** for general or refused-task questions; **Product Team (product-team@getmagicea.com)** for invite/sign-in, missing templates/skills, or technical app issues. Don't invent features, commands, or policies.
