import type { ClientFile, Persona } from "@/story/types"

/* Fictional client for the Bookkeeping and finance path. Nothing here is real. */
export const MARCO: Persona = {
  id: "marco",
  name: "Marco Ruiz",
  first: "Marco",
  company: "Ruiz Coffee",
  what: "two coffee shops and a wholesale roastery",
  city: "Portland, Oregon",
  tzShort: "PT",
  initials: "MR",
  prefs: [
    "Numbers come from a document, never from memory. A blank beats a guess.",
    "Every Friday: one line on cash, and what is overdue in and out.",
    "Nothing gets paid or moved without my thumbs-up. Not even small ones.",
  ],
  voice: "Short and direct. Plain words, no accounting jargon. Signs off Marco.",
  pron: { they: "he", them: "him", their: "his" },
}

export const FILES: Record<string, ClientFile> = {
  invoices: { id: "invoices", name: "September supplier invoices (14 PDFs)", kind: "pdf" },
  tracker: { id: "tracker", name: "Invoice tracker.xlsx", kind: "sheet" },
  bank: { id: "bank", name: "Bank export, September.csv", kind: "sheet" },
  chart: { id: "chart", name: "Chart of accounts.xlsx", kind: "sheet" },
  aging: { id: "aging", name: "Customer invoices, overdue.xlsx", kind: "sheet" },
  template: { id: "template", name: "Reminder template.docx", kind: "doc" },
  vendors: { id: "vendors", name: "Vendor list.xlsx", kind: "sheet" },
}

export const PROJECTS = [
  { id: "books", label: "Ruiz Coffee books", ok: true },
  { id: "downloads", label: "Downloads", ok: false, why: "Claude can read, change and delete anything in the folder you pick. Keep it to the client's project." },
  { id: "home", label: "Your whole home folder", ok: false, why: "Far too wide, and your own bank statements live somewhere in there." },
]
