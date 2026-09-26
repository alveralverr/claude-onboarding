import * as React from "react"
import { HeartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { burst } from "@/engine/burst"
import { BadgeArt } from "@/engine/BadgeArt"
import { useDerived, useGame, trustOf, markSeen } from "@/lib/game"
import { suggestedDrill } from "@/story/drills"
import { HABITS, type Habit, type PathDef } from "@/story/types"

export function Hearts({ value, className }: { value: number; className?: string }) {
  return (
    <span className={className} role="img" aria-label={`Client trust ${value} of 5`} title={`Client trust: ${value} of 5. Starts at 3; clean tasks earn some, consequences cost some.`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <HeartIcon key={i} className={`inline size-4 ${value >= i - 0.25 ? "fill-[#E24B4A] text-[#E24B4A]" : value >= i - 0.75 ? "fill-[#F7C1C1] text-[#E24B4A]" : "text-[#D3D1C7]"}`} />
      ))}
    </span>
  )
}

export function HabitBars({ compact }: { compact?: boolean }) {
  const d = useDerived()
  return (
    <ul className="flex flex-col gap-2">
      {HABITS.map((h) => {
        const pct = Math.round(d.habits[h.id] * 100)
        return (
          <li key={h.id} className="grid grid-cols-[76px_1fr_42px] items-center gap-3 text-[14px]">
            <span className="font-semibold">{h.name}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <span className="block h-full rounded-full bg-violet" style={{ width: `${pct}%` }} />
            </span>
            <span className="text-right text-muted-foreground tabular-nums">{pct}%</span>
            {!compact && <span className="col-span-3 -mt-1 text-[12.5px] text-muted-foreground">{h.line}</span>}
          </li>
        )
      })}
    </ul>
  )
}

/* End of a shift: trust, hours, habits, badge, and what's next. */
export function ShiftSummary({ path, si, onNext }: { path: PathDef; si: number; onNext: () => void }) {
  const g = useGame()
  const d = useDerived()
  const ref = React.useRef<HTMLDivElement>(null)
  const last = si >= path.shifts!.length - 1
  const badge = si === 0 ? "first-shift" : last ? `path-${path.id}` : null
  const earned = !!badge && d.badges.includes(badge)
  React.useEffect(() => {
    if (earned && badge) {
      burst(ref.current)
      markSeen(badge)
    }
  }, [earned, badge])
  const maxes: Partial<Record<Habit, number>> = {}
  for (const r of Object.values(g.story.tasks)) for (const h of Object.keys(r.max) as Habit[]) maxes[h] = (maxes[h] ?? 0) + (r.max[h] ?? 0)
  const drill = suggestedDrill(d.habits, maxes)

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-5">
        {badge && <BadgeArt id={badge} earned={earned} className="size-24" />}
        <div className="min-w-0 flex-1">
          <p className="text-[15px] text-muted-foreground">
            {path.persona!.first}'s trust <Hearts value={trustOf(g, path.id)} className="ml-1" /> · {d.hours} hours saved so far (estimate) · Level {d.level.n}, {d.level.name}
          </p>
        </div>
      </div>
      <div className="rounded-2xl bg-background p-4">
        <p className="mb-1 text-[14px] font-semibold">Your five habits</p>
        <p className="mb-3 text-[13px] text-muted-foreground">Every task trains one. Full marks for a first try without the last hint.</p>
        <HabitBars />
      </div>
      {drill && (
        <p className="rounded-2xl bg-warning-soft px-4 py-3 text-[14px] text-warning">
          <span className="font-semibold">Andi suggests:</span> {drill.habit.name} is at {drill.score}%, and {drill.why}.{" "}
          <a href={drill.room.href} className="font-semibold underline">
            {drill.room.name}, {drill.room.minutes} min
          </a>
          , whenever you like.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {!last && <Button size="lg" onClick={onNext}>Start {path.shifts![si + 1].day}</Button>}
        {last && <Button size="lg" render={<a href="#/launchpad" />} nativeButton={false}>Plan your real Week 1</Button>}
        {!d.ready.safety && (
          <Button size="lg" variant="outline" render={<a href="#/room/vault" />} nativeButton={false}>
            Take the safety check (6 min)
          </Button>
        )}
        {si > 0 && !d.ready.setup && (
          <Button size="lg" variant="outline" render={<a href="#/room/desk" />} nativeButton={false}>
            Set up your real Claude (20 min)
          </Button>
        )}
        {d.ready.all && (
          <Button size="lg" variant="outline" render={<a href="/certificate.html" target="_blank" rel="noopener" />} nativeButton={false}>
            Get your certificate
          </Button>
        )}
        {last && <Button size="lg" variant="ghost" onClick={onNext}>Back to your desk</Button>}
      </div>
    </div>
  )
}
