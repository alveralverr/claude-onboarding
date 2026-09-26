/* Game state for v4 and v5: XP, badges, step completion, avatar, and the
   v5 story (paths, shifts, tasks, trust, habit scores).

   Stored under its own key so the v1 key (checkboxes + safety) stays exactly
   as v1/v2/v3 wrote it. Everything that can be derived is derived, so a v3
   user opens v4 already at the right level with the right badges, and a
   future cloud sync only has to merge two sets of keys (see mergeGame). */
import { useSyncExternalStore } from "react"

import { BADGES, LEVELS } from "@/content/world"
import { weekStart } from "@/content/quests"
import { PATHS } from "@/content/paths"
import { taskKey, type Habit } from "@/story/types"
import { FIRST_TASK_KEY, SETUP_KEYS } from "./data"
import { getStatus, useProgress, type ProgressState } from "./progress"

export const GAME_KEY = "magic-onboarding-v4"

export type GameState = {
  version: 1
  /* "mission/step" -> ISO time completed. Quests use "quest/<id>-<week>". */
  steps: Record<string, string>
  /* badge id -> ISO time first shown (badges themselves are derived) */
  seen: Record<string, string>
  avatar?: string
  name?: string
  story: StoryState
  updatedAt: string
}

/* v5 story progress. Task keys are "path/shift/task" (see taskKey). */
export type TaskResult = {
  done: string
  pts: Partial<Record<Habit, number>>
  max: Partial<Record<Habit, number>>
  hints: number
  rewinds: number
  trust: number
}
export type StoryState = {
  started?: string
  /* the path the assistant says they were hired for */
  role?: string
  /* the path being played (a live path; role may not be built yet) */
  play?: string
  tasks: Record<string, TaskResult>
  /* client trust per path, 1 to 5 */
  trust: Record<string, number>
  /* the real-client fields typed into Plan your real Week 1 (stays local) */
  launchpad?: Record<string, string>
}

const emptyStory = (): StoryState => ({ tasks: {}, trust: {} })
const empty = (): GameState => ({ version: 1, steps: {}, seen: {}, story: emptyStory(), updatedAt: new Date(0).toISOString() })

function load(): GameState {
  try {
    const raw = localStorage.getItem(GAME_KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<GameState>
      return { ...empty(), ...s, steps: s.steps ?? {}, seen: s.seen ?? {}, story: { ...emptyStory(), ...s.story } }
    }
  } catch {
    /* blocked or corrupt */
  }
  return empty()
}

