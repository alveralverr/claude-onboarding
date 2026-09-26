import * as React from "react"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

import { toast } from "@/components/ui/toast"
import type { SpotStep } from "@/content/types"

/* Click the problem. Flagged segments are the targets; clicking a clean one
   gets a gentle "that part is fine". Done when every target is found. */
export function Spot({ step, onDone }: { step: SpotStep; onDone: () => void }) {
  const targets = step.segments.map((s, i) => (s.flag ? i : -1)).filter((i) => i >= 0)
  const [found, setFound] = React.useState<number[]>([])
  const done = targets.every((t) => found.includes(t))
  React.useEffect(() => {
    if (done) onDone()
  }, [done, onDone])

  const click = (i: number) => {
    const seg = step.segments[i]
    if (!seg.flag) {
      toast.add({ title: "That part is fine.", type: "info" })
      return
    }
    if (!found.includes(i)) setFound((f) => [...f, i])
  }

  const frame = {
    prompt: "rounded-2xl border bg-card p-4 font-mono text-[15px] leading-relaxed",
    draft: "rounded-2xl border bg-white p-5 text-[16px] leading-relaxed",
    plan: "rounded-2xl border bg-card p-4 text-[16px] leading-relaxed",
  }[step.frame]

  return (
    <div className="flex flex-col gap-4 text-[17px] text-card-foreground">
      <div className="flex flex-col gap-3">{step.intro}</div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {found.length} of {targets.length} found. Click or tap the part that should not be there.
      </p>
      <div className={cn(frame, "whitespace-pre-wrap")}>
        {step.segments.map((seg, i) => {
          const isFound = found.includes(i)
          return (
            <button
              key={i}
              type="button"
              onClick={() => click(i)}
              aria-pressed={isFound}
              className={cn(
                "inline rounded-md px-0.5 text-left transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50",
                isFound && "bg-[#FFE4DE] text-destructive line-through decoration-2"
              )}
            >
              {seg.text}
            </button>
          )
        })}
      </div>
      {found.length > 0 && (
        <ul className="flex flex-col gap-2 text-base">
          {found.map((i) => (
            <li key={i} className="flex gap-2 rounded-xl bg-background p-3">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
              <span>
                <strong>{step.segments[i].flag}</strong>
                {step.segments[i].fix && <span className="mt-1 block text-muted-foreground">Better: {step.segments[i].fix}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
      {done && <div className="flex flex-col gap-2 rounded-xl bg-success-soft p-4 text-success">{step.done}</div>}
    </div>
  )
}
