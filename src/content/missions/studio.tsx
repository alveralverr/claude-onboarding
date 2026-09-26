import type { Mission } from "../types"
import { Code } from "@/engine/bits"

/* Mastery: The Studio. Docs, Slides, Design, and the document skills that
   carry most real EA work (docx, pptx, xlsx are the most-used skills). */
export const STUDIO: Mission = {
  id: "studio",
  title: "Make the document, not the draft",
  tagline: "Docs, decks and spreadsheets that land where the client can open them.",
  minutes: 7,
  steps: [
    {
      kind: "explain",
      id: "places",
      title: "Three places work now lands.",
      body: (
        <>
          <p>
            Since September, Claude can build the file itself inside the conversation. <strong>Claude Docs</strong> writes a document you edit together and export to Word, PDF or Google Docs. <strong>Claude Slides</strong> drafts a deck you can present or download as PowerPoint or PDF. <strong>Claude Design</strong> mocks up a page or prototype.
          </p>
          <p>
            In Cowork, the <Code>/docx</Code>, <Code>/pptx</Code> and <Code>/xlsx</Code> skills do the same into your working folder. Magic assistants use these more than any other skill, so this room is worth your time.
          </p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-base">
            <li><strong>Where did it go?</strong> A Doc or Slides file lives in the conversation until you export it. A skill saves into the folder you picked. If you are not sure, ask: "Where did you save that?"</li>
            <li><strong>Sharing with the client:</strong> export to their format (PDF for reading, PowerPoint or Google Docs for editing), then send it yourself.</li>
            <li><strong>Deleted is gone.</strong> A deleted Doc or deck has no trash bin. Export anything you care about.</li>
          </ul>
        </>
      ),
      note: { body: <>Docs and Slides reached Pro and Max first; Team seats follow. If you don't see them yet, the skills in Cowork do the same job.</> },
    },
    {
      kind: "compose",
      id: "compose",
      title: "Ask for a deck the way a client would recognise.",
      intro: <p>Dana wants a short deck for her staff meeting from last quarter's numbers. Pick one chip per ingredient.</p>,
      groups: [
        {
          id: "source",
          label: "The source",
          hint: "Claude cannot summarise a file it cannot see.",
          chips: [
            { id: "s1", text: "Use Q3-report.xlsx in the Reyes Dental folder.", good: true },
            { id: "s2", text: "You know our numbers from last time.", why: "Every session starts fresh unless the file is in the project. Point at the file." },
          ],
        },
        {
          id: "audience",
          label: "The audience and purpose",
          hint: "Who reads it, and what they should walk away knowing.",
          chips: [
            { id: "a1", text: "For Dana's six staff at the Monday meeting: what went well, what to fix, one ask per person.", good: true },
            { id: "a2", text: "Make it impressive for investors.", why: "Wrong audience, and 'impressive' is how you get filler. Say who and why." },
          ],
        },
        {
          id: "shape",
          label: "The shape",
          hint: "Length and format up front.",
          chips: [
            { id: "f1", text: "Six slides, one idea per slide, numbers only from the file. Use Claude Slides.", good: true },
            { id: "f2", text: "As many slides as you need to be thorough.", why: "Open length means twenty slides. Set the number." },
          ],
        },
        {
          id: "honesty",
          label: "What to do when the data is thin",
          hint: "Give it permission to say so.",
          chips: [
            { id: "h1", text: "If a number is missing from the file, leave a blank and tell me rather than estimating.", good: true },
            { id: "h2", text: "Fill any gaps with reasonable estimates.", why: "That is how invented figures reach a client. Ask for blanks and a note instead." },
          ],
        },
      ],
      done: <p>Source, audience, shape, honesty. The same four ingredients work for a doc, a spreadsheet or a one-pager.</p>,
    },
    {
      kind: "spot",
      id: "review",
      title: "Read the summary slide like Dana would.",
      intro: <p>Here is the notes text Claude wrote for slide one. Two things in it would embarrass you in the meeting. Find both.</p>,
      frame: "draft",
      segments: [
        { text: "Q3 in one slide. New patients grew from 41 to 58, driven mainly by the referral partnership with Oak Street Pediatrics. " },
        { text: "Patient satisfaction reached 97.4%, the highest in the practice's history.", flag: "There is no satisfaction survey in the file. This number was invented to sound precise.", fix: "Cut it, or ask Dana whether she wants a survey added next quarter." },
        { text: " Hygiene bookings held steady at 212. " },
        { text: "As an AI language model, I have leveraged the data to synthesise actionable insights.", flag: "Nobody in a staff meeting talks like this, and it announces the deck was not read by a human.", fix: "Delete it. The numbers already make the point." },
        { text: " Two asks for Monday: confirm the Thursday hygiene block, and reply to Northline by Friday." },
      ],
      done: <p>Invented precision and AI phrasing are the two things clients notice first. Check every number against the source before a deck leaves your hands.</p>,
    },
    {
      kind: "live",
      id: "live",
      title: "Build one real file.",
      k: "live-studio",
      body: (
        <>
          <p>Pick a document, deck or sheet your client actually needs this week. Point Claude at the source, name the audience, set the shape, and export it in the format they open.</p>
          <p className="text-base text-muted-foreground">Fix at least one thing by hand before you share it. That edit is the difference between a draft and a deliverable.</p>
        </>
      ),
      prompts: [
        "Use the notes in meeting-notes.md in my client folder. Write a one-page summary for the client: decisions, owners, deadlines. Save it as a Word document in the same folder.",
        "Open Q3-report.xlsx. Build a six-slide deck for the team meeting: what went well, what to fix, one ask per person. Numbers only from the file; leave blanks where data is missing and tell me.",
        "Turn this list of vendor emails into a tracker spreadsheet with columns for vendor, last contact, next step and owner. Save it in my client folder.",
      ],
      label: <>I built a real document, deck or sheet with Claude, checked the numbers, and exported it for the client.</>,
    },
    {
      kind: "reveal",
      id: "done",
      title: "Deck builder.",
      badge: "deck-builder",
      body: <p>Next door, the Switchboard: what each connector can and cannot do, and when to stop and do it by hand.</p>,
      next: { href: "#/room/switchboard", label: "Go to The Switchboard" },
    },
  ],
}
