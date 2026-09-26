import * as React from "react"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { SortStep } from "../types"
import type { RunnerApi } from "../useRunner"

/* Spot: sort the client's to-dos into who does what. Tap a card, then a
   tray. Wrong trays explain themselves and the card stays in the pile. */
export function SortBoard({ step, api }: { step: SortStep; api: RunnerApi }) {
  const [placed, setPlaced] = React.useState<Record<string, string>>({})
  const [sel, setSel] = React.useState<string | null>(null)
  const [missed, setMissed] = React.useState<string[]>([])
  const [note, setNote] = React.useState<{ card: string; text: string; good: boolean } | null>(null)
  const left = step.cards.filter((c) => !placed[c.id])
  const doneAll = left.length === 0
  const firstTry = step.cards.length - missed.length

  const drop = (bin: string) => {
    if (!sel) return
    const card = step.cards.find((c) => c.id === sel)!
    if (card.bin === bin) {
      setPlaced((p) => ({ ...p, [card.id]: bin }))
      setNote({ card: card.id, text: card.why, good: true })
      setSel(null)
    } else {
      if (!missed.includes(card.id)) setMissed((m) => [...m, card.id])
      setNote({ card: card.id, text: `Not quite. ${card.why}`, good: false })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] text-card-foreground">{step.prompt}</p>
      <div className="flex flex-wrap gap-2" aria-label={`${api.path.persona!.first}'s to-dos`}>
        {left.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={sel === c.id}
            onClick={() => setSel(c.id)}
            className={cn(
              "w-[calc(50%-4px)] rounded-lg bg-[#FFF3C4] px-3 py-2.5 text-left text-[14px] leading-snug text-[#5C4400] shadow-[0_4px_10px_rgba(92,68,0,0.12)] transition-transform sm:w-[calc(25%-6px)]",
              sel === c.id ? "-translate-y-1 ring-3 ring-violet" : "hover:-translate-y-0.5",
              note && !note.good && note.card === c.id && "animate-[shake_0.3s]"
            )}
          >
            {c.text}
          </button>
        ))}
        {doneAll && <p className="text-sm text-muted-foreground">All sorted.</p>}
      </div>
      {note && (
        <p role="status" className={cn("rounded-xl px-3.5 py-2.5 text-[14px]", note.good ? "bg-success-soft text-success" : "bg-[#FFF4F2] text-destructive")}>
          {note.text}
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-3">
        {step.bins.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => drop(b.id)}
            disabled={!sel}
            className={cn(
              "flex min-h-32 flex-col gap-1.5 rounded-2xl border-2 border-dashed p-3 text-left transition-colors",
              sel ? "border-violet/50 bg-secondary/60 hover:border-violet" : "border-border bg-background"
            )}
            aria-label={`${b.label}: ${b.hint}`}
          >
            <span className="text-[15px] font-semibold">{b.label}</span>
            <span className="text-[13px] text-muted-foreground">{b.hint}</span>
            <span className="mt-1 flex flex-col gap-1">
              {step.cards
                .filter((c) => placed[c.id] === b.id)
                .map((c) => (
                  <span key={c.id} className="flex items-start gap-1.5 rounded-md bg-white px-2 py-1 text-[12.5px] leading-snug shadow-card-sm">
                    <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success" /> {c.text}
                  </span>
                ))}
            </span>
          </button>
        ))}
      </div>
      {doneAll && (
        <div className="flex flex-col gap-3 rounded-2xl bg-success-soft p-4 text-success">
          <p className="text-[15px]">
            {firstTry} of {step.cards.length} right the first time. The rule of thumb: money, logins and decisions stay with you. Anything with a date or a time zone gets your check.
          </p>
          <Button
            className="w-fit"
            onClick={() => {
              api.setPlacement(firstTry)
              api.done(missed.length === 0)
            }}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  )
}
