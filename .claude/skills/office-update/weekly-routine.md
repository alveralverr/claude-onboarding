# Weekly pre-draft (scheduled routine)

Prompt for the Claude Code scheduled routine that keeps the knowledge base
continuous. It drafts; a person publishes.

---

You are working in the public repo `alveralverr/claude-onboarding` (The Magic Office, Magic's Claude onboarding for executive assistants). Load the `office-update` skill from `.claude/skills/office-update/SKILL.md` and follow it.

1. Read Anthropic's release notes (`https://support.claude.com/en/articles/12138966-release-notes`) and the Claude blog (`https://claude.com/blog`). Collect every change from the last 8 days.
2. Read `src/content/updates/` and skip anything already covered.
3. For each remaining change that affects how an executive assistant uses Claude for client work (features, models, connectors, skills, plans, policies), draft a card per the skill. Skip developer-only and API-only changes.
4. If a change alters the default model, fallback, effort guidance or Team availability, edit `src/content/now.ts`.
5. Run `npm run lint && npm run build`.
6. Create branch `updates/<today yyyy-mm-dd>`, commit, and open a pull request titled `Weekly updates: <today>` with one line per card and a note on anything you were unsure about. Do not push to `main`. If there is nothing new, open no PR and stop.
