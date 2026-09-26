# Updating the Magic Office (content guide)

The office is data. You add or change a room by editing files under `src/content`; the engine in `src/engine` renders whatever is there. You should not need to touch a component to change copy, add a scenario or add a room.

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
