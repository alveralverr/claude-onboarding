import type { Mission } from "../types"
import { Code } from "@/engine/bits"

/* Mastery: The Workshop. Custom skills are the most-activated kind among
   Magic assistants; Magic's own templates are barely used. Both get fixed here. */
export const WORKSHOP: Mission = {
  id: "workshop",
  title: "Turn a repeat task into a skill",
  tagline: "Magic's templates, your own skills, and the marketplace rule.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "kinds",
      title: "Three kinds of skill.",
      body: (
        <>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong>Magic templates.</strong> <Code>/email-management</Code>, <Code>/calendar-management</Code>, <Code>/writing</Code>, <Code>/eod-sod</Code>. Built for EA work, kept current by the Product Team. Type the command on its own line, then your task; a command pasted in front of an unrelated request just confuses things.
            </li>
            <li>
              <strong>Your own.</strong> Anything you have asked for three times is a skill waiting to be made. <Code>/skill-creator</Code> interviews you and writes it. Give it a plain name and a trigger phrase you'll remember.
            </li>
            <li>
              <strong>Plugins and the marketplace.</strong> Anthropic opened a marketplace with thousands of plugins in September. The rule from the Vault applies: Anthropic-verified or Magic-approved only, and read the permissions before installing.
            </li>
          </ul>
          <p className="text-base text-muted-foreground">Claude also picks skills on its own when a task matches one. When it does, that's a sign your setup is working.</p>
        </>
      ),
    },
    {
      kind: "compose",
      id: "spec",
      title: "Spec a skill for the daily delivery report.",
      intro: <p>You write the same delivery-status report for a client every afternoon. Give the skill creator what it needs. One chip per ingredient.</p>,
      groups: [
        {
          id: "trigger",
          label: "Name and trigger",
          hint: "What you will type, and when it should run on its own.",
          chips: [
            { id: "t1", text: "Name: delivery-report. Trigger when I type /delivery-report, or when I paste delivery notes and ask for the daily report.", good: true },
            { id: "t2", text: "Name: report. Trigger whenever I mention a report.", why: "Too broad. It will fire on every report you ever mention." },
          ],
        },
        {
          id: "inputs",
          label: "Inputs",
          hint: "What the skill needs from you each time.",
          chips: [
            { id: "i1", text: "Inputs: today's delivery sheet from the client folder, plus my pasted notes on exceptions.", good: true },
            { id: "i2", text: "Inputs: whatever is available.", why: "The skill can't know what to look for. Name the file and the notes." },
          ],
        },
        {
          id: "output",
          label: "Output",
          hint: "The exact shape, every time.",
          chips: [
            { id: "o1", text: "Output: three sections, Delivered, Delayed with reason, Needs the client's decision. Plain text, under 150 words. Save to Reports/YYYY-MM-DD.md.", good: true },
            { id: "o2", text: "Output: a nice report.", why: "Format is the whole point of a skill. Spell it out." },
          ],
        },
        {
          id: "never",
          label: "What it never does",
          hint: "The line the skill must not cross.",
          chips: [
            { id: "n1", text: "Never sends the report anywhere. Never marks anything delivered that the sheet doesn't show. If a row is unclear, list it under Needs the client's decision.", good: true },
            { id: "n2", text: "Sends it to the client automatically at 5pm.", why: "A skill that sends is a scheduled message to a client. Save; you send." },
          ],
        },
      ],
      done: <p>That is a skill spec. Paste it into /skill-creator and it will write the rest.</p>,
    },
    {
      kind: "quiz",
      id: "check",
      title: "Skill or not?",
      questions: [
        {
          id: "wk1",
          q: "A marketplace plugin promises to auto-reply to your client's customers. It has 4,000 installs.",
          options: [
            { v: "a", t: "Skip it unless it's Anthropic-verified or Magic-approved. Auto-reply to a client's customers is a send, and sends are yours." },
            { v: "b", t: "Install it. 4,000 people can't be wrong." },
            { v: "c", t: "Install it on the client's account so it's their responsibility." },
          ],
          answer: "a",
          wrong: "Not quite. Popularity is not verification, and anything that sends on a client's behalf without review breaks the rules.",
        },
        {
          id: "wk2",
          q: "You typed /email-management and then pasted a request to build a spreadsheet. Claude did something odd.",
          options: [
            { v: "a", t: "The command loaded the email approach for a spreadsheet job. Start a new chat and use /xlsx, or no skill at all." },
            { v: "b", t: "The skill is broken. Email the Product Team." },
            { v: "c", t: "Skills don't matter; keep going." },
          ],
          answer: "a",
          wrong: "Not quite. A slash command loads an approach. Match it to the task, or leave it out and let Claude pick.",
        },
      ],
    },
    {
      kind: "live",
      id: "live",
      title: "Make one, or use one, for real.",
      k: "live-workshop",
      body: (
        <>
          <p>Either run <Code>/skill-creator</Code> for a task you repeat, or run one Magic template on today's real work. If you don't see Magic's skills in Customize › Skills › Your organization, message your Account Lead.</p>
        </>
      ),
      prompts: [
        "/skill-creator I want a skill for the daily delivery report. Inputs: the delivery sheet in my client folder and my notes. Output: Delivered, Delayed with reason, Needs decision, under 150 words, saved to Reports. It never sends anything.",
        "/calendar-management Look at my client's calendar for next week and flag conflicts, double bookings and days with no breaks.",
      ],
      label: <>I made a skill with /skill-creator, or ran a Magic template, on real work today.</>,
    },
    {
      kind: "reveal",
      id: "done",
      title: "Skill maker.",
      badge: "skill-maker",
      body: <p>Last room: the Engine Room, where models, effort, limits and memory get explained in five minutes.</p>,
      next: { href: "#/room/engine", label: "Go to The Engine Room" },
    },
  ],
}
