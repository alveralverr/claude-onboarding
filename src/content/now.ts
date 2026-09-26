/* The current state of Claude, in one place. Copy across the site reads
   from here, so a model announcement is a one-line edit plus an update
   card (see src/content/updates). Dates are when Anthropic shipped it. */
import { MERGED_UI } from "@/lib/flags"

export const NOW = {
  /* Model names as they appear in the picker. */
  defaultModel: "Opus 5.5",
  defaultModelShort: "Opus",
  defaultModelSince: "22 September 2026",
  fallbackModel: "Sonnet",
  avoidForClients: "Haiku",
  effortDefault: "High",
  /* Plan facts for Magic's Team seats. Flip when the rollout reaches Team. */
  teamHasMergedUI: MERGED_UI,
  teamHasDocsSlides: false,
  seatPlan: "Claude Team Standard",
  seatValuePhp: 1500,
  /* Where the Product Team and assistants go for the official word. */
  releaseNotes: "https://support.claude.com/en/articles/12138966-release-notes",
  blog: "https://claude.com/blog",
} as const
