import { LightbulbIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { RunnerApi } from "@/story/useRunner"

/* Andi, a practice Account Lead: three levels of hint, free to use. */
export function Coach({ api }: { api: RunnerApi }) {
  const hints = api.step?.hints ?? []
  if (!api.step || hints.length === 0) return null
  const text = api.hintLevel > 0 ? hints[api.hintLevel - 1] : "Stuck? Ask me for a hint. It's free, and it doesn't count against you much."
  const more = api.hintLevel < hints.length
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white bg-card/95 p-3 shadow-card" role="status" aria-live="polite">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning-soft text-[14px] font-semibold text-warning" aria-hidden="true">
        A
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-[12.5px] text-muted-foreground">Andi, your Account Lead (practice)</p>
        <p className="text-[14px] leading-snug">{text}</p>
      </div>
      {more && (
        <Button size="sm" variant="outline" onClick={api.hint}>
          <LightbulbIcon data-icon="inline-start" />
          {api.hintLevel === 0 ? "Hint" : api.hintLevel === hints.length - 1 ? "Show me" : "More"}
        </Button>
      )}
    </div>
  )
}
