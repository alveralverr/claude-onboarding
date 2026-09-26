import * as React from "react"
import { cn } from "cn"
import { CheckIcon, FolderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Why } from "@/sim/parts"
import { Shell } from "@/sim/Shell"
import type { InstructionsStep } from "../types"
import type { RunnerApi } from "../useRunner"

/* Write a project's Instructions for Claude by picking one line per group. */
export function InstructionsView({ step, api, userName }: { step: InstructionsStep; api: RunnerApi; userName: string }) {
  const [on, setOn] = React.useState<Record<string, boolean>>({})
  const [mistakes, setMistakes] = React.useState(0)
  const covered = step.groups.map((g) => g.chips.some((c) => on[c.id] && c.good))
  const bad = step.groups.flatMap((g) => g.chips.filter((c) => on[c.id] && !c.good))
  const complete = covered.every(Boolean) && bad.length === 0
  const text = step.groups.flatMap((g) => g.chips.filter((c) => on[c.id]).map((c) => c.text)).join("\n\n")

  const toggle = (id: string, good?: boolean) => {
    setOn((o) => ({ ...o, [id]: !o[id] }))
    if (!good && !on[id]) setMistakes((m) => m + 1)
  }

  return (
    <Shell active="projects" userName={userName} project={step.project}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[860px] flex-col gap-4 px-4 py-6 font-sans md:px-6">
          <div className="flex items-center gap-2">
            <FolderIcon className="size-5 text-[#73726C]" />
            <h2 className="text-[22px] font-medium">{step.project}</h2>
          </div>
          <p className="text-[14px] text-[#73726C]">{step.intro}</p>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <div className="flex flex-col gap-3">
              {step.groups.map((g, gi) => (
                <fieldset key={g.id} className="rounded-xl border border-[#E7E5DD] bg-white p-3.5">
                  <legend className="flex items-center gap-2 px-1 text-[12.5px] font-semibold tracking-[0.06em] uppercase">
                    <span className={cn("flex size-5 items-center justify-center rounded-full text-[11px] text-white", covered[gi] ? "bg-[#0E8A4F]" : "bg-[#1F1E1D]")} aria-hidden="true">
                      {covered[gi] ? <CheckIcon className="size-3" /> : gi + 1}
                    </span>
                    {g.label}
                  </legend>
                  <p className="mb-2 px-1 text-[12.5px] text-[#73726C]">{g.hint}</p>
                  <div className="flex flex-col gap-1.5">
                    {g.chips.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={!!on[c.id]}
                        onClick={() => toggle(c.id, c.good)}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-left text-[13.5px] leading-snug",
                          on[c.id] && c.good && "border-[#1F1E1D] bg-[#F3F2EC]",
                          on[c.id] && !c.good && "border-[#E24B4A] bg-[#FFF1EE] text-[#A32D2D]",
                          !on[c.id] && "border-[#E7E5DD] hover:border-[#CFCBBF]"
                        )}
                      >
                        {c.text}
                      </button>
                    ))}
                  </div>
                  {g.chips.filter((c) => on[c.id] && !c.good && c.why).map((c) => (
                    <p key={c.id} className="mt-2 px-1 text-[12.5px] text-[#A32D2D]">
                      {c.why}
                    </p>
                  ))}
                </fieldset>
              ))}
            </div>
            <div className="flex flex-col gap-2 lg:sticky lg:top-2 lg:self-start">
              <p className="text-[12px] font-semibold tracking-[0.08em] text-[#73726C] uppercase">Instructions for Claude</p>
              <div className="min-h-40 rounded-2xl border border-[#E7E5DD] bg-white p-4 text-[13.5px] leading-relaxed whitespace-pre-wrap">
                {text || <span className="text-[#9C9A92]">Pick one line from each group.</span>}
              </div>
              {complete && (
                <>
                  <Why good>{step.done}</Why>
                  <Button className="w-fit" onClick={() => api.done(mistakes === 0)}>
                    Save instructions
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
