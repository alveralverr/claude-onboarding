import type { PathDef } from "@/story/types"
import { NADIA } from "./persona"
import { SHIFT_1 } from "./shift1"
import { SHIFT_2 } from "./shift2"
import { SHIFT_3 } from "./shift3"

export const LEADGEN: PathDef = {
  id: "leadgen",
  name: "Lead gen and sales",
  blurb: "Lead lists, outreach, CRM",
  icon: "magnet",
  live: true,
  persona: NADIA,
  shifts: [SHIFT_1, SHIFT_2, SHIFT_3],
  launchpad: {
    recurring: ["lead lists with sources", "follow-up drafts from calls", "CRM updates", "weekly pipeline brief", "prospect research"],
    platforms: ["HubSpot", "Gmail", "Fathom", "LinkedIn Sales Navigator", "Google Sheets"],
  },
}
