# Integrate the Funnel Dashboard into the site

**For:** Claude Code, working in this repo (`claude-onboarding`).
**Goal:** Add a second app — the **Funnel Dashboard** (the MEA Ops Claude pilot tracker) — to this site, and put a simple **landing page** in front that lets people choose between two apps: the **Onboarding Guide** (the current site) and the **Funnel Dashboard**. Keep the two apps cleanly separated — do **not** merge the dashboard into the onboarding pages.

This is a plain static site served by Cloudflare Workers (`wrangler.jsonc`, `assets.directory = "."`). No build step, no bundler — files are served as they sit.

---

## What's already been added to the repo

```
landing.html                         # NEW two-choice landing page (styled with css/styles.css)
funnel-dashboard/
  index.html                         # NEW the Funnel Dashboard app (self-contained, reads ./data.json)
  data.json                          # NEW sanitized pilot data (NO passwords) — the dashboard's data source
  generate-data.py                   # NEW regenerates data.json from the Google Sheet .xlsx export
  _source/                           # reference only — do NOT deploy/link
    pilot-command-center.artifact.html   # original Cowork artifact version (uses the live Cowork bridge)
    dashboard_mockups.html               # earlier design mockups
    SESSION_NOTES_colAE_2026-07-09.tsv   # per-assistant Cowork session notes
```

The dashboard is the same UI as the Cowork "Pilot Command Center" artifact, adapted for the web:
- The Cowork data bridge (`window.cowork.callMcpTool`) was replaced with `fetch('./data.json')`.
- League Spartan is wired via `@font-face` to `../assets/fonts/league-spartan-3.woff2` (same font the site already ships).
- The Magic design tokens/colors are inlined and match `css/styles.css`.

---

## Tasks

### 1. Landing page becomes the site entry
- Rename the current onboarding page: `index.html` → `onboarding.html`.
- Promote the landing: `landing.html` → `index.html`.
- The onboarding page keeps all its **relative** references (`css/…`, `js/…`, `assets/…`) — they still resolve because it stays at the repo root. Verify it still loads after the rename.
- Search the onboarding page and JS for any self-links that assume it's at `/` or `index.html` (e.g. "back to top"/brand links, canonical URLs, `certificate.html` links) and update them to `onboarding.html` where they should return to the guide. The brand/logo link that scrolls to top can stay as-is.
- The new landing (`index.html`) links to `onboarding.html` and `funnel-dashboard/`. Confirm both links work.

### 2. Funnel Dashboard app
- Served at `/funnel-dashboard/` (its `index.html`). It is self-contained and needs only `data.json` beside it and the shared fonts at `../assets/fonts/`.
- Add a small "← Back to home" link at the top of `funnel-dashboard/index.html` pointing to `../` (optional but recommended). Do the same on `onboarding.html` if desired. Keep it minimal — don't restyle the apps.

### 3. Data source (important — read before deploying)
The dashboard reads **`funnel-dashboard/data.json`**. It must **never** read the raw Google Sheet on the client, because the sheet's **Password column** and other PII must not be published. `data.json` is already sanitized (no passwords).

Pick one refresh strategy:

- **A. Scheduled export (recommended, already partly set up).** A Claude scheduled task (`pilot-cc-weekday-datapull`, weekdays 9PM PHT) already pulls the sheet. Extend it (or a small commit step) to run `funnel-dashboard/generate-data.py <exported.xlsx>` and commit the refreshed `data.json`, then redeploy. This keeps the site static and safe.
- **B. Cloudflare Worker endpoint.** Add a Worker function that fetches the sheet server-side (Sheets API with a service account, or a "Publish to web" CSV of the **EA Pilot 62 tab only**), strips sensitive columns server-side, and returns JSON at `/funnel-dashboard/data.json`. Use this if you want near-real-time data without commits. Never expose the Password column.
- **C. Manual.** Whenever the sheet changes: `File → Download → .xlsx`, then `python3 funnel-dashboard/generate-data.py <file>.xlsx`, commit, deploy.

`data.json` schema (array of assistant objects). Booleans are real JSON booleans:

```
name, hsEmail, dealCard, client, vertical, al, status, email,
invited, accessed, confirmed, desktop, cowork,           // access funnel booleans
reachType, emailReach, discordReach, discordUN, reachNotes,
callDate, callCat ("" | "call1" | "call2" | "done"), facil, profile, rec, insight,
bonus, dateFiled, rate, payout, gen, sessionNote,
reached (bool), inPilot (bool)
```
The dashboard computes all KPIs/funnel/roster from this array, so the shape must stay stable. `generate-data.py` is the source of truth for producing it — update both together if columns change.

### 4. Do not touch the onboarding content
Only the rename + link updates above are allowed on the onboarding side. Do not move dashboard sections into the guide or vice-versa. The `_source/` folder is reference material — exclude it from what users can reach (it's fine to leave in the repo; just don't link it).

### 5. Deploy
No build step. Preview locally with `python3 -m http.server 8000`. Deploy per `DEPLOY.md` (Cloudflare Workers via `npx wrangler deploy`, or Cloudflare Pages). Confirm three routes after deploy:
- `/` → landing (two choices)
- `/onboarding.html` → the guide
- `/funnel-dashboard/` → the dashboard, with data loaded

---

## Acceptance checklist
- [ ] `/` shows the two-choice landing, styled consistently with the site (League Spartan, Magic violet, soft cards).
- [ ] Onboarding guide works unchanged at `/onboarding.html` (all assets, JS, certificate link intact).
- [ ] `/funnel-dashboard/` loads, KPIs + funnel + roster render from `data.json`, filters/drawer/search work.
- [ ] No password or PII is present in `data.json` or anywhere client-reachable.
- [ ] A documented way to refresh `data.json` is in place (A, B, or C above).
- [ ] `_source/` is not linked from any user-facing page.

## Business rules (keep consistent)
- **Needs-action owner mapping** (the "Needs action" board groups each in-pilot assistant by who owns their next step):
  - Not invited / not accessed / not confirmed → **Access · Alver**
  - Not on desktop / no first Cowork message → **Access · AL**
  - Any insight-call step (schedule / Call 1 / Call 2) → **Insight call · BizOps + Product** (joint POC — do **not** split into separate BizOps and Product buckets)
  - Call done but bonus not filed → **Incentive**
- This mapping lives in the `nextAction(p)` function and the `order` array inside `funnel-dashboard/index.html`. If you change one, change both, and keep the insight-call owner as the single combined "BizOps + Product" bucket.

## Notes / gotchas
- The dashboard's usage **leaderboard** uses a small embedded snapshot from the "Cowork Users" tab (it is not in `data.json`); refresh it in `funnel-dashboard/index.html` (the `USAGE` object) when you want updated session/day counts, or extend `generate-data.py` to emit it too.
- Keep `funnel-dashboard/index.html` self-contained (inline CSS/JS) to match the "no bundler" convention.
- The name shown to users is **Funnel Dashboard** (internally this was the "Pilot Command Center").
