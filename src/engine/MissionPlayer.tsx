import * as React from "react"
import { cn } from "cn"
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Mission, Step } from "@/content/types"
import { completeStep, isStepDone, useGame } from "@/lib/game"
import { useProgress } from "@/lib/progress"
import { Checklist } from "./steps/Checklist"
import { Compose } from "./steps/Compose"
import { Explain } from "./steps/Explain"
import { Live } from "./steps/Live"
import { Quiz } from "./steps/Quiz"
import { Reveal } from "./steps/Reveal"
import { Sim } from "./steps/Sim"
import { Spot } from "./steps/Spot"

/* Plays a mission one step at a time. Step completion is written to the v4
   store; checklist and live steps also write the v1 keys through their own
   components. Nothing blocks Next: an assistant can always move on and come
   back, the step just stays unticked. */
export function MissionPlayer({ mission, room, onExit }: { mission: Mission; room: { name: string }; onExit: string }) {
  const g = useGame()
  const p = useProgress()
  const reduce = useReducedMotion()
  const steps = mission.steps
  const firstOpen = Math.max(0, steps.findIndex((s) => !isStepDone(g, mission.id, s.id)))
  const [i, setI] = React.useState(firstOpen < 0 ? 0 : firstOpen)
  const [dir, setDir] = React.useState(1)
  const step = steps[i]
  const topRef = React.useRef<HTMLDivElement>(null)

  const doneCount = steps.filter((s) => isStepDone(g, mission.id, s.id)).length
  const markDone = React.useCallback(() => completeStep(mission.id, step.id), [mission.id, step.id])

  const go = (n: number) => {
    setDir(n > i ? 1 : -1)
    setI(Math.max(0, Math.min(steps.length - 1, n)))
    topRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" })
  }
  const next = () => {
    if (step.kind === "explain") markDone()
    go(i + 1)
  }

  const stepDone = isStepDone(g, mission.id, step.id)
  const last = i === steps.length - 1

  return (
    <div ref={topRef} className="scroll-mt-20">
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <a href={onExit} className="flex items-center gap-1 text-violet no-underline hover:underline">
          <ArrowLeftIcon className="size-4" /> Back to the office
        </a>
        <span aria-hidden="true">·</span>
        <span>
          {room.name} · about {mission.minutes} min
        </span>
        <span className="ml-auto" aria-live="polite">
          Step {i + 1} of {steps.length}
        </span>
      </div>

      <ol className="mb-5 flex flex-wrap gap-1.5" aria-label="Steps">
        {steps.map((s, n) => {
          const d = isStepDone(g, mission.id, s.id)
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(n)}
                aria-current={n === i ? "step" : undefined}
                aria-label={`${s.title}${d ? ", done" : ""}`}
                className={cn(
                  "flex h-8 min-w-8 items-center justify-center gap-1 rounded-full border-1.5 px-2 text-xs font-semibold transition-colors",
                  n === i ? "border-violet bg-violet text-white" : d ? "border-success bg-success-soft text-success" : "border-border bg-card text-muted-foreground hover:border-violet/40"
                )}
              >
                {d && n !== i ? <CheckIcon className="size-3.5" /> : n + 1}
              </button>
            </li>
          )
        })}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step.id}
          initial={reduce ? false : { opacity: 0, x: 24 * dir }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -24 * dir }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="text-[17px]">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <CardTitle className="text-[clamp(22px,2.3vw,28px)] leading-tight font-semibold tracking-[-0.01em] text-balance">{step.title}</CardTitle>
              {stepDone && step.kind !== "reveal" && (
                <Badge variant="success" className="h-6 shrink-0 px-2.5 text-sm">
                  Done
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <StepView step={step} onDone={markDone} passed={!!p.v2.safety} />
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="outline" size="lg" disabled={i === 0} onClick={() => go(i - 1)}>
          <ArrowLeftIcon data-icon="inline-start" /> Back
        </Button>
        <p className="text-sm text-muted-foreground">
          {doneCount} of {steps.length} done
        </p>
        {last ? (
          <Button size="lg" render={<a href={onExit} />} nativeButton={false}>
            Back to the office
          </Button>
        ) : (
          <Button size="lg" variant={stepDone || step.kind === "explain" ? "default" : "secondary"} onClick={next}>
            {stepDone || step.kind === "explain" ? "Next" : "Skip for now"} <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  )
}

function StepView({ step, onDone, passed }: { step: Step; onDone: () => void; passed: boolean }) {
  switch (step.kind) {
    case "explain":
      return <Explain step={step} />
    case "checklist":
      return <Checklist step={step} onDone={onDone} />
    case "quiz":
      return <Quiz step={step} onDone={onDone} alreadyPassed={passed} />
    case "spot":
      return <Spot step={step} onDone={onDone} />
    case "compose":
      return <Compose step={step} onDone={onDone} />
    case "sim":
      return <Sim step={step} onDone={onDone} />
    case "live":
      return <Live step={step} onDone={onDone} />
    case "reveal":
      return <Reveal step={step} onDone={onDone} />
  }
}
