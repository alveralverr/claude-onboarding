/* Composer state and the skills menu for the practice Claude. */
export type ComposerState = {
  text: string
  files: string[]
  mode: "chat" | "cowork"
  project: string | null
  permission: "ask" | "auto"
}

export const emptyComposer = (): ComposerState => ({ text: "", files: [], mode: "cowork", project: null, permission: "ask" })

export const SKILLS = [
  { id: "email-management", hint: "Magic: triage and draft replies" },
  { id: "calendar-management", hint: "Magic: availability, time zones, invites" },
  { id: "writing", hint: "Magic: memos and long drafts" },
  { id: "eod-sod", hint: "Magic: end-of-day and start-of-day reports" },
  { id: "docx", hint: "Word documents" },
  { id: "xlsx", hint: "Spreadsheets" },
  { id: "pptx", hint: "Slide decks" },
  { id: "schedule", hint: "Create a scheduled task" },
  { id: "skill-creator", hint: "Make your own skill" },
]
