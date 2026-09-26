import * as React from "react"
import { cn } from "cn"
import { CheckIcon, Loader2Icon, SparklesIcon } from "lucide-react"

import { SIM } from "./theme"

export function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] rounded-2xl rounded-br-md bg-[#EFEDE6] px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap">{children}</div>
    </div>
  )
}

/* Claude's turn. Serif, like the real app's responses. */
export function ClaudeMsg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-3", className)}>
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#D97757]/12 text-[#C2603F]" aria-hidden="true">
        <SparklesIcon className="size-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1 text-[15px] leading-relaxed" style={SIM.serif}>
        {children}
      </div>
    </div>
  )
}

export function Thinking({ label = "Thinking" }: { label?: string }) {
  return (
    <ClaudeMsg>
      <span className={cn("flex items-center gap-2 text-[14px]", SIM.muted)} style={{ fontFamily: "inherit" }}>
        <Loader2Icon className="size-4 animate-spin" /> {label}
      </span>
    </ClaudeMsg>
  )
}

/* Tool steps ticking over, one at a time. */
export function ToolList({ tools, done }: { tools: string[]; done: number }) {
  return (
    <ul className="flex flex-col gap-1.5 rounded-xl border border-[#E7E5DD] bg-white px-3.5 py-3 font-sans text-[13px]">
      {tools.slice(0, Math.min(tools.length, done + 1)).map((t, i) => (
        <li key={t} className="flex items-center gap-2">
          {i < done ? <CheckIcon className="size-4 text-[#0E8A4F]" /> : <Loader2Icon className="size-4 animate-spin text-[#73726C]" />}
          <span className={i < done ? "" : SIM.muted}>{t}</span>
        </li>
      ))}
    </ul>
  )
}

/* A small card in the right-hand panel. */
export function PanelCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-[12px] font-semibold tracking-[0.08em] text-[#73726C] uppercase">{title}</h3>
      {children}
    </section>
  )
}

/* Feedback line under a choice. */
export function Why({ good, children }: { good?: boolean; children: React.ReactNode }) {
  return (
    <p role="status" className={cn("rounded-xl px-3.5 py-2.5 font-sans text-[14px] leading-snug", good ? "bg-[#E3F6EC] text-[#0B6B3D]" : "bg-[#FFF1EE] text-[#A32D2D]")}>
      {children}
    </p>
  )
}

export function MenuList({ children, className, up }: { children: React.ReactNode; className?: string; up?: boolean }) {
  return (
    <div
      role="menu"
      className={cn(
        "absolute left-0 z-20 min-w-56 rounded-xl border border-[#E7E5DD] bg-white p-1.5 font-sans text-[13.5px] shadow-[0_12px_32px_rgba(20,10,60,0.12)]",
        up ? "bottom-full mb-2" : "top-full mt-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export function MenuItem({ children, onSelect, active, hint }: { children: React.ReactNode; onSelect: () => void; active?: boolean; hint?: string }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-[#F3F2EC]", active && "bg-[#F3F2EC] font-medium")}
    >
      <span className="min-w-0 flex-1">
        {children}
        {hint && <span className="block text-[12px] text-[#73726C]">{hint}</span>}
      </span>
      {active && <CheckIcon className="size-4 shrink-0" />}
    </button>
  )
}
