# Funnel Dashboard

The **Funnel Dashboard** (internally "Pilot Command Center") tracks the MEA Ops
Claude pilot. It is a self-contained static page: `index.html` (inline CSS/JS)
reads its data from `./data.json` beside it and the shared fonts from
`../assets/fonts/`. Served at `/funnel-dashboard/`.

## Security — read first
- The dashboard **never** reads the raw Google Sheet on the client. The sheet's
  **Password column (col H)** and other PII must not be published.
- `data.json` is the sanitized data source — **no passwords**. `generate-data.py`
  is the only thing that produces it and it deliberately omits the Password column.
- `_source/` (raw Cowork artifact, mockups, per-assistant session notes) and the
  Python scripts (`*.py`) are **excluded from deploy** via `.assetsignore`. Do not
  link them from any user-facing page.
- The dashboard serves real names/emails with **no auth**. To restrict it, put
  **Cloudflare Access** in front of the route (see "Restricting access" below) — a
  config change, no code change.

## Tooling
- `generate-data.py <xlsx>` — regenerate `data.json` + append to `history.json`
  (header-mapped, sanity-checked; aborts rather than writing corrupt data).
- `test_data.py` — data-contract test; run before committing / in CI. Exits
  non-zero on bad structure, leaked PII, or a collapsed funnel.
- `build-artifact.py [out.html]` — build the self-contained Claude artifact copy
  (font + `data.json` + `history.json` inlined, CSP-safe), then publish it to the
  pinned artifact URL.

## Restricting access (Cloudflare Access — optional)
The static site has no login. To gate `/funnel-dashboard/` to your team:
1. Cloudflare dashboard → **Zero Trust → Access → Applications → Add a self-hosted app**.
2. Path: the dashboard host + `/funnel-dashboard*` (and `/` if you also want the landing gated).
3. Policy: **Allow** where **Emails ending in** `@getmagic.com` (or an explicit allow-list).
4. Save. Cloudflare then requires an email one-time-PIN / SSO before the page loads.
No code changes; the funnel data stays where it is.

## Refreshing `data.json`

`data.json` is regenerated from the "EA Pilot 62" tab of the
"Claude Transition - MEA Ops" workbook. Pick one strategy:

### A. Scheduled export (recommended)
The Claude scheduled task `pilot-cc-weekday-datapull` (weekdays 9PM PHT) already
pulls the sheet. Extend it to run the generator and commit + redeploy:

```bash
python3 funnel-dashboard/generate-data.py <exported.xlsx>
git add funnel-dashboard/data.json && git commit -m "Refresh funnel data"
npx wrangler deploy   # see ../DEPLOY.md
```

### B. Cloudflare Worker endpoint
Add a Worker that fetches the **EA Pilot 62 tab only** server-side (Sheets API
with a service account, or a "Publish to web" CSV), strips sensitive columns, and
serves JSON at `/funnel-dashboard/data.json`. Use for near-real-time data without
commits. **Never expose the Password column.**

### C. Manual (simplest)
```bash
# In the Google Sheet: File → Download → Microsoft Excel (.xlsx)
python3 funnel-dashboard/generate-data.py ~/Downloads/Claude_Transition_MEA_Ops.xlsx
git add funnel-dashboard/data.json && git commit -m "Refresh funnel data"
npx wrangler deploy
```

`generate-data.py` requires `openpyxl` (`pip install openpyxl`).

## `data.json` schema
An **object** (booleans are real JSON booleans):

```
{
  "generatedAt": "<iso>",         # when the file was produced
  "usageAsOf":   "YYYY-MM-DD",    # latest Cowork session date (labels the leaderboard)
  "assistants":  [ {…}, … ],      # one object per assistant (below)
  "usage":       { "<magicassistant email>": {sessions, active_days, cost, tokens}, … }
}
```

Each **assistant** object:
```
name, hsEmail, dealCard, client, vertical, al, status, email,
invited, accessed, confirmed, desktop, cowork,           # access funnel booleans
reachType, emailReach, discordReach, discordUN, reachNotes,
callDate, callCat ("" | "call1" | "call2" | "done"), facil, profile, rec, insight,
bonus, dateFiled, rate, payout, gen, sessionNote,
reached (bool), inPilot (bool)
```

The dashboard reads `data.assistants` and `data.usage` (falling back gracefully if a
legacy array is served). Columns are resolved **by header name** in
`generate-data.py` (the sheet gets re-ordered periodically), with a **sanity check**
that aborts rather than overwriting good data with corrupt zeros.

`history.json` — array of daily aggregate snapshots (`{date, k:{cow,notStarted,
callsToRun,incPayN,invited,…}}`), appended each refresh. The dashboard uses it for
the KPI **sparklines and week-over-week deltas** (durable + shared, vs. per-browser
localStorage). Commit it alongside `data.json`.

## Other notes
- **Cowork usage** is now emitted into `data.json` (`usage`) from the "Cowork Users"
  tab — no more stale hardcoded snapshot. The raw "Cowork Sessions" tab (which
  contains prompt text) is **never** read/exported.
- **Needs-action owner mapping** lives in both the `nextAction(p)` function and the
  `order` array in `index.html` — change both together. Keep the insight-call owner
  as the single combined **"Insight call · BizOps + Product"** bucket (do not split).
