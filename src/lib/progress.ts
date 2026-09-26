/* Progress store. Persists to localStorage under the SAME key as v1/v2 so
   returning assistants keep their ticks. Shape:
   { checkboxes: {key: true}, v2: { safety: true } }  (older v1 fields are kept
   but ignored). Nothing on the page is ever locked; this only drives the
   "Your path" card, the top-bar pill, and the certificate hand-off. */
import { useSyncExternalStore } from "react"

import { FIRST_TASK_KEY, SETUP_KEYS, SETUP_PANELS } from "./data"

export const STORAGE_KEY = "magic-onboarding-v1"

export type ProgressState = {
  checkboxes: Record<string, boolean>
  v2: { safety?: boolean }
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const s = raw ? (JSON.parse(raw) as Partial<ProgressState> & Record<string, unknown>) : null
    if (s && typeof s === "object") {
      return { ...s, checkboxes: s.checkboxes ?? {}, v2: s.v2 ?? {} }
    }
  } catch {
    /* storage blocked or corrupt */
  }
  return { checkboxes: {}, v2: {} }
}

let state: ProgressState = load()
const listeners = new Set<() => void>()

function commit(next: ProgressState) {
  state = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function setChecked(key: string, checked: boolean) {
  const checkboxes = { ...state.checkboxes }
  if (checked) checkboxes[key] = true
  else delete checkboxes[key]
  commit({ ...state, checkboxes })
}

export function passSafety() {
  commit({ ...state, v2: { ...state.v2, safety: true } })
}

export function resetProgress() {
  commit({ checkboxes: {}, v2: {} })
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
const getSnapshot = () => state

export function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export type Status = {
  setupDone: number
  setupTotal: number
  setup: boolean
  first: boolean
  safety: boolean
  pct: number
  all: boolean
  current: "setup" | "first" | "safety" | null
}

export function getStatus(s: ProgressState): Status {
  const setupDone = SETUP_KEYS.filter((k) => s.checkboxes[k]).length
  const setup = setupDone === SETUP_KEYS.length
  const first = !!s.checkboxes[FIRST_TASK_KEY]
  const safety = !!s.v2.safety
  const pct = Math.round((setupDone / Math.max(1, SETUP_KEYS.length)) * 60 + (first ? 20 : 0) + (safety ? 20 : 0))
  const all = setup && first && safety
  const current = !setup ? "setup" : !first ? "first" : !safety ? "safety" : null
  return { setupDone, setupTotal: SETUP_KEYS.length, setup, first, safety, pct, all, current }
}

export function useStatus() {
  return getStatus(useProgress())
}

export function isPanelComplete(s: ProgressState, keys: readonly string[]) {
  return keys.length > 0 && keys.every((k) => s.checkboxes[k])
}

export function firstIncompletePanel(s: ProgressState) {
  const i = SETUP_PANELS.findIndex((p) => !isPanelComplete(s, p.keys))
  return i < 0 ? 0 : i
}
