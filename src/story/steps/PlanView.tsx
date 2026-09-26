import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { ClaudeMsg, ToolList, UserBubble, Why } from "@/sim/parts"
import { Shell, Thread } from "@/sim/Shell"
import type { PlanStep } from "../types"
import type { RunnerApi } from "../useRunner"
import { wait } from "./common"

/* Claude proposes a plan. One step is wrong. Approving it plays out the
   consequence (then rewind); redirecting fixes it. */
export function PlanView({ step, api, userName }: { step: PlanStep; api: RunnerApi; userName: string }) {
  const persona = api.path.persona!
  const [shown, setShown] = React.useState(0)
  const [phase, setPhase] = React.useState<"plan" | "redirect" | "running" | "failed">("plan")
  const [fixed, setFixed] = React.useState(false)
  const [wrong, setWrong] = React.useState<string | null>(null)
  const [mistakes, setMistakes] = React.useState(0)
  const [ran, setRan] = React.useState(0)
  const badIdx = step.plan.findIndex((p) => p.bad)
  const bad = badIdx >= 0 ? step.plan[badIdx].bad : undefined

  React.useEffect(() => {
    if (shown >= step.plan.length) return
    const t = setTimeout(() => setShown((n) => n + 1), wait(shown === 0 ? 700 : 380))
    return () => clearTimeout(t)
  }, [shown, step.plan.length])

  React.useEffect(() => {
    if (phase !== "running") return
    if (ran >= step.tools.length) {
      const t = setTimeout(() => {
        if (bad && !fixed) {
          api.consequence(step.consequence, true)
          setPhase("failed")
        } else api.done(mistakes === 0)
      }, wait(450))
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setRan((r) => r + 1), wait(480))
    return () => clearTimeout(t)
    // api changes identity every render; the phase and counters drive this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ran])

  const planText = (i: number) => (i === badIdx && fixed && bad ? bad.fixed : step.plan[i].text)
  const revealed = shown >= step.plan.length

  return (
    <Shell active="new" userName={userName} project={persona.company}>
      <Thread>
        <UserBubble>{api.lastPrompt || api.task?.open}</UserBubble>
        <ClaudeMsg>
          <p className="mb-2">Here's my plan. Approve it, or tell me what to change.</p>
          <ol className="flex flex-col gap-1 font-sans text-[14px]">
            {step.plan.slice(0, shown).map((_, i) => (
              <li
                key={i}
                className={cn(
                  "flex gap-2.5 rounded-lg px-2.5 py-1.5",
                  i === badIdx && fixed && "bg-[#E3F6EC]",
                  i === badIdx && phase === "failed" && "bg-[#FFF1EE]"
                )}
              >
                <span className="text-[#73726C]">{i + 1}.</span>
                <span>{planText(i)}</span>
              </li>
            ))}
          </ol>
          {revealed && phase === "plan" && (
            <div className="mt-3 flex flex-wrap gap-2 font-sans">
              <Button size="sm" onClick={() => setPhase("running")}>
                Approve plan
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPhase("redirect")} disabled={fixed || !bad}>
                Redirect
              </Button>
            </div>
          )}
        </ClaudeMsg>
        {phase === "redirect" && bad && (
          <div className="flex flex-col gap-2 rounded-2xl border border-[#E1DFD6] bg-white p-4 font-sans">
            <p className="text-[14px] font-medium">Which step do you want to change, and to what?</p>
            <p className="text-[13px] text-[#73726C]">Step {badIdx + 1} becomes:</p>
            <div className="flex flex-col gap-1.5">
              {bad.options.map((o) => (
                <button
                  key={o.text}
                  type="button"
                  onClick={() => {
                    if (o.good) {
                      setFixed(true)
                      setWrong(null)
                      setPhase("plan")
                    } else {
                      setWrong(o.why ?? "Not that one.")
                      setMistakes((m) => m + 1)
                    }
                  }}
                  className="rounded-xl border border-[#E7E5DD] px-3.5 py-2.5 text-left text-[14px] hover:border-[#CFCBBF] hover:bg-[#FAF9F5]"
                >
                  {o.text}
                </button>
              ))}
            </div>
            {wrong && <Why>{wrong}</Why>}
            <Button size="sm" variant="ghost" className="w-fit" onClick={() => setPhase("plan")}>
              Back to the plan
            </Button>
          </div>
        )}
        {(phase === "running" || phase === "failed") && (
          <ClaudeMsg>
            <ToolList tools={step.tools} done={phase === "failed" ? step.tools.length : ran} />
          </ClaudeMsg>
        )}
        {phase === "failed" && bad && (
          <ClaudeMsg>
            <p>Done. {step.plan[badIdx].text}</p>
            <div className="mt-2 font-sans">
              <Why>{bad.why}</Why>
            </div>
          </ClaudeMsg>
        )}
      </Thread>
    </Shell>
  )
}
