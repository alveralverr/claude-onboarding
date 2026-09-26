import type { Update } from "./types"

export default {
  id: "2026-09-16-docs-and-slides",
  date: "2026-09-16",
  kind: "feature",
  title: "Claude Docs and Claude Slides",
  summary:
    "Claude now writes the document or the deck inside the chat. Docs you edit together and export to Word, PDF or Google Docs. Slides you can present, or download as PowerPoint or PDF. Claude Design also works inside any chat.",
  why: "Most EA work ends in a file. This removes the copy-paste step, and the export is what you send the client.",
  links: [{ label: "How it changed, and when to use what", href: "https://note.com/ai__worker/n/n0fde3382c057?hl=en" }],
  try: "Take notes you already have and ask: turn meeting-notes.md into a six-slide deck for the team meeting, one idea per slide, numbers only from the file. Export it as PowerPoint.",
  habits: ["brief", "check"],
  rooms: ["studio"],
  quest: { title: "Build one real deck with Claude Slides", body: "Take a report or notes you already have and ask for a six-slide deck. Fix one slide by hand before you share it." },
  status: "team-pending",
  audience: ["pro", "max"],
} satisfies Update
