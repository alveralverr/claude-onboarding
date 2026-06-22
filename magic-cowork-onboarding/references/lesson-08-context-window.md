---
Module: 3 of 5 — Work in Cowork
Lesson: 8 of 13 — The context window
Time: ~7 min
Source: index.html — "Context Window" subsection
---

# Lesson 8 — The context window

## Learning objectives

- Understand what the context window is and that it has a fixed limit.
- Recognize what happens when it fills.
- Know how to manage it.

## Claude's working memory — and its limit

Every session holds a fixed amount of input. When it fills, older context drops off and quality degrades.

### What it is

A rolling window of everything Claude can see — your prompts, its replies, attached files, tool calls. **Fixed in size and doesn't grow mid-session.**

### When it fills

Claude loses sight of earlier instructions and context. Responses become **shorter, repetitive, or miss details** you've already given.

### How to manage it

- Start a **fresh session for each new task**.
- Don't chain unrelated work in one conversation.
- Paste a brief **summary** if context needs to carry over.

*(Teaching note: The web guide shows the context window as around 1M (or 200k) tokens depending on the model, filling turn by turn until older context is truncated. You can mention the rough scale, but the load-bearing point is the management behavior, not the exact number.)*

## Knowledge check

**Question (multiple choice):** What's the best way to manage the context window?

- A) Keep everything in one long conversation forever
- B) Start a fresh session for each new task, and paste a brief summary if context needs to carry over
- C) Switch to Haiku
- D) Turn off connectors

**Correct answer: B.** Fresh session per task, don't chain unrelated work, and carry over only a short summary when needed.

*(If wrong: re-explain that the window is fixed and fills up; once full, Claude loses earlier context and quality drops — so you reset per task and summarize forward only what's needed. Then re-ask.)*

## Reflection

Ask the trainee: *Have you ever had a chatbot "forget" something you told it earlier in a long conversation? That's the context window filling up. How will you avoid that in Cowork?* (Expected: fresh session per task.)

## What's next

Next lesson: **Skills, connectors & scheduled tasks** — the building blocks that make Cowork powerful, plus exactly what each connector can do.
