# Onboarding v4: "The Magic Office", a Claude simulator for Magic assistants

Status: proposal, awaiting approval. No code has changed.
Author: Claude (Fable 5.1) with Alver Remolar, 26 September 2026.
Replaces: the v3 written guide at `/` (Vite + React + shadcn). Keeps the repo, stack, deploy, progress keys, and section deep links.

---

## 1. Problem statement

Magic gives EAs a Claude Team seat and a written guide, and about a third of them stop within their first three days. Telemetry since June shows 76 EAs touched Claude, 27 of them used it on three days or fewer, and 19 of those never came back after their first week. The ones who stay are not using what we built for them: Magic's own skill templates barely register (Email Management: 6 EAs in 60 days; Calendar Management: not in the top 40), while document skills, EOD reports and self-made skills carry the real workload. Coaching notes show the failure modes that reach clients: drafts that read like unedited AI output, twenty rejected drafts in one go, a three-hour task that should have taken one, tokens pasted into prompts, and effort levels turned down to "save tokens" until the client bought ChatGPT instead.

The guide is a good reference and a weak teacher. It explains, but it never lets an EA practise on something safe before their first client task, and it gives nobody a reason to come back after setup.

## 2. What the data says (evidence for every design choice)

### 2.1 Telemetry, `agent_safe`, EAs only

| Signal (window) | Number | What it means for the design |
|---|---|---|
| Weekly active EAs, 6 Jul to 21 Sep | 22 → 51 | Adoption is growing; the tool now has to serve returning users, not only new ones |
| EAs active since 1 Jun | 76 | |
| Used on 1 day only / 2-3 days / 4-10 days | 10 / 11 / 12 | 43% are light or abandoned |
| Of the 1-3 day group, quit within 7 days of first use | 19 of 21 | The first week decides everything. The core path must be finishable in one sitting and end in a real task |
| Sustained users (11+ active days) | 43 | These are the "returning" audience for mastery missions and weekly quests |
| Cowork sessions with at most one human prompt (60 d) | 95% | Most sessions are one-shot or scheduled. EAs rarely iterate; they take the first answer |
| Tool accept rate (60 d) | 0.99 to 1.00 | Nobody rejects or redirects a plan. "Review before it ships" is not happening at the plan step |
| Sessions on claude.ai chat vs Cowork | 42 EAs / 66 EAs | A large share still works in plain chat; the merged UI (16 Sep) makes this distinction moot, the guide must follow |
| Top skills by EAs using them (60 d) | custom skills 18, writing 19, docx 15, xlsx 14, pdf 13, pptx 6, eod-sod 8, email-management 6, calendar-management 0 in top 40 | Teach what EAs actually do: documents, decks, sheets, EOD reports, writing, and making a skill of their own |
| `mcp_tool` calls (60 d) | 90,870 by 59 EAs | Connectors are the centre of real usage; WebFetch succeeds only 82% of the time |

### 2.2 What EAs type (150 random human prompts, last 30 days, themes only)

- **Tone fixes dominate the iteration loop.** "Make it sound like a human, it is too AI", "shorten it", "rephrase", "make it basic for Marc". Nobody teaches client voice up front, so it is fixed after the fact, every time.
- **EOD reports and trackers** are the daily bread: "make me an EOD report", "create an EOD, use the skill", Google Sheets tabs, Monday.com boards, billing trackers.
- **Calendar and inbox lookups** against a named client: "which of these options matches Dr. M's calendar", "look up this thread and draft a reply".
- **Confusion about where things are.** "Did you just create another Google Doc or just show it to me?", "How can I make this artifact accessible by my boss?", "What email is connected in the Drive connector?", "does Claude still work if I switch accounts?", "just to make sure I can continue later, right?"
- **Overload and limits.** "It's just that you're overwhelming me" (too many questions), "prompt too long, it started compacting, help me move to a new session".
- **Asking for things a connector cannot do.** Thunderbird not synced, "can't you use the Chrome extension, Fathom is open", attachments the Nutshell connector cannot read.
- **Slash-command misunderstanding.** `/setup-cowork` typed in front of an unrelated request.
- **Voice-to-text prompts** with "um" and "uh", which is fine and should be normalised.
- **Personal use of the seat** (coffee shops with wifi, discount tickets, room soundproofing) draining quota meant for client work.
- **Two prompts contained what look like live credentials** (a Notion integration token and a Supabase service-role key). See section 11.

### 2.3 Account Lead notes and client calls (last 120 days, mentions of Claude or Cowork)

