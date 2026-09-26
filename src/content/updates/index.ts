import type { Update } from "./types"

/* Every update file in this folder, newest first. Add a file, and it's
   published on the next deploy. Nothing else to register. */
const files = import.meta.glob<{ default: Update }>("./20*.ts", { eager: true })

export const UPDATES: Update[] = Object.values(files)
  .map((m) => m.default)
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export const LATEST_UPDATE_DATE = UPDATES[0]?.date ?? "1970-01-01"

export const updateById = (id?: string) => UPDATES.find((u) => u.id === id)

/* Updates newer than what the assistant has seen. */
export const unseenUpdates = (seen?: string) => UPDATES.filter((u) => !seen || u.date > seen)

/* Updates that touch a room or Shelf section. */
export const updatesFor = (room: string) => UPDATES.filter((u) => u.rooms?.includes(room))

/* Updates within `days` of a date (for quests and bonus drills). */
export const recentUpdates = (days: number, now = new Date()) =>
  UPDATES.filter((u) => (now.getTime() - Date.parse(u.date)) / 86400000 <= days)

export const KIND_LABEL: Record<Update["kind"], string> = {
  feature: "New feature",
  model: "Model",
  magic: "From Magic",
  policy: "Rules",
  tip: "Tip",
}
export const STATUS_LABEL: Record<Update["status"], string> = {
  live: "Live on your seat",
  "rolling-out": "Rolling out",
  "team-pending": "Not on Team seats yet",
}
