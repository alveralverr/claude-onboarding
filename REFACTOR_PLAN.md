# Refactor Plan — Claude × Magic Onboarding Playbook

**Target:** the static site in this repo (deployed on Cloudflare Pages).
**Goal:** a cleaner, faster codebase with no loss of functionality, content, or information, and no new dependencies that could be blocked for specific users.
**Scope:** safe, high-impact, fully reversible wins. No framework, no build step, no architectural rewrites.

---

## Part 1 — The prompt for Claude Code

> Copy everything in the block below into Claude Code, running it from the repo root.

```
You are refactoring a STATIC website (plain HTML/CSS/vanilla JS, no build step)
deployed on Cloudflare Pages. The files are served verbatim from this folder.

Primary files:
  index.html          (~3,600 lines — all page copy lives here as semantic HTML)
  css/styles.css      (~7,900 lines)
  js/app.js, js/ui.js, js/hero-graph.js, js/voiceover.js
  assets/             (~112 MB — mostly GIFs and video)
Also present: claude-design.html, certificate.html. See AUDIT.md and DEPLOY.md
for prior findings and deploy details.

GOAL: make the site cleaner, faster, and lower-latency WITHOUT changing what the
user sees, reads, or can do. No content may be removed or reworded. No layout or
visual change. No feature removed.

HARD CONSTRAINTS:
1. NO new runtime dependencies, and NO reliance on third-party CDNs that could be
   blocked on some corporate/school/region networks. The current three.js CDN
   loads (cdnjs + jsdelivr) ARE such a risk — vendor (self-host) those files into
   assets/ instead of removing the feature. Do not introduce npm, bundlers, or
   frameworks.
2. Keep it a zero-build static site. Files must still work when served verbatim.
3. EVERY change must be REVERSIBLE. Work on a branch, commit each phase
   separately with a clear message, and never delete an original asset until its
   replacement is verified — move originals to assets/_archive/ instead of rm.
4. Preserve all localStorage keys and persisted-state behavior exactly (progress,
   checklists, gates) — users mid-onboarding must not lose state.
5. Respect Cloudflare Pages limits: 25 MB per file (any single file >25 MB must
   be compressed or split). Add cache headers via a _headers file.

WORKFLOW (do these in order, pausing for me to verify between phases):
  Phase 0  Create branch `refactor/perf-cleanup`. Read AUDIT.md, DEPLOY.md, and
           skim index.html + the JS files. Produce a short written inventory of:
           every <script>/<link>, every asset referenced in HTML/CSS vs. every
           asset on disk (flag unreferenced files), and every localStorage key.
           Do NOT change anything yet.
  Phase 1  Asset diet (highest impact, lowest risk).
  Phase 2  three.js: self-host + defer + pause-offscreen.
  Phase 3  JS state-system de-duplication.
  Phase 4  Loading/caching hygiene.
  Phase 5  Verification + tests (see test checklist below).

For each phase: explain what you'll change and why, make the edits, commit, then
STOP and tell me exactly how to verify before continuing. If anything is
ambiguous or risks a visible/behavioral change, ASK before proceeding rather
than guessing.

Start with Phase 0 and show me the inventory.
```

---

## Part 2 — The plan (what each phase does and why)

The work is ordered by impact-to-risk: biggest, safest wins first. Each phase is an
independent commit so any one can be reverted without unwinding the others.

### Phase 0 — Safety net and inventory (no changes)

Branch first (`git checkout -b refactor/perf-cleanup`) so `main` stays a known-good
deploy that Cloudflare can roll back to. Build three reference lists before touching
anything: all `<script>`/`<link>`/asset references, all files actually on disk (to find
dead weight), and all `localStorage` keys (so state behavior can be preserved and later
verified). This inventory is the baseline the final tests check against.

### Phase 1 — Asset diet (largest latency win)

`assets/` is ~112 MB and dominated by a handful of files:

| File | Size | Status |
|---|---|---|
| `setup-guide.mp4` | 25 MB | **exceeds Cloudflare's 25 MB/file limit** — must be re-encoded smaller |
| `connectors-browse.gif` | 21 MB | referenced — convert GIF → MP4/WebM |
| `claude-usecase-3.gif` | 20 MB | **unreferenced** — `claude-usecase-3.mp4` (3.4 MB) is already used instead |
| `cowork-thumbnail.gif` | 16 MB | referenced — convert GIF → MP4/WebM |
| `claude-usecase-4.gif` | 14 MB | **unreferenced** — `claude-usecase-4.mp4` (2.2 MB) is already used instead |

Actions, in order:
1. **Remove dead weight** — the two unreferenced GIFs (~34 MB) are already replaced by
   MP4s in the HTML. Move them to `assets/_archive/` (not delete) and confirm nothing in
   HTML/CSS still points at them.
2. **Convert the referenced GIFs** (`connectors-browse.gif`, `cowork-thumbnail.gif`) to
   `<video autoplay muted loop playsinline>` MP4/WebM, mirroring the pattern already used
   for usecase-3/4. Keep the GIF in `_archive/` until verified. This typically cuts each
   file by ~90%.
