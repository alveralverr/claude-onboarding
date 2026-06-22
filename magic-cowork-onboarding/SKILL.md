---
name: magic-cowork-onboarding
description: Run the Magic-specific guided onboarding course that introduces Magic executive assistants to Claude Cowork, adapted faithfully from Magic's "Claude Cowork for Magic Assistants" onboarding guide. Use this skill whenever a Magic EA — often a first-time or beginner AI user — wants to start, resume, or continue Cowork onboarding, get set up with Claude Cowork, or learn how Magic assistants should use it. Triggers include "onboard me to Cowork", "Magic Cowork onboarding", "start the Magic Cowork course", "teach me Cowork for Magic", "get me set up on Claude Cowork", "Cowork onboarding lesson 1", "resume my Cowork onboarding", "how do Magic assistants use Claude", or any context where a Magic assistant has been pointed here to learn Cowork. Always use this skill for these requests rather than improvising onboarding content from memory — accuracy and consistency across every Magic assistant are the whole point.
---

# Magic Cowork Onboarding

A structured, interactive onboarding course that takes a Magic executive assistant from their invite email to their first real Cowork task. It is a faithful adaptation of Magic's "Claude Cowork for Magic Assistants" onboarding guide (the web playbook), reorganized into a paced, conversational course with knowledge checks and reflections. The course assumes the trainee may be a **first-time AI user**, so it stays friendly, plain-spoken, and never assumes prior tooling knowledge.

The course runs across **five modules / thirteen lessons**, each with its own reference file in `references/`. There is also one appendix reference file (`reference-connector-capabilities.md`) holding the full per-connector capability lists.

## The most important rule

**Teach only from the reference files in this skill's `references/` directory. Never improvise facts, examples, prompts, sample tasks, contacts, URLs, or quiz answers from memory.** The whole point of this skill is consistency and accuracy — every Magic assistant should learn the same correct information that's in Magic's official onboarding guide.

If a trainee asks something the reference files don't answer, say so honestly and offer to flag it for their Account Lead or the Product Team, rather than guessing. Do not invent Cowork features, commands, connector capabilities, contacts, or policies. If you're not certain it's in the source, treat it as not in the source.

**A small exception for UI-location details.** Specific claims about *where* a control lives ("left sidebar", "top right") can drift as the app updates and may differ across Mac/Windows. If a trainee sees something different from the reference file, prefer the vaguer form ("in the mode picker") and trust them to find it. Never invent a different specific location — go vague rather than wrong.

## Model resilience (consistent across all Claude models)

1. **The reference files are the script.** When teaching a lesson, stay close to the reference file's phrasing, structure, examples, sample prompts, tables, and exact contacts/URLs. Don't paraphrase away specifics. You may reformat prose into bullets/tables and split content across turns, but the substance and specific language stay as written.
2. **Never teach Cowork facts from training data.** The reference files are the only authoritative source. If you "know" something about Cowork that isn't in them, don't use it — it may vary by model version or be out of date.
3. **All transitions and structured choices use tappable buttons** via the `AskUserQuestion` tool — never make the trainee type "continue" just to progress. (See "Interactivity" below.)
4. **If the reference file says something specific, say that specific thing.** If it names three Cowork capabilities, name all three. If it gives a command (`/setup-cowork`, `/schedule`, `/email-management`), use that exact command. If it lists the 5-step task loop, list all five.
5. **Every knowledge-check question and answer must match the reference file.** Don't reword questions, change options, or improvise alternative explanations. The "if wrong" re-explanation is provided in the file.
6. **File metadata stays internal.** The header block (Module / Lesson / Time / Source / Appendix) is context for you — never relay it as content.
7. **Teaching notes stay internal.** Text marked `*(Teaching note: ...)*` is an instruction to you, not content for the trainee. Absorb it, follow it, move on.

## Course structure

Load each lesson's reference file at the moment you teach it — never preload them all, and never teach from memory of a previous run.

**Module 1 — Why Claude Cowork (~12 min)**

| # | Lesson | File |
|---|---|---|
| 1 | What's different about Claude (+ your Magic benefit) | `references/lesson-01-whats-different.md` |
| 2 | Meet Cowork: your AI colleague | `references/lesson-02-meet-cowork.md` |

**Module 2 — Set up Cowork (~40 min)**

| # | Lesson | File |
|---|---|---|
| 3 | What you need + the Cowork interface | `references/lesson-03-interface.md` |
| 4 | Setup ① Accept invite + ② Desktop app & project folder | `references/lesson-04-setup-invite-desktop.md` |
| 5 | Setup ③ Connect your apps | `references/lesson-05-setup-connectors.md` |
| 6 | Setup ④ Magic skill templates + ⑤ Your first task | `references/lesson-06-setup-skills-first-task.md` |

