import type { PathDef } from "@/story/types"
import { PRIYA } from "./persona"
import { SHIFT_1 } from "./shift1"
import { SHIFT_2 } from "./shift2"
import { SHIFT_3 } from "./shift3"

export const ADMIN: PathDef = {
  id: "admin",
  name: "General admin",
  blurb: "Inbox, calendar, travel, research",
  icon: "inbox",
  live: true,
  persona: PRIYA,
  shifts: [SHIFT_1, SHIFT_2, SHIFT_3],
  launchpad: {
    recurring: ["daily EOD report", "inbox triage and drafts", "calendar and time zones", "meeting notes to tasks", "vendor research"],
    platforms: ["Gmail", "Google Calendar", "Google Drive", "ClickUp", "Fathom"],
  },
}
