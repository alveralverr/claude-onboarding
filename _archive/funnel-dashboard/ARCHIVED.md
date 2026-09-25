# ARCHIVED — Funnel Dashboard (deprecated 2026-09-25)

Removed from the site: the landing-page card was deleted and `_archive/` is
excluded from deploy via `.assetsignore`. This folder is safe to move out of
the repo by hand.

Notes if you ever revive it:
- `index.html` loads fonts from `../assets/fonts/` and links "Back to home" to
  `../`. Those paths only resolve when the folder sits at the site root as
  `funnel-dashboard/`.
- `data.json` / `history.json` hold real assistant names and emails. Don't
  publish them without Cloudflare Access in front.
- The auto-refresh job that committed `chore: auto-refresh funnel data` wrote to
  `funnel-dashboard/`. Disable it, or it will recreate that folder at the root.
