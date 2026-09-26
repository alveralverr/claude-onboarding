import * as React from "react"
import { cn } from "cn"
import { SIM } from "./theme"
import { BriefcaseIcon, ChevronDownIcon, ClockIcon, FolderIcon, PaletteIcon, PinIcon, ShapesIcon, SquarePenIcon } from "lucide-react"

/* The practice Claude window. It mirrors the layout of the real Claude
   desktop app as of September 2026, simplified, and never calls a model.
   It is labelled "Practice mode" on every screen and carries no Anthropic
   logo. Update this file when Anthropic changes the real layout. */


export type SimNav = "new" | "projects" | "artifacts" | "scheduled" | "design" | "customize"

const NAV: { id: SimNav; label: string; Icon: typeof SquarePenIcon }[] = [
  { id: "new", label: "New", Icon: SquarePenIcon },
  { id: "projects", label: "Projects", Icon: FolderIcon },
  { id: "artifacts", label: "Artifacts", Icon: ShapesIcon },
  { id: "scheduled", label: "Scheduled", Icon: ClockIcon },
  { id: "design", label: "Design", Icon: PaletteIcon },
  { id: "customize", label: "Customize", Icon: BriefcaseIcon },
]

export function Shell({
  active = "new",
  userName,
  project,
  children,
  panel,
  className,
}: {
  active?: SimNav
  userName: string
  project?: string
  children: React.ReactNode
  panel?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex h-full w-full overflow-hidden text-[14px]", SIM.bg, SIM.text, className)} role="group" aria-label="Practice Claude (simulated)">
      <aside className={cn("hidden w-[208px] shrink-0 flex-col gap-0.5 border-r p-2.5 md:flex", SIM.side, SIM.border)} aria-label="Practice Claude sidebar">
        {NAV.map(({ id, label, Icon }) => (
          <span
            key={id}
            className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5", id === active ? "bg-[#E9E7DF] font-medium" : SIM.muted)}
            aria-current={id === active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.75} />
            {label}
          </span>
        ))}
        <span className={cn("flex items-center gap-2.5 px-2.5 py-1.5", SIM.muted)}>
          <ChevronDownIcon className="size-4" strokeWidth={1.75} />
          More
        </span>
        <p className={cn("mt-4 px-2.5 text-[12px]", SIM.muted)}>Pinned</p>
        {project && (
          <span className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5">
            <PinIcon className="size-3.5 shrink-0" strokeWidth={1.75} />
            {project}
          </span>
        )}
        <p className={cn("mt-4 px-2.5 text-[12px]", SIM.muted)}>Chats and tasks</p>
        <span className={cn("truncate px-2.5 py-1", SIM.muted)}>Today's work</span>
        <div className="mt-auto flex flex-col gap-2 px-1.5 pt-3">
          <span className="w-fit rounded-md bg-[#EFEAFF] px-2 py-0.5 text-[11px] font-semibold tracking-[0.06em] text-[#3B0FA8] uppercase">Practice mode</span>
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#D97757] text-[11px] font-semibold text-white" aria-hidden="true">
              {userName.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate text-[13px]">
              {userName} <span className={SIM.muted}>· Magic, Inc.</span>
            </span>
          </span>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={cn("flex items-center gap-2 border-b px-4 py-2 text-[12px] md:hidden", SIM.border, SIM.muted)}>
          <span className="rounded-md bg-[#EFEAFF] px-2 py-0.5 text-[11px] font-semibold tracking-[0.06em] text-[#3B0FA8] uppercase">Practice mode</span>
          {project && <span className="truncate">{project}</span>}
        </div>
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
          {panel && <aside className={cn("max-h-[45%] shrink-0 overflow-y-auto border-t p-4 lg:max-h-none lg:w-[380px] lg:border-t-0 lg:border-l", SIM.border, "bg-white/60")}>{panel}</aside>}
        </div>
      </div>
    </div>
  )
}

/* The scrollable message column. Keeps itself scrolled to the newest item. */
export function Thread({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      el.scrollTop = el.scrollHeight
    })
    const inner = el.firstElementChild
    if (inner) ro.observe(inner)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className={cn("min-h-0 flex-1 overflow-y-auto", className)}>
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-4 py-5 md:px-6">{children}</div>
    </div>
  )
}
