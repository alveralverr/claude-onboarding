import type { Update } from "./types"

export default {
  id: "2026-09-23-marketplace",
  date: "2026-09-23",
  kind: "policy",
  title: "The Claude Marketplace, and Magic's rule",
  summary: "Anthropic opened a marketplace with thousands of plugins, agents and connectors. Anyone can publish to it.",
  why: "Popularity is not verification. For client work, use Anthropic-verified connectors and Magic's skills. Anything that sends on a client's behalf without your review is off the table, however many installs it has.",
  links: [{ label: "Use plugins in Claude", href: "https://support.claude.com/en/articles/13837440-use-plugins-in-claude" }],
  habits: ["steer"],
  rooms: ["workshop", "skills", "vault"],
  status: "live",
  audience: ["all"],
} satisfies Update