- A client rejected all 20 Cowork-drafted emails in one review: "you're not getting exactly what I want". Root cause in the note: templates and logs were given, but the EA could not turn them into drafts the client would sign.
- A client is considering ending a placement because "summaries and reports read like unedited AI output"; the client "is not against AI, but wants it used as a tool, not a substitute for critical thinking".
- An EA turned effort levels down to conserve tokens, output quality dropped, and the client bought a ChatGPT Pro seat instead.
- A CRM report took about three hours instead of one because the connector could not read attachments and Claude fell back to the browser tool, one PDF at a time. The EA did not know when to stop and do it by hand.
- Clients keep asking Magic to train their EA on Claude (three requests in September alone), and one AL is coaching an EA to use "Instructions for Claude" for role and tone, which the guide never mentions.
- Positive patterns to reinforce: EAs who draft "multiple options based on feedback trends", who "manually refine after the AI framework", who build a supervised project that drafts for review before anything is posted.

### 2.4 What changed at Anthropic that the guide does not cover

- 16 Sep: Cowork folded into Claude. No more mode switch; Claude decides whether to chat or run a task. Manual (ask before each action) vs Automatic permission modes. Claude Docs and Claude Slides launched; Claude Design works inside conversations. Rollout: Pro and Max first, Team "to follow". Our Team seats may or may not have it yet (open question 1).
- 17 Sep: Projects redesigned with parallel threads and shared memory (beta).
- 22 Sep: Opus 5.5, "Fable 5.1 level on most work at 40% lower cost". The model section needs a rewrite.
- 23 to 25 Sep: Claude Marketplace and plugin directory. The safety section's "skip unfamiliar plugins" rule matters more now.
- Anthropic's 2026 prompting guidance: state clear intent instead of rigid steps, explain why a constraint matters, say what "done" looks like, tell Claude what to do rather than what to avoid, give one example when format matters, allow it to say it is unsure, and stop over-engineering long prompts.

## 3. Product vision

**A safe place to practise before the client sees it.** The Magic Office is an isometric office you move through. Each room is a short mission built around a real EA task type. Inside a mission you work in a simulated Claude window: pick the context, write or assemble the prompt, watch Claude plan, decide whether to approve or redirect, then review the output and fix what a client would notice. Every mission ends with one "take it live" step on real work, because the goal is adoption, not completion.

The written guide does not disappear. It becomes the reference shelf inside each room, and the Help Desk room keeps every route to a human.

### Design read

Reading this as: an interactive learning app for remote EAs on modest Windows and Mac laptops (and phones between shifts), playful but premium, in the Magic brand (violet, League Spartan, pillow cards, aurora glow), built on the existing Vite + React + shadcn stack with `motion/react` for animation and an optional WebGL hub later.

Dials: variance 6, motion 6, density 3 for the world and lobby; the simulator screens follow the Magic v6 app layer (dense, sentence case, 12px floor, no gradient word).

Principles that keep cognitive load low:

- One idea per screen, at most 40 words of instruction per step, one action per step.
- No timers, no fail states, no penalties. A wrong answer explains itself and lets you try again.
- Every mission is 5 to 8 minutes and resumable. Every step has "I know this, skip".
- Progress is always visible. Nothing is ever locked; the map suggests an order.
- Taglish, voice-to-text and typos are fine in the simulator, and the simulator says so.
- Reduced motion turns the world into a static map with the same content. Keyboard reaches every room.
- Copy has no em dashes, no emoji, no version labels, no section-number eyebrows.

## 4. The world

**Lobby (hub).** Pick your avatar (a few EA characters, no names required), see your desk, your level and the map. Returning users land here with "continue where you left off" and this week's quest.

### Core path (about 35 minutes, the thing new EAs finish in one sitting)

| Room | Replaces | What you practise | Progress key |
|---|---|---|---|
| 1. Your Desk (setup) | Setup tabs s0 to s4 | Assemble the desk: webmail, invite, desktop app, working folder, connectors, Magic skills. Each item is the existing checklist item with the same key, dressed as a desk object that appears when ticked. Merged-UI copy behind a flag. | `need-*`, `s1-*` to `s4-*` (unchanged) |
| 2. The Inbox (first real task) | First task section and the 18-label tour | The simulator: a client scenario (a small dental practice, a Monday morning inbox). Choose context chips (folder, Gmail connector, `/email-management`), assemble the prompt from blocks or type it, watch the plan, approve or redirect (one step is wrong on purpose), review the drafts, and edit the two sentences a client would call "too AI". Then take it live on your own inbox. | `s5-0` (unchanged) |
| 3. The Vault (safety) | Safety section and quiz | Scenario cards drawn from real incidents: a pasted token, a client's Gmail, an unedited summary, a scheduled task that sends messages, a confidentiality clause, Automatic mode, the client in aerospace. Pass the check to unlock the certificate. | `v2.safety` (unchanged) plus three new questions |

