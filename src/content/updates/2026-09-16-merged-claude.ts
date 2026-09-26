import type { Update } from "./types"

export default {
  id: "2026-09-16-merged-claude",
  date: "2026-09-16",
  kind: "feature",
  title: "Cowork is now part of Claude",
  summary:
    "There is no separate Cowork mode. You describe what you need and Claude decides whether to answer or run a task. A new permission setting lets you choose Ask first (Claude checks before each action) or Auto.",
  why: "Fewer decisions before you start. Keep Ask first while you learn; it is the setting that catches a send you didn't mean.",
  links: [{ label: "Anthropic's announcement", href: "https://techcrunch.com/2026/09/16/anthropic-merges-claude-chat-and-cowork-in-one-interface/" }],
  try: "Open a new chat and type what you need as if to a colleague. Notice whether Claude answers or shows a plan, and leave the permission menu on Ask first.",
  habits: ["steer"],
  rooms: ["cowork", "desk"],
  drill: {
    id: "drill-permission-mode",
    title: "Ask first, or Auto?",
    sticky: "Permission mode",
    habits: ["steer"],
    minutes: { manual: 3, claude: 1 },
    open: "New setting in the composer: Ask first or Auto. When would you flip it?",
    steps: [
      {
        kind: "choose",
        id: "when",
        title: "When is Auto fine?",
        habit: "steer",
        says: "Auto lets me act without checking each step. Which of these is a good fit for Auto?",
        options: [
          { id: "eod", label: "Your daily EOD draft, which you've run and reviewed ten times, saved to your folder", good: true, why: "Routine, reviewed before, and it only writes a file you read afterwards." },
          { id: "send", label: "Replying to client emails from your Gmail", why: "Anything that reaches a client stays on Ask first. Auto skips the moment you'd catch a bad send." },
          { id: "new", label: "A brand-new task on a client's connected account", why: "New tasks are exactly when you need to see the plan." },
        ],
        hints: ["Auto removes your approve step. Where does that not matter?", "Routine, reviewed, and nothing sends.", "The EOD draft."],
      },
    ],
    done: "That's the rule: Auto for routine work that only writes files, Ask first for everything that reaches a person.",
  },
  status: "team-pending",
  audience: ["pro", "max"],
} satisfies Update
