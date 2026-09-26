/* The mission content model. A mission is a room; a room is a list of steps.
   Every step kind is rendered by src/engine/steps. Adding a mission means
   adding a file under src/content/missions and one entry in world.ts. See
   CONTENT.md. */
import type { ReactNode } from "react"

export type Media =
  | { type: "image"; src: string; alt: string; w: number; h: number; className?: string }
  | { type: "gif"; src: string; poster: string; alt: string; w: number; h: number }
  | { type: "video"; src: string; label: string }
  | { type: "youtube"; id: string; title: string }

type Base = { id: string; title: string; xp?: number; optional?: boolean }

/* Read a short thing. */
export type ExplainStep = Base & {
  kind: "explain"
  body: ReactNode
  media?: Media
  voice?: string
  note?: { variant?: "info" | "warning"; body: ReactNode }
}

/* Tick real setup items. Keys are the v1 localStorage checkbox keys. */
export type ChecklistStep = Base & {
  kind: "checklist"
  intro?: ReactNode
  items: { k: string; label: ReactNode; media?: Media }[]
  note?: { variant?: "info" | "warning"; body: ReactNode }
  voice?: string
  after?: ReactNode
}

/* One scenario, one right answer, feedback either way. */
export type QuizQuestion = {
  id: string
  q: string
  options: { v: string; t: string }[]
  answer: string
  wrong: string
  right?: string
}
export type QuizStep = Base & {
  kind: "quiz"
  intro?: ReactNode
  questions: QuizQuestion[]
  /* Called once every question has been answered correctly. */
  onPass?: () => void
}

/* Click the problem in a mock. Segments with `flag` are the targets. */
export type SpotStep = Base & {
  kind: "spot"
  intro: ReactNode
  frame: "prompt" | "draft" | "plan"
  segments: { text: string; flag?: string; fix?: string }[]
  done: ReactNode
}

/* Build a prompt from ingredient chips. */
export type ComposeStep = Base & {
  kind: "compose"
  intro: ReactNode
  groups: { id: string; label: string; hint: string; chips: { id: string; text: string; good?: boolean; why?: string }[] }[]
  done: ReactNode
}

/* Scripted Claude run with an approve-or-redirect moment. */
export type SimStep = Base & {
  kind: "sim"
  intro: ReactNode
  scenario: string
}

/* Take it live: a real-work attestation bound to a v1 key. */
export type LiveStep = Base & {
  kind: "live"
  body: ReactNode
  k: string
  label: ReactNode
  prompts?: string[]
}

/* The reward beat. */
export type RevealStep = Base & {
  kind: "reveal"
  badge?: string
  body: ReactNode
  next?: { href: string; label: string }
}

export type Step = ExplainStep | ChecklistStep | QuizStep | SpotStep | ComposeStep | SimStep | LiveStep | RevealStep

export type Mission = {
  id: string
  title: string
  tagline: string
  minutes: number
  steps: Step[]
}
