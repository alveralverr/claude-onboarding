---
name: office-update
description: Publish an update to The Magic Office's living knowledge base. Use when the Product Team says "announce", "post an update", "new Claude feature", "Anthropic released", "model announcement", "add to What's new", or pastes an Anthropic release note or URL. Drafts the typed update card (summary, why it matters to an EA, Try it prompt, habits, rooms, optional weekly quest and 3-minute drill), fixes src/content/now.ts when a fact changed, previews, and commits. Also used by the weekly pre-draft routine.
---

# /office-update

You publish one update card to the knowledge base in this repo. Cards are typed files in `src/content/updates/`, picked up automatically by `src/content/updates/index.ts`, shown on the desk noticeboard, the What's new page (`#/whats-new`), and as "New" pins on the rooms they touch. Cloudflare deploys on push to `main`.

Read `CONTENT.md` (section "Updates") and one existing card in `src/content/updates/` before writing.

## Input

Any of: a pasted Anthropic release note, a URL (fetch it), a Magic-internal change ("new skill", "new rule"), or one sentence. If the source is a URL, fetch and read it; never invent details the source does not state.

## Write the card

File: `src/content/updates/<yyyy-mm-dd>-<slug>.ts`, `export default { ... } satisfies Update`. Fields, in the voice of the site (short sentences, sentence case, no em dashes, no emoji, no filler such as "leverage" or "seamless"):

- `id`, `date` (when Anthropic or Magic shipped it), `kind`: feature | model | magic | policy | tip.
- `title`: a name, not a headline. Under 8 words.
- `summary`: two or three plain sentences saying what changed. Facts only.
- `why`: one or two sentences on what it means for a Magic EA doing client work. This is the part that matters; if it does not change how an EA works, the card may not be worth publishing.
- `try`: one copyable prompt or action to try on real work today, drafts-only where sending is involved.
- `habits`: any of spot, brief, steer, check, show that this changes.
- `rooms`: room ids (desk, inbox, vault, studio, switchboard, clock, writing, workshop, engine) and Shelf section ids (cowork, context-window, skills, connectors, scheduled, prompting, model, learn, help) it touches.
- `quest` (optional): a one-week real-work challenge. Include when the feature deserves a week of practice.
- `drill` (optional): a `Task` using existing step kinds from `src/story/types.ts` (`choose`, `review`, `phone`, `permission` are the usual fits). Include when the feature changes a decision an EA makes. Keep it to 2 or 3 steps and one trap. Fictional client details only.
- `video` (optional): YouTube id and title; it renders through the site's facade.
- `links`: the source, and Anthropic's docs if any.
- `status`: live | rolling-out | team-pending. Magic assistants are on Team seats; if the release says Pro and Max first, use team-pending.
- `audience`: which plans have it.

## Facts that live elsewhere

If the update changes the default model, the fallback, effort guidance, or what Team seats have, edit `src/content/now.ts` too. Search `src` for any remaining hardcoded mention and point it at `NOW`.

## Guardrails

- The repo is public. No client names, no telemetry, no internal notes, no names of assistants.
- Do not describe a feature as available to assistants if `status` is not live.
- Never state a security control exists or is compliant unless the source says so.
- One card per change. A release with three changes is up to three cards.

## Finish

1. `npm run lint && npm run build` must pass (a malformed card fails the build, which is the point).
2. Show the card as it will read, and where its "New" pins land.
3. On approval, commit with a message that starts `Update: <title>` and push to `main`. If this is the weekly routine, open a branch `updates/<yyyy-mm-dd>` and a PR instead; never push to `main` from the routine.
