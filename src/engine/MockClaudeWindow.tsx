import * as React from "react"
import { cn } from "cn"
import { FolderIcon, PlugIcon, SparklesIcon, SquarePenIcon, MessageSquareIcon, LayoutGridIcon } from "lucide-react"

/* A scripted, offline replica of the Claude desktop window. It never calls a
   model. The transcript is whatever the caller renders as children. */
export function MockClaudeWindow({
  context,
  model = "Opus",
  children,
  composer,
  className,
}: {
  context: string[]
  model?: string
  children: React.ReactNode
  composer?: React.ReactNode
  className?: string
}) {
  const icon = (c: string) => (c.startsWith("/") ? SparklesIcon : /gmail|calendar|drive|slack|notion/i.test(c) ? PlugIcon : FolderIcon)
  return (
    <div className={cn("overflow-hidden rounded-2xl border-2 border-white bg-[#F7F6FC] shadow-card", className)} role="group" aria-label="Simulated Claude window">
      <div className="grid md:grid-cols-[180px_1fr]">
        <aside className="hidden flex-col gap-1 border-r bg-[#F0EEF8] p-3 text-[13px] text-muted-foreground md:flex" aria-hidden="true">
          <p className="mb-2 px-2 text-[15px] font-semibold text-foreground">Claude</p>
          {[
            [SquarePenIcon, "New chat"],
            [MessageSquareIcon, "Chats"],
            [LayoutGridIcon, "Projects"],
            [SparklesIcon, "Customize"],
          ].map(([I, t]) => {
            const Icon = I as typeof SquarePenIcon
            return (
              <span key={String(t)} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                <Icon className="size-4" /> {String(t)}
              </span>
            )
          })}
          <span className="mt-auto rounded-lg px-2 py-1.5 text-[12px]">Cowork session</span>
        </aside>
        <div className="flex min-h-[420px] flex-col">
          <div className="flex items-center gap-2 border-b bg-white/70 px-4 py-2 text-[13px] text-muted-foreground">
            <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground">{model}</span>
            <span className="truncate">Working in Reyes Dental</span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-4 text-[15px] leading-relaxed">{children}</div>
          <div className="border-t bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {context.map((c) => {
                const Icon = icon(c)
                return (
                  <span key={c} className="flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-[12px] text-muted-foreground">
                    <Icon className="size-3" /> {c}
                  </span>
                )
              })}
            </div>
            <div className="min-h-9 rounded-xl border bg-white px-3 py-2 text-[14px] text-muted-foreground">{composer ?? "Message Claude"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Bubble({ who, children, className }: { who: "you" | "claude" | "system"; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-2.5", who === "you" && "justify-end", className)}>
      {who !== "you" && (
        <span className={cn("mt-1 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white", who === "claude" ? "bg-claude" : "bg-muted-foreground")} aria-hidden="true">
          {who === "claude" ? "C" : "!"}
        </span>
      )}
      <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5", who === "you" ? "bg-secondary text-secondary-foreground" : who === "claude" ? "bg-white shadow-card-sm" : "bg-warning-soft text-warning")}>
        {children}
      </div>
    </div>
  )
}
