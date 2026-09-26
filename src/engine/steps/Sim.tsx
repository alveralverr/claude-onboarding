import * as React from "react"
import { cn } from "cn"
import { CheckIcon, CircleIcon, Loader2Icon, MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { SimStep } from "@/content/types"
import { INBOX } from "@/content/scenarios/inbox"
import { SCHEDULE } from "@/content/scenarios/schedule"
import type { Scenario } from "@/content/scenarios/types"
import { Bubble, MockClaudeWindow } from "../MockClaudeWindow"

const SCENARIOS: Record<string, Scenario> = { inbox: INBOX, schedule: SCHEDULE }

type Phase = "prompt" | "planning" | "decide" | "redirect" | "running" | "output"

function useReduced() {
  return React.useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, [])
}

export function Sim({ step, onDone }: { step: SimStep; onDone: () => void }) {
  const sc = SCENARIOS[step.scenario]
  const reduced = useReduced()
  const wait = (ms: number) => (reduced ? 0 : ms)
  const [phase, setPhase] = React.useState<Phase>("prompt")
  const [shown, setShown] = React.useState(0) // plan steps revealed
  const [warned, setWarned] = React.useState(false)
  const [pick, setPick] = React.useState<string | null>(null)
  const [pickWrong, setPickWrong] = React.useState<string | null>(null)
  const [fixed, setFixed] = React.useState(false)
  const [ran, setRan] = React.useState(0) // tools completed
  const badIndex = sc.plan.findIndex((x) => x.bad)
  const bad = sc.plan[badIndex]?.bad

  // Reveal the plan one line at a time.
  React.useEffect(() => {
    if (phase !== "planning") return
    if (shown >= sc.plan.length) {
      const t = setTimeout(() => setPhase("decide"), wait(400))
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShown((n) => n + 1), wait(shown === 0 ? 900 : 550))
    return () => clearTimeout(t)
  }, [phase, shown, sc.plan.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Run the tools one at a time.
  React.useEffect(() => {
    if (phase !== "running") return
    if (ran >= sc.tools.length) {
      const t = setTimeout(() => setPhase("output"), wait(500))
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setRan((n) => n + 1), wait(700))
    return () => clearTimeout(t)
  }, [phase, ran, sc.tools.length]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (phase === "output") onDone()
  }, [phase, onDone])

  const approve = () => {
    if (bad && !fixed) {
      setWarned(true)
      return
    }
    setPhase("running")
  }
  const redirect = () => setPhase("redirect")
  const applyFix = () => {
    if (!pick || !bad) return
    const opt = bad.options.find((o) => o.text === pick)
    if (!opt?.good) {
      setPickWrong(opt?.why ?? "Not that one.")
      return
    }
    setFixed(true)
    setPickWrong(null)
    setPhase("decide")
  }

  const planText = (i: number) => (i === badIndex && fixed ? bad!.fixed : sc.plan[i].text)

  return (
    <div className="flex flex-col gap-4 text-[17px] text-card-foreground">
      <div className="flex flex-col gap-3">{step.intro}</div>
      <MockClaudeWindow context={sc.context} model={sc.model} workspace={sc.workspace} composer={phase === "prompt" ? sc.prompt : undefined}>
        {phase !== "prompt" && <Bubble who="you">{sc.prompt}</Bubble>}
        {phase === "planning" && shown === 0 && (
          <Bubble who="claude">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" /> Reading the folder and making a plan
            </span>
          </Bubble>
        )}
        {(phase !== "prompt" && shown > 0) && (
          <Bubble who="claude">
            <p className="mb-2 font-semibold">Here is my plan. Approve it or tell me what to change.</p>
            <ol className="flex flex-col gap-1.5">
              {sc.plan.slice(0, shown).map((_, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex gap-2 rounded-lg px-2 py-1",
                    i === badIndex && warned && !fixed && "bg-[#FFF4F2] ring-1.5 ring-destructive",
                    i === badIndex && fixed && "bg-success-soft"
                  )}
                >
                  <span className="text-muted-foreground">{i + 1}.</span>
                  <span>{planText(i)}</span>
                </li>
              ))}
            </ol>
            {phase === "decide" && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={approve}>
                  Approve plan
                </Button>
                <Button size="sm" variant="outline" onClick={redirect} disabled={fixed}>
                  Redirect
                </Button>
              </div>
            )}
          </Bubble>
        )}
        {phase === "decide" && warned && !fixed && <Bubble who="system">{bad?.why ?? sc.approveWarning} Click Redirect.</Bubble>}
        {phase === "redirect" && bad && (
          <Bubble who="you" className="justify-start">
            <p className="mb-2 font-semibold">Change step {badIndex + 1} to:</p>
            <RadioGroup value={pick} onValueChange={(v) => { setPick(String(v)); setPickWrong(null) }} className="gap-1">
              {bad.options.map((o) => (
                <Field key={o.text} orientation="horizontal" className="rounded-lg px-2 py-1.5 hover:bg-white/60">
                  <RadioGroupItem value={o.text} id={`fix-${o.text}`} className="size-4.5" />
                  <FieldLabel htmlFor={`fix-${o.text}`} className="text-[15px] leading-snug font-normal">
                    {o.text}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
            {pickWrong && <p className="mt-2 text-[14px] text-destructive">{pickWrong}</p>}
            <Button size="sm" className="mt-2" onClick={applyFix} disabled={!pick}>
              Send redirect
            </Button>
          </Bubble>
        )}
        {(phase === "running" || phase === "output") && (
          <Bubble who="claude">
            <ul className="flex flex-col gap-1">
              {sc.tools.slice(0, Math.max(ran, phase === "output" ? sc.tools.length : 0) + (phase === "running" && ran < sc.tools.length ? 1 : 0)).map((t, i) => {
                const doneTool = i < ran || phase === "output"
                return (
                  <li key={t} className="flex items-center gap-2">
                    {doneTool ? <CheckIcon className="size-4 text-success" /> : <Loader2Icon className="size-4 animate-spin text-muted-foreground" />}
                    <span className={doneTool ? "" : "text-muted-foreground"}>{t}</span>
                  </li>
                )
              })}
            </ul>
          </Bubble>
        )}
        {phase === "output" && (
          <Bubble who="claude">
            <p className="mb-2 flex items-center gap-2 font-semibold">
              <MailIcon className="size-4 text-claude" /> {sc.output.title}
            </p>
            <ul className="flex flex-col gap-2">
              {sc.output.drafts.map((d) => (
                <li key={d.subject} className="rounded-lg border bg-background p-2.5 text-[14px]">
                  <p className="text-muted-foreground">
                    {sc.output.kind === "email" ? "To" : "Saved to"} {d.to} · <span className="text-foreground">{d.subject}</span>
                  </p>
                  <p className="mt-1">{d.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[14px] text-muted-foreground">{sc.output.note}</p>
          </Bubble>
        )}
      </MockClaudeWindow>
      {phase === "prompt" && (
        <div className="flex items-center gap-3">
          <Button size="lg" onClick={() => setPhase("planning")}>
            Send the prompt
          </Button>
          <p className="text-base text-muted-foreground">Then watch the plan. Approve it only if every step is something you would do yourself.</p>
        </div>
      )}
      {phase === "output" && (
        <p className="flex items-center gap-2 rounded-xl bg-success-soft p-4 text-base text-success">
          <CircleIcon className="size-2 fill-current" /> {sc.done}
        </p>
      )}
    </div>
  )
}
