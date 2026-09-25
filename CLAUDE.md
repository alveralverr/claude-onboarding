# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The "Claude Cowork onboarding for Magic assistants" site: a plain static site (HTML, CSS, vanilla JS). **No build step, no npm, no bundler, no tests, no linter.** Files are served exactly as they sit in the repo.

## Run / deploy

- Preview: `python3 -m http.server 4599` from the repo root (the `onboarding-static` config in `.claude/launch.json`). Use a server, not `file://`.
- Deploy: Cloudflare Workers static assets (`wrangler.jsonc`, `assets.directory = "."`), via `npx wrangler deploy` or Cloudflare's git build on push to `main`. `_redirects` (Cloudflare syntax) sends the old `/onboarding.html` URL to `/`.
- **Everything in the repo is public unless `.assetsignore` excludes it.** It excludes `*.md`, `.git`, `.claude`, `_archive/`, `assets/_archive/`, and the wrangler files. New files get served by default. Cloudflare rejects single files over 25 MiB; `assets/setup-guide.mp4` is about 24.2 MiB.
- `DEPLOY.md`, `AUDIT.md`, and `REFACTOR_PLAN.md` are from June 2026 and describe v1. They are stale.

## The guide (v2, `index.html` + `css/guide.css` + `js/guide.js`)

- **All copy lives in `index.html`.** Find a phrase and edit it in place. The page has no third-party scripts and loads about 200 KB before any media.
- Structure: hero with a "Your path" card, then What's different (`#intro`), then **the path**: Setup (`#setup`, 5 tabs), First task (`#first-task`), Safety check (`#safety`, ends in a 5-question quiz). Then **the library**, which is always open: `#cowork` (includes `#tour` and `#context-window`), `#skills`, `#connectors`, `#scheduled`, `#prompting`, `#model`, `#learn`. Then `#help` and `#feedback`. `#ready` (certificate call to action) shows only when the path is complete.
- **Nothing is ever locked.** v1's gating and "Mark as read" buttons were removed on purpose. Every section is reachable by deep link.
- Section ids are linked from `claude-design.html` and from old shared links (`#need` survives as an anchor inside `#setup`). Keep them stable.

### State and progress (`js/guide.js`)

- Stored in `localStorage` under **`magic-onboarding-v1`**, the same key as v1, so returning users keep their ticks. The shape is `{ checkboxes: {key: true}, v2: { safety: true } }`. Older v1 fields (`completed`, `setupTabs`) may be present and are ignored.
- Checkbox keys (`data-cb-key`) must be unique and stable. Changing one wipes that tick for everyone.
- Progress is 60% setup (every checkbox inside `#setup`, counted automatically), 20% first task (`s5-0`), and 20% safety quiz passed. Adding a checkbox inside `#setup` changes the setup total with no other code change.
- The quiz answer key is `data-answer` on each `fieldset.q`, and the wrong-answer text is `.q__fb`. The questions quote the safety rules above them. Keep them in sync if the rules change.
- Data that lives in JS rather than HTML: the `CONNECTORS` capability list, `MODELS` (picker text), and `ROUTES` (help router).

### Media conventions

- Images live in `assets/media/` as WebP, resized to display size, with `width`/`height` set and `loading="lazy"`. Originals are in `assets/_archive/`.
- YouTube: `<div class="yt" data-yt="ID" data-title="…">` is a click-to-load facade. Nothing loads from YouTube until someone clicks, and the embed uses youtube-nocookie.
- Long animations: `<figure class="gifplay" data-gif="…webp">` shows a poster WebP and loads the animated WebP only on click.
- Muted demo videos use `data-autoplay`. They play only while on screen and show controls instead under reduced motion.
- Voiceover: `<button class="vo" data-vo="assets/voice/….mp3">`. The Audio object is created on first click. File names follow the sections in `voiceover-script.md`.
- To convert new media, Pillow with WebP support is available (`python3 -c "from PIL import features; print(features.check('webp'))"`). ffmpeg is not installed.

## Other pages (still on the v1 stack)

- `claude-design.html` uses `css/styles.css`, `js/ui.js`, and `js/app.js`, which **only it** uses now. `styles.css` grew in appended patch layers that override each other with `!important`, so find every definition of a selector before editing. Its password lock is client-side and cosmetic, not real access control.
- `certificate.html` is self-contained (inline CSS and fonts). The guide links to it once the path is complete.

## Other folders

- `magic-cowork-onboarding/` and `magic-cowork-launchpad/`: Claude skills (Markdown only, not served) that teach the same content as the guide. Keep their facts in sync with `index.html`.
- `_archive/v1/`: the v1 guide (`index.html`, `hero-graph.js`, `voiceover.js`, the standalone connector page). `_archive/landing/`: the retired landing page. Not deployed.

## Previewing gotchas

- The preview browser caches CSS and JS hard. Cache-bust with `?v=` on the stylesheet, or reload with a new query string.
- CDP screenshots of content scrolled into view with `window.scrollTo` can come back blank. Workaround: hide the sections above the target (`style.display='none'`), set a tall viewport, then capture at scroll 0.
- To test the path, clear `magic-onboarding-v1`, or use "Reset my progress" in the footer.
