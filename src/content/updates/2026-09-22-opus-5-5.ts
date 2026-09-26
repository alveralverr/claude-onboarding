import type { Update } from "./types"

export default {
  id: "2026-09-22-opus-5-5",
  date: "2026-09-22",
  kind: "model",
  title: "Opus 5.5 is your default",
  summary: "Anthropic released Opus 5.5. It matches the top model on most work at a lower cost, so it is the default for every client task. Sonnet stays the fallback when you hit a limit.",
  why: "Leave effort on its default. Turning it down to save tokens cost one assistant a client. Ration low-value tasks, not the thinking.",
  links: [{ label: "Release notes", href: "https://support.claude.com/en/articles/12138966-release-notes" }],
  try: "Open the model picker in a new chat and check it says Opus 5.5 with effort on High. If it doesn't, switch it, and tell your Account Lead if the option is missing.",
  habits: ["steer"],
  rooms: ["engine", "model"],
  drill: {
    id: "drill-opus-5-5",
    title: "Which model, and how much effort?",
    sticky: "Model check",
    habits: ["steer"],
    minutes: { manual: 5, claude: 2 },
    open: "Quick one before you start: which model are you on, and is effort where it should be?",
    steps: [
      {
        kind: "choose",
        id: "pick",
        title: "A client draft, and you're worried about tokens",
        habit: "steer",
        says: "You have a client proposal to draft this afternoon and you've used a lot of your quota this week. Which setting do you use?",
        options: [
          { id: "opus", label: "Opus 5.5 at default effort, and move low-value tasks to later", good: true, why: "Client work gets the best model and normal effort. Ration the tasks, not the thinking." },
          { id: "low", label: "Opus 5.5 with effort turned down to save tokens", why: "Lower effort costs quality where it shows most. An assistant did exactly this and the client moved to another tool." },
          { id: "haiku", label: "Haiku, it's the cheapest", why: "Haiku is for bulk rote data, never for something a client reads." },
        ],
        hints: ["What does the client read: your quota, or the proposal?", "Keep the model and effort; change which tasks you run today.", "Opus at default effort."],
      },
      {
        kind: "choose",
        id: "limit",
        title: "Opus says you've hit the limit",
        habit: "steer",
        says: "Halfway through, Opus says you've reached your limit and it resets at 5am. The proposal is half drafted.",
        options: [
          { id: "sonnet", label: "Switch to Sonnet, finish the draft, review it as always", good: true, why: "Sonnet is the fallback for exactly this. Still strong, lighter on quota." },
          { id: "send", label: "Send the half-finished draft so the client has something", why: "Half a draft never goes out. Your review is the last check." },
          { id: "haiku2", label: "Drop to Haiku and finish fast", why: "Not for client work." },
        ],
        hints: ["There is a fallback model.", "Not Haiku, and not a half-finished send.", "Sonnet."],
      },
    ],
    done: "Good. Same quality, no drama.",
  },
  status: "live",
  audience: ["all"],
} satisfies Update
