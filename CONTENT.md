# Updating the Magic Office (content guide)

Since v5 there are two kinds of content:

- **Paths** (the desk): a role, a fictional client and shifts of tasks, played in the practice Claude. This is the main experience. See "Paths" below.
- **Missions** (the training floor, the v4 rooms): drills for one skill each, plus setup and the safety check. Everything after "Where things live" is about missions.

## Paths

A path lives in `src/content/paths/<id>/` and is listed in `src/content/paths/index.ts`. Types are in `src/story/types.ts`.

- `persona.ts`: the fictional client (name, company, city, time zone, three preferences, voice) plus their files and project options. **Fictional only.** Never reuse a name, company or detail from telemetry or Account Lead notes; the repo is public.
- `shift1.ts` and so on: a `Shift` is `{ id, day, title, clock, tasks }`. A `Task` is `{ id, title, sticky, habits, minutes: { manual, claude }, open, steps, done }`. `open` is the client's text that starts it; `minutes` feed the hours-saved estimate.
- `index.ts`: the `PathDef` with `live: true`, the persona, the shifts, and `launchpad` defaults (recurring tasks and platforms) for the Week 1 Launchpad export.

### Step kinds (v5)

| Kind | Where it plays | What it trains |
|---|---|---|
| `sort` | desk | Spot: cards into three trays (Claude drafts it, Claude and me, Me only) |
| `brief` | laptop | Brief: free text in the practice composer, checked for `ingredients` (regex `test`, `insert` text), `needFiles`, the right `projects` choice and `mode` |
| `plan` | laptop | Steer: one plan item has `bad` with redirect `options`; approving it plays `consequence` and offers a rewind |
| `connect` | laptop | Spot and safety: Customize › Connectors, choose the right account |
| `permission` | laptop | Steer: Allow once, Always allow or Deny |
| `choose` | laptop | Any: Claude offers options (a slot, a shape, a cadence); optional `table` and `recommend` |
| `review` | laptop | Check: tap the flagged `segments` in the output |
| `instructions` | laptop | Brief: write a project's Instructions for Claude from chip groups |
| `phone` | phone | Show: pick what to send; the client `reply`s; a wrong pick costs a little trust |
| `live` | desk | The bridge: copyable prompts plus a v1 checkbox key `k` |
| `launchpad` | desk | Plan your real Week 1 and copy the Launchpad block |

Every step should have `habit` and three `hints` (nudge, hint, answer). Keep one trap per task, one idea per step, and copy under 40 words of instruction. Task keys are stored as `path/shift/task`; renaming an id resets it for everyone.

### Scoring

Done first try (and without the third hint) earns a full habit point, otherwise half. A clean task (no mistakes, no consequences) adds half a heart of client trust; consequences subtract theirs. Rewinding a plan refunds its trust cost but the task is no longer clean. XP: 30 per task, 40 per finished shift. Badges: `first-shift`, `path-<id>`.

### The practice Claude

`src/sim/` mirrors the real Claude desktop layout (September 2026): sidebar, composer with `/` skills, `+` attach, Chat or Cowork, "Opus 5.5 High", "Project or folder", and the permission menu. It is labelled Practice mode and carries no Anthropic logo. When Anthropic changes the real layout, update `Shell.tsx` and `Composer.tsx` only; step views build on them.

### The desk plate

`src/desk/plateConfig.ts` holds the plate size and the four-corner quads of the laptop and phone screens. With `src: null` a drawn placeholder is used. When `desk-pov.png` arrives (brief in `assets-src/v5/README.md`), measure the green screens, set the quads and `src`, and the real screens map onto them via `matrix3d` (`src/desk/homography.ts`).

The office is data. You add or change a room by editing files under `src/content`; the engine in `src/engine` renders whatever is there. You should not need to touch a component to change copy, add a scenario or add a room.

## Updates (the living knowledge base)

One file per announcement in `src/content/updates/<yyyy-mm-dd>-<slug>.ts`, typed as `Update` (`types.ts`). The loader picks up every file automatically; add one and it is published on the next deploy. Updates show on the desk noticeboard (with an unread count), on `#/whats-new`, as "New" pins on the rooms and Shelf sections in `rooms`, and, when they carry a `quest`, as the weekly quest for the three weeks after `date`. A `drill` (a `Task` built from the existing step kinds) appears on the noticeboard as "Practise it" and opens from `#/drill/<update id>`.

The Product Team publishes with the Claude Code skill in `.claude/skills/office-update/` (`/office-update`): paste a release note or URL, and it drafts the card, fixes `src/content/now.ts` if a fact changed, runs lint and build, and commits. The weekly routine prompt (`weekly-routine.md` in the same folder) pre-drafts cards from Anthropic's release notes into a PR; a person publishes.

Facts about the current Claude (default model, fallback, effort, what Team seats have) live in `src/content/now.ts` and nowhere else. Write copy against `NOW`, not literal model names.

## Where things live

