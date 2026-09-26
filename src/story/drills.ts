import { ROOMS } from "@/content/world"
import { HABITS, type Habit } from "./types"

/* The drill Andi suggests for each habit when it scores low. */
const DRILL_FOR: Record<Habit, { room: string; why: string }> = {
  spot: { room: "switchboard", why: "what Claude can reach decides what you hand it" },
  brief: { room: "writing", why: "the brief is where most misses start" },
  steer: { room: "engine", why: "models, limits and memory are what you steer" },
  check: { room: "studio", why: "review a real doc and deck the way the client would" },
  show: { room: "workshop", why: "the EOD skill is how you close the loop" },
}

export function suggestedDrill(habits: Record<Habit, number>, maxes: Partial<Record<Habit, number>>) {
  const weak = HABITS.map((h) => ({ h, score: habits[h.id] })).filter(({ h, score }) => (maxes[h.id] ?? 0) > 0 && score < 0.75).sort((a, b) => a.score - b.score)[0]
  if (!weak) return null
  const room = ROOMS.find((r) => r.id === DRILL_FOR[weak.h.id].room)
  return room ? { habit: weak.h, score: Math.round(weak.score * 100), room, why: DRILL_FOR[weak.h.id].why } : null
}
