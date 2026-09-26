import type { ClientFile, Persona } from "@/story/types"

/* Fictional client for the General admin path. Nothing here is real. */
export const PRIYA: Persona = {
  id: "priya",
  name: "Priya Menon",
  first: "Priya",
  company: "Menon Studio",
  what: "a 12-person architecture studio",
  city: "Austin, Texas",
  tzShort: "CT",
  initials: "PM",
  prefs: [
    "No contractions in emails to clients or partners.",
    "A plan by noon her time: three bullets, done, next, needs you.",
    "Nothing booked before 9 or after 5 her time.",
  ],
  voice: "Short, warm and plain. First names. No exclamation marks. Signs off Priya.",
  pron: { they: "she", them: "her", their: "her" },
}

export const FILES: Record<string, ClientFile> = {
  voice: { id: "voice", name: "Brand and voice notes.docx", kind: "doc" },
  clients: { id: "clients", name: "Client list.xlsx", kind: "sheet" },
  invoice: { id: "invoice", name: "Northline invoice 4471.pdf", kind: "pdf" },
  visit: { id: "visit", name: "Site visit, Hill Country (Fathom)", kind: "recording" },
  tracker: { id: "tracker", name: "Project tracker (ClickUp)", kind: "sheet" },
}

export const PROJECTS = [
  { id: "studio", label: "Menon Studio", ok: true },
  { id: "downloads", label: "Downloads", ok: false, why: "Claude can read, change and delete anything in the folder you pick. Keep it to the client's project." },
  { id: "home", label: "Your whole home folder", ok: false, why: "Far too wide. Claude only needs the client's project." },
]
