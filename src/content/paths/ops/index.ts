import type { PathDef } from "@/story/types"
import { TOM } from "./persona"
import { SHIFT_1 } from "./shift1"
import { SHIFT_2 } from "./shift2"
import { SHIFT_3 } from "./shift3"

export const OPS: PathDef = {
  id: "ops",
  name: "Operations and data",
  blurb: "Trackers, SOPs, spreadsheets",
  icon: "workflow",
  live: true,
  persona: TOM,
  shifts: [SHIFT_1, SHIFT_2, SHIFT_3],
  launchpad: {
    recurring: ["data cleanup and dedupe", "call notes into tasks", "SOP writing", "weekly status", "dispatch or schedule sheet"],
    platforms: ["ClickUp", "Google Sheets", "Google Drive", "Fathom", "Asana"],
  },
}
