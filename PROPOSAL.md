# Proposal — Foundation Fixes + Completion Certificate

Companion to `AUDIT.md`. Re-verified against the working tree on 2026-06-05 — all audit findings still present. Everything stays in the current stack (vanilla JS, no build step) and the Magic design language (violet-dominant, pillow cards, aurora accents, sparing Claude orange).

## Scope

This round is deliberately narrow: **fix the broken foundation, then add one new learner-facing feature** — a completion certificate the assistant submits to their Account Lead. The larger learning-design ideas (quizzes, build-a-prompt, simulations, drills) are out of scope for now.

---

## Tier 1 — Foundation fixes (do first, ~half a day)

Interactivity built on broken state will misbehave. From the audit:

1. **Unify state into one module.** Single `localStorage` key, single source of truth for checkboxes, completions, and progress. Delete the v1 system in `app.js` and the duplicate model-picker/highlighter IIFEs in `ui.js`. Compute `TOTAL_STEPS` from the DOM instead of hardcoding 39.
2. **Fix the duplicate `s4-1` key**, the placeholder feedback URL, the dead `playbook-v5.js` comment, and the missing poster.
3. **Reconcile contradictory copy** (model picker + help router vs. "Start on Opus" page guidance).
4. **Swap the use-case GIFs for their existing MP4s** (saves ~28 MB), pick one setup video (local or YouTube, not both), lazy-load images, and pause the hero graph offscreen via `IntersectionObserver` + respect `prefers-reduced-motion`.
5. **Move `ui.js` to the end of body** and drop the `setTimeout` polling.

---

## Tier 2 — Completion certificate for ALs (~1 day)

**Goal.** Give Account Leads a concrete artifact that an assistant has finished onboarding, with no backend.

**The trigger — a one-click link below the progress bar.**
Today, when a learner reaches 100% the progress widget just shows a dead "Guide complete ✓" label ([ui.js:378-380](js/ui.js:378)). Replace that end state:

- While the guide is incomplete, the link stays **"Continue →"** (unchanged behavior — routes to the next unlocked step).
- The moment the learner hits **100% completion**, the same link flips to a live, one-click **"Get your certificate →"** that **opens a new tab** with the certificate. (It replaces "Continue"; it is not an extra button.)

**The certificate page (new `certificate.html`).**
A standalone, self-contained, Magic-styled page — no shared dependencies, safe to open in a fresh tab:

- Magic × Claude branding (existing banner SVG/PNG in `assets/`), a "Certificate of Completion — Claude Onboarding Playbook" headline, the completion date, and the assistant's name.
- A **"Download / Print"** action (browser print-to-PDF, pure CSS `@media print`) so the assistant can attach or paste it into whatever channel they already use to reach their AL.
- A short line of instruction: *"Send this to your Account Lead to confirm you've completed onboarding."*

**Name + date handoff.** The certificate needs the assistant's name and the completion date:
- Completion date is stamped at render time (`new Date()` in the certificate page).
- Name: prompt for it once on the certificate page (a single input that fills the name in-place) — keeps the playbook itself free of a name field. The name is not persisted server-side; it only lives in the rendered certificate.

**Why this and nothing else.** It's the lightest viable version of the audit's "completion visibility" gap: turns per-browser progress into something an AL can actually receive, with zero backend and one new static file.

---

## Sequencing

| Phase | Items | Effort | Outcome |
|-------|-------|--------|---------|
| 1 | Tier 1 | ~0.5 day | Stable single-source state, ~30% lighter page, accessible motion |
| 2 | Tier 2 | ~1 day | 100% completion opens a submittable certificate for the AL |

Both phases ship independently — no big-bang rewrite, no new dependencies, GitHub Pages deploy unchanged. Phase 1 must land first: the certificate trigger depends on a progress system that can actually reach 100% (today it caps at ~87%).

## Sign-off decisions (approved 2026-06-05)

1. **Name capture** — prompt on the certificate page. ✅
2. **Submission channel** — print-to-PDF + "send to your AL" is enough. ✅
3. **Completion code** — ~~include a hash~~ removed. The code implied a verification check that didn't exist; certificate is a social/honor-system artifact for now.

Status: **implemented & verified 2026-06-05.** Tier 1 + Tier 2 shipped; both pages load with no console errors, progress reaches 100% (35/35), and the certificate hand-off renders. See the implementation notes below.

## Implementation notes

- **State unified into `js/ui.js`** (key `magic-onboarding-v1`). `js/app.js` no longer touches `localStorage` — it now owns only tab navigation, copy-prompt buttons, the help router, and smooth-scroll. The reset button is wired once (single confirm).
- **`TOTAL_STEPS` computed from the DOM** (28 unique checkbox keys + 7 sections = 35) instead of the hardcoded 39 — the bar now reaches 100%.
- **Duplicate `s4-1` → `s4-3`.**
- **Copy reconciled:** one Opus-default model picker (matches "Start on Opus"); help-router `limit` route now says step down to Sonnet, not Haiku.
- **~53 MB lighter:** use-case GIFs → existing MP4s (~28 MB); the redundant 25 MB local setup video dropped in favor of the YouTube embed (its broken poster removed with it). All images `loading="lazy"`.
- **Hero graph** pauses offscreen via `IntersectionObserver` and respects `prefers-reduced-motion`.
- **`js/ui.js` moved to end of body**; all `setTimeout` polling removed.
- **`certificate.html`** (new): name prompt → Magic-styled certificate with completion date, plus print-to-PDF. The progress link flips from "Continue →" to "Get your certificate →" (opens a new tab) at 100%. Verification code removed — no AL verifier tool exists, so the code implied a check that couldn't be performed.

> Note: the feedback CTA now points to a `mailto:` fallback — swap in the live Google Form URL once built (see `FEEDBACK-FORM.md`).
