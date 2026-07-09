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
- `_source/` (raw Cowork artifact, mockups, per-assistant session notes) and
  `generate-data.py` are **excluded from deploy** via `.assetsignore`. Do not link
  them from any user-facing page.

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
Array of assistant objects (booleans are real JSON booleans):

```
name, hsEmail, dealCard, client, vertical, al, status, email,
invited, accessed, confirmed, desktop, cowork,           # access funnel booleans
reachType, emailReach, discordReach, discordUN, reachNotes,
callDate, callCat ("" | "call1" | "call2" | "done"), facil, profile, rec, insight,
bonus, dateFiled, rate, payout, gen, sessionNote,
reached (bool), inPilot (bool)
```

The dashboard computes all KPIs / funnel / roster from this array, so the shape
must stay stable. If columns change, update `generate-data.py` and the dashboard
together.

## Other notes
- The **usage leaderboard** uses a small embedded snapshot (the `USAGE` object in
  `index.html`) from the "Cowork Users" tab — it is **not** in `data.json`. Refresh
  it by editing `USAGE`, or extend `generate-data.py` to emit it.
- **Needs-action owner mapping** lives in both the `nextAction(p)` function and the
  `order` array in `index.html` — change both together. Keep the insight-call owner
  as the single combined **"Insight call · BizOps + Product"** bucket (do not split).
