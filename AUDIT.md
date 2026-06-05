# Codebase Audit — Claude × Magic Onboarding Playbook

June 2026 · Covers `index.html` (1,577 lines), `css/styles.css` (4,500 lines), `js/app.js`, `js/ui.js`, `js/hero-graph.js`, `assets/` (105 MB), `DEPLOY.md`.

## Architecture summary

Plain static site, no build step. All copy lives in `index.html` as semantic HTML. Interactivity is split across two vanilla-JS files that grew in layers: `app.js` (v1 progress system) and `ui.js` (v5 gate system, demo carousel, ToC, model picker). `hero-graph.js` renders a Three.js node graph behind the Quickstart section. State persists in `localStorage`.

The site already has solid interactive bones: checklist persistence, sequential section gating with overlays, tabbed setup with a "complete all to continue" gate, copy-to-clipboard prompts, collapsible prompt pairs, a model picker, a help router, and a demo video carousel.

## Bugs (verified)

1. **Duplicate checkbox key `s4-1`** — `index.html` lines 464 and 472. Two different checklist items in the Skills panel share one persistence key. Checking either one checks both on reload, and the panel can read as complete when it isn't.

2. **Two competing state systems fight over the same checkboxes.** `app.js` stores under key `magic-claude-onboarding-v1` (`step-id::index` format); `ui.js` stores under `magic-onboarding-v1` (`data-cb-key` format). Both hydrate checkboxes on load, both attach change listeners, both drive the progress bar, and both wire the same Reset button — so reset shows **two stacked confirm dialogs** and only clears one store, letting stale state resurrect on reload.

3. **Progress bar can never reach 100%.** `ui.js` hardcodes `TOTAL_STEPS = 39` ("32 checkboxes + 7 Mark-as-Read"), but the page actually has 28 checkboxes (27 unique keys after the dup) + 7 sections = 34. The bar tops out at ~87% while the status text says "You're ready for client work!"

4. **Model picker has three competing implementations with contradictory copy.** `app.js` (lines 170–194) says Sonnet is "the default for most EA tasks" and Opus "burns through your quota"; `ui.js` has two more IIFEs (lines 17–47 and 52–69, the second a near-duplicate of the first's highlight logic) saying Opus is the default. Which text wins depends on listener-registration timing (`setTimeout` races). The page copy says "Start on Opus" — `app.js`'s copy actively contradicts it.

5. **Help router contradicts the model guidance.** `app.js` ROUTES `limit` advises "switch to Haiku," directly against the on-page warning "Don't drop to Haiku."

6. **`ui.js` is loaded mid-document** (line 1108, inside the Prompting section) before the Model, Help, and ToC markup exists — hence the `setTimeout`-retry polling scattered through it. Fragile and order-dependent.

7. **Dead/broken references.** Editing notes (line 40) point to `playbook-v5.js`, which doesn't exist. The feedback CTA links to `https://forms.gle/placeholder`. The video poster `assets/setup-guide-thumb.jpg` 404s (noted in DEPLOY.md).

## Performance

- `assets/` is 105 MB. The four worst offenders are GIFs/video: `setup-guide.mp4` (25 MB), `connectors-browse.gif` (21 MB), `claude-usecase-3.gif` (20 MB), `cowork-thumbnail.gif` (16 MB), `claude-usecase-4.gif` (14 MB). **MP4 versions of usecase-3/4 already exist in assets (3.5 MB / 2.3 MB) but the HTML still references the GIFs** — a ~28 MB saving is sitting unused.
- `hero-graph.js` runs a `requestAnimationFrame` loop continuously, even when the canvas is scrolled offscreen — no `IntersectionObserver`, no pause. Constant CPU/GPU drain on a content page.
- Five Three.js CDN scripts load synchronously in `<head>`, blocking first paint, for one decorative background.
- Several screenshots (400–500 KB PNGs) lack `loading="lazy"` and have no width/height attributes (layout shift).

## Accessibility

- No `prefers-reduced-motion` handling anywhere (auto-rotating 3D graph, aurora animations).
- Setup tabs (`.setup-tab`) have a `role="tablist"` container but the buttons lack `role="tab"`, `aria-selected`, and keyboard arrow navigation. (The demo carousel does this correctly — inconsistent.)
- The floating ToC reveals only on **mouse** proximity to the right edge — unreachable by touch or keyboard.
- Gate overlays hide content visually but the locked sections likely remain in tab/reading order.
- Heavy use of inline styles (positioning, sizing) in HTML and 62 `!important`s in the CSS make consistent responsive/a11y fixes harder.

## Content & learning-design observations

- The page is **read-and-check**: every checkbox is self-reported ("I did this"), nothing verifies understanding. "Mark as read" gates measure scrolling, not learning.
- The strongest existing learning element is the tap-to-reveal prompt pairs — active recall. It's the only one.
- Long passive stretches: Using Cowork → Skills → Connectors is ~900 lines of video + tables with no interaction beyond watching.
- No way for a learner to *practice* prompting, model choice, or safety judgment before doing it live with a client.
- Progress state is per-browser only — ALs tracking "Claude Certified" onboarding have no visibility into completion.

See `PROPOSAL.md` for the prioritized plan.
