import * as React from "react"
import { cn } from "cn"
import { CheckIcon, ClipboardListIcon, FileTextIcon, MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { ClaudeMsg, UserBubble, Why } from "@/sim/parts"
import { Shell, Thread } from "@/sim/Shell"
import type { ReviewStep } from "../types"
import type { RunnerApi } from "../useRunner"

const ICON = { email: MailIcon, doc: FileTextIcon, tasks: ClipboardListIcon, eod: FileTextIcon }

/* Review Claude's output the way the client would: tap what's wrong. */
export function ReviewView({ step, api, userName }: { step: ReviewStep; api: RunnerApi; userName: string }) {
  const persona = api.path.persona!
  const targets = step.segments.map((s, i) => (s.flag ? i : -1)).filter((i) => i >= 0)
  const [found, setFound] = React.useState<number[]>([])
  const [misses, setMisses] = React.useState(0)
  const all = targets.every((t) => found.includes(t))
  const Icon = ICON[step.artifact.kind]

  const tap = (i: number) => {
    if (step.segments[i].flag) {
      if (!found.includes(i)) setFound((f) => [...f, i])
      return
    }
    setMisses((m) => m + 1)
    toast.add({ title: "That part is fine.", type: "info" })
  }

  const artifact = (
    <div className="flex flex-col gap-3 font-sans">
      <div className="flex items-center gap-2">
        <Icon className="size-4.5 text-[#73726C]" />
        <p className="flex-1 text-[14.5px] font-medium">{step.artifact.title}</p>
        {step.artifact.meta && <span className="text-[12px] text-[#73726C]">{step.artifact.meta}</span>}
      </div>
      <p className="text-[13px] text-[#73726C]" aria-live="polite">
        {step.intro} {found.length} of {targets.length} found.
      </p>
      <div className="rounded-xl border border-[#E7E5DD] bg-white p-4 text-[14px] leading-relaxed whitespace-pre-wrap">
        {step.segments.map((s, i) => (
          // Inline spans, not buttons: segments wrap mid-line like real text.
          <span
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => tap(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                tap(i)
              }
            }}
            aria-pressed={found.includes(i)}
            className={cn(
              "cursor-pointer rounded-sm box-decoration-clone px-0.5 outline-none hover:bg-[#F3F2EC] focus-visible:ring-2 focus-visible:ring-violet",
              found.includes(i) && "bg-[#FFE4DE] text-[#A32D2D] line-through decoration-2"
            )}
          >
            {s.text}
          </span>
        ))}
      </div>
      {found.length > 0 && (
        <ul className="flex flex-col gap-2">
          {found.map((i) => (
            <li key={i} className="flex gap-2 rounded-xl bg-[#FAF9F5] p-3 text-[13.5px]">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-[#0E8A4F]" />
              <span>
                <strong className="font-medium">{step.segments[i].flag}</strong>
                {step.segments[i].fix && <span className="mt-0.5 block text-[#73726C]">Fix: {step.segments[i].fix}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
      {all && (
        <>
          <Why good>{step.done}</Why>
          <Button className="w-fit" onClick={() => api.done(misses <= 1)}>
            Continue
          </Button>
        </>
      )}
    </div>
  )

  return (
    <Shell active="new" userName={userName} project={persona.company}>
      <Thread>
        <UserBubble>{api.lastPrompt || api.task?.open}</UserBubble>
        <ClaudeMsg>
          <p>Done. Here's what I made. Have a read before anything goes anywhere.</p>
        </ClaudeMsg>
        {artifact}
      </Thread>
    </Shell>
  )
}
