import { Button } from "@/components/ui/button"
import { CopyPrompt } from "@/components/site/shared"
import { Check } from "@/engine/bits"
import { useProgress } from "@/lib/progress"
import type { LiveStep } from "../types"
import type { RunnerApi } from "../useRunner"

/* The bridge to real work: the same task in the assistant's real Claude. */
export function LiveView({ step, api }: { step: LiveStep; api: RunnerApi }) {
  const p = useProgress()
  const ticked = !!p.checkboxes[step.k]
  return (
    <div className="flex flex-col gap-4 text-[16px]">
      <p className="text-card-foreground">{step.body}</p>
      <div className="flex flex-col gap-2.5">
        {step.prompts.map((t) => (
          <CopyPrompt key={t} text={t} />
        ))}
      </div>
      <div className="rounded-2xl border-2 border-dashed border-violet/30 bg-card p-2">
        <Check k={step.k} big>
          {step.label}
        </Check>
      </div>
      <Button className="w-fit" variant={ticked ? "default" : "secondary"} onClick={() => api.done(true)}>
        {ticked ? "Continue" : "I'll do it later"}
      </Button>
    </div>
  )
}
