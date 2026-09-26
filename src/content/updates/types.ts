import type { Task } from "@/story/types"
import type { Habit } from "@/story/types"

/* One announcement. One file per update in this folder; the loader in
   index.ts picks them all up. Authored with the /office-update skill. */
export type UpdateKind = "feature" | "model" | "magic" | "policy" | "tip"
export type UpdateStatus = "live" | "rolling-out" | "team-pending"

export type Update = {
  /* yyyy-mm-dd-slug, matches the filename */
  id: string
  /* the day Anthropic (or Magic) shipped it, yyyy-mm-dd */
  date: string
  kind: UpdateKind
  title: string
  /* two or three plain sentences: what changed */
  summary: string
  /* one or two sentences: why an EA should care */
  why: string
  video?: { youtube: string; title: string }
  links?: { label: string; href: string }[]
  /* a copyable prompt to try it on real work */
  try?: string
  habits?: Habit[]
  /* room ids or Shelf section ids this touches (adds a "New" pin there) */
  rooms?: string[]
  /* becomes the weekly quest for the three weeks after `date` */
  quest?: { title: string; body: string }
  /* a 3-minute drill using the existing step kinds; shows on the noticeboard */
  drill?: Task
  status: UpdateStatus
  /* which plans have it; Magic assistants are on Team */
  audience: ("pro" | "max" | "team" | "enterprise" | "all")[]
}
