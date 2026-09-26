/* The v5 story model: paths, shifts, tasks and steps.

   A path is a role an assistant was hired for, with a fictional client and
   a handful of shifts. A shift is a working day of tasks. A task starts with
   a message from the client and runs through steps; each step trains one of
   the five habits. Content lives in src/content/paths and is plain data. */

export type Habit = "spot" | "brief" | "steer" | "check" | "show"

export const HABITS: { id: Habit; name: string; line: string }[] = [
  { id: "spot", name: "Spot", line: "Know what to hand Claude" },
  { id: "brief", name: "Brief", line: "Give Claude what it can't guess" },
  { id: "steer", name: "Steer", line: "Read the plan, pick the shape, pilot first" },
  { id: "check", name: "Check", line: "Review it the way the client would" },
  { id: "show", name: "Show", line: "Close the loop with the client" },
]

export type Persona = {
  id: string
  name: string
  first: string
  company: string
  what: string
  city: string
  tzShort: string
  initials: string
  portrait?: string
  prefs: string[]
  voice: string
}

export type ClientFile = { id: string; name: string; kind: "doc" | "sheet" | "pdf" | "recording" | "email" }

/* Something that happens because of a choice: a message on the phone. */
export type Consequence = { from?: string; text: string; trust: number }

export type Option = {
  id: string
  label: string
  good?: boolean
  why: string
  /* what the client texts back when this is sent (phone steps) */
  reply?: string
  consequence?: Consequence
}

type Base = {
  id: string
  title: string
  habit?: Habit
  /* nudge, hint, answer */
  hints?: string[]
}

/* Desk: sort the client's to-dos into who does what. */
export type SortStep = Base & {
  kind: "sort"
  prompt: string
  bins: { id: string; label: string; hint: string }[]
  cards: { id: string; text: string; bin: string; why: string }[]
}

export type Ingredient = { id: string; label: string; test: string; insert: string }

/* Laptop: write the brief in the practice Claude composer. */
export type BriefStep = Base & {
  kind: "brief"
  prompt: string
  files: ClientFile[]
  needFiles: string[]
  projects: { id: string; label: string; ok: boolean; why?: string }[]
  /* "any" when either mode works for this job */
  mode: "cowork" | "chat" | "any"
  skill?: string
  ingredients: Ingredient[]
  example: string
}

export type PlanItem = {
  text: string
  bad?: { why: string; options: { text: string; good?: boolean; why?: string }[]; fixed: string }
}

/* Laptop: Claude shows a plan; approve or redirect. */
export type PlanStep = Base & { kind: "plan"; plan: PlanItem[]; tools: string[]; consequence: Consequence }

/* Laptop: Claude can't see a tool; connect it in Customize. */
export type ConnectStep = Base & { kind: "connect"; says: string; connector: string; options: Option[] }

/* Laptop: Claude asks permission before acting. */
export type PermissionStep = Base & { kind: "permission"; says: string; action: string; detail: string; options: Option[] }

/* Laptop: Claude offers options; pick one. */
export type ChooseStep = Base & {
  kind: "choose"
  says: string
  table?: { head: string[]; rows: string[][] }
  recommend?: string
  options: Option[]
}

export type Segment = { text: string; flag?: string; fix?: string }

/* Laptop: review Claude's output and flag what the client would catch. */
export type ReviewStep = Base & {
  kind: "review"
  intro: string
  artifact: { kind: "email" | "doc" | "tasks" | "eod"; title: string; meta?: string }
  segments: Segment[]
  done: string
}

export type ComposeGroup = {
  id: string
  label: string
  hint: string
  chips: { id: string; text: string; good?: boolean; why?: string }[]
}

/* Laptop: write a project's Instructions for Claude. */
export type InstructionsStep = Base & { kind: "instructions"; intro: string; project: string; groups: ComposeGroup[]; done: string }

/* Phone: choose what to send the client. */
export type PhoneStep = Base & { kind: "phone"; prompt: string; options: Option[] }

/* Desk: do it for real, tick the v1 key. */
export type LiveStep = Base & { kind: "live"; body: string; k: string; label: string; prompts: string[] }

/* Desk: plan the real Week 1 and export the Launchpad block. */
export type LaunchpadStep = Base & { kind: "launchpad" }

export type Step =
  | SortStep
  | BriefStep
  | PlanStep
  | ConnectStep
  | PermissionStep
  | ChooseStep
  | ReviewStep
  | InstructionsStep
  | PhoneStep
  | LiveStep
  | LaunchpadStep

export type Task = {
  id: string
  title: string
  /* short label on the sticky note */
  sticky: string
  habits: Habit[]
  /* estimated minutes by hand vs with Claude plus review */
  minutes: { manual: number; claude: number }
  /* the client's message that starts the task */
  open: string
  steps: Step[]
  /* the client's message when it's done */
  done?: string
}

export type Shift = { id: string; day: string; title: string; clock: string; tasks: Task[] }

export type PathDef = {
  id: string
  name: string
  blurb: string
  icon: string
  live: boolean
  next?: boolean
  persona?: Persona
  shifts?: Shift[]
  launchpad?: { recurring: string[]; platforms: string[] }
}

export type Surface = "desk" | "laptop" | "phone"

export function surfaceOf(s: Step): Surface {
  if (s.kind === "sort" || s.kind === "live" || s.kind === "launchpad") return "desk"
  if (s.kind === "phone") return "phone"
  return "laptop"
}

export const taskKey = (path: string, shift: string, task: string) => `${path}/${shift}/${task}`
