/* Runs one task at a time: the current step, the phone thread, consequences,
   rewinds, hints and scoring. State that matters after a reload is written
   to the game store when a task finishes (recordTask); everything else is
   in memory on purpose, so a refresh never leaves a task half-scored. */
import * as React from "react"

import { recordTask, useGame } from "@/lib/game"
import { taskKey, type Consequence, type Habit, type PathDef, type Step, type Task } from "./types"

export type Msg = { id: number; from: "client" | "you" | "al"; name: string; text: string }

type Score = {
  pts: Partial<Record<Habit, number>>
  max: Partial<Record<Habit, number>>
  hints: number
  rewinds: number
  trust: number
  clean: boolean
  stepHint: number
}
const newScore = (): Score => ({ pts: {}, max: {}, hints: 0, rewinds: 0, trust: 0, clean: true, stepHint: 0 })

export type Finished = { si: number; ti: number; shiftDone: boolean; clean: boolean }

export type RunnerApi = {
  path: PathDef
  active: { si: number; ti: number } | null
  task: Task | null
  step: Step | null
  stepIdx: number
  epoch: number
  thread: Msg[]
  unread: number
  conseq: Consequence | null
  lastPrompt: string
  finished: Finished | null
  hintLevel: number
  placement: number | null
  start: (si: number, ti: number) => void
  done: (firstTry: boolean) => void
  consequence: (c: Consequence, rewind: boolean) => void
  rewind: () => void
  hint: () => void
  say: (from: Msg["from"], text: string, name?: string) => void
  setLastPrompt: (s: string) => void
  setPlacement: (n: number) => void
  markRead: () => void
  dismissFinished: () => void
  quit: () => void
}

export function useRunner(path: PathDef): RunnerApi {
  const g = useGame()
  const persona = path.persona!
  const shifts = path.shifts!
  const [active, setActive] = React.useState<{ si: number; ti: number } | null>(null)
  const [stepIdx, setStepIdx] = React.useState(0)
  const [epoch, setEpoch] = React.useState(0)
  const [thread, setThread] = React.useState<Msg[]>([])
  const [unread, setUnread] = React.useState(0)
  const [conseq, setConseq] = React.useState<Consequence | null>(null)
  const [lastPrompt, setLastPrompt] = React.useState("")
  const [finished, setFinished] = React.useState<Finished | null>(null)
  const [hintLevel, setHintLevel] = React.useState(0)
  const [placement, setPlacement] = React.useState<number | null>(null)
  const score = React.useRef<Score>(newScore())
  const ids = React.useRef(0)

  const task = active ? shifts[active.si].tasks[active.ti] : null
  const step = task ? (task.steps[stepIdx] ?? null) : null

  const say = React.useCallback(
    (from: Msg["from"], text: string, name?: string) => {
      ids.current += 1
      const id = ids.current
      const who = name ?? (from === "client" ? persona.first : from === "al" ? "Andi, your Account Lead" : "You")
      setThread((t) => [...t, { id, from, name: who, text }])
      if (from !== "you") setUnread((u) => u + 1)
    },
    [persona.first]
  )

  const start = (si: number, ti: number) => {
    score.current = newScore()
    setActive({ si, ti })
    setStepIdx(0)
    setEpoch((e) => e + 1)
    setConseq(null)
    setLastPrompt("")
    setFinished(null)
    setHintLevel(0)
    say("client", shifts[si].tasks[ti].open)
    setUnread(0)
  }

  const finish = () => {
    if (!active || !task) return
    const shift = shifts[active.si]
    const s = score.current
    const trust = s.trust + (s.clean ? 0.5 : 0)
    recordTask(path.id, shift.id, task.id, { pts: s.pts, max: s.max, hints: s.hints, rewinds: s.rewinds, trust })
    const shiftDone = shift.tasks.every((t) => t.id === task.id || !!g.story.tasks[taskKey(path.id, shift.id, t.id)])
    if (task.done) say("client", task.done)
    setFinished({ si: active.si, ti: active.ti, shiftDone, clean: s.clean })
    setActive(null)
    setConseq(null)
    setHintLevel(0)
  }

  const done = (firstTry: boolean) => {
    if (!task || !step) return
    const s = score.current
    if (step.habit) {
      s.max[step.habit] = (s.max[step.habit] ?? 0) + 1
      const full = firstTry && s.stepHint < 3
      s.pts[step.habit] = (s.pts[step.habit] ?? 0) + (full ? 1 : 0.5)
    }
    if (!firstTry) s.clean = false
    s.stepHint = 0
    setHintLevel(0)
    setConseq(null)
    if (stepIdx + 1 >= task.steps.length) finish()
    else setStepIdx(stepIdx + 1)
  }

  const consequence = (c: Consequence, rewind: boolean) => {
    say(c.from ? "al" : "client", c.text, c.from)
    score.current.trust += c.trust
    score.current.clean = false
    if (rewind) setConseq(c)
  }

  // Rewinding undoes what happened (the trust it cost comes back), but the
  // task no longer counts as a clean run: the lesson stays.
  const rewind = () => {
    if (conseq) score.current.trust -= conseq.trust
    score.current.rewinds += 1
    setConseq(null)
    setEpoch((e) => e + 1)
  }

  const hint = () => {
    const max = step?.hints?.length ?? 0
    if (!max) return
    score.current.hints += 1
    score.current.stepHint = Math.min(max, score.current.stepHint + 1)
    setHintLevel((l) => Math.min(max, l + 1))
  }

  return {
    path,
    active,
    task,
    step,
    stepIdx,
    epoch,
    thread,
    unread,
    conseq,
    lastPrompt,
    finished,
    hintLevel,
    placement,
    start,
    done,
    consequence,
    rewind,
    hint,
    say,
    setLastPrompt,
    setPlacement,
    markRead: () => setUnread(0),
    dismissFinished: () => setFinished(null),
    quit: () => {
      setActive(null)
      setConseq(null)
    },
  }
}
