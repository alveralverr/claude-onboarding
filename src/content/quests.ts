/* Weekly quests. One shows per week, rotating through this list from the
   first Monday below. Add to the end; never reorder, or attestations shift.
   Each quest is a real-work step, self-attested, no penalty for skipping. */
import { recentUpdates } from "./updates"

export type Quest = { id: string; title: string; body: string; room?: string }

export const QUEST_EPOCH = "2026-09-28" // a Monday

export const QUESTS: Quest[] = [
  { id: "slides", title: "Build one real deck with Claude Slides", body: "Take a report or notes you already have and ask for a six-slide deck. Fix one slide by hand before you share it.", room: "#/room/studio" },
  { id: "instructions", title: "Add Instructions for Claude to one client project", body: "Three lines: who the client is, how they sound, and what you never send without review.", room: "#/room/writing" },
  { id: "eod", title: "Run your EOD with the skill for five days", body: "Type /eod-sod at the end of each shift. Edit it before it goes anywhere.", room: "#/room/clock" },
  { id: "redirect", title: "Redirect a plan on purpose", body: "Next time Claude shows a plan, change one step before you approve. Notice what it does differently." },
  { id: "connector", title: "Ask Claude which accounts it can see", body: "Open a session and ask: which email and calendar are connected right now? Fix anything that surprises you.", room: "#/room/switchboard" },
  { id: "skill", title: "Turn a repeat task into a skill", body: "Something you have asked for three times this month. Run /skill-creator and give it a name.", room: "#/room/workshop" },
  { id: "newchat", title: "Start a fresh chat for every new task this week", body: "One task, one chat. If you need earlier context, paste a three-line summary.", room: "#/room/engine" },
  { id: "voice", title: "Rewrite one Claude draft the way you would say it", body: "Cut the opener, cut the closer, keep the facts. Send that version." },
]

export function weekStart(d = new Date()): string {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = x.getUTCDay() || 7
  x.setUTCDate(x.getUTCDate() - day + 1)
  return x.toISOString().slice(0, 10)
}

/* An update with a quest owns the weeks right after it ships (newest first);
   otherwise the rotation above. */
export function currentQuest(d = new Date()): { quest: Quest; week: string } {
  const week = weekStart(d)
  const fromUpdate = recentUpdates(21, d).find((u) => u.quest)
  if (fromUpdate?.quest) {
    const room = fromUpdate.rooms?.find((r) => ROOM_IDS.includes(r))
    return { quest: { id: `update-${fromUpdate.id}`, title: fromUpdate.quest.title, body: fromUpdate.quest.body, room: room ? `#/room/${room}` : undefined }, week }
  }
  const weeks = Math.max(0, Math.round((Date.parse(week) - Date.parse(QUEST_EPOCH)) / 604800000))
  return { quest: QUESTS[weeks % QUESTS.length], week }
}

const ROOM_IDS = ["desk", "inbox", "vault", "studio", "switchboard", "clock", "writing", "workshop", "engine"]
