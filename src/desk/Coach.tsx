import { LightbulbIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { COACH_ANDI } from "@/content/world"
import type { RunnerApi } from "@/story/useRunner"

/* Andi, a practice Account Lead: three levels of hint, free to use. Sits
   directly above whatever you are working on, so it is never below the fold. */
export function Coach({ api }: { api: RunnerApi }) {
  const hints = api.step?.hints ?? []
  if (!api.step || hints.length === 0) return null
  const text = api.hintLevel > 0 ? hints[api.hintLevel - 1] : "Stuck? Ask me for a hint. It's free, and it doesn't count against you much."
  const more = api.hintLevel < hints.length
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white bg-card/95 px-3 py-2 shadow-card-sm" role="status" aria-live="polite">
      <img src={COACH_ANDI} alt="" width={256} height={256} className="size-9 shrink-0 rounded-full bg-[#E6E6F8] object-cover" title="Andi, your Account Lead (practice)" />
      <p className="min-w-0 flex-1 text-[14px] leading-snug">
        <span className="sr-only">Andi, your Account Lead (practice): </span>
        {text}
      </p>
      {more && (
        <Button size="sm" variant="outline" onClick={api.hint}>
          <LightbulbIcon data-icon="inline-start" />
          {api.hintLevel === 0 ? "Hint" : api.hintLevel === hints.length - 1 ? "Show me" : "More"}
        </Button>
      )}
    </div>
  )
}
