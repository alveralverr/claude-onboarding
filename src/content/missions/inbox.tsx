import type { Mission } from "../types"
import { Code } from "@/engine/bits"
import { FIRST_TASK_KEY } from "@/lib/data"
import { CLIENT_DANA } from "../world"

const FIRST_PROMPTS = [
  "Go through my inbox, find unread client emails from the last 24 hours, and draft a reply for each one that needs a response. Save the drafts in Gmail for my review.",
  "Check my Google Calendar for next week and write a summary of my client's availability. Save it as availability.md in my Magic Work folder.",
  "Research [company name]: their industry, recent news, and key people. Write a one-page briefing and save it to my folder.",
  "Summarize these meeting notes and pull out every action item with the owner and deadline.",
]

/* Room 2: The Inbox. A practice client, a practice task, then the real one. */
export const INBOX_MISSION: Mission = {
  id: "inbox",
  title: "Run your first task",
  tagline: "Practice on Dana's inbox, then do the same on yours.",
  minutes: 10,
  steps: [
    {
      kind: "explain",
      id: "meet",
      title: "Meet Dana.",
      body: (
        <>
          <p>
            <strong>Dana Reyes</strong> runs Reyes Dental, a two-chair practice. She is your practice client for this room: not real, so nothing you do here can go wrong.
          </p>
          <p>It is Monday morning. Dana's inbox has 14 unread emails. She wants replies drafted for the ones that matter, in her voice, ready for her to send.</p>
          <p>A Cowork task runs like this: you give the context and the ask, Claude shows a plan, you approve or redirect, it works, you review. The next three steps are exactly that.</p>
        </>
      ),
      media: { type: "image", src: CLIENT_DANA, alt: "Dana Reyes, a dentist in a white clinic coat, your practice client", w: 256, h: 256, className: "mx-auto max-w-[160px] rounded-full border-0 bg-[#E6E6F8] shadow-none" },
      voice: "/assets/voice/07 - how a task runs.mp3",
    },
    {
      kind: "compose",
      id: "compose",
      title: "Build the prompt.",
      intro: (
        <p>
          Claude is brilliant on day one; it just does not know Dana. A good prompt has four ingredients. Pick one chip per ingredient. Wording does not matter, the ingredient does.
        </p>
      ),
      groups: [
        {
          id: "context",
          label: "What Claude can see",
          hint: "Folder, connector or skill. Without these it guesses.",
          chips: [
            { id: "c1", text: "Use /email-management and my Gmail.", good: true },
            { id: "c2", text: "Work in the Reyes Dental folder in Magic Work.", good: true },
            { id: "c3", text: "Look through my whole home folder for anything useful.", why: "Claude can read, write and delete anything in a folder it is given. Scope it to the client." },
          ],
        },
        {
          id: "ask",
          label: "The ask, with its scope",
          hint: "What, and how far back or how many.",
          chips: [
            { id: "a1", text: "Go through my Gmail from the last 24 hours and flag client emails or anything urgent.", good: true },
            { id: "a2", text: "Help me with my email.", why: "Too open. Claude will ask five questions or guess. Say what and how much." },
          ],
        },
        {
          id: "done",
          label: "What done looks like",
          hint: "The output you want back.",
          chips: [
            { id: "d1", text: "Draft a reply for each one that needs a response and list what you skipped.", good: true },
            { id: "d2", text: "Reply to everyone for me.", why: "Nothing goes to a client before you have read it. Ask for drafts, not sends." },
          ],
        },
        {
          id: "voice",
          label: "Voice and place",
          hint: "How it should sound and where it should land.",
          chips: [
            { id: "v1", text: "Dana writes short, warm and plain, no exclamation marks. Save the drafts in Gmail for my review.", good: true },
            { id: "v2", text: "Make it sound professional and impressive.", why: "This is how you get drafts that read like AI. Describe the person's real voice instead." },
          ],
        },
      ],
      done: <p>That is a complete prompt. Notice there is no clever wording in it, only the four ingredients.</p>,
    },
    {
      kind: "sim",
      id: "run",
      title: "Watch it work.",
      intro: <p>Send the prompt and read Claude's plan before you approve it. One step is not something Dana would want.</p>,
      scenario: "inbox",
    },
    {
      kind: "spot",
      id: "edit",
      title: "Read it the way Dana would.",
      intro: (
        <p>
          Two of the three drafts have a sentence that no real person writes. Clients notice this every time. Find both.
        </p>
      ),
      frame: "draft",
      segments: [
        { text: "Hi Priya, " },
        { text: "I hope this message finds you well!", flag: "The classic AI opener, and an exclamation mark Dana never uses.", fix: "Hi Priya, Thursday the 8th at 10:30 is open." },
        { text: " Thursday the 8th at 10:30 is open, and I have pencilled you in. Reply yes and it is yours. Dana\n\n" },
        { text: "Hi Marcus, thanks for the nudge. The payment went out this morning, reference 4471. " },
        { text: "Please don't hesitate to reach out should you have any further questions.", flag: "A filler closer. Dana would just stop.", fix: "Delete it. The reference number is the answer." },
        { text: " Dana\n\n" },
        { text: "Hi Dr. Chen, yes, let's talk. I have Tuesday 2pm or Wednesday 9am. Which suits you? Dana" },
      ],
      done: (
        <>
          <p>
            <strong>Editor's eye earned.</strong> This is the review step, and it is the one that keeps clients. Fix it in the draft, then fix it upstream: add "no filler openers or closers" to the project instructions so the next batch comes out right.
          </p>
        </>
      ),
    },
    {
      kind: "live",
      id: "live",
      title: "Now do it for real.",
      k: FIRST_TASK_KEY,
      body: (
        <>
          <p>Open a Cowork session on your own machine and run something real from your to-do list. Link the folder, the connector or the skill first, and ask yourself what Claude needs to know.</p>
          <p className="text-base text-muted-foreground">
            If it misses, do not reword the same ask. Add the context it could not see. Voice-to-text, Taglish and typos are fine. Type <Code>/email-management</Code> or <Code>/calendar-management</Code> to start from a Magic template.
          </p>
        </>
      ),
      prompts: FIRST_PROMPTS,
      label: <>I ran my first real Cowork task and reviewed the output before anything reached a client.</>,
    },
    {
      kind: "reveal",
      id: "done",
      title: "First real task.",
      badge: "first-task",
      body: <p>Your first few real tasks are where it clicks. One room left before client work: the Vault, where you learn what never goes into a prompt.</p>,
      next: { href: "#/room/vault", label: "Go to The Vault" },
    },
  ],
}
