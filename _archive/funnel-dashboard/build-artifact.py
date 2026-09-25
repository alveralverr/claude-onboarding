#!/usr/bin/env python3
"""
Build a self-contained artifact copy of the dashboard: the League Spartan font,
data.json, and history.json are all INLINED (Claude artifacts run under a strict
CSP — no external fonts, no fetch), and the outer <!doctype>/<html>/<head>/<body>
tags are stripped (the Artifact host wraps content in its own skeleton).

Usage:  python3 funnel-dashboard/build-artifact.py [out.html]
        (default out: /tmp/claude-funnel-dashboard-artifact.html)

Then publish the produced file with the Artifact tool, keeping the pinned URL:
        https://claude.ai/code/artifact/6dc98eac-d460-4a6f-81e6-33801ef51af3
"""
import base64, json, re, sys, os

D = os.path.dirname(os.path.abspath(__file__))
out_path = sys.argv[1] if len(sys.argv) > 1 else "/tmp/claude-funnel-dashboard-artifact.html"

html = open(os.path.join(D, "index.html"), encoding="utf-8").read()
data = json.dumps(json.load(open(os.path.join(D, "data.json"), encoding="utf-8")), ensure_ascii=True)
hist = json.dumps(json.load(open(os.path.join(D, "history.json"), encoding="utf-8")), ensure_ascii=True)
font = base64.b64encode(open(os.path.join(D, "..", "assets", "fonts", "league-spartan-3.woff2"), "rb").read()).decode()

html = html.replace("src:url('../assets/fonts/league-spartan-3.woff2') format('woff2')",
                    f"src:url('data:font/woff2;base64,{font}') format('woff2')")
of = "async function fetchData(){const r=await fetch('./data.json',{cache:'no-store'});if(!r.ok)throw new Error('data.json '+r.status);return await r.json();}"
oh = "async function fetchHistory(){try{const r=await fetch('./history.json',{cache:'no-store'});if(!r.ok)return[];const h=await r.json();return Array.isArray(h)?h:[];}catch(e){return[];}}"
assert of in html and oh in html, "fetch signatures changed — update build-artifact.py"
html = html.replace(of, "const DATA=" + data + ";\nasync function fetchData(){return DATA;}")
html = html.replace(oh, "const HIST=" + hist + ";\nasync function fetchHistory(){return HIST;}")
html = re.sub(r'\s*<a href="\.\./"[^>]*>&larr; Back to home</a>', '', html)
# drop the password gate entirely — the artifact is already private on claude.ai
# (no double-gate). Remove the lock markup AND the gate script (so the password value
# and the "password" word don't ride along); the dashboard just calls init() directly.
html = re.sub(r'<div class="cd-lock" id="cdLock".*?</form>\s*</div>\s*', '', html, count=1, flags=re.S)
html = re.sub(r'/\* ---- access gate.*?\}\)\(\);', 'init();', html, count=1, flags=re.S)
html = re.sub(r'<script>try\{if\(localStorage\.getItem\(.funnel-unlocked.\).*?</script>\s*', '', html, count=1, flags=re.S)

html = html.replace('<!DOCTYPE html>', '').replace('<html lang="en">', '')
html = re.sub(r'<head>\s*', '', html, count=1)
html = re.sub(r'<meta name="viewport"[^>]*>\s*', '', html, count=1)
html = html.replace('</head>', '', 1).replace('<body>', '', 1).replace('</body>', '', 1).replace('</html>', '', 1)
html = re.sub(r'<meta charset="UTF-8">\s*', '', html, count=1).strip()
html = '<meta charset="utf-8">\n' + html

for bad in ("fetch(", "./data.json", "./history.json", "../assets", "<!DOCTYPE", "password", "all_prompts"):
    assert bad not in html, f"artifact still contains {bad!r} — build is unsafe"

open(out_path, "w", encoding="utf-8").write(html)
print(f"Wrote {out_path} ({len(html)} chars). Publish it via the Artifact tool to the pinned URL "
      f"https://claude.ai/code/artifact/6dc98eac-d460-4a6f-81e6-33801ef51af3")
