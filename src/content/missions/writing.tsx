import type { Mission } from "../types"

/* Mastery: The Writing Room. Anthropic's 2026 prompting guidance, applied
   to the loop assistants actually live in: "make it sound human". */
export const WRITING: Mission = {
  id: "writing",
  title: "Say it once, in their voice",
  tagline: "Prompting the 2026 way, and the setting that ends the rewrite loop.",
  minutes: 8,
  steps: [
    {
      kind: "explain",
      id: "rules",
      title: "What Anthropic says works now.",
      body: (
        <>
          <p>Newer Claude models follow short, clear instructions better than long rule lists. Six habits from Anthropic's own guidance:</p>
          <ol className="grid gap-2 text-base sm:grid-cols-2">
            {[
              ["State the intent, not the steps.", "\"Draft a reply that gets the invoice paid\" beats a ten-step recipe."],
              ["Say why a constraint matters.", "\"Keep it short, she reads on her phone between patients\" is followed better than \"be concise\"."],
              ["Describe what done looks like.", "Format, length, where it goes."],
              ["Say what to do, not what to avoid.", "\"Write it as one paragraph\" instead of \"don't use bullets\"."],
              ["Give one example when the format matters.", "Paste a past email the client liked."],
              ["Let it say it's unsure.", "\"If the file doesn't cover it, say so instead of guessing.\""],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3 rounded-xl bg-background p-3.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet text-xs font-semibold text-white" aria-hidden="true">{i + 1}</span>
                <span><strong className="block">{t}</strong><span className="text-muted-foreground">{d}</span></span>
              </li>
            ))}
          </ol>
          <p className="text-base text-muted-foreground">What no longer helps: "you are a world-class expert", "double-check your work", and rule lists in capitals. The model already does the checking, and the fluff crowds out your actual context.</p>
        </>
      ),
    },
    {
      kind: "spot",
      id: "trim",
      title: "Trim the prompt.",
      intro: <p>An assistant wrote this for a client follow-up. Three parts do nothing, or make the result worse. Find all three.</p>,
      frame: "prompt",
      segments: [
        { text: "You are a world-class executive assistant with 20 years of experience and impeccable judgement. ", flag: "Role fluff. It adds nothing the model doesn't already do, and it pushes your real context down.", fix: "Delete it. Start with the task." },
        { text: "Draft a follow-up to Marcus at Northline about invoice 4471: the payment went out this morning, reference 4471, and we'd like confirmation by Friday. Marcus is friendly but busy, so one short paragraph. " },
        { text: "DO NOT use bullet points, DO NOT use exclamation marks, DO NOT be formal. ", flag: "Three negatives. Say what you want instead.", fix: "\"One warm, plain paragraph, the way Dana writes.\"" },
        { text: "Here is one Dana sent him last month that he liked: [pasted email]. " },
        { text: "Double-check your work three times before answering and make sure it is perfect.", flag: "Redundant. Newer models self-check; this only slows the reply.", fix: "Delete it. Review the draft yourself, which you were going to do anyway." },
      ],
      done: <p>What's left is the task, the facts, the reader, and one example. That is the whole prompt.</p>,
    },
    {
      kind: "compose",
      id: "instructions",
      title: "Write Instructions for Claude for Dana's project.",
      intro: (
        <p>
          Instructions for Claude live on a project and apply to every task in it. This is where "make it sound human" gets fixed once. Pick one chip per ingredient.
        </p>
      ),
      groups: [
        {
          id: "who",
          label: "Who the client is",
          hint: "Two lines of context that every task needs.",
          chips: [
            { id: "w1", text: "Dana Reyes runs Reyes Dental, a two-chair practice in Austin. I am her Magic EA; I handle inbox, calendar and suppliers.", good: true },
            { id: "w2", text: "Dana is a very important client and everything must be perfect.", why: "Pressure, not context. Say what she does and what you handle for her." },
          ],
        },
        {
          id: "voice",
          label: "How she sounds",
          hint: "Describe it, or paste an example.",
          chips: [
            { id: "v1", text: "Dana writes short, warm and plain. First names, no exclamation marks, no filler openers or closers. Example: \"Hi Marcus, thanks for the nudge. Payment went out this morning, ref 4471. Dana\"", good: true },
            { id: "v2", text: "Professional and polished at all times.", why: "That produces the AI voice you keep deleting. Describe the real person." },
          ],
        },
        {
          id: "format",
          label: "Defaults for output",
          hint: "So you stop repeating yourself.",
          chips: [
            { id: "f1", text: "Emails: drafts in Gmail, never sent. Documents: save to the Reyes Dental folder. Dates as 10/4, not October 4th.", good: true },
            { id: "f2", text: "Use whatever format seems best.", why: "Then it changes every time. Set the defaults once." },
          ],
        },
        {
          id: "unsure",
          label: "When it's unsure",
          hint: "Permission to stop instead of guess.",
          chips: [
            { id: "u1", text: "If something isn't in the folder or the email, ask me or leave a blank. Never invent a price, a date or a name.", good: true },
            { id: "u2", text: "Always give a complete answer, even if you have to assume.", why: "That is the invented-number problem from the Studio. Ask for blanks." },
          ],
        },
      ],
      done: <p>Paste those four into the project's Instructions for Claude. Every task in the project now starts with them.</p>,
    },
    {
      kind: "quiz",
      id: "check",
      title: "The loop, and how to leave it.",
      questions: [
        {
          id: "wr1",
          q: "Every draft comes back \"too AI\" and you fix the same lines each time. What ends it?",
          options: [
            { v: "a", t: "Put the client's voice and the banned filler in the project's Instructions for Claude." },
            { v: "b", t: "Type \"make it sound human\" at the end of every prompt." },
            { v: "c", t: "Switch to a different model." },
          ],
          answer: "a",
          wrong: "Not quite. Fix it upstream, once, in the project instructions. Repeating it per prompt is the loop.",
        },
        {
          id: "wr2",
          q: "Claude keeps asking five questions before it starts and you're overwhelmed.",
          options: [
            { v: "a", t: "Tell it: make sensible assumptions, list them at the top, and start." },
            { v: "b", t: "Answer all five every time." },
            { v: "c", t: "Give up and do the task yourself." },
          ],
          answer: "a",
          wrong: "Not quite. Ask for assumptions listed up front. You correct the wrong ones after, which is faster than a questionnaire.",
        },
      ],
    },
    {
      kind: "live",
      id: "live",
      title: "Set it once for a real client.",
      k: "live-writing",
      body: (
        <>
          <p>Open one client project in Claude and write its Instructions for Claude: who they are, how they sound (with one real example), your output defaults, and what to do when unsure. Then run one task and see how much less you have to fix.</p>
        </>
      ),
      label: <>I wrote Instructions for Claude for one real client project and ran a task with them.</>,
    },
    {
      kind: "reveal",
      id: "done",
      title: "Prompt whisperer.",
      badge: "prompt-whisperer",
      body: <p>The Workshop is next: the skills Magic built for you, and the one you build yourself.</p>,
      next: { href: "#/room/workshop", label: "Go to The Workshop" },
    },
  ],
}
