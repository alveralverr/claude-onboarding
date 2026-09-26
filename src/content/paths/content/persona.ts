import type { ClientFile, Persona } from "@/story/types"

/* Fictional client for the Content and social path. Nothing here is real. */
export const LEAH: Persona = {
  id: "leah",
  name: "Leah Sato",
  first: "Leah",
  company: "Sato Wellness",
  what: "a wellness coaching practice with a weekly vlog",
  city: "Vancouver, BC",
  tzShort: "PT",
  initials: "LS",
  prefs: [
    "Never a health claim. 'Helps me' is fine. 'Cures', 'treats' or 'proven' is never fine.",
    "Captions sound like I talk: first person, warm, a question at the end. No hashtag walls.",
    "Nothing publishes until I have seen it. Scheduling is fine; auto-posting is not.",
  ],
  voice: "Warm, first person, short sentences. One emoji at most. Signs off Leah.",
  pron: { they: "she", them: "her", their: "her" },
}

export const FILES: Record<string, ClientFile> = {
  transcript: { id: "transcript", name: "Episode 42 transcript (Fathom)", kind: "recording" },
  voice: { id: "voice", name: "Brand voice guide.docx", kind: "doc" },
  calendar: { id: "calendar", name: "Content calendar.xlsx", kind: "sheet" },
  top: { id: "top", name: "Top posts, last 90 days.docx", kind: "doc" },
  kit: { id: "kit", name: "Brand kit (Canva)", kind: "doc" },
  dms: { id: "dms", name: "Follower DMs, this week.docx", kind: "doc" },
}

export const PROJECTS = [
  { id: "sato", label: "Sato Wellness", ok: true },
  { id: "downloads", label: "Downloads", ok: false, why: "Claude can read, change and delete anything in the folder you pick. Keep it to the client's project." },
  { id: "home", label: "Your whole home folder", ok: false, why: "Far too wide. Claude only needs the client's project." },
]