Finishing the core path shows the existing `certificate.html` and awards the "Client-ready" badge.

### Mastery wing (5 to 8 minutes each, for returning users; order is a suggestion)

| Room | What it teaches | Evidence |
|---|---|---|
| 4. The Studio | Claude Docs, Slides and Design inside a conversation; the docx, pptx, xlsx skills; where the file lands and how to share it with the client | Document skills are the most-used; "did you create a doc or just show it?"; "how can my boss access this artifact?" |
| 5. The Switchboard | Connectors: what each can and cannot do, which account is connected, when to stop and do it by hand, Composio for Outlook, the Chrome extension as the slow last resort | 90k connector calls; the three-hour CRM report; Thunderbird and Fathom questions |
| 6. The Clock Tower | Scheduled tasks and the EOD/SOD and morning skills; what is safe to automate; supervised project that drafts for review | eod-sod is the 2nd most used skill; AL "start supervised" advice; scheduled tasks dominate sessions |
| 7. The Writing Room | Prompting the 2026 way: intent, why, what done looks like, one example, what to do not what to avoid; "Instructions for Claude" and project instructions for client voice; edit before it ships | "make it sound human" loop; 20 rejected drafts; "unedited AI output"; AL tactic |
| 8. The Workshop | Magic skill templates, making your own skill (`/skill-creator`), plugins and the marketplace with the safety rule | Custom skills are the top activation type; marketplace launched 23 Sep |
| 9. The Engine Room | Opus 5.5 as default, when Sonnet, never Haiku for client work; effort levels; usage limits; the context window and when to start a new chat; "you're overwhelming me" (ask Claude to ask fewer questions) | Effort-level incident; "compacting" prompt; limit questions |
| 10. The Help Desk | Every route to a human (the existing `ROUTES`), feedback, the Anthropic course shelf, Claude Design page | Unchanged content, new home |

### Rewards and return loops

- **XP and levels.** Steps grant XP; five levels named for the job: New hire, Set up, Client-ready, Power user, Magic pro. Levels only add cosmetics to your desk (plant, lamp, mug, second monitor). Cheap delight, no gatekeeping.
- **Badges, twelve at most.** Desk ready, First real task, Client-ready, Editor's eye (fixed the AI sentences), Secret keeper (caught the token), Connector pro, Scheduler, Deck builder, Prompt whisperer, Skill maker, Three-week streak, Voice heard (sent feedback).
- **Weekly quest.** One per week from a data file, tied to whatever Anthropic shipped: "Build one real deck with Claude Slides", "Add Instructions for Claude for one client". Self-attested, no penalty for skipping. This is how the knowledge base stays current without a redesign.
- **Take it live.** Every mission ends with a real-work step and a self-attestation. The simulator is practice; the attestation is adoption.
- **Streaks are weekly, not daily**, and never punish. EAs work part-time shifts.
- **Leaderboard: opt-in, per cohort, phase 3 only.** Needs cloud progress. Not a launch feature.

## 5. The simulator (the part that is new)

`MockClaudeWindow` is a scripted, offline replica of the Claude desktop window: sidebar, context bar (folder, connectors, skills), the chat, the plan card with Approve and Redirect, tool-step ticks, and the output panel. It never calls a real model. Each mission ships a transcript JSON with branches: what Claude "says" for each choice, which step is the deliberate mistake, which sentences in the output are flagged as AI-sounding and what the fix looks like.

Step kinds the engine supports (all content is data, no component edits to add a mission):

- `explain`: text, optional media (WebP, GifPlay, InViewVideo, YouTube facade), optional voiceover.
- `checklist`: existing `Check` items by key.
- `choose`: a scenario with options and per-option feedback (the quiz, generalised).
- `spot`: click the problem in a mock (the token in a prompt, the wrong step in a plan, the AI sentence in a draft).
- `compose`: build a prompt from chips (context, ask, done-looks-like, format, place to save) or type freely; the engine scores presence of the four ingredients, not wording.
- `sim`: play a scripted Claude run with approve and redirect points.
- `live`: the take-it-live attestation.
- `reveal`: the reward beat (badge, XP, desk item).

## 6. Content we remove, keep, change

