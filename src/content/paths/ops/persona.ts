import type { ClientFile, Persona } from "@/story/types"

/* Fictional client for the Operations and data path. Nothing here is real. */
export const TOM: Persona = {
  id: "tom",
  name: "Tom Alvarez",
  first: "Tom",
  company: "Alvarez Grounds",
  what: "a 40-person landscaping company",
  city: "Denver, Colorado",
  tzShort: "MT",
  initials: "TA",
  prefs: [
    "One tracker, one truth. If a number changes, tell me where it came from.",
    "SOPs are numbered step lists. One action per line, nothing clever.",
    "Friday status by 3: what slipped, what it costs, what you need from me.",
  ],
  voice: "Blunt, friendly, no filler. Bullet points. Signs off T.",
  pron: { they: "he", them: "him", their: "his" },
}

export const FILES: Record<string, ClientFile> = {
  jobs: { id: "jobs", name: "Job list export.csv (640 rows)", kind: "sheet" },
  crews: { id: "crews", name: "Crew schedule.xlsx", kind: "sheet" },
  manual: { id: "manual", name: "Ops manual v3.docx (64 pages)", kind: "doc" },
  call: { id: "call", name: "Monday ops call (Fathom)", kind: "recording" },
  board: { id: "board", name: "Jobs board (ClickUp)", kind: "sheet" },
  status: { id: "status", name: "Friday status, last week.docx", kind: "doc" },
}

export const PROJECTS = [
  { id: "ops", label: "Alvarez Ops", ok: true },
  { id: "shared", label: "The whole shared drive", ok: false, why: "Payroll and HR live in there too. Claude can read, change and delete anything it can reach. Keep it to the ops folder." },
  { id: "home", label: "Your whole home folder", ok: false, why: "Far too wide. Claude only needs the client's project." },
]
