# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The "Claude for Magic Assistants" onboarding site: a plain static site (HTML + one CSS file + vanilla JS). **No build step, no npm, no bundler, no tests, no linter.** Files are served exactly as they sit in the repo.

## Run / deploy

- Preview: `python3 -m http.server 4599` from the repo root (the `onboarding-static` config in `.claude/launch.json`). Use a server, not `file://`; fonts and scripts won't load otherwise.
- Deploy: Cloudflare Workers static assets (`wrangler.jsonc`, `assets.directory = "."`), via `npx wrangler deploy` or Cloudflare's git build on push to `main`.
- **Everything in the repo root is public unless `.assetsignore` excludes it.** It already excludes `*.md`, `.git`, `_archive/`, `assets/_archive/`, and the wrangler files. A new file or folder at the root gets served by default. Cloudflare rejects any single file over 25 MiB, and `assets/setup-guide.mp4` is about 24.2 MiB.
- `DEPLOY.md`, `AUDIT.md`, and `REFACTOR_PLAN.md` are from June and partly stale. They call the guide `index.html` and refer to a `docs/` folder. The guide is now `onboarding.html` at the root.

## Pages

- `index.html`: landing page. Its `lp__*` styles are inline; it uses only the tokens, fonts, and reset from `css/styles.css`. It links only to `onboarding.html`. The Funnel Dashboard was retired to `_archive/funnel-dashboard/` on 2026-09-25.
- `onboarding.html`: the guide. **All copy lives here as semantic HTML.** Find a phrase and edit it in place. Sections (`#intro`, `#cowork-intro`, `#need`, `#setup`, `#cowork`, `#prompting`, `#model`, `#safety`, `#learn`, `#help`, `#feedback`) are gated one after another. Mid-body it has an inline `<style>` and `<script>` block for the connector reference grid (the `CONNECTORS` array).
- `claude-design.html`: a separate page linked from the guide's topbar. It shares `styles.css`, `ui.js`, and `app.js`, and has a client-side password lock. That lock is cosmetic, not real access control.
- `certificate.html`: self-contained, with inline CSS and its own `@font-face`. `ui.js` reveals the link to it when progress reaches 100%.
- `Connector Capabilities (standalone).html`: the original that was merged into `onboarding.html`. Nothing links to it.

## JS architecture (`js/`)

- `ui.js` owns state, progress, and gating. It persists to `localStorage` under the key **`magic-onboarding-v1`**. Never rename that key or change checkbox keys, or users mid-onboarding lose their progress.
  - Checkboxes are keyed by `data-cb-key`, and each key must be unique on the page.
  - Setup tabs pair `button[data-tab]` with `[data-panel]` and carry a `data-step-id`.
  - A locked section has `.section--locked` plus a JS-injected `.gate-overlay`.
  - Some class names are built in code (`rv-arrow--N`, `rv-head--N`, `cw-block--*`, `cw-group--*`). Search `ui.js` before calling a CSS rule dead.
- `app.js`: tab nav, copy-to-clipboard (`code.prompt[data-copy]`), the help router, and smooth scroll.
- `voiceover.js`: buttons with `data-voiceover-src` play `assets/voice/*.mp3`. The file names follow the section order in `voiceover-script.md`.
- `hero-graph.js`: a three.js (r128) node graph drawn behind `#need`. It uses the global `THREE` and the examples scripts, loaded from the cdnjs/jsdelivr `<script>` tags in `onboarding.html`'s `<head>`.
- **Load order matters.** The scripts sit near the end of `<body>` without `defer`. Any immediately-invoked block in them only sees markup above its `<script>` tag. The floating TOC (`nav.toc`) comes *after* the scripts, so TOC logic has to wait for DOMContentLoaded.

## CSS (`css/styles.css`)

This single file grew in appended "patch" layers (v2 to v9). A later layer often overrides an earlier one, sometimes with `!important`: `.dark-band`, `.toc`, `.prompt-pair`, `.cw-only`, and the compare table are each defined 3–5 times. Before editing a selector, find every definition of it, or the change will be silently overridden. The `.cd-*` rules at the end are used only by `claude-design.html`.

## Other folders

- `magic-cowork-onboarding/` and `magic-cowork-launchpad/`: Claude skills (Markdown only, not served) that teach the same content as the guide. The lesson files in `references/` should stay factually in sync with `onboarding.html`.
- `assets/_archive/` and `_archive/`: originals kept so changes can be reversed; neither is deployed. `_archive/funnel-dashboard/data.json` contains real names and emails, so it must never be served.

## Previewing gotchas

- The preview browser caches `styles.css` and `ui.js` hard, even across reloads. To see CSS changes, cache-bust the stylesheet (`?v=`). HTML changes do reload fresh.
- New visitors see most sections locked. To inspect one, remove `.section--locked` and `.gate-overlay` in devtools, or clear `magic-onboarding-v1`.
- CDP screenshots of content scrolled into view with `window.scrollTo` can come back blank. Workaround: hide the earlier sections and use a tall viewport.