**Remove**
- The MagicGPT vs ChatGPT vs Claude comparison table (dated, and the AL notes show clients now compare Claude with Gemini and Codex, not MagicGPT).
- The 18-label static tour of the home screen and the task screen. The simulator is the tour.
- "Switch to Cowork in the mode picker" and `/setup-cowork` as required setup steps (behind the merged-UI flag until Team seats flip; then deleted).
- The "Chat vs Cowork" framing in the intro. Replace with "Claude decides; you choose Manual or Automatic".
- The Haiku card as a peer of Opus and Sonnet.
- The v1 docs `DEPLOY.md`, `AUDIT.md`, `REFACTOR_PLAN.md` (stale, called out in CLAUDE.md).

**Keep as-is**
- Progress key `magic-onboarding-v1` and every checkbox key; the safety flag; the certificate page; `claude-design.html`; the voiceover mp3s that still match copy; the YouTube facade, GifPlay, InViewVideo; the connector can/can't data; the help routes.
- All section ids as deep-link aliases (`#setup` lands on Your Desk, `#safety` on the Vault, `#connectors` on the Switchboard, and so on).

**Change or add**
- Setup copy and screenshots for the merged UI; Manual vs Automatic modes.
- New library content: Docs and Slides, Design in conversation, Projects with shared memory, Opus 5.5 and effort levels, Instructions for Claude, the marketplace rule, the 2026 prompting guidance, "when to stop and do it by hand".
- Safety: three new scenarios (pasted secret, unedited AI output, Automatic mode on a client account). The quiz answer keys stay in `QUIZ` with the rules rendered beside them, as CLAUDE.md requires.
- Prompting: rewrite around the four ingredients (context, ask, done, format and place), with client voice as a first-class ingredient.

## 7. Architecture

Keep: Vite, React 19, TypeScript, Tailwind v4, shadcn (Base UI, nova), Cloudflare Workers via `prepare`, `public/` assets.

Add:
- `motion` (`motion/react`) for camera moves between rooms, reveals and the plan animation. Isolated in leaf components, honours `useReducedMotion`.
- Phase 3 only: `three`, `@react-three/fiber`, `@react-three/drei`, lazy-loaded, for a true orbiting hub. Not in phase 1 (see section 9 for why).

New source layout:
```
src/
  content/
    missions/        one file per room: desk.ts, inbox.ts, vault.ts, studio.ts ...
    quests.ts        weekly quests (date-keyed)
    world.ts         rooms, positions on the map, badges, levels, desk cosmetics
    scenarios/       simulator transcripts (JSON), one per mission
  engine/
    MissionPlayer.tsx   renders steps by kind, tracks step completion
    steps/              Explain, Checklist, Choose, Spot, Compose, Sim, Live, Reveal
    MockClaudeWindow/   the simulator
  world/
    Lobby.tsx, Map.tsx (2.5D), Room.tsx, Avatar.tsx, Desk.tsx
  lib/
    progress.ts      v1 keys untouched; new `magic-onboarding-v4` namespace for xp, badges, step state, quests
    routes.ts        hash routes (#/room/desk) plus legacy alias map (#setup -> #/room/desk)
    flags.ts         MERGED_UI, CLOUD_SYNC, WORLD_3D
```

Progress model: `getStatus()` keeps returning setup, first, safety, all, so the certificate and the old percentages keep working. XP and badges derive from step state plus the legacy flags, so an EA who finished v3 opens v4 already at "Client-ready" with the right badges.

Updating content: a mission is a typed TS file; a scenario is JSON; a quest is one line. `CONTENT.md` will document the step kinds, the media conventions and the two rules from CLAUDE.md (stable keys, quiz and rules in sync). Adding a room means adding a file and one entry in `world.ts`.

Assets: isometric room scenes generated with the Gemini image tool available in this session, one consistent style prompt, exported as WebP under 200 KB each with posters; avatar and desk items as small WebP or SVG layers. Voiceovers reused where the copy survives.

Performance budget: first load under 600 KB of JS gzipped; room images lazy; LCP under 2.5 s on a slow connection; works at 375 px wide.

Accessibility: every room reachable from a plain list as well as the map; ARIA live for XP and badge announcements; visible focus; colour never the only signal; 12 px floor.

## 8. Gamification that stays measurable

Leading indicators (telemetry, `agent_safe`, and the app itself):

| Metric | Baseline (Jun to Sep) | Target 90 days after launch |
|---|---|---|
| New EAs who use Claude on 3 days or fewer | 36% of new users | 20% |
| New EAs who quit within their first week | 19 of 21 light users | halve |
| Core path finished within 7 days of invite | unknown (no sync) | 70% (needs phase 3 sync, or certificate count as proxy) |
| EAs using a Magic skill template in a month | 6 | 25 |
| Tool accept rate | 0.99 to 1.00 | 0.95 to 0.98 (a sign that plans get read) |
| Sessions with 2 or more human prompts | about 5% of Cowork sessions | 15% |
| AL or client notes mentioning "unedited AI" output | recurring | none new in the quarter |

