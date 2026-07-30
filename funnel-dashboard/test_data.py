#!/usr/bin/env python3
"""
Data-contract test for the Funnel Dashboard's data files.

Run before committing / in CI:  python3 funnel-dashboard/test_data.py
Exits non-zero on any failure. Catches regressions (bad structure, leaked PII,
corrupt/zeroed funnel) WITHOUT needing the raw sheet — a cheap guard against the
next time the source sheet is re-ordered.
"""
import json, os, sys

D = os.path.dirname(os.path.abspath(__file__))
fails = []
def check(cond, msg):
    if not cond: fails.append(msg)

# --- data.json ---
data = json.load(open(os.path.join(D, "data.json"), encoding="utf-8"))
check(isinstance(data, dict) and "assistants" in data and "usage" in data,
      "data.json must be an object with 'assistants' and 'usage'")
A = data.get("assistants", []) if isinstance(data, dict) else data
check(15 <= len(A) <= 60, f"expected 15-60 assistants, got {len(A)}")

required = ["name", "al", "status", "email", "invited", "accessed", "confirmed",
            "desktop", "cowork", "callCat", "call2Date", "call2Facil", "call2Rec",
            "bonus", "reached", "inPilot", "profile", "rec", "inactive", "revokeReason",
            "seat", "seatStatus", "seatTier", "sessionCount", "lastSession"]
for p in (A[:1] + A[-1:]):
    for k in required:
        check(k in p, f"assistant missing key {k!r}")
check(all(isinstance(p.get("invited"), bool) for p in A), "invited must be boolean")
check(all(isinstance(p.get("inactive"), bool) for p in A), "inactive must be boolean")
# at least one inactive so the labelling path is exercised, and every inactive must
# match its definition (has a revoke reason OR a CHURNED status) — never a stray flag
check(sum(1 for p in A if p.get("inactive")) > 0, "0 inactive assistants — revoke mapping likely broke")
check(all(p.get("revokeReason") or p.get("status") == "CHURNED"
          for p in A if p.get("inactive")), "an inactive assistant matches neither revoke nor CHURNED")
check(all(p.get("callCat") in ("", "call1", "call2", "done") for p in A),
      "callCat has an invalid value")

# funnel must not be collapsed (the exact failure a sheet column-shift causes)
inv = sum(1 for p in A if p.get("invited"));       check(inv > 0, "0 invited — likely corrupt data")
pipeline = sum(1 for p in A if p.get("callCat"));   check(pipeline > 0, "0 in insight-call pipeline — likely a column shift")

# usage
U = data.get("usage", {}) if isinstance(data, dict) else {}
check(isinstance(U, dict) and len(U) > 0, "usage is empty")
for em, u in list(U.items())[:3]:
    for k in ("sessions", "active_days", "cost", "tokens",
              "skills", "distinctSkills", "hooks", "toolOk"):
        check(k in u and isinstance(u[k], (int, float)), f"usage[{em}] missing/invalid {k!r}")

# seat reconciliation from the "Confirmed Access" tab
S = data.get("seats") if isinstance(data, dict) else None
check(isinstance(S, dict), "data.json must carry a 'seats' object")
if isinstance(S, dict):
    for k in ("total", "active", "pending", "roster", "internal"):
        check(isinstance(S.get(k), int), f"seats missing/invalid {k!r}")
    check(S.get("total", 0) > 0, "0 Claude Team seats — Confirmed Access likely not parsed")
    check(S.get("active", 0) + S.get("pending", 0) <= S.get("total", 0),
          "seats active+pending exceeds total")
    check(S.get("roster", 0) + S.get("internal", 0) == S.get("total", 0),
          "seats roster+internal must equal total")
check(isinstance(data.get("dataFlags"), list), "data.json must carry a 'dataFlags' array")
# every assistant flagged as holding a seat must have an Active seat status
check(all(p.get("seatStatus", "").lower() == "active" for p in A if p.get("seat")),
      "an assistant has seat=True without an Active seat status")

# PII / secrets must NEVER appear
blob = json.dumps(data).lower()
for bad in ("passw", "redacted", "all_prompts"):
    check(bad not in blob, f"leaked {bad!r} in data.json")

# --- history.json ---
try:
    H = json.load(open(os.path.join(D, "history.json"), encoding="utf-8"))
except FileNotFoundError:
    H = None
check(isinstance(H, list) and len(H) > 0, "history.json must be a non-empty array")
if isinstance(H, list):
    check(all(isinstance(h, dict) and "date" in h and "k" in h for h in H),
          "each history entry needs 'date' and 'k'")

if fails:
    print("DATA CONTRACT FAILED:")
    for m in fails: print("  -", m)
    sys.exit(1)
print(f"OK: {len(A)} assistants, {len(U)} usage rows, {len(H)} history days — "
      f"structure / funnel / usage / PII checks all passed.")
