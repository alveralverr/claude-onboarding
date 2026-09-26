import type { Mission } from "../types"
import { Code } from "@/engine/bits"

/* Mastery: The Clock Tower. Scheduled tasks and the EOD/SOD skill, the
   second most used Magic skill. Most Cowork sessions are already scheduled
   runs, so this is about keeping them safe. */
export const CLOCK: Mission = {
  id: "clock",
  title: "Let the routine run itself",
  tagline: "Scheduled tasks, start-of-day briefs and end-of-day reports, without surprises.",
  minutes: 7,
  steps: [
    {
      kind: "explain",
      id: "routine",
      title: "Two tools for the routine part of the job.",
      body: (
        <>
          <p>
            <strong>Scheduled tasks.</strong> Type <Code>/schedule</Code> in Cowork. Claude asks what, when and how often, and confirms before creating anything. It runs while you are not watching, so it should only ever <em>read, write files and notify you</em>. It should never message a client, buy anything, or change something hard to undo.
          </p>
          <p>
            <strong>The EOD/SOD skill.</strong> <Code>/eod-sod</Code> turns your day into the report your client and Account Lead expect. Magic assistants use it more than almost any other skill. Run it, then edit it: it is your report, not Claude's.
          </p>
          <p>A good pattern from an Account Lead: a supervised project that drafts every morning and posts nothing. You review, then you send.</p>
        </>
      ),
      note: { variant: "warning", body: <>Review the results of any scheduled task at least weekly. A task that quietly fails, or quietly drifts, is worse than no task.</> },
    },
    {
      kind: "sim",
      id: "run",
      title: "Schedule Dana's morning brief.",
      intro: <p>You are setting up a weekday brief for the practice client. Read the plan. One step would run every morning without anyone checking it.</p>,
      scenario: "schedule",
    },
    {
      kind: "quiz",
      id: "check",
      title: "Safe to schedule?",
      questions: [
        {
          id: "ck1",
          q: "Every Friday at 5pm, send the weekly report to the client.",
          options: [
            { v: "a", t: "Fine. It's the same report every week." },
            { v: "b", t: "Schedule the draft, not the send. Friday 4pm: write the report to my folder and notify me. I send it." },
            { v: "c", t: "Fine, as long as it CCs me." },
          ],
          answer: "b",
          wrong: "Not quite. A scheduled task never sends to a client. Schedule the draft and keep the send for yourself.",
        },
        {
          id: "ck2",
          q: "Your EOD came out of /eod-sod with a line you didn't do today. What do you send?",
          options: [
            { v: "a", t: "The report after you delete that line and read the rest again." },
            { v: "b", t: "The report as is. One line won't matter." },
            { v: "c", t: "A note to the client that Claude wrote it." },
          ],
          answer: "a",
          wrong: "Not quite. The skill drafts; you own what goes out. One wrong line is how clients stop trusting reports.",
        },
        {
          id: "ck3",
          q: "A scheduled task has been saving a daily summary for two weeks. What's the habit that keeps it safe?",
          options: [
            { v: "a", t: "Open the last few outputs every week and check they still match reality." },
            { v: "b", t: "Nothing. It worked on day one." },
            { v: "c", t: "Switch it to Automatic mode so it needs even less attention." },
          ],
          answer: "a",
          wrong: "Not quite. Tasks drift when calendars, folders or clients change. A weekly look catches it.",
        },
      ],
    },
    {
      kind: "live",
      id: "live",
      title: "Set up one routine.",
      k: "live-clock",
      body: (
        <>
          <p>Either schedule one low-risk task that saves a file and notifies you, or run <Code>/eod-sod</Code> at the end of today's shift and edit it before it goes anywhere.</p>
        </>
      ),
      prompts: [
        "/schedule Every weekday at 8am, check my inbox and my client's shared calendar, and save a short start-of-day brief to my client folder. Notify me when it's done.",
        "/schedule Every Friday at 4pm, list the tasks I completed this week from my folder and draft a summary for my Account Lead. Save it, don't send it.",
        "/eod-sod Here is what I did today: [paste your notes]. Write my end-of-day report in our usual format.",
      ],
      label: <>I scheduled one low-risk task that only saves and notifies, or ran my EOD with the skill and edited it before sending.</>,
    },
    {
      kind: "reveal",
      id: "done",
      title: "Scheduler.",
      badge: "scheduler",
      body: <p>The Writing Room is where the "make it sound human" loop ends: client voice, set once, used everywhere.</p>,
      next: { href: "#/room/writing", label: "Go to The Writing Room" },
    },
  ],
}
