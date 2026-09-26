import * as React from "react"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { QuizStep } from "@/content/types"

/* One question at a time. A wrong pick explains itself and lets you retry.
   The step is done when every question has been answered correctly. */
export function Quiz({ step, onDone, alreadyPassed }: { step: QuizStep; onDone: () => void; alreadyPassed?: boolean }) {
  const qs = step.questions
  const [i, setI] = React.useState(alreadyPassed ? qs.length : 0)
  const [picked, setPicked] = React.useState<string | null>(null)
  const [checked, setChecked] = React.useState(false)
  const [right, setRight] = React.useState<Record<string, true>>(() => (alreadyPassed ? Object.fromEntries(qs.map((q) => [q.id, true])) : {}))
  const finished = i >= qs.length
  const firedRef = React.useRef(alreadyPassed ?? false)
  React.useEffect(() => {
    if (finished && !firedRef.current) {
      firedRef.current = true
      step.onPass?.()
      onDone()
    }
  }, [finished, step, onDone])
  React.useEffect(() => {
    if (alreadyPassed) onDone()
  }, [alreadyPassed, onDone])

  if (finished) {
    return (
      <div className="flex flex-col gap-3 text-[17px] text-card-foreground">
        {step.intro}
        <p className="flex items-center gap-2 font-semibold text-success">
          <CheckIcon className="size-5" /> {qs.length} of {qs.length} right. You know the rules for safe client work.
        </p>
        <ol className="flex flex-col gap-2 text-base text-muted-foreground">
          {qs.map((q, n) => (
            <li key={q.id} className="flex gap-2">
              <span className="text-success">{n + 1}.</span> {q.q}
            </li>
          ))}
        </ol>
      </div>
    )
  }

  const q = qs[i]
  const wrong = checked && picked !== null && picked !== q.answer
  const isRight = checked && picked === q.answer
  const submit = () => {
    if (!picked) return
    setChecked(true)
    if (picked === q.answer) setRight((r) => ({ ...r, [q.id]: true }))
  }
  const next = () => {
    setI(i + 1)
    setPicked(null)
    setChecked(false)
  }
  return (
    <div className="flex flex-col text-[17px] text-card-foreground">
      {step.intro && i === 0 && <div className="mb-4 flex flex-col gap-3">{step.intro}</div>}
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Scenario {i + 1} of {qs.length} · {Object.keys(right).length} right so far
      </p>
      <FieldSet className="py-3" data-invalid={wrong || undefined}>
        <FieldLegend className="text-lg leading-snug font-medium">{q.q}</FieldLegend>
        <RadioGroup value={picked} onValueChange={(v) => { setPicked(String(v)); setChecked(false) }} aria-invalid={wrong || undefined} className="mt-2 gap-1.5">
          {q.options.map((o) => {
            const id = `${q.id}-${o.v}`
            const on = picked === o.v
            return (
              <Field
                key={o.v}
                orientation="horizontal"
                className={cn(
                  "rounded-lg border-1.5 border-transparent px-3 py-2.5 hover:bg-background",
                  on && "border-violet/30 bg-[#FBFAFF]",
                  wrong && on && "border-destructive bg-[#FFF4F2]",
                  isRight && on && "border-success bg-success-soft"
                )}
              >
                <RadioGroupItem value={o.v} id={id} className="size-5" />
                <FieldLabel htmlFor={id} className="text-[17px] leading-snug font-normal">
                  {o.t}
                </FieldLabel>
              </Field>
            )
          })}
        </RadioGroup>
        {wrong && <FieldError className="text-base">{q.wrong}</FieldError>}
        {isRight && (
          <FieldDescription className="text-base text-success">
            <CheckIcon className="mr-1 inline size-4" aria-hidden="true" />
            {q.right ?? "Correct."}
          </FieldDescription>
        )}
      </FieldSet>
      <div className="flex flex-wrap gap-3">
        {!isRight ? (
          <Button size="lg" type="button" onClick={submit} disabled={!picked}>
            {wrong ? "Try again" : "Check my answer"}
          </Button>
        ) : (
          <Button size="lg" type="button" onClick={next}>
            {i + 1 < qs.length ? "Next scenario" : "Finish the check"}
          </Button>
        )}
      </div>
    </div>
  )
}
