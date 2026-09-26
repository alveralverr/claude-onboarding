import * as React from "react"
import { cn } from "cn"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Task } from "@/story/types"
import type { RunnerApi } from "@/story/useRunner"
import { PhoneStepView } from "@/story/steps/PhoneStepView"
import { ClientAvatar } from "./ClientAvatar"

/* The client's thread, on your phone. Tasks start here; some steps are
   replies you choose here. */
export function PhonePanel({
  api,
  pending,
  onStart,
  onClose,
}: {
  api: RunnerApi
  pending: Task | null
  onStart: () => void
  onClose: () => void
}) {
  const persona = api.path.persona!
  const ref = React.useRef<HTMLDivElement>(null)
  const count = api.thread.length
  React.useEffect(() => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
  }, [count, pending])
  const phoneStep = api.step?.kind === "phone" ? api.step : null

  return (
    <section
      className="flex h-full max-h-[640px] w-full flex-col overflow-hidden rounded-[32px] border-[6px] border-ink-dark bg-[#F6F5FB] shadow-lift"
      aria-label={`Messages with ${persona.name}`}
    >
      <header className="flex items-center gap-3 border-b bg-white px-4 py-3">
        <ClientAvatar persona={persona} className="size-9 text-[13px]" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[15px] font-semibold">{persona.name}</p>
          <p className="truncate text-[12.5px] text-muted-foreground">
            Client · {persona.city} ({persona.tzShort})
          </p>
        </div>
        <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-muted" aria-label="Put the phone down">
          <XIcon className="size-4" />
        </button>
      </header>
      <div ref={ref} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 py-3" aria-live="polite">
        {api.thread.length === 0 && !pending && <p className="m-auto text-center text-[13px] text-muted-foreground">No messages yet.</p>}
        {api.thread.map((m) => (
          <div key={m.id} className={cn("flex flex-col", m.from === "you" ? "items-end" : "items-start")}>
            {m.from === "al" && <span className="mb-0.5 px-1 text-[11.5px] text-muted-foreground">{m.name}</span>}
            <p
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug whitespace-pre-line",
                m.from === "you" && "rounded-br-md bg-violet text-white",
                m.from === "client" && "rounded-bl-md bg-white shadow-card-sm",
                m.from === "al" && "rounded-bl-md bg-warning-soft text-warning"
              )}
            >
              {m.text}
            </p>
            {m.actions && (
              <div className="mt-1.5 flex max-w-[85%] flex-wrap gap-1.5">
                {m.actions.map((a) => (
                  <Button key={a.href} size="sm" variant="outline" render={<a href={a.href} />} nativeButton={false}>
                    {a.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        {pending && (
          <div className="flex flex-col items-start">
            <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2 text-[14px] leading-snug shadow-card-sm">{pending.open}</p>
          </div>
        )}
      </div>
      <footer className="border-t bg-white p-3">
        {phoneStep ? (
          <PhoneStepView key={`${api.task?.id}-${api.stepIdx}-${api.epoch}`} step={phoneStep} api={api} />
        ) : pending ? (
          <Button className="w-full" size="lg" onClick={onStart}>
            Start: {pending.title}
          </Button>
        ) : (
          <Button className="w-full" variant="outline" onClick={onClose}>
            Back to work
          </Button>
        )}
      </footer>
    </section>
  )
}