let state = load()
const listeners = new Set<() => void>()
function commit(next: GameState) {
  state = { ...next, updatedAt: new Date().toISOString() }
  try {
    localStorage.setItem(GAME_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}
function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
export function useGame() {
  return useSyncExternalStore(subscribe, () => state, () => state)
}

export const stepKey = (mission: string, step: string) => `${mission}/${step}`

export function completeStep(mission: string, step: string) {
  const k = stepKey(mission, step)
  if (state.steps[k]) return
  commit({ ...state, steps: { ...state.steps, [k]: new Date().toISOString() } })
}
export function isStepDone(s: GameState, mission: string, step: string) {
  return !!s.steps[stepKey(mission, step)]
}
export function markSeen(badge: string) {
  if (state.seen[badge]) return
  commit({ ...state, seen: { ...state.seen, [badge]: new Date().toISOString() } })
}
export function setAvatar(avatar: string, name?: string) {
  commit({ ...state, avatar, name: name?.trim() || state.name })
}
export function resetGame() {
  commit(empty())
}

/* ---------- v5 story ---------- */

export const TRUST_START = 3
const clampTrust = (n: number) => Math.max(1, Math.min(5, Math.round(n * 2) / 2))

export function startStory(role: string, play: string) {
  commit({ ...state, story: { ...state.story, started: state.story.started ?? new Date().toISOString(), role, play } })
}

export function recordTask(path: string, shift: string, task: string, r: Omit<TaskResult, "done">) {
  const k = taskKey(path, shift, task)
  const prev = state.story.tasks[k]
  const trust = clampTrust((state.story.trust[path] ?? TRUST_START) + r.trust)
  commit({
    ...state,
    story: {
      ...state.story,
      tasks: { ...state.story.tasks, [k]: { ...r, done: prev?.done ?? new Date().toISOString() } },
      trust: { ...state.story.trust, [path]: trust },
    },
  })
}

export function saveLaunchpad(fields: Record<string, string>) {
  commit({ ...state, story: { ...state.story, launchpad: fields } })
}

export const trustOf = (g: GameState, path: string) => g.story.trust[path] ?? TRUST_START

/* Union merge for a later cloud sync: newest wins per key. */
export function mergeGame(a: GameState, b: GameState): GameState {
  const newer = a.updatedAt >= b.updatedAt ? a : b
  return {
    version: 1,
    steps: { ...a.steps, ...b.steps },
    seen: { ...a.seen, ...b.seen },
    avatar: newer.avatar ?? a.avatar ?? b.avatar,
    name: newer.name ?? a.name ?? b.name,
    story: {
      ...(a.updatedAt >= b.updatedAt ? b.story : a.story),
      ...newer.story,
      tasks: { ...a.story.tasks, ...b.story.tasks },
      trust: { ...a.story.trust, ...newer.story.trust },
    },
    updatedAt: newer.updatedAt,
  }
}

/* Consecutive weeks with at least one completed step, counting back from
   this week or last week (so a Monday visit doesn't break a streak). */
export function streakWeeks(g: GameState, now = new Date()): number {
  const stamps = [...Object.values(g.steps), ...Object.values(g.story.tasks).map((t) => t.done)]
  const weeks = new Set(stamps.map((iso) => weekStart(new Date(iso))))
  let cursor = weekStart(now)
  if (!weeks.has(cursor)) cursor = weekStart(new Date(now.getTime() - 7 * 86400000))
  let n = 0
  while (weeks.has(cursor)) {
    n++
    cursor = weekStart(new Date(Date.parse(cursor) - 7 * 86400000))
  }
  return n
}

/* ---------- Derived: XP, badges, level ---------- */

export const XP = { setupItem: 10, firstTask: 120, safety: 120, step: 20, storyTask: 30, shift: 40 }

export type Derived = {
  xp: number
  streak: number
  level: (typeof LEVELS)[number]
  nextLevel?: (typeof LEVELS)[number]
  levelPct: number
  badges: string[]
  unseen: string[]
  /* estimated hours saved across finished story tasks */
  hours: number
  /* 0..1 per habit across finished story tasks */
  habits: Record<Habit, number>
}

export function derive(p: ProgressState, g: GameState, stepXp: Record<string, number> = {}): Derived {
  const st = getStatus(p)
  let xp = SETUP_KEYS.filter((k) => p.checkboxes[k]).length * XP.setupItem
  if (p.checkboxes[FIRST_TASK_KEY]) xp += XP.firstTask
  if (st.safety) xp += XP.safety
  for (const k of Object.keys(g.steps)) xp += stepXp[k] ?? XP.step

  // v5 story: tasks, shifts, paths, hours and habit scores
  const story = g.story
  let minutes = 0
  const pts: Record<Habit, number> = { spot: 0, brief: 0, steer: 0, check: 0, show: 0 }
  const max: Record<Habit, number> = { spot: 0, brief: 0, steer: 0, check: 0, show: 0 }
  const storyBadges: string[] = []
  for (const path of PATHS) {
    let pathDone = !!path.shifts?.length
    path.shifts?.forEach((shift, si) => {
      let shiftDone = true
      for (const task of shift.tasks) {
        const r = story.tasks[taskKey(path.id, shift.id, task.id)]
        if (!r) {
          shiftDone = false
          continue
        }
        xp += XP.storyTask
        minutes += Math.max(0, task.minutes.manual - task.minutes.claude)
        for (const h of Object.keys(r.max) as Habit[]) {
          pts[h] += r.pts[h] ?? 0
          max[h] += r.max[h] ?? 0
        }
      }
      if (shiftDone) {
        xp += XP.shift
        if (si === 0 && !storyBadges.includes("first-shift")) storyBadges.push("first-shift")
      } else pathDone = false
    })
    if (pathDone) storyBadges.push(`path-${path.id}`)
  }
  const habits = Object.fromEntries((Object.keys(pts) as Habit[]).map((h) => [h, max[h] ? pts[h] / max[h] : 0])) as Record<Habit, number>

  const badges: string[] = []
  if (st.setup) badges.push("desk-ready")
  if (st.first) badges.push("first-task")
  if (g.steps["inbox/edit"]) badges.push("editors-eye")
  if (g.steps["vault/secret"]) badges.push("secret-keeper")
  if (st.all) badges.push("client-ready")
  if (p.checkboxes["live-studio"]) badges.push("deck-builder")
  if (p.checkboxes["live-switchboard"]) badges.push("connector-pro")
  if (p.checkboxes["live-clock"]) badges.push("scheduler")
  if (p.checkboxes["live-writing"]) badges.push("prompt-whisperer")
  if (p.checkboxes["live-workshop"]) badges.push("skill-maker")
  if (streakWeeks(g) >= 3) badges.push("streak")
  if (p.checkboxes["fb-0"]) badges.push("voice-heard")
  badges.push(...storyBadges)

  let level = LEVELS[0]
  for (const l of LEVELS) if (xp >= l.xp) level = l
  const nextLevel = LEVELS.find((l) => l.xp > level.xp)
  const levelPct = nextLevel ? Math.round(((xp - level.xp) / (nextLevel.xp - level.xp)) * 100) : 100
  const unseen = badges.filter((b) => !g.seen[b])
  return { xp, streak: streakWeeks(g), level, nextLevel, levelPct, badges, unseen, hours: Math.round((minutes / 60) * 10) / 10, habits }
}

export function useDerived() {
  const p = useProgress()
  const g = useGame()
  return derive(p, g)
}

export const badgeInfo = (id: string) => BADGES.find((b) => b.id === id)
