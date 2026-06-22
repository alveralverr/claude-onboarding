---
Module: 4 of 5 — Prompt, choose, and stay safe
Lesson: 10 of 13 — Prompting for Cowork
Time: ~14 min
Source: index.html — "Prompting for Cowork" section (#1 rule, three principles, 6 weak→strong pairs, tips, pitfalls)
---

# Lesson 10 — Prompting for Cowork

## Learning objectives

- Internalize the #1 rule: context does the heavy lifting, not perfect wording.
- Know the three things to focus on.
- Be able to turn a weak ask into a strong, context-rich one.
- Know the Cowork-specific tips and the common pitfalls.

## The big idea

Provide Claude what it needs to know and what you want **delivered**. Context does the heavy lifting. Add your Cowork files, attach screenshots, paste the email, link your Connectors data, or trigger Skills — then tell Claude what you need out of it.

## The #1 rule

**Claude is brilliant on day one. It just doesn't know your situation yet.**

It knows every language, industry, and format. What it doesn't know is your client, your task, and what a good result looks like. **Give it that context — the more relevant data you hand over, the less it has to guess.**

If the output wasn't what you wanted, that's almost always a **context problem — not a Claude problem.** Add more information instead of stressing over perfect wording.

**Polished prompt, no context (weak):**
> "Analyze our sales data and turn it into a slide deck with charts. Keep it accurate and clear."

**The context, handed over (strong):**
> "Go to my Q2 Reports folder and open regional_sales.csv. Read every row, analyze the trends, and turn the key insights into charts for the quarterly business review. Build it into a slide deck — and double-check every figure against the sheet before you finalize."

## Three things to focus on

**01 — Link and feed the raw data.** Connect your apps and folders, attach files, paste the email, share screenshots, then speak out what you need. What you hand over matters far more than how you word the ask.

**02 — Refine the first draft if needed.** Claude iterates. If the result isn't right, add more context and redirect with clearer instructions, the same way you would with a colleague who needed more of the story.

**03 — Assume it can do anything until it tells you otherwise.** Try the task — don't overthink whether it can handle it. Claude will flag it if something is out of reach, and if it needs more from you, it'll ask clarifying questions before it proceeds. Most assistants stop short of what is actually possible — the people who get the most out of it are the ones who keep asking.

## Weak ask → strong ask (6 examples)

*(Teaching note: present these as before/after. The "why" line is the lesson each one teaches. Use 2–3 of these interactively; the trainee can be asked to spot what context was added.)*

**01 · Pre-call research**
- Weak: "Research this company before my call."
- Strong: "[pastes booking email] Investor call Thursday with **Acme Corp** — Series B fintech. Pull their latest news and funding history from the web, use `/calendar-management` to check the attendees against our notes (**Meeting Insights - 2026.docx**) in the **Clients folder**, and write me a **one-page prep brief** using our **call-prep template** in that same file. Goal: open **Q4** project talks."
- Why: A pasted email plus where the rest lives — web, calendar, your notes, a template — and a clear goal. You didn't word it perfectly; you pointed Claude at everything it needed.

**02 · Follow-up email**
- Weak: "Write a follow-up email to the client about the call."
- Strong: "[screenshots the thread] They no-showed our Monday call. Use `/calendar-management` to pull two open slots from my **Google Calendar** next week, use `/email-management` to draft a warm reply offering both, and match the voice in our **email guide**. Under 5 sentences."
- Why: A screenshot of the thread, two skills, and your voice guide. Show Claude the history instead of retyping it — the reply almost writes itself.

**03 · Inbox triage**
- Weak: "Check my inbox for anything important."
- Strong: "Use `/email-management` to go through my **Gmail** from the last 24 hours. Flag only client emails or anything urgent, cross-check each sender against the **active-accounts list** in our team **Google Drive**, and summarize each in one line with what it needs and the account it ties to. **Save them all into one Word doc** in **/active accounts/2026-06/week 1**."
- Why: A connector, a cross-check file, and an exact output format and location. The scope — "last 24 hours", "client or urgent" — keeps it focused.

**04 · Recurring task**
- Weak: "Summarize this weekly."
- Strong: "**Every Monday before 8am Pacific**, open the latest **Fathom transcript** of the **Marketing Team Sync** from my inbox. Pull every action item with its owner and due date into a table, add them to our team **Notion**, then notify the team in `#core-marketing`. Save the summary as a spreadsheet in the **Core Team Archives** folder for client **John Doe**."
- Why: Even a hands-off recurring task only works because you named the exact source, destination, and people. Set the context once and Claude runs it every week without you.

**05 · Client proposal**
- Weak: "Write a proposal for this client."
- Strong: "Use the **proposal template** in our **Google Drive** and the pricing in our **Sales Playbook** (sales folder). Draft one for **Acme Corp** from the discovery notes in their client sub-folder and the draft presentation they sent [attached]. Run it through `/writing` so it sounds human and on-brand, then export a clean **PDF**."
- Why: A template, your pricing, the discovery notes, and their attached deck — plus the format you want out. Your files do the heavy lifting; /writing keeps it sounding human.

**06 · Too generic? (reprompt with context)**
- Situation: The output exists — it just needs more to go on.
- Reprompt: "That's too generic. This is for a **healthcare client** preparing a board update — lead with the compliance risks from our **Q2 deck**, frame them against the targets in our **KPI sheet**, and keep it to the three slides that matter."
- Why: Audience, two source files, and a sharper frame. You didn't rephrase the original ask — you added what Claude couldn't see.

## Cowork-specific tips

- State the **output format** upfront — "save as a .md file", "create a table", "write bullet points".
- State the **output location** — "save to my Magic Work folder in Google Drive".
- For tasks touching your **inbox or calendar**, define the scope — "only emails from the last 48 hours" or "just the three meetings on Thursday".
- Claude makes changes in real-time. **Don't interrupt mid-step** unless it is clearly going wrong. Wait for Claude to surface a result, then redirect.
- You don't need polished prompts. A voice-to-text input, Taglish, abbreviations, or text with typos — if Claude has the context, it figures out the rest. **Worry less about how you phrase it and more about whether Claude has what it needs.**
- **Switch to a new chat when switching topics.** Long conversations where you've jumped between subjects can confuse Claude — it has to read all of that history first. Finish one topic, take what you need, then start fresh.

## Things that trip people up

- Claude **can hit rate limits** — "reset at 5am" means your usage cap was reached. Switch to a simpler task or step down to Sonnet.
- If Claude **goes quiet mid-task**, it may be waiting on a permission prompt — check the task sidebar before restarting.
- **Always confirm the right project folder, file path, skills or connectors linked** before a task runs — check if Claude saves or reads from exactly where you intend.
- If Claude **goes off track**, resist the urge to reword the same ask — redirect it with the right context instead. Generic or wrong outputs almost always mean Claude couldn't see what you could.

## Knowledge check

**Question (multiple choice):** Your Cowork output came back generic and not quite right. What should you do?

- A) Reword the exact same request more politely
- B) Add the context Claude couldn't see — the audience, source files, format, and location — and redirect
- C) Give up and do it manually
- D) Switch to Haiku

**Correct answer: B.** A bad output is almost always a context problem, not a Claude problem. Don't rephrase the same ask — add what Claude couldn't see.

*(If wrong: re-explain the #1 rule — Claude is brilliant but doesn't know your situation; generic output means missing context, so you hand over more (files, audience, format, location) rather than polishing the wording. Then re-ask.)*

**Question (scenario):** A trainee is embarrassed their prompt has typos and is half in Taglish. Does that hurt the result?

*Answer:* No. You don't need polished prompts — voice-to-text, Taglish, abbreviations, or typos are fine if Claude has the context. Worry less about phrasing, more about whether Claude has what it needs.

## Reflection

Ask the trainee: *Take the weak ask "check my calendar and tell me about next week." Rewrite it strong — add the connector/skill, the scope, the output format, and where to save it.* Coach them using the tips above.

## What's next

Next lesson: **Choosing the right model** — when to use Opus, Sonnet, and Haiku.
