import type { ClientFile, Persona } from "@/story/types"

/* Fictional client for the Lead gen and sales path. Nothing here is real. */
export const NADIA: Persona = {
  id: "nadia",
  name: "Nadia Cole",
  first: "Nadia",
  company: "Cole Talent Partners",
  what: "a six-person B2B recruiting agency",
  city: "Chicago, Illinois",
  tzShort: "CT",
  initials: "NC",
  prefs: [
    "Book the call, do not pitch. An email's only job is a fifteen-minute meeting.",
    "Every lead has a source and a reason. No list without both.",
    "Nothing goes to a prospect until I have seen the first two.",
  ],
  voice: "Confident, short, specific. Names the company and one proof point. Ends with one question. Signs off Nadia.",
  pron: { they: "she", them: "her", their: "her" },
}

export const FILES: Record<string, ClientFile> = {
  icp: { id: "icp", name: "Ideal client notes.docx", kind: "doc" },
  calls: { id: "calls", name: "Discovery calls, last week (Fathom)", kind: "recording" },
  pipeline: { id: "pipeline", name: "Pipeline (HubSpot)", kind: "sheet" },
  examples: { id: "examples", name: "Outreach examples.docx", kind: "doc" },
  list: { id: "list", name: "Prospect list, draft.xlsx", kind: "sheet" },
  deck: { id: "deck", name: "Agency overview.pdf", kind: "pdf" },
}

export const PROJECTS = [
  { id: "cole", label: "Cole Talent", ok: true },
  { id: "downloads", label: "Downloads", ok: false, why: "Claude can read, change and delete anything in the folder you pick. Keep it to the client's project." },
  { id: "home", label: "Your whole home folder", ok: false, why: "Far too wide. Claude only needs the client's project." },
]