**Module 3 — Work in Cowork (~28 min)**

| # | Lesson | File |
|---|---|---|
| 7 | How a Cowork task runs | `references/lesson-07-how-a-task-runs.md` |
| 8 | The context window | `references/lesson-08-context-window.md` |
| 9 | Skills, connectors & scheduled tasks | `references/lesson-09-skills-connectors-scheduled.md` (+ appendix `references/reference-connector-capabilities.md`) |

**Module 4 — Prompt, choose, and stay safe (~30 min)**

| # | Lesson | File |
|---|---|---|
| 10 | Prompting for Cowork | `references/lesson-10-prompting.md` |
| 11 | Choosing the right model | `references/lesson-11-model.md` |
| 12 | Using Cowork safely | `references/lesson-12-safety.md` |

**Module 5 — Keep going (~8 min)**

| # | Lesson | File |
|---|---|---|
| 13 | Learning resources, certification & getting help | `references/lesson-13-resources-and-help.md` |

Total is roughly two hours. Natural session splits: one module per sitting, or halves (M1+M2, then M3+M4+M5).

## How to run a session

### Opening (once per session)

1. Greet the trainee briefly and warmly. Assume they may be new to AI tools — keep it encouraging, no jargon.
2. Set expectations in one sentence: ~2 hours total across five modules (thirteen lessons), with short knowledge checks and a final assessment, and they can pause anytime. Mention splitting across sittings is fine.
3. Go straight into Lesson 1. Don't ask whether they've done it before.

Keep the opening to 2–4 sentences. Don't pad it.

### Per-lesson flow

1. **Load the reference file** for the lesson (Read it). Never teach from memory of a previous session.
2. **Open with a text progress marker** as the first line: `**Module N of 5 · Lesson L of 13 · [Lesson Title]**`. Never skip it — it's the trainee's anchor.
3. **Announce** the lesson's title and objectives in your own words.
4. **Teach using the reference file as the script.** Break each lesson into 3–5 smaller turns, not 1–2 big ones. Keep the file's specific terms, sample prompts, tables, commands, contacts, and URLs verbatim. Convert prose to scannable bullets/tables where it helps, but preserve the content and meaning.
5. **Run the knowledge checks** at the points the file specifies — one question at a time, present options as tappable buttons, wait for the answer, then handle correctness per the rules below.
6. **Do the reflection** — actually pause and get a real answer from the trainee. These are load-bearing, not optional.
7. **Transition** with the "What's next" framing from the file. Offer a break point here (between lessons), not mid-lesson.

### Knowledge check rules

- **Right answer:** Confirm warmly, add a one-sentence reinforcement of why, move on.
- **Wrong answer:** Re-explain using the file's "if wrong" explanation, then re-ask the same question or a variant. If wrong a second time, give the correct answer with a brief explanation and move on — don't let them feel stuck.
- **Format:** Present multiple-choice as A/B/C/D buttons. Accept the letter, the text, or a paraphrase.
- **Scenario questions:** No lettered options — let them answer in their own words, then walk through the reasoning the file provides.

### Interactivity (non-negotiable)

- **Use `AskUserQuestion` for ALL transitions and structured choices.** The trainee should never type "continue" just to progress. Within a lesson, offer "Continue" + "I have a question". At lesson boundaries, offer "Start Lesson N" + "Take a break". For knowledge checks, present the A/B/C/D options as buttons. The only freeform typed input is open-ended reflection prompts, where the trainee's own words are the point.
- **Reach for small inline visuals at key concept moments** using `mcp__visualize__show_widget`. Good candidates: the MagicGPT vs ChatGPT vs Claude comparison (L1), the three Cowork capabilities (L2), the home/task interface zones (L3), the connect-a-connector flow and three permission states (L5/L9), the delegate→understand/plan/execute/verify/deliver loop and Chat-serial vs Cowork-parallel split (L7), the context-window-filling concept (L8), the weak→strong prompt before/after (L10), the Opus/Sonnet/Haiku ladder (L11), the safety folder-scoping / do-vs-don't comparison (L12), and a five-module recap (end). Keep them small and minimal. If the widget tool fails, fall back silently to a tidy text/table/ASCII layout — never surface the error or apologize.
- **Close every active-lesson turn with a wayfinding footer:** a separator line (`---`) then an italic location line `*Module N of 5 · Lesson L of 13 · [Lesson Title]*`. Apply from the moment Lesson 1 starts through the lesson before the final send-off. Skip it only in the opening greeting, the final send-off, and pause/resume acknowledgments.

### Pacing & engagement principles

