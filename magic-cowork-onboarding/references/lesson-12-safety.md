---
Module: 4 of 5 — Prompt, choose, and stay safe
Lesson: 12 of 13 — Using Cowork safely
Time: ~10 min
Source: index.html — "Use Claude Cowork safely" section (risks, Responsible Use, Magic-specific guidelines, your responsibility)
---

# Lesson 12 — Using Cowork safely

**Read this before any client work.**

Cowork works on your computer with access to your files, browser, connected services, and apps. That capability comes with risks worth understanding.

## To minimize risks

- Avoid granting access to local files with **sensitive information**, like financial documents and passwords.
- Be especially cautious with computer use — Claude makes changes on your computer directly and bypasses **permission checks** when you allow it to.
- Cowork may have direct access to Claude in Chrome. We strongly advise being extremely careful with anything that takes control of your screen. Avoid automating risky and irreversible actions such as **logins, payments, or deletions** that require human oversight.

## Responsible use — Anthropic's safety measures + what to watch for

1. **Be selective about file access.** Claude can read, write, and delete any files it has access to. Avoid pointing it at sensitive documents — use a dedicated working folder instead, and keep backups of anything important.
2. **Monitor tasks, not just commands.** Watch out for unexpected patterns rather than validating every command — is Claude accessing files or sites you didn't mention? Is scope creeping beyond what you asked for? If something feels off, stop the task immediately.
3. **Be cautious with scheduled tasks.** Scheduled tasks run without you watching. Start with low-risk tasks, avoid scheduling anything involving messages, purchases, or hard-to-undo actions, and review results regularly.
4. **Be cautious with computer use.** Avoid anything that interacts directly with your screen, apps, and browser.
5. **Avoid unfamiliar third-party plugins or skills.** Stick to Anthropic verified connectors from the Desktop directory and review permissions during installation.
6. **Be careful using Claude as an add-in to official apps.** Claude can share data across apps (Excel, PowerPoint) without you explicitly directing it. Avoid working with sensitive information while Cowork is active.

> **Important.** While Anthropic enacted measures to reduce risk, you are still responsible for your own use of Claude. Always exercise caution when using Cowork. Report any suspicious behaviour or critical issues to **product-team@getmagicea.com**.

## Magic-specific guidelines

- ✕ **Never paste passwords, API keys, or credentials** into a Cowork prompt. Don't ask it to access private data or scrape personal information, especially your client's.
- ✕ **Never connect a client's email, calendar, or cloud storage** without their explicit approval.
- ✕ **Never impersonate someone.** Instead, ask: "based on their communication style, how would they respond?"
- ✕ **Don't modify security settings directly.** Claude will refuse.
- ✕ **Don't use Claude for clients whose confidentiality clauses cover AI tools.** Ask your AL first.
- ⚠ **Aerospace, defense, or government clients** — Don't connect any client accounts — personal productivity only.
- ✓ **Always review everything** before it goes to a client. Your sign-off is the last check.

## Your responsibility

You remain responsible for all actions Claude takes on your behalf:

- Content published or messages sent.
- Purchases or financial transactions.
- Data accessed or modified.
- Actions taken by scheduled tasks running on your behalf.
- Actions taken through computer use on your desktop and apps.
- Respecting third-party terms of service, including restrictions on automated access.

> Not sure if something is allowed? Ask your Account Lead. They'll check with the Product Team if they don't know.

## Knowledge check

**Question (multiple choice):** Which of these is a Magic-specific safety rule?

- A) Always use Haiku for client work
- B) Never connect a client's email, calendar, or cloud storage without their explicit approval
- C) Always schedule payment tasks
- D) Paste credentials so Claude can log in for you

**Correct answer: B.** Never connect a client's accounts without explicit approval — alongside never pasting credentials, never impersonating, and always reviewing everything before it goes to a client.

*(If wrong: re-explain the guidelines — no credentials in prompts, no client accounts without approval, no impersonation, don't touch security settings, check confidentiality clauses with your AL, extra caution for aerospace/defense/government, and always review. Then re-ask.)*

**Question (scenario):** A trainee notices Claude is opening files and visiting a site they never mentioned. What should they do?

*Answer:* Monitor tasks, not just commands. If scope is creeping beyond what you asked, or Claude is touching files/sites you didn't mention, **stop the task immediately**. Then report suspicious behaviour to product-team@getmagicea.com if needed.

**Question (scenario):** A client's contract has a confidentiality clause that covers AI tools. Can the trainee use Claude on that client's work?

*Answer:* Don't — ask your AL first. (And remember: you remain responsible for data accessed or modified, content sent, and respecting third-party terms.)

## Reflection

Ask the trainee: *Look at your own setup — is your project folder scoped to a dedicated working folder, or pointed somewhere with sensitive files? What's one thing you'll change to be safer?*

## What's next

Final lesson: **Learning resources, certification & getting help** — where to go deeper and who to contact when something breaks.
