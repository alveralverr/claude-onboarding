import type { Update } from "./types"

export default {
  id: "2026-09-17-projects-memory",
  date: "2026-09-17",
  kind: "feature",
  title: "Projects with shared memory",
  summary: "Projects now run several threads side by side and share what they learn. A new thread in the same project is not starting from zero.",
  why: "One project per client, with Instructions for Claude, means every chat starts knowing the client. Start a fresh thread per task without losing the context.",
  try: "Create a project for one client and add Instructions for Claude: who they are, how they write with one real example, your defaults, and what to do when unsure.",
  habits: ["brief"],
  rooms: ["writing", "context-window"],
  status: "rolling-out",
  audience: ["all"],
} satisfies Update
