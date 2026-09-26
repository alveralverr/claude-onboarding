import * as React from "react"
import { ShieldCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ClaudeMsg, UserBubble, Why } from "@/sim/parts"
import { Shell, Thread } from "@/sim/Shell"
import type { Option, PermissionStep } from "../types"
import type { RunnerApi } from "../useRunner"

/* Claude pauses before an action that reaches other people. */
export function PermissionView({ step, api, userName }: { step: PermissionStep; api: RunnerApi; userName: string }) {
  const persona = api.path.persona!
  const [picked, setPicked] = React.useState<Option | null>(null)
  const [mistakes, setMistakes] = React.useState(0)
  return (
    <Shell active="new" userName={userName} project={persona.company}>
      <Thread>
        <UserBubble>{api.lastPrompt || api.task?.open}</UserBubble>
        <ClaudeMsg>
          <p>{step.says}</p>
        </ClaudeMsg>
        <div className="rounded-2xl border border-[#E1DFD6] bg-white p-4 font-sans">
          <p className="flex items-center gap-2 text-[14.5px] font-medium">
            <ShieldCheckIcon className="size-4.5 text-[#73726C]" /> Claude wants to: {step.action}
          </p>
          <p className="mt-1 text-[13.5px] text-[#73726C]">{step.detail}</p>
          {!picked?.good && (
            <div className="mt-3 flex flex-wrap gap-2">
              {step.options.map((o) => (
                <Button
                  key={o.id}
                  size="sm"
                  variant={o.id === "deny" ? "ghost" : "outline"}
                  onClick={() => {
                    setPicked(o)
                    if (!o.good) setMistakes((m) => m + 1)
                  }}
                >
                  {o.label}
                </Button>
              ))}
            </div>
          )}
          {picked && <div className="mt-3"><Why good={picked.good}>{picked.why}</Why></div>}
          {picked?.good && (
            <Button className="mt-3" onClick={() => api.done(mistakes === 0)}>
              Continue
            </Button>
          )}
        </div>
      </Thread>
    </Shell>
  )
}
