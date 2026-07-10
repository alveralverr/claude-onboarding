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

Column mapping (row 1 = section headers, row 2 = column names, row 3+ = data):
    A Name  B HS Email  C Deal Card Link  D Client Name  E Account Lead  F Status
    G Magic Assistant Email  H Password(OMITTED)  I Revoke Reason  J Claude Join Date
    K Invited  L Accessed  M Access confirmed  N Desktop installed  O Has Cowork usage
    P Verticals  Q Cowork Session Notes  R Reachout Type  S Email Reachout
    T Discord Reachout  U Discord UN  V Reachout Notes  W Insight Call Date
    X Call Status  Y Facilitator  Z EA Profile Link(hyperlink)  AA Recording(hyperlink)
    AB Insight Call Notes  AC Bonus Filed  AD Date Filed  AE Rate  AF Payout  AG General Notes
Keep this in sync with the sheet AND with the schema the dashboard consumes.
"""
import sys, os, re, json, datetime
try:
    import openpyxl
except ImportError:
    sys.exit("pip install openpyxl")

XLSX = sys.argv[1] if len(sys.argv) > 1 else "Claude_Transition_MEA_Ops.xlsx"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.json")
TAB = "EA Pilot 62"

# Two loads: data_only for cached cell values, default for hyperlink targets
# (cells like "EA Profile Link" show display text but carry the URL as a hyperlink).
wb = openpyxl.load_workbook(XLSX, data_only=True)
if TAB not in wb.sheetnames:
    sys.exit(f'Tab "{TAB}" not found. Available: {wb.sheetnames}')
ws = wb[TAB]
wsh = openpyxl.load_workbook(XLSX)[TAB]
rows = list(ws.iter_rows(values_only=True))

def v(x): return "" if x is None else str(x).strip()
def tb(x): return v(x).lower() == "true"
def link(sheet_row, col1):
    """Hyperlink target for a 1-based (row, col); fall back to a URL-looking value."""
    c = wsh.cell(row=sheet_row, column=col1)
    if c.hyperlink and c.hyperlink.target:
        return c.hyperlink.target.strip()
    val = v(c.value)
    return val if val.startswith("http") else ""
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
for ri, r in enumerate(rows):
    if ri < 2:            # rows 1-2 are headers
        continue
    if r[0] in (None, ""):
        continue
    sheet_row = ri + 1    # openpyxl is 1-based
    email = v(r[6]); email = email if email and email != "N/A" else ""
    status = v(r[5]).upper()
    o = dict(
        name=v(r[0]), hsEmail=v(r[1]), dealCard=v(r[2]), client=v(r[3]),
        al=clean_al(v(r[4])), status=status, email=email,
        invited=tb(r[10]), accessed=tb(r[11]), confirmed=tb(r[12]), desktop=tb(r[13]), cowork=tb(r[14]),
        vertical=v(r[15]), sessionNote=v(r[16]),
        reachType=v(r[17]), emailReach=tb(r[18]), discordReach=tb(r[19]), discordUN=v(r[20]), reachNotes=v(r[21]),
        callDate=v(r[22]), callCat=call_cat(v(r[23])), facil=v(r[24]),
        profile=link(sheet_row, 26),   # Z  EA Profile Link (hyperlink target)
        rec=link(sheet_row, 27),       # AA Meeting Recording Link (hyperlink target)
        insight=v(r[27]),              # AB Insight Call Notes
        bonus=tb(r[28]), dateFiled=v(r[29]), rate=v(r[30]), payout=v(r[31]),
        gen=v(r[32]),                  # AG General Notes
        # Password (col H / index 7) intentionally omitted.
    )
    o["reached"] = o["emailReach"] or o["discordReach"]
    o["inPilot"] = bool(email) and status not in ("CHURNED", "")
    out.append(o)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(f"Wrote {OUT} with {len(out)} assistants (passwords excluded) at {datetime.datetime.now().isoformat(timespec='seconds')}")
