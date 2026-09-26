import * as React from "react"

import type { ChecklistStep } from "@/content/types"
import { Voiceover } from "@/components/site/shared"
import { useProgress } from "@/lib/progress"
import { Check, Checks, MediaView, NoteBox } from "../bits"

export function Checklist({ step, onDone }: { step: ChecklistStep; onDone: () => void }) {
  const s = useProgress()
  const done = step.items.every((i) => s.checkboxes[i.k])
  React.useEffect(() => {
    if (done) onDone()
  }, [done, onDone])
  const n = step.items.filter((i) => s.checkboxes[i.k]).length
  return (
    <div className="flex flex-col text-[17px] leading-relaxed text-card-foreground">
      {step.intro && <div className="mb-2 flex flex-col gap-3">{step.intro}</div>}
      <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
        {n} of {step.items.length} ticked
      </p>
      <Checks>
        {step.items.map((i) => (
          <React.Fragment key={i.k}>
            <Check k={i.k}>{i.label}</Check>
            {i.media && <MediaView media={i.media} className="sm:ml-12" />}
          </React.Fragment>
        ))}
      </Checks>
      {step.after && <div className="mt-2 flex flex-col gap-3">{step.after}</div>}
      {step.voice && (
        <div className="mt-3">
          <Voiceover src={step.voice} />
        </div>
      )}
      {step.note && <NoteBox variant={step.note.variant}>{step.note.body}</NoteBox>}
    </div>
  )
}