Lagging: retention of Claude-trained assistants from Introductory Period to Charged versus pilot testers; client requests for "train my EA on Claude" answered by a link to the Office.

## 9. Options considered for the "3D" layer

| Option | Feel | Cost to build and update | Risk on EA machines | Recommendation |
|---|---|---|---|---|
| A. Full WebGL office (react-three-fiber, low-poly GLB models) | True 3D, orbit and zoom | High: models to source (CC0 packs), scene code, no image tooling for GLB here; every new room needs 3D work | Highest: GPU, memory, battery; some Windows laptops in the data are entry-level | Phase 3, behind `WORLD_3D`, after content proves itself |
| B. 2.5D isometric world: generated scenes as layers, CSS 3D transforms and `motion` camera moves, clickable hotspots | Reads as a 3D diorama; rooms zoom in and out | Low: a new room is one image and one data entry | Low: images and transforms only | **Phase 1** |
| C. Scroll-world cinematic (the `scroll-world` skill) | Film-like flythrough | Real money per scene, minutes per render, and a cinematic is the wrong shape for a place you return to | Medium | No |

Recommendation: ship B first, keep the door open for A. The simulator inside the rooms is what teaches; the hub only needs to delight and orient.

## 10. Phasing

**Phase 1, core (about three working sessions).** Content model and engine; the three core rooms with the simulator; the 2.5D lobby and map; progress migration and legacy deep links; `MERGED_UI` flag with both copy variants; certificate; `CONTENT.md`; lint, build, and the design and accessibility critiques.

**Phase 2, mastery (two to three sessions).** Six mastery rooms; XP, levels, badges, desk cosmetics; weekly quests; the Anthropic content refresh in every room; new safety scenarios; remove the stale docs.

**Phase 3, optional.** WebGL hub; cloud progress on Cloudflare D1 keyed by webmail address so an EA can switch machines and an AL can see completion; opt-in cohort leaderboard; a small event beacon so usage can be joined to `agent_safe` telemetry.

## 11. Findings that need action outside this project

- **Two EA prompts in the last 30 days contained what look like live credentials** (a Notion integration token and a Supabase service-role key), pasted straight into Claude. Per Magic policy this should go to the Security team for rotation and follow-up; I have not recorded the values anywhere. The Vault's "Secret keeper" mission exists because of this.
- **Team plan timing for the merged Claude UI is unknown.** The setup room ships with both variants behind a flag; someone with a Magic Team seat should confirm which one they see before screenshots are taken.

## 12. Open questions (blocking marked with *)

1. * Do Magic's Team seats already show the merged Claude interface with Docs and Slides? This sets the default of `MERGED_UI` and which screenshots we capture.
2. * 2.5D first with the WebGL hub in phase 3, or WebGL from the start?
3. Cloud progress (Cloudflare D1, keyed by webmail address, no password) in phase 3: yes or no? Without it, progress stays per browser as today and completion can only be inferred from certificate views.
4. Working title: "The Magic Office", "Magic Academy" or "Cowork Studio".
5. Who owns content updates after launch (Product Team, AOM)? `CONTENT.md` will be written for that person.
6. Should the certificate page get the badge list, or stay as it is?

## 13. Acceptance criteria for phase 1

- [ ] A returning v3 user opens v4 and sees their setup ticks, first task and safety pass reflected as completed rooms and badges.
- [ ] Every old deep link (`#setup`, `#need`, `#first-task`, `#safety`, `#ready`, `#library`, `#cowork`, `#tour`, `#context-window`, `#skills`, `#connectors`, `#scheduled`, `#prompting`, `#model`, `#learn`, `#help`, `#feedback`) lands on the right room or shelf.
- [ ] The core path can be finished in under 40 minutes with no step longer than 40 words of instruction.
- [ ] The Inbox simulator has at least one deliberate wrong plan step and at least two AI-sounding sentences to fix, and it scores prompts on ingredients, not wording.
- [ ] The Vault check requires all questions right, keeps `v2.safety`, and the certificate opens on completion.
- [ ] With reduced motion on, the world is a static map and every room is reachable by keyboard.
- [ ] `npm run lint` and `npm run build` pass; the page has no horizontal scroll at 390, 768, 1080 and 1440 px; body text never below 12 px; no em dashes or emoji in visible copy.
- [ ] First-load JavaScript under 600 KB gzipped; room images under 200 KB each.
- [ ] `CONTENT.md` explains how to add a mission, a scenario and a quest without touching components.
