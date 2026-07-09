#!/usr/bin/env python3
"""
Generate funnel-dashboard/data.json from the "Claude Transition - MEA Ops" workbook.

The Funnel Dashboard (index.html) is a static page: it cannot call the live Google
Sheet, so it reads ./data.json instead. This script produces that file.

SECURITY: the source sheet has a Password column (col H) — it is intentionally
NEVER written to data.json. Do not publish the raw sheet to the web.

Usage:
    python3 generate-data.py path/to/Claude_Transition_MEA_Ops.xlsx
    # writes data.json next to this script

The .xlsx can be produced by exporting the Google Sheet (File > Download > .xlsx)
or via the Drive API. The tab used is "EA Pilot 62" (source of truth).
"""
import sys, os, re, json, datetime
try:
    import openpyxl
except ImportError:
    sys.exit("pip install openpyxl")

XLSX = sys.argv[1] if len(sys.argv) > 1 else "Claude_Transition_MEA_Ops.xlsx"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.json")
TAB = "EA Pilot 62"

wb = openpyxl.load_workbook(XLSX, data_only=True)
rows = list(wb[TAB].iter_rows(values_only=True))
data = [r for r in rows[2:] if r[0] not in (None, "")]

def v(x): return "" if x is None else str(x).strip()
def tb(x): return v(x).lower() == "true"
def clean_al(s):
    a = re.sub(r"\s+Bot\s+", " ", s or "")
    a = re.sub(r"\s*Kenreich\s*", " ", a)
    a = re.sub(r"\s+", " ", a).strip()
    return a if a and a != "N/A" else "Unassigned"
def call_cat(s):
    s = s or ""
    if re.search("Call 1", s, re.I): return "call1"
    if re.search("Call 2", s, re.I): return "call2"
    if re.search("Done|Completed", s, re.I): return "done"
    return ""

out = []
for r in data:
    email = v(r[6]); email = email if email and email != "N/A" else ""
    status = v(r[5]).upper()
    o = dict(
        name=v(r[0]), hsEmail=v(r[1]), dealCard=v(r[2]), client=v(r[3]),
        al=clean_al(v(r[4])), status=status, email=email,
        invited=tb(r[9]), accessed=tb(r[10]), confirmed=tb(r[11]), desktop=tb(r[12]), cowork=tb(r[13]),
        reachType=v(r[14]), emailReach=tb(r[15]), discordReach=tb(r[16]), discordUN=v(r[17]), reachNotes=v(r[18]),
        callDate=v(r[19]), callCat=call_cat(v(r[20])), facil=v(r[21]), profile=v(r[22]), rec=v(r[23]), insight=v(r[24]),
        bonus=tb(r[25]), dateFiled=v(r[26]), rate=v(r[27]), payout=v(r[28]),
        vertical=v(r[29]), gen=v(r[30]), sessionNote=v(r[31]),
        # Password (col H / index 7) intentionally omitted.
    )
    o["reached"] = o["emailReach"] or o["discordReach"]
    o["inPilot"] = bool(email) and status not in ("CHURNED", "")
    out.append(o)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(f"Wrote {OUT} with {len(out)} assistants (passwords excluded) at {datetime.datetime.now().isoformat(timespec='seconds')}")
