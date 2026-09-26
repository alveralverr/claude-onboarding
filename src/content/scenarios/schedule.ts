import type { Scenario } from "./types"

/* The Clock Tower simulator: scheduling a start-of-day brief for the
   practice client. Fictional. */
export const SCHEDULE: Scenario = {
  id: "schedule",
  client: "Dana Reyes, Reyes Dental",
  model: "Opus",
  context: ["Magic Work / Reyes Dental", "Google Calendar (shared)", "Gmail (your account)"],
  workspace: "Working in Reyes Dental",
  prompt:
    "/schedule Every weekday at 8am, read Dana's shared calendar for today and my Gmail from the last 24 hours, and write a short start-of-day brief: today's appointments, anything urgent, and the first three things I should do. Save it as today.md in the Reyes Dental folder.",
  plan: [
    { text: "Create a scheduled task: weekdays at 8:00am, your time zone." },
    { text: "Each run: read the shared calendar for today and your Gmail from the last 24 hours." },
    { text: "Write the brief: appointments, urgent items, the first three things to do." },
    {
      text: "Post the brief to Dana in the Reyes Dental WhatsApp group so she sees it first thing.",
      bad: {
        why: "Step 4 sends something to the client every morning with nobody reading it first. A scheduled task never messages a client.",
        options: [
          { text: "Save the brief as today.md in the Reyes Dental folder and notify me.", good: true },
          { text: "Post it to the group, but only on weekdays.", why: "Still an unreviewed message to a client. The day of the week does not change that." },
          { text: "Email it to Dana instead of WhatsApp.", why: "Same problem, different channel. Scheduled tasks save and notify; you send." },
        ],
        fixed: "Save the brief as today.md in the Reyes Dental folder and notify you.",
      },
    },
    { text: "Confirm the schedule with you before saving it." },
  ],
  tools: ["Saving the schedule: weekdays, 8:00am", "Test run: reading today's calendar", "Test run: reading 9 emails", "Writing today.md", "Notifying you"],
  approveWarning: "Read the plan once more. One step does something a client would not want every morning.",
  done: "The task will save a file and ping you. Nothing reaches Dana until you have read it.",
  output: {
    title: "Scheduled. First brief saved.",
    kind: "file",
    note: "Next run: tomorrow, 8:00am. You can pause or edit it from the task list in the sidebar.",
    drafts: [
      {
        to: "Reyes Dental/today.md",
        subject: "Start-of-day brief, Tuesday",
        body: "3 appointments: 9:00 Priya N. (cleaning), 11:30 new patient consult, 2:00 hygiene. Urgent: the Northline invoice reply is still in drafts. First: send the Northline reply, confirm Thursday with Priya, prep the new-patient forms.",
      },
    ],
  },
}
