import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { ClaudeMsg, UserBubble, Why } from "@/sim/parts"
import { Shell, Thread } from "@/sim/Shell"
import type { ChooseStep, Option } from "../types"
import type { RunnerApi } from "../useRunner"

/* Claude offers options (a slot, a shape, a way to run it). Pick the one
   the client would want. Some wrong picks have a consequence on the phone. */
export function ChooseView({ step, api, userName }: { step: ChooseStep; api: RunnerApi; userName: string }) {
  const persona = api.path.persona!
  const [picked, setPicked] = React.useState<Option | null>(null)
  const [mistakes, setMistakes] = React.useState(0)
  const [told, setTold] = React.useState<string[]>([])

  const pick = (o: Option) => {
    setPicked(o)
    if (o.good) return
    setMistakes((m) => m + 1)
    if (o.consequence && !told.includes(o.id)) {
      api.consequence(o.consequence, false)
      setTold((t) => [...t, o.id])
    }
  }

  return (
    <Shell active="new" userName={userName} project={persona.company}>
      <Thread>
        <UserBubble>{api.lastPrompt || api.task?.open}</UserBubble>
        <ClaudeMsg>
          <p>{step.says}</p>
          {step.table && (
            <div className="mt-3 overflow-x-auto rounded-xl border border-[#E7E5DD] bg-white font-sans">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-[#FAF9F5] text-[12.5px] text-[#73726C]">
                  <tr>
                    {step.table.head.map((h) => (
                      <th key={h} className="px-3.5 py-2 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {step.table.rows.map((r, i) => (
                    <tr key={i} className="border-t border-[#E7E5DD]">
                      {r.map((cell, j) => (
                        <td key={j} className="px-3.5 py-2 tabular-nums">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {step.recommend && <p className="mt-2 text-[#73726C]">{step.recommend}</p>}
        </ClaudeMsg>
        <div className="flex flex-col gap-2 font-sans">
          <p className="text-[13px] font-medium text-[#73726C]">Your call:</p>
          {step.options.map((o) => (
            <button
              key={o.id}
              type="button"
              disabled={!!picked?.good}
              onClick={() => pick(o)}
              className={cn(
                "rounded-xl border px-3.5 py-2.5 text-left text-[14px] transition-colors",
                picked?.id === o.id ? (o.good ? "border-[#0E8A4F] bg-[#E3F6EC]" : "border-[#E24B4A] bg-[#FFF1EE]") : "border-[#E7E5DD] bg-white hover:border-[#CFCBBF]"
              )}
            >
              {o.label}
            </button>
          ))}
          {picked && <Why good={picked.good}>{picked.why}</Why>}
          {picked?.good && (
            <Button className="w-fit" onClick={() => api.done(mistakes === 0)}>
              Continue
            </Button>
          )}
        </div>
      </Thread>
    </Shell>
  )
}
