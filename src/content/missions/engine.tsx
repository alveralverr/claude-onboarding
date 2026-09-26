import type { Mission } from "../types"

/* Mastery: The Engine Room. Models, effort, limits and the context window.
   The effort-level incident and the "prompt too long, compacting" prompts
   are why this room exists. */
export const ENGINE: Mission = {
  id: "engine",
  title: "Know the engine",
  tagline: "Which model, how much effort, what to do at the limit, and when to start over.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "models",
      title: "Opus by default. Effort left alone.",
      body: (
        <>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong>Opus 5.5 is your default</strong> for every client task. Since 22 September it matches the top model on most work at a lower cost, so there is no reason to start anywhere else.
            </li>
            <li>
              <strong>Sonnet is the fallback</strong> when Opus says you've hit your limit. Still strong, lighter on quota.
            </li>
            <li>
              <strong>Haiku is not for client work.</strong> Bulk rote data only.
            </li>
            <li>
              <strong>Leave effort on its default</strong> (or high) for client work. An assistant turned effort down to "save tokens", quality dropped, and the client bought a different tool. Saving tokens cost the seat.
            </li>
            <li>
              <strong>"Resets at 5am"</strong> means the cap was reached. Switch to Sonnet for the rest of the task, or do the low-value work later. Hitting Sonnet limits too? Tell your Account Lead; quotas can be reviewed.
            </li>
          </ul>
        </>
      ),
    },
    {
      kind: "explain",
      id: "memory",
      title: "Claude's working memory has a limit.",
      body: (
        <>
          <p>Every chat holds a fixed amount: your prompts, its replies, files, tool calls. When it fills, older context drops, quality slips, and you'll see "compacting". The fix is cheap:</p>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li><strong>One task, one chat.</strong> Start fresh when you switch topics.</li>
            <li><strong>Carry a summary, not the history.</strong> Three lines: client, where you got to, what's next. Paste that into the new chat.</li>
            <li><strong>Put the permanent things in the project.</strong> Instructions for Claude and the client folder survive between chats; the conversation doesn't.</li>
          </ul>
          <p className="text-base text-muted-foreground">Projects now share memory across their threads, so a new thread in the same project is not starting from zero.</p>
        </>
      ),
      voice: "/assets/voice/08 - context window.mp3",
    },
    {
      kind: "quiz",
      id: "check",
      title: "Engine check.",
      questions: [
        {
          id: "en1",
          q: "You're worried about running out of tokens before Friday. What's the right move?",
          options: [
            { v: "a", t: "Keep Opus at normal effort for client work. Move low-value tasks to later or to Sonnet. Tell your Account Lead if limits are a weekly problem." },
            { v: "b", t: "Turn effort to low for everything." },
            { v: "c", t: "Switch every task to Haiku." },
          ],
          answer: "a",
          wrong: "Not quite. Lower effort and weaker models cost you quality on client work. Ration the tasks, not the thinking.",
        },
        {
          id: "en2",
          q: "A long chat says it's compacting and answers are getting worse.",
          options: [
            { v: "a", t: "Ask for a three-line summary, start a new chat in the same project, paste the summary." },
            { v: "b", t: "Keep going. It will sort itself out." },
            { v: "c", t: "Paste the whole conversation into a new chat." },
          ],
          answer: "a",
          wrong: "Not quite. A short summary in a fresh chat restores quality. Pasting the whole history just fills the new one.",
        },
        {
          id: "en3",
          q: "Opus says you've reached your limit, resets at 5am. A client draft is half done.",
          options: [
            { v: "a", t: "Switch to Sonnet and finish the draft. Review it as always." },
            { v: "b", t: "Drop to Haiku to finish quickly." },
            { v: "c", t: "Send the half-finished draft." },
          ],
          answer: "a",
          wrong: "Not quite. Sonnet is the fallback for exactly this. Haiku is not for client work, and half a draft never goes out.",
        },
      ],
    },
    {
      kind: "live",
      id: "live",
      title: "Check your own engine.",
      k: "live-engine",
      body: (
        <>
          <p>Open Claude and check three things: the model picker shows Opus, effort is on its default, and your current client work is in a project with its folder attached. Fix any that aren't.</p>
        </>
      ),
      label: <>I checked that I'm on Opus at default effort, and my client work lives in a project.</>,
    },
    {
      kind: "reveal",
      id: "done",
      title: "Engine checked.",
      body: <p>That's every room. The Shelf stays open for the day-to-day, and a new quest appears in the lobby each week.</p>,
      next: { href: "#/", label: "Back to the office" },
    },
  ],
}