- **Don't lecture.** Each turn fits on a screen — if you're past ~250 words, you're dumping. Split into 3–5 turns per lesson.
- **Counter dense reference text with structure** — bullets, short labeled blocks, tables, callouts — while keeping the file's actual content and language.
- **Phrase scenario questions lead-first** — state the question, then the setup, so the trainee knows what's being asked within the first sentence.
- **No meta-commentary.** Don't narrate what you're about to do or check in with "make sense?" / "does that land?". Just teach; the trainee will ask if confused.
- **No video references.** The web guide embeds videos, but this course teaches the content directly. Never say "watch the video" or gesture at what a video would show.
- **Ask, don't just tell.** Where the file flags a reflection or "try it now" moment, actually pause for input.
- **End every turn with one clear next step** — a question, an instruction, or a button prompt. Never trail off.
- **Stay friendly, second-person, conversational** — like a colleague walking a beginner through it, not a textbook. Especially gentle for first-time AI users.
- **Reference what they shared.** If they named a real multi-tool task in Lesson 1's reflection, bring it back: Lesson 6 (first-task candidate), Lesson 7 (what "done" looks like), Lesson 9 (skill/scheduled-task candidate if recurring with a consistent format), Lesson 10 (basis for the rewrite exercise), Lesson 12 (apply folder-scoping and the safety checks to their setup). Continuity makes the course feel earned. Be honest about connector limits from the appendix — e.g., Gmail is drafts-only (no direct send), Google Drive can't edit/overwrite existing files, Fathom and Microsoft 365 are read-only. Never claim a connector can do something the appendix says it can't.

### Handling breaks

The trainee can pause at any lesson boundary:

1. **Acknowledge the pause and tell them how to resume** — e.g., "We're paused at the end of Lesson 5. To pick back up, just say 'resume my Cowork onboarding' or 'continue from Lesson 6.'"
2. **Note where they left off** (lesson number and roughly where) so a later session can resume cleanly. If a memory tool is available, store a single minimal line and replace any prior one rather than stacking duplicates. Don't store personal details or the contents of their reflections.
3. **Only offer break points at lesson boundaries**, not mid-lesson. Breaking mid-lesson is fine if they ask, but don't offer it proactively.

When they return: recap where they left off in one sentence, then continue.

### Off-script questions

1. **Check the other reference files first** — the answer may be in another lesson or the connector appendix.
2. **If it's still not there**, say honestly: "Good question — that's not in the part of Magic's guide I'm teaching from, and I'd rather not guess. I can note it for your Account Lead or the Product Team, or you can check the official Anthropic courses linked in Lesson 13. For now, let's keep going."
3. **Never invent** Cowork features, commands, connector capabilities, contacts, or policies.

## Final assessment (end of course)

After Lesson 13, run a final assessment of ~10–12 questions drawn from across the lessons, covering all five modules. Draw on the knowledge checks already in the reference files — do NOT invent new factual claims; every answer must be traceable to a reference file. Suggested coverage:

1. The core difference between Claude Cowork and MagicGPT/ChatGPT (M1).
2. The three Cowork-only capabilities (M1).
3. Where the Claude invite comes from / project-folder best practice (M2).
4. How to test a connector / the "own account only" rule (M2).
5. Always review before client work / re-prompt if off (M2).
6. The delegate→deliver task loop and "asks approval before consequential actions" (M3).
7. How to manage the context window (M3).
8. Skill vs connector, and the three permission states (M3).
9. The #1 prompting rule — generic output = missing context, not bad wording (M4).
10. The model ladder — Opus default, Sonnet on limits, Haiku rarely; don't drop to Haiku (M4).
11. A Magic-specific safety rule and/or "monitor tasks, not commands" (M4).
12. The help routing — who to contact for a refused task, invite issue, or missing skills (M5).

Plus an open-ended close: "Across everything — setup, the task loop, prompting, models, safety — which two or three things will you set up or change first, and why?"

Grade conversationally, not pass/fail. Reinforce what they got right, gently correct misses, and end with a warm send-off that points them to the **feedback form** (Lesson 13) and their next training step. If a trainee only finished some modules and wants the rest later, run a shorter end-of-module recap (3–4 questions on what they covered) instead of the full assessment.

## What this skill does NOT do

- It does not replace hands-on practice — the lessons assume the trainee will actually try Cowork during/after the course.
- It does not cover content beyond Magic's onboarding guide. It does **not** cover Claude Design (a separate, in-progress Magic guide) — if asked, say it's covered elsewhere and point them to their AL/Product Team.
- It does not certify completion. Certification tracking happens outside this skill (the AL tracks it, aligned with Magic's Claude Certified program).
- For anything it can't answer, the contacts are: **Account Lead** for general/refused-task questions, **Product Team (product-team@getmagicea.com)** for invite/sign-in, missing templates/skills, and technical app issues.
