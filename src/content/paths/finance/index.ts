import type { PathDef } from "@/story/types"
import { MARCO } from "./persona"
import { SHIFT_1 } from "./shift1"
import { SHIFT_2 } from "./shift2"
import { SHIFT_3 } from "./shift3"

export const FINANCE: PathDef = {
  id: "finance",
  name: "Bookkeeping and finance admin",
  blurb: "Invoices, bills, reconciliation",
  icon: "calculator",
  live: true,
  persona: MARCO,
  shifts: [SHIFT_1, SHIFT_2, SHIFT_3],
  launchpad: {
    recurring: ["invoice entry", "bank reconciliation", "overdue reminders (drafts)", "weekly cash summary", "month-end statements"],
    platforms: ["QuickBooks", "Gmail", "Google Sheets", "Google Drive", "Xero"],
  },
}
