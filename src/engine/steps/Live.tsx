import * as React from "react"

import { CopyPrompt } from "@/components/site/shared"
import type { LiveStep } from "@/content/types"
import { useProgress } from "@/lib/progress"
import { Check } from "../bits"

export function Live({ step, onDone }: { step: LiveStep; onDone: () => void }) {
  const s = useProgress()
  const done = !!s.checkboxes[step.k]
  React.useEffect(() => {
    if (done) onDone()
  }, [done, onDone])
  return (
    <div className="flex flex-col gap-4 text-[17px] text-card-foreground">
      <div className="flex flex-col gap-3">{step.body}</div>
      {step.prompts && (
        <div className="flex flex-col gap-2.5">
          {step.prompts.map((p) => (
            <CopyPrompt key={p} text={p} />
          ))}
        </div>
      )}
      <div className="rounded-2xl border-2 border-dashed border-violet/30 bg-card p-2">
        <Check k={step.k} big>
          {step.label}
        </Check>
      </div>
    </div>
  )
}
