import * as React from "react"
import { ArrowLeftIcon, RotateCcwIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Composer } from "@/sim/Composer"
import { emptyComposer } from "@/sim/composerState"
import { ClaudeMsg, UserBubble } from "@/sim/parts"
import { Shell, Thread } from "@/sim/Shell"
import { SIM } from "@/sim/theme"
import { HABITS, surfaceOf } from "@/story/types"
import type { RunnerApi } from "@/story/useRunner"
import { BriefView } from "@/story/steps/BriefView"
import { ChooseView } from "@/story/steps/ChooseView"
import { ConnectView } from "@/story/steps/ConnectView"
import { InstructionsView } from "@/story/steps/InstructionsView"
import { PermissionView } from "@/story/steps/PermissionView"
import { PlanView } from "@/story/steps/PlanView"
import { ReviewView } from "@/story/steps/ReviewView"

/* With no task running, the laptop is a sandbox home screen. */
function FreeHome({ userName, company }: { userName: string; company: string }) {
  const [c, setC] = React.useState(emptyComposer)
  const [said, setSaid] = React.useState<string[]>([])
  return (
    <Shell active="new" userName={userName} project={company}>
      {said.length === 0 ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[680px] flex-col gap-6 px-4 py-10 md:px-6 md:py-16">
            <h2 className="text-center text-[30px]" style={SIM.serif}>
              Good morning, {userName}
            </h2>
            <Composer state={c} onChange={setC} onSend={() => { setSaid((s) => [...s, c.text]); setC(emptyComposer()) }} />
          </div>
        </div>
      ) : (
        <>
          <Thread>
            {said.map((t, i) => (
              <React.Fragment key={i}>
                <UserBubble>{t}</UserBubble>
                <ClaudeMsg>
                  <p>This is practice mode, so I can't do real work here. Pick up a task from the sticky notes on your desk, or your phone, and we'll do it together.</p>
                </ClaudeMsg>
              </React.Fragment>
            ))}
          </Thread>
          <div className="mx-auto w-full max-w-[720px] px-4 pb-4 md:px-6">
            <Composer state={c} onChange={setC} onSend={() => { setSaid((s) => [...s, c.text]); setC(emptyComposer()) }} />
          </div>
        </>
      )}
    </Shell>
  )
}

export function Laptop({ api, userName, onLeanBack }: { api: RunnerApi; userName: string; onLeanBack: () => void }) {
  const reduce = useReducedMotion()
  const alertRef = React.useRef<HTMLDivElement>(null)
  const hasConseq = !!api.conseq
  React.useEffect(() => {
    if (hasConseq) alertRef.current?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" })
  }, [hasConseq, reduce])
  const persona = api.path.persona!
  const step = api.step && surfaceOf(api.step) === "laptop" ? api.step : null
  const key = `${api.task?.id}-${api.stepIdx}-${api.epoch}`
  const habit = step?.habit ? HABITS.find((h) => h.id === step.habit) : undefined

  let view: React.ReactNode = <FreeHome userName={userName} company={persona.company} />
  if (step) {
    const props = { api, userName }
    switch (step.kind) {
      case "brief":
        view = <BriefView key={key} step={step} {...props} />
        break
      case "plan":
        view = <PlanView key={key} step={step} {...props} />
        break
      case "connect":
        view = <ConnectView key={key} step={step} {...props} />
        break
      case "permission":
        view = <PermissionView key={key} step={step} {...props} />
        break
      case "choose":
        view = <ChooseView key={key} step={step} {...props} />
        break
      case "review":
        view = <ReviewView key={key} step={step} {...props} />
        break
      case "instructions":
        view = <InstructionsView key={key} step={step} {...props} />
        break
    }
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.72, y: -30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Button variant="outline" size="lg" onClick={onLeanBack}>
          <ArrowLeftIcon data-icon="inline-start" />
          {api.task ? "Pause and lean back" : "Lean back"}
        </Button>
        {api.task && step && (
          <p className="text-[15px]">
            <span className="font-semibold">{api.task.title}</span>
            <span className="text-muted-foreground">
              {" "}
              · step {api.stepIdx + 1} of {api.task.steps.length}: {step.title}
            </span>
          </p>
        )}
        {habit && <span className="ml-auto rounded-full bg-secondary px-3 py-1 text-[13px] font-semibold text-secondary-foreground">Habit: {habit.name}</span>}
      </div>
      {api.conseq && (
        <div ref={alertRef} role="alert" className="flex scroll-mt-24 flex-wrap items-center gap-3 rounded-2xl border-2 border-[#F7C1C1] bg-[#FFF4F2] px-4 py-3">
          <p className="min-w-0 flex-1 text-[15px] text-[#791F1F]">
            <span className="font-semibold">{api.conseq.from ?? persona.first}:</span> {api.conseq.text}
          </p>
          <Button onClick={api.rewind}>
            <RotateCcwIcon data-icon="inline-start" /> Rewind to the decision
          </Button>
        </div>
      )}
      <div className="h-[min(760px,calc(100dvh-210px))] min-h-[540px] overflow-hidden rounded-[22px] border-[10px] border-ink-dark bg-ink-dark shadow-lift">
        <div className="size-full overflow-hidden rounded-[12px]">{view}</div>
      </div>
      <div className="mx-auto h-3 w-[70%] rounded-b-[18px] bg-[#C9C5E0]" aria-hidden="true" />
    </motion.div>
  )
}