3. **Re-encode `setup-guide.mp4`** below 25 MB (e.g. H.264 CRF ~28, scaled to its display
   width) so it stays within Cloudflare's per-file limit and stops being a single-file SPOF.
4. **Down-size oversized PNGs** (several screenshots are 400–570 KB) — re-export at actual
   display resolution; optionally add WebP alongside. Keep originals archived.

Use `ffmpeg`/`cwebp` locally; commit converted files. Net expected: ~112 MB → roughly
20–30 MB, the single biggest load-time improvement, with zero visual change.

### Phase 2 — three.js: kill the CDN blocker, defer it, pause it

Today five three.js scripts load **synchronously in `<head>` from cdnjs and jsdelivr**,
blocking first paint, purely for one decorative hero animation. This is also the exact
"dependency that may be a blocker for specific users" called out in the brief — those CDNs
are blocked on some networks, which would break the page.

1. **Self-host** all five three.js files under `assets/vendor/three/` and reference them
   locally. Removes the external-CDN failure mode entirely; no behavior change.
2. **Defer** them — move the tags to the end of `<body>` or add `defer`, so they no longer
   block first paint.
3. **Pause when offscreen / honor reduced motion** — wrap `hero-graph.js`'s
   `requestAnimationFrame` loop in an `IntersectionObserver` that stops the loop when the
   canvas isn't visible, and short-circuit the animation when
   `prefers-reduced-motion: reduce` is set. Cuts idle CPU/GPU with no visible difference.
4. **Graceful fallback** — if three.js fails to load, the hero should still render its
   static background (the section must never appear broken).

### Phase 3 — De-duplicate the competing JS state systems

Per AUDIT.md, `app.js` (key `magic-claude-onboarding-v1`) and `ui.js`
(key `magic-onboarding-v1`) both hydrate the same checkboxes, both drive the progress bar,
and both wire the Reset button — causing double confirm dialogs, a progress bar that can't
reach 100%, and contradictory model-picker copy from three competing implementations.

This is cleanup, not redesign, so move carefully and reversibly:
1. Pick `ui.js` as the single source of truth for state/progress/gating (the editing notes
   already declare this intent). Remove the duplicated progress/checkbox/reset/model-picker
   logic from `app.js`, leaving `app.js` only its non-overlapping duties.
2. **Migrate persisted state** rather than orphaning it: on load, if the old
   `magic-claude-onboarding-v1` key exists, map it into the surviving key once, so users
   mid-onboarding keep their progress. Preserve the surviving key's exact name and format.
3. Fix the verified bugs while here: the duplicate `s4-1` checkbox key, the hardcoded
   `TOTAL_STEPS` count, and the dead `playbook-v5.js` / `forms.gle/placeholder` references.
4. Remove the `setTimeout` polling races by loading the consolidated script after its
   markup exists (end of `<body>`).

If this phase proves risky, it can be shipped separately or reverted on its own — Phases 1,
2, and 4 stand alone.

### Phase 4 — Loading & caching hygiene

1. **Lazy-load + dimensions** on every below-the-fold `<img>` (`loading="lazy"` +
   explicit `width`/`height` to prevent layout shift).
2. **`_headers` file** for Cloudflare Pages: long-lived immutable cache for `assets/`,
   `css/`, `js/` (fingerprint or version filenames if needed), short cache for `index.html`.
   This is the cheapest latency win for repeat visits.
3. **Preload** the one or two truly above-the-fold assets (hero font, hero image) and keep
   the existing `preconnect` hints.
4. Fix the known `assets/setup-guide-thumb.jpg` 404 (add the poster or remove the
   `poster=` attribute).

### Phase 5 — Verification & tests (required before merge)

No change merges until the site is proven visually and behaviorally identical. Run these
and report results:

- **Link/asset integrity:** script that crawls `index.html`, `claude-design.html`,
  `certificate.html`, and `styles.css` for every referenced path and asserts each resolves
  (zero 404s). Confirm no reference points at an archived file.
- **Visual regression:** capture full-page screenshots at mobile + desktop widths before
  (from `main`) and after; diff them. Any pixel difference must be explained.
- **Behavioral smoke test:** load locally (`python3 -m http.server`), then verify:
  checkboxes persist across reload; progress bar reaches 100% when all items are checked;
  Reset shows ONE dialog and clears state fully; setup tabs gate correctly; copy-prompt
  buttons work; model picker shows one consistent message; help router works; hero
  animation runs, pauses when scrolled away, and is disabled under reduced-motion.
- **State migration:** with old `magic-claude-onboarding-v1` data seeded in localStorage,
  confirm progress carries over after the Phase 3 change.
- **Performance check:** Lighthouse (or `du -sh assets`) before/after — confirm total
  payload dropped substantially and no metric regressed.
- **Cloudflare preflight:** assert no single file exceeds 25 MB; deploy to a Cloudflare
  Pages **preview** URL and re-run the smoke test there before promoting to production.

### Reversibility summary

- All work on `refactor/perf-cleanup`; `main` remains the rollback point (Cloudflare Pages
  also keeps prior deployments for instant rollback).
- One commit per phase → revert any single phase cleanly.
- Originals moved to `assets/_archive/`, never deleted, until verified.
- localStorage keys and formats preserved (with one-time migration), so no user loses
  onboarding progress.