| What | File |
|---|---|
| Rooms on the map, badges, levels, avatars | `src/content/world.ts` |
| One mission per room | `src/content/missions/<room>.tsx`, registered in `src/content/missions/index.ts` |
| Simulator scripts (what "Claude" says and does) | `src/content/scenarios/<name>.ts` |
| Quiz questions and answer keys | `QUIZ` in `src/lib/data.ts` |
| Connectors, models, help routes, courses | `src/lib/data.ts` |
| The Shelf (reference sections) | `src/components/site/Library*.tsx`, `HelpFeedback.tsx` |
| Weekly quests | `src/content/quests.ts` (append only; the rotation is by week since `QUEST_EPOCH`) |
| Feature flags (`MERGED_UI` and friends) | `src/lib/flags.ts` |
| Old section links that must keep working | `LEGACY` in `src/lib/routes.ts` |

## Step kinds

A mission is `{ id, title, tagline, minutes, steps }`. Each step has a `kind`:

- `explain`: text (`body`), optional `media`, `voice`, `note`. Done when the assistant clicks Next.
- `checklist`: `items` of `{ k, label, media? }`. `k` is a v1 localStorage key. Done when every item is ticked.
- `quiz`: `questions` (usually `QUIZ` from data.ts), optional `onPass`. One scenario at a time; done when all are right.
- `spot`: `segments` of `{ text, flag?, fix? }`. Flagged segments are the targets. Done when all are found. `frame` is `prompt`, `draft` or `plan`.
- `compose`: `groups` of chips. A group is covered by a chip with `good: true`; a bad chip needs a `why`. Done when every group is covered and no bad chip is selected.
- `sim`: `scenario` names a file in `scenarios/`. Done when the run reaches its output.
- `live`: a real-work attestation bound to a v1 key `k`, with optional copyable `prompts`.
- `reveal`: the reward beat, optional `badge` (from `world.ts`) and `next` link.

Step `id`s are stored as `"<mission>/<step>"` in localStorage under `magic-onboarding-v4`. Renaming a step id resets it for everyone. Badges derive from state, never stored: `inbox/edit` (Editor's eye), `vault/secret` (Secret keeper), the `live-*` keys of each mastery room (`Room.live` in `world.ts`), `fb-0` (Voice heard), and three consecutive weeks with any completed step (Three-week streak). See `derive()` in `src/lib/game.ts`.

A mastery room is a mission whose `Room` entry has `mastery: true`, a `live` key and usually a `badge`. Its "take it live" step must use that same `k`.

## Rules that are easy to break

- **Checklist keys are permanent.** They are the v1 keys in `SETUP_PANELS` and `FIRST_TASK_KEY` in `data.ts`, shared with every version since v1. Rename labels, never keys. Adding a key to a panel changes the setup total, which is fine; removing one strands progress.
- **Quiz and rules stay in sync.** The Vault renders `HABITS` and `RULES` in `missions/vault.tsx` and quizzes `QUIZ` in `data.ts`. Change one, change the other.
- **Nothing is ever locked.** Every room and every step is reachable. Don't add gates.
- **Legacy links.** Every id in `LEGACY` (`#setup`, `#connectors`, ...) is linked from `claude-design.html` and from links already shared with assistants. Keep them, and add the new home of any section you move.
- **Copy rules.** One idea per step, under 40 words of instruction, no em dashes, no emoji, sentence case, no "Step 1" labels in copy. Taglish and voice-to-text are fine in examples.
- **Images from renders.** Source PNGs live in `assets-src/v4` (git-ignored) with descriptive names: `lobby`, `room-<id>`, `avatar-<name>`, `client-dana`, `badge-<id>`, `item-<id>`; `-alt` files are second takes kept for swapping. Convert with Pillow to WebP in `public/assets/media`: scenes 1200 wide (lobby at 768 and 1536), everything else 256 square with alpha.
- **Media.** WebP under `public/assets/media` with `w` and `h`; YouTube through `{ type: "youtube" }` (nothing loads until clicked); long animations `{ type: "gif" }` with a poster; muted demos `{ type: "video" }`.

## Adding a room

1. Add a `Room` to `ROOMS` in `world.ts` with a `spot` (where its label sits on the lobby scene, in % of the image, at the top of the furniture) and an `image` banner. New furniture means a new lobby render: regenerate it from the brief in `assets-src/v4/README.md`, then re-measure every `spot`.
2. Create `src/content/missions/<room>.tsx` and register it in `missions/index.ts`.
3. If it needs a simulator run, add `src/content/scenarios/<name>.ts` and register it in `SCENARIOS` in `src/engine/steps/Sim.tsx`.
4. If it awards a badge, add it to `BADGES` and to `derive()`.
5. `npm run lint && npm run build`, then open `#/room/<id>`.

## Adding a scenario

A scenario is what the simulator "Claude" says and does. It needs a `prompt`, a `plan` with exactly one `bad` step (the one the assistant must catch, with redirect `options` where one is `good`), `tools` to tick through, and an `output`. Keep the client fictional and the drafts realistic; the flagged sentences in the matching `spot` step should be copied from the output verbatim.

## The merged Claude interface

Anthropic folded Cowork into Claude on 16 September 2026. Magic's Team seats still show the separate Cowork toggle. When that changes, set `MERGED_UI = true` in `flags.ts`: the Desk mission swaps its two mode-switch items for the Manual/Automatic explanation, keys unchanged. Then retake the screenshots under `public/assets/media` that show the old sidebar.
