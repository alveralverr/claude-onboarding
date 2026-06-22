---
Module: 3 of 5 — Work in Cowork
Lesson: 9 of 13 — Skills, connectors & scheduled tasks
Time: ~12 min
Source: index.html — Skills, Connectors, Capabilities reference, and Scheduled tasks subsections
Appendix: references/reference-connector-capabilities.md (full can / can't per connector)
---

# Lesson 9 — Skills, connectors & scheduled tasks

## Learning objectives

- Understand what skills and connectors are and how they work together.
- Know the three connector permission states.
- Know how to schedule recurring tasks.

## Skills — reusable task templates, ready to call

Instead of prompting from scratch every time, call a skill and Claude loads the right approach automatically. Type `/skill-name` or just describe your task in plain English — Claude recognizes when a skill applies.

We developed pre-made skills for the most common EA tasks. **Always check if a skill exists before prompting from scratch.**

| Skill | What it does | What it covers |
|---|---|---|
| **Email Management** | Inbox triage, reply drafts, follow-ups | Triage inbox, summarize threads, draft replies and follow-ups, flag urgent items, apply client tone |
| **Calendar Management** | Availability summaries, scheduling, conflict checks | Pull availability, summarize the week ahead, schedule across time zones, set recurring blocks, flag conflicts |
| **Writing** | Long-form drafts, memos, reports, structured documents | Long-form drafts, memos, briefings, and formatted documents tailored to your voice and context |
| *(More skills coming soon)* | | |

> If you don't see Magic skills in your Projects sidebar, message your AL or email the Product Team — there may be a permissions issue.

## Connectors — the apps Claude works inside directly

Connectors let Claude read data and take actions inside your tools on your behalf — no copy-pasting between apps. Once connected, they're available in every conversation.

| App | What Claude can do |
|---|---|
| **Gmail** | Read inbox, draft replies, send emails — powers Email Management |
| **Notion** | Read and write pages and databases |
| **Google Calendar** | Check availability, create events, send briefings — powers Calendar Management |
| **Google Drive** | Retrieve and manage documents |
| **Slack** | Summaries, notifications, follow-ups |

You can browse hundreds of apps and search Claude Connectors at **claude.com/connectors**.

> Skills that depend on a missing connector won't run until it's added. If a connector isn't set up yet, Claude will flag it.

## Connector capabilities & permissions

**Where to find this:** Customize › Connectors › select a connector › Tool permissions.

Each tool can be set to one of three states:

- **Always allow** — Claude runs the tool without asking.
- **Needs approval** — Claude pauses for your OK each time.
- **Blocked** — Claude can't use the tool at all.

There are **10 approved connectors** for Magic assistants, grouped by access level:

- **Read & write (7):** Gmail, Google Calendar, Google Drive, Slack, Notion, Asana, ClickUp
- **Interactive (1):** Canva
- **Read only (2):** Fathom, Microsoft 365 *(Microsoft 365 is available on Team / Enterprise plans only)*

And by category: Google Workspace (3), Productivity (4), Project Management (2), Design (1).

**For the exact list of what each connector can and can't do, read the appendix: `references/reference-connector-capabilities.md`.** Check a tool there before you ask Claude to use it.

## Scheduled tasks — work that runs on a cadence

Have Claude run work on a cadence — without you starting it. Type `/schedule` in Cowork. Claude asks a few questions — what, when, how often — and confirms before anything is created. You define it once and it handles it from there.

Sample prompts for scheduled tasks:

- "Every weekday morning at 8am, check my inbox and save a summary of unread client emails to my folder."
- "Every Friday at 4pm, pull my completed tasks for the week and create a short summary for my AL."
- "Every Monday, check my client's calendar for the week and flag any conflicts or gaps in scheduling."

## Knowledge check

**Question (multiple choice):** What's the difference between a skill and a connector?

- A) They're the same thing
- B) A skill is a reusable task template you call with `/skill-name`; a connector wires Claude into an app (like Gmail or Slack) so it can read data and take action there
- C) A connector is a template; a skill is an app
- D) Neither exists in Cowork

**Correct answer: B.** Skills are reusable task templates (called with `/skill-name` or auto-detected); connectors are the app integrations that give Claude access to your tools. Skills often rely on connectors — e.g., Email Management is powered by the Gmail connector.

*(If wrong: re-explain — skill = the "how" (a ready-made approach), connector = the "where" (access to an app). A skill that depends on a missing connector won't run until it's added. Then re-ask.)*

**Question (multiple choice):** A connector tool set to "Needs approval" means:

- A) Claude can never use it
- B) Claude pauses for your OK each time before using it
- C) Claude uses it silently every time
- D) The connector is broken

**Correct answer: B.** "Needs approval" pauses for your OK each time; "Always allow" runs without asking; "Blocked" means Claude can't use it at all.

## Reflection

Ask the trainee: *Name one recurring task you'd schedule with `/schedule`, and how often it should run.* If they earlier described a recurring task with a consistent format, point out it could become a scheduled task or even a skill candidate.

## What's next

Next lesson: **Prompting for Cowork** — the single most important habit for getting great results.
