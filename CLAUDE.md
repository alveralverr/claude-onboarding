# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The "Claude Cowork onboarding for Magic assistants" site. Since v4 (September 2026) it is **"The Magic Office"**: a gamified simulator where each room is a mission and the reference guide lives on "the Shelf". Stack: **Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui (Base UI, `nova` style) + motion**, built to `dist/`. Two older pages (`claude-design.html`, `certificate.html`) are still plain static files served from `public/`. `PLAN_V4.md` is the approved product plan; `CONTENT.md` is the how-to for editing rooms, scenarios and quiz content.

## Commands

```bash
npm install          # also builds dist/ via the `prepare` script (see Deploy)
npm run dev          # Vite dev server (add `-- --port 4600` etc.)
npm run build        # tsc -b && vite build  -> dist/
npm run preview      # serve dist/ locally
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npx shadcn@latest add <component>   # add a shadcn component (Base UI, nova)
```

There are no tests. `npm run lint` and `npm run build` are the checks. The Node version used in CI is Cloudflare's default (24); locally, `node` comes from nvm (24.x). A separate `/usr/local/bin/node` (22.x) exists on this machine and is what tools that don't load the shell profile will find.

## Deploy (Cloudflare Workers, GitHub integration)

- `wrangler.jsonc` serves `assets.directory = "./dist"`. Only `dist/` is public, so anything Vite doesn't emit or copy from `public/` is never served.
- **How the build runs on Cloudflare:** Workers Builds ignores wrangler's `build.command`. It runs `npm install` (which triggers the `prepare` script = `npm run build`), then `npx wrangler deploy`. So no dashboard build command is required, and `prepare` must keep working. Packages the build needs (`vite`, `typescript`, `@vitejs/plugin-react`, `@types/*`, `tailwindcss`) are in `dependencies`, not `devDependencies`, so the build still works if `NODE_ENV=production` is set. `wrangler.jsonc`'s `build.command` makes a local `npx wrangler deploy` build first too.
- `public/_redirects` sends the old `/onboarding.html` URL to `/`. `public/.assetsignore` keeps `.DS_Store` out of uploads.

## Layout

- `index.html`: Vite entry (meta tags, favicon, font preload). Nothing else lives here.
- `src/main.tsx` mounts `App` and the shadcn `Toaster`. `src/App.tsx` switches on the hash route (`src/lib/routes.ts`): `#/` lobby, `#/room/<id>` mission, `#/shelf[/<section>]` reference. Old section hashes (`#setup`, `#connectors`, ...) are aliased in `LEGACY` there.
- `src/world/`: `Lobby` (avatar pick, status card, map), `Map` (2.5D hotspots over `OfficeScene`, an isometric SVG diorama drawn from `iso.ts` boxes), `RoomPage`, `Shelf`.
- `src/engine/`: `MissionPlayer` plays a mission one step at a time; `steps/` renders each step kind; `MockClaudeWindow` is the offline Claude replica used by the `sim` step; `bits.tsx` has `Check`, `Shot`, `MediaView`; `burst.ts` is the confetti.
- `src/content/`: `types.ts` (step kinds), `world.ts` (rooms, badges, levels, desk items, avatars), `quests.ts` (weekly quests), `missions/` (one file per room: three core, six mastery), `scenarios/` (simulator scripts: `inbox`, `schedule`).
- `src/components/site/`: the Shelf sections (`LibraryCowork`, `LibraryTools`, `LibraryPractice`, `HelpFeedback`) and `TopBar`. `shared.tsx` holds the small building blocks (`Section`, `Kicker`, `Voiceover`, `CopyPrompt`, `YouTube` facade, `GifPlay`, `InViewVideo`, `Note`, `Ticks`).
- `src/components/ui/`: shadcn components added by the CLI. Local customizations (keep them when updating): `button.tsx` is pill-shaped with extra `light`, `outline-light`, `success`, `violet` variants and an `xl` size; `badge.tsx` has `success`/`warning`; `alert.tsx` has `info`/`warning`; `card.tsx` uses the Magic pillow look (white border, violet shadow). ESLint's `only-export-components` rule is off for this folder.
- `src/lib/data.ts`: content that is data (setup panel keys, quiz, connectors, models, help routes, resources). `src/lib/progress.ts`: the v1 progress store (checkboxes + safety). `src/lib/game.ts`: the v4 store (step completion, avatar) plus derived XP, level and badges. `src/lib/flags.ts`: `MERGED_UI`, `CLOUD_SYNC`, `WORLD_3D`. `src/lib/voiceover.ts`: one shared Audio player.
- `src/index.css`: Tailwind, the shadcn token block, Magic brand tokens (`--violet`, `--cyan`, `--success`, `--warning`, `--claude`, shadows) registered in `@theme inline`, self-hosted League Spartan `@font-face`, and a few `@utility` classes (`grad`, `kicker`, `h-display`, `h-section`, `h-sub`, `lede`, `wrap`, `band-glow`, `hero-wash`, `tint`). The brand is light-only; `.dark` mirrors `:root`.
- `public/`: copied verbatim into `dist/`: `assets/` (media, fonts, voice mp3s, the two demo mp4s and `setup-guide.mp4`), `claude-design.html` + `css/styles.css` + `js/ui.js` + `js/app.js` (v1 stack, only that page uses them), `certificate.html`, `_redirects`.
- `_archive/`: v1 (`v1/`), the v2 static guide (`v2/`), the retired landing page (`landing/`), and original media (`assets/`). Not deployed.

