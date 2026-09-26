/* Game state for v4: XP, badges, step completion, avatar.

   Stored under its own key so the v1 key (checkboxes + safety) stays exactly
   as v1/v2/v3 wrote it. Everything that can be derived is derived, so a v3
   user opens v4 already at the right level with the right badges, and a
   future cloud sync only has to merge two sets of keys (see mergeGame). */
import { useSyncExternalStore } from "react"

import { BADGES, LEVELS } from "@/content/world"
import { FIRST_TASK_KEY, SETUP_KEYS } from "./data"
import { getStatus, useProgress, type ProgressState } from "./progress"

export const GAME_KEY = "magic-onboarding-v4"

export type GameState = {
  version: 1
  /* "mission/step" -> ISO time completed */
  steps: Record<string, string>
  /* badge id -> ISO time first shown (badges themselves are derived) */
  seen: Record<string, string>
  avatar?: string
  name?: string
  updatedAt: string
}

const empty = (): GameState => ({ version: 1, steps: {}, seen: {}, updatedAt: new Date(0).toISOString() })

function load(): GameState {
  try {
    const raw = localStorage.getItem(GAME_KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<GameState>
      return { ...empty(), ...s, steps: s.steps ?? {}, seen: s.seen ?? {} }
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

/* Union merge for a later cloud sync: newest wins per key. */
export function mergeGame(a: GameState, b: GameState): GameState {
  const newer = a.updatedAt >= b.updatedAt ? a : b
  return {
    version: 1,
    steps: { ...a.steps, ...b.steps },
    seen: { ...a.seen, ...b.seen },
    avatar: newer.avatar ?? a.avatar ?? b.avatar,
    name: newer.name ?? a.name ?? b.name,
    updatedAt: newer.updatedAt,
  }
}

/* ---------- Derived: XP, badges, level ---------- */

export const XP = { setupItem: 10, firstTask: 120, safety: 120, step: 20 }

export type Derived = {
  xp: number
  level: (typeof LEVELS)[number]
  nextLevel?: (typeof LEVELS)[number]
  levelPct: number
  badges: string[]
  unseen: string[]
}

export function derive(p: ProgressState, g: GameState, stepXp: Record<string, number> = {}): Derived {
  const st = getStatus(p)
  let xp = SETUP_KEYS.filter((k) => p.checkboxes[k]).length * XP.setupItem
  if (p.checkboxes[FIRST_TASK_KEY]) xp += XP.firstTask
  if (st.safety) xp += XP.safety
  for (const k of Object.keys(g.steps)) xp += stepXp[k] ?? XP.step

  const badges: string[] = []
  if (st.setup) badges.push("desk-ready")
  if (st.first) badges.push("first-task")
  if (g.steps["inbox/edit"]) badges.push("editors-eye")
  if (g.steps["vault/secret"]) badges.push("secret-keeper")
  if (st.all) badges.push("client-ready")

  let level = LEVELS[0]
  for (const l of LEVELS) if (xp >= l.xp) level = l
  const nextLevel = LEVELS.find((l) => l.xp > level.xp)
  const levelPct = nextLevel ? Math.round(((xp - level.xp) / (nextLevel.xp - level.xp)) * 100) : 100
  const unseen = badges.filter((b) => !g.seen[b])
  return { xp, level, nextLevel, levelPct, badges, unseen }
}

export function useDerived() {
  const p = useProgress()
  const g = useGame()
  return derive(p, g)
}

export const badgeInfo = (id: string) => BADGES.find((b) => b.id === id)
