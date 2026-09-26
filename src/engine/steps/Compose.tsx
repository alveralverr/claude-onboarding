import * as React from "react"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { ComposeStep } from "@/content/types"

/* Build the prompt from ingredient chips. A group is covered when it has a
   good chip; a bad chip explains itself and stays selectable until removed. */
export function Compose({ step, onDone }: { step: ComposeStep; onDone: () => void }) {
  const [on, setOn] = React.useState<Record<string, boolean>>({})
  const covered = step.groups.map((g) => g.chips.some((c) => on[c.id] && c.good))
  const bad = step.groups.flatMap((g) => g.chips.filter((c) => on[c.id] && !c.good))
  const done = covered.every(Boolean) && bad.length === 0
  React.useEffect(() => {
    if (done) onDone()
  }, [done, onDone])

  const preview = step.groups
    .flatMap((g) => g.chips.filter((c) => on[c.id]).map((c) => c.text))
    .join(" ")

  return (
    <div className="flex flex-col gap-4 text-[17px] text-card-foreground">
      <div className="flex flex-col gap-3">{step.intro}</div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="flex flex-col gap-4">
          {step.groups.map((g, gi) => (
            <fieldset key={g.id} className="rounded-xl border bg-background p-3.5">
              <legend className="flex items-center gap-2 px-1 text-sm font-semibold tracking-[0.06em] uppercase">
                <span className={cn("flex size-5 items-center justify-center rounded-full text-[11px] text-white", covered[gi] ? "bg-success" : "bg-violet")} aria-hidden="true">
                  {covered[gi] ? <CheckIcon className="size-3" /> : gi + 1}
                </span>
                {g.label}
              </legend>
              <p className="mb-2 px-1 text-sm text-muted-foreground">{g.hint}</p>
              <div className="flex flex-wrap gap-2">
                {g.chips.map((c) => {
                  const sel = !!on[c.id]
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={sel}
                      onClick={() => setOn((o) => ({ ...o, [c.id]: !o[c.id] }))}
                      className={cn(
                        "rounded-full border-1.5 bg-card px-3.5 py-2 text-left text-[15px] leading-snug transition-colors hover:border-violet/40 focus-visible:ring-3 focus-visible:ring-ring/50",
                        sel && c.good && "border-violet bg-secondary text-secondary-foreground",
                        sel && !c.good && "border-destructive bg-[#FFF4F2] text-destructive"
                      )}
                    >
                      {c.text}
                    </button>
                  )
                })}
              </div>
              {g.chips.some((c) => on[c.id] && !c.good && c.why) && (
                <ul className="mt-2 flex flex-col gap-1 px-1 text-sm text-destructive">
                  {g.chips.filter((c) => on[c.id] && !c.good && c.why).map((c) => <li key={c.id}>{c.why}</li>)}
                </ul>
              )}
            </fieldset>
          ))}
        </div>
        <div className="flex flex-col gap-2 lg:sticky lg:top-24 lg:self-start">
          <p className="flex items-center justify-between text-sm font-semibold tracking-[0.06em] text-muted-foreground uppercase">
            Your prompt
            <Badge variant={done ? "success" : "secondary"}>{covered.filter(Boolean).length} of {step.groups.length} ingredients</Badge>
          </p>
          <div className="min-h-32 rounded-2xl border bg-card p-4 text-[16px] leading-relaxed" aria-live="polite">
            {preview || <span className="text-muted-foreground">Pick a chip from each ingredient. Wording does not matter, having the ingredient does.</span>}
          </div>
          {done && <div className="rounded-xl bg-success-soft p-4 text-base text-success">{step.done}</div>}
        </div>
      </div>
    </div>
  )
}