## Rules that are easy to break

- **Progress storage.** Key `magic-onboarding-v1`, shape `{ checkboxes: {key: true}, v2: { safety: true } }`, shared with v1/v2/v3 so returning users keep their ticks. Checkbox keys (the `k` of checklist items in `src/content/missions/desk.tsx` and `FIRST_TASK_KEY`) must stay unique and stable; they're listed per panel in `SETUP_PANELS` in `data.ts`, and the setup total is derived from that list. Core progress = 60% setup + 20% first task (`s5-0`) + 20% safety quiz. v4 adds `magic-onboarding-v4` (`{ steps: {"mission/step": iso}, seen, avatar, name, updatedAt }`); XP, level and badges are derived from both stores in `derive()`, never stored, so a v3 user opens v4 already at the right level. Badges derive from `inbox/edit`, `vault/secret`, each mastery room's `live-*` key (`Room.live` in `world.ts`), `fb-0`, and a three-week streak of step timestamps; weekly quests store as `quest/<id>-<weekStart>` and rotate from `QUEST_EPOCH` in `src/content/quests.ts` (append only). Both stores are cleared together by "Reset my progress" in the footer. Clearing localStorage by hand while the app is open re-saves the in-memory state; use the footer button or reload first.
- **Nothing is ever locked.** Every room, step and Shelf section is reachable by deep link. Old section ids (`intro`, `setup`, `need`, `first-task`, `safety`, `ready`, `library`, `cowork`, `tour`, `task-runs`, `context-window`, `skills`, `connectors`, `scheduled`, `prompting`, `model`, `learn`, `help`, `feedback`) are linked from `claude-design.html` and old shared links; they resolve through `LEGACY` in `routes.ts`, and the Shelf sections keep those element ids. Keep both.
- **The quiz** answer key is `answer` per question in `QUIZ`; the Vault mission renders the habits and rules the questions quote. Keep both in sync.
- **Missions are data.** Add or change rooms per `CONTENT.md`. Step ids are storage keys; renaming one resets it for everyone.
- **`MERGED_UI` is off** until a Magic Team seat shows the merged Claude interface (Cowork folded in, Docs and Slides). Flipping it swaps the Desk mission's two mode-switch items; keys unchanged.
- **Base UI, not Radix.** Use `render={<a />}` (plus `nativeButton={false}` on non-buttons) instead of `asChild`; `ToggleGroup`/`Accordion` take array values and `multiple`, not `type`; `Checkbox` uses `onCheckedChange`, others `onValueChange`. `Checkbox`/`RadioGroupItem` render a `span[role=…]` plus a hidden input that carries the `id`, so `FieldLabel htmlFor` works.
- **Custom `@utility` classes lose to Tailwind utilities** when both set the same property (e.g. `CardTitle`'s `text-base` beats `h-sub`). Inside shadcn components, size text with Tailwind classes, not the custom utilities.
- **Motion.** `motion/react` only in leaf components, always through `useReducedMotion` (the map zoom and step transitions go static). Confetti is off under reduced motion.
- **Media conventions:** images are WebP in `public/assets/media` with `width`/`height` and `loading="lazy"`; YouTube goes through the `YouTube` facade (nothing loads until clicked, youtube-nocookie); long animations use `GifPlay` (poster + click-to-play animated WebP); muted demos use `InViewVideo`; voiceover buttons use `Voiceover` with a `/assets/voice/…mp3` src. Pillow WebP support is available for converting new images; ffmpeg is not installed.

## Previewing gotchas

- The desktop app's preview launcher didn't reliably start servers in this repo (processes reported "running" while nothing listened). If that happens, start Vite with the absolute nvm node path from `.claude/launch.json`, or run it yourself and open `http://localhost:4600`.
- Vite is configured with `server.host: true` so both `localhost` (IPv6) and `127.0.0.1` reach it.
- CDP screenshots of content scrolled into view can come back blank. Workaround: `display:none` the sections above the target, set a tall viewport, capture at scroll 0. The pane must be visible for screenshots.
- To test the path, clear `magic-onboarding-v1` or use "Reset my progress" in the footer.
