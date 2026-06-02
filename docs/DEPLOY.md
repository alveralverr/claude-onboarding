# Deploying the Playbook

This is a plain static site — **no build step, no npm, no bundler**. The files are
served exactly as they sit in this folder. To edit content, open `index.html`,
`css/styles.css`, or the files in `js/` and change them directly.

```
docs/
  index.html          # the page
  css/styles.css      # all styles
  js/app.js           # progress persistence, copy buttons, model picker, help router
  js/ui.js            # toggles, model table, table-of-contents tracker
  js/hero-graph.js    # the three.js hero animation
  assets/             # logo.png + League Spartan fonts
```

three.js is loaded from a CDN (jsdelivr / cdnjs) — the only external dependency.

## Preview locally

```bash
cd docs
python3 -m http.server 8000
# open http://localhost:8000
```

(Open via a server, not by double-clicking `index.html` — `file://` blocks the
font and module loads. Any static server works.)

---

## Option A — GitHub Pages (simplest)

1. From the repo root, commit everything:
   ```bash
   git init                      # only if this isn't a repo yet
   git add .
   git commit -m "Add Playbook static site"
   ```
2. Create the GitHub repo and push:
   ```bash
   gh repo create <repo-name> --public --source=. --push
   # or create it on github.com and: git remote add origin <url> && git push -u origin main
   ```
3. On GitHub: **Settings → Pages**.
   - **Source:** Deploy from a branch
   - **Branch:** `main`  •  **Folder:** `/docs`
   - **Save**
4. After ~1 minute the site is live at `https://<user>.github.io/<repo-name>/`.

No Actions, no build, no bundle errors — GitHub serves `/docs` verbatim.

**Custom domain (optional):** add it in the Pages "Custom domain" box, then create
a file `docs/CNAME` containing just your domain (e.g. `playbook.example.com`).

---

## Option B — Cloudflare Pages

**Via Git (auto-deploys on every push):**
1. Push the repo to GitHub/GitLab as above.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo, then set:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `docs`
4. **Save and Deploy** → live at `https://<project>.pages.dev`.

**Or drag-and-drop (no Git):**
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Upload assets**.
2. Drag the **contents of the `docs/` folder** (so `index.html` is at the root of
   the upload), name the project, **Deploy**.

**Custom domain:** project → **Custom domains → Set up a domain**.

---

## Notes

- The original single-file bundle lives at `output/playbook-split/index.html`
  (and `output/Claude Onboarding Playbook v*.html`). It is kept for offline /
  email distribution; this `docs/` folder is the editable, deployable version.
- To regenerate this folder from a new bundle, run
  `python3 output/playbook-split/unbundle.py`. It also copies the page's media
  from the repo-root `assets/` folder into `docs/assets/`.

### Size & media

- `docs/` is ~80 MB. The bulk is animated GIFs and a video:
  `claude-usecase-3.gif` (26 MB), `claude-usecase-4.gif` (14 MB),
  `cowork-thumbnail.gif` (16 MB), `setup-guide.mp4` (25 MB).
- This is fine for GitHub Pages (1 GB site limit, 100 MB/file) and Cloudflare
  Pages (25 MB/file — **note: `claude-usecase-3.gif` at 26 MB exceeds this**, so
  on Cloudflare either compress it or host that one file elsewhere).
- **Optional optimization:** converting the large GIFs to `.mp4`/`.webm` would
  cut the repo by ~50 MB and load far faster. Not required to deploy.

### Known gap

- `assets/setup-guide-thumb.jpg` (the poster image for the setup video) does not
  exist anywhere in the source repo, so it 404s — the video still plays, it just
  shows its first frame instead of a poster. To silence it, either add the file
  to `assets/` or remove the `poster="assets/setup-guide-thumb.jpg"` attribute
  from the `<video id="introVideo">` tag in `index.html`.
