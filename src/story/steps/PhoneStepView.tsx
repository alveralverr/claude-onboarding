import * as React from "react"

import { Button } from "@/components/ui/button"
import { Why } from "@/sim/parts"
import type { Option, PhoneStep } from "../types"
import type { RunnerApi } from "../useRunner"
import { wait } from "./common"

/* Pick what to send the client. The client answers; a wrong pick costs a
   little trust (once) and you can send something better. */
export function PhoneStepView({ step, api }: { step: PhoneStep; api: RunnerApi }) {
  const [picked, setPicked] = React.useState<Option | null>(null)
  const [waiting, setWaiting] = React.useState(false)
  const [good, setGood] = React.useState(false)
  const [mistakes, setMistakes] = React.useState(0)
  const [told, setTold] = React.useState<string[]>([])

  const send = (o: Option) => {
    setPicked(o)
    setWaiting(true)
    api.say("you", o.label)
    setTimeout(() => {
      setWaiting(false)
      if (o.good) {
        if (o.reply) api.say("client", o.reply)
        setGood(true)
        return
      }
      setMistakes((m) => m + 1)
      const first = !told.includes(o.id)
      setTold((t) => (first ? [...t, o.id] : t))
      if (first && o.consequence) api.consequence(o.consequence, false)
      else if (first) api.consequence({ text: o.reply ?? "Hmm.", trust: -0.5 }, false)
      else if (o.reply) api.say("client", o.reply)
    }, wait(800))
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[14px] font-medium">{step.prompt}</p>
      {!good &&
        step.options.map((o) => (
          <button
            key={o.id}
            type="button"
            disabled={waiting}
            onClick={() => send(o)}
            className="rounded-2xl border border-border bg-card px-3.5 py-2.5 text-left text-[14px] leading-snug whitespace-pre-line hover:border-violet/40 disabled:opacity-50"
          >
            {o.label}
          </button>
        ))}
      {picked && !waiting && <Why good={picked.good}>{picked.why}</Why>}
      {good && (
        <Button className="w-fit" onClick={() => api.done(mistakes === 0)}>
          Continue
        </Button>
      )}
    </div>
  )
}
