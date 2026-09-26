import * as React from "react"
import { cn } from "cn"
import { AwardIcon, CheckIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { BADGES, MASTERY_ORDER, ROOMS, type Room } from "@/content/world"
import { UPDATES } from "@/content/updates"
import { useDerived, useGame } from "@/lib/game"
import { useProgress } from "@/lib/progress"
import { navigate, parseHash } from "@/lib/routes"
import { BadgeArt } from "@/engine/BadgeArt"

/* The office, seen from your desk. A rendered isometric floor with hotspots;
   clicking a room zooms the scene toward it, then routes. Reduced motion
   skips the zoom. Below it, the same rooms as a list, grouped by what they
   are for, which is what keyboard, screen reader and phone users get. */
export function OfficeMap({ onLeave }: { onLeave?: () => void }) {
  const d = useDerived()
  const g = useGame()
  const p = useProgress()
  const reduce = useReducedMotion()
  const [zoom, setZoom] = React.useState<Room | null>(null)
  const done = (r: Room) => (r.id === "desk" ? d.ready.setup : r.id === "vault" ? d.ready.safety : !!(r.live && p.checkboxes[r.live]))
  // "New" pins wait for the first shift, like the noticeboard: one thing at a time.
  const isNew = (id: string) => d.ready.shift && UPDATES.some((u) => u.rooms?.includes(id) && (!g.seenUpdates || u.date > g.seenUpdates))

  const enter = (r: Room) => {
    if (reduce || !(r.core || r.mastery)) {
      onLeave?.()
      navigate(parseHash(r.href))
      return
    }
    setZoom(r)
    setTimeout(() => {
      onLeave?.()
      navigate(parseHash(r.href))
    }, 420)
  }

  const Pin = ({ r }: { r: Room }) => (
    <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] text-white", done(r) ? "bg-success" : r.core ? "bg-violet" : r.mastery ? "bg-violet-mid" : "bg-muted-foreground")} aria-hidden="true">
      {done(r) ? <CheckIcon className="size-3.5" /> : r.core ? ROOMS.filter((x) => x.core).indexOf(r) + 1 : r.mastery ? <AwardIcon className="size-3" /> : "·"}
    </span>
  )

  const groups: { title: string; note: string; rooms: Room[] }[] = [
    { title: "Get client-ready", note: "Two rooms, plus your first shift at the desk.", rooms: ROOMS.filter((r) => r.core) },
    { title: "Drills", note: "One skill each, five to eight minutes. Andi suggests one after each shift.", rooms: MASTERY_ORDER.map((id) => ROOMS.find((r) => r.id === id)!) },
    { title: "Reference", note: "Open any time.", rooms: ROOMS.filter((r) => !r.core && !r.mastery) },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-[24px] border-2 border-white bg-[#E6E6F8] shadow-card" style={{ aspectRatio: "3 / 2" }}>
        <motion.div
          className="absolute inset-0"
          animate={zoom ? { scale: 1.7, x: `${(50 - zoom.spot.x) * 1.3}%`, y: `${(50 - zoom.spot.y) * 1.3}%` } : { scale: 1, x: 0, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/assets/media/lobby-1536.webp"
            srcSet="/assets/media/lobby-768.webp 768w, /assets/media/lobby-1536.webp 1536w"
            sizes="(min-width: 768px) 800px, 100vw"
            width={1536}
            height={1024}
            alt="An isometric office floor: a setup desk, a vault, a studio, a switchboard, a writing nook, a workshop, an engine room, a bookshelf and a help desk."
            className="size-full object-cover"
          />
        </motion.div>
        {ROOMS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => enter(r)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 hover:z-10 focus-visible:z-10 focus-visible:outline-none"
            style={{ left: `${r.spot.x}%`, top: `${r.spot.y}%` }}
            aria-label={`${r.name}: ${r.blurb}${done(r) ? ", done" : ""}`}
          >
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full border-2 border-white bg-card/95 p-1 text-[13px] font-semibold whitespace-nowrap text-foreground shadow-card-sm transition-transform group-hover:z-10 group-hover:scale-105 group-focus-visible:ring-3 group-focus-visible:ring-ring/50",
                r.core ? "sm:pr-3" : "group-hover:pr-3 group-focus-visible:pr-3",
                (r.core || r.mastery) && "text-violet"
              )}
            >
              <Pin r={r} />
              <span className={r.core ? "max-sm:sr-only" : "sr-only group-hover:not-sr-only group-focus-visible:not-sr-only"}>{r.name}</span>
            </span>
          </button>
        ))}
      </div>
      {groups.map((gr) => (
        <section key={gr.title} aria-label={gr.title}>
          <p className="mb-0.5 text-[14px] font-semibold">{gr.title}</p>
          <p className="mb-2 text-[13px] text-muted-foreground">{gr.note}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {gr.rooms.map((r) => {
              const badge = r.badge ? BADGES.find((b) => b.id === r.badge) : undefined
              const earned = !!r.badge && d.badges.includes(r.badge)
              return (
                <li key={r.id}>
                  <a
                    href={r.href}
                    onClick={(e) => {
                      e.preventDefault()
                      enter(r)
                    }}
                    className="flex items-center gap-3 rounded-xl border-1.5 border-transparent bg-background px-3.5 py-2.5 text-foreground no-underline transition-colors hover:border-violet/30"
                  >
                    <Pin r={r} />
                    <span className="flex min-w-0 flex-col leading-tight">
                      <span className="flex items-center gap-2 font-semibold">
                        {r.name}
                        {isNew(r.id) && <span className="rounded-full bg-violet px-2 py-0.5 text-[11px] font-semibold text-white">New</span>}
                      </span>
                      <span className="text-[13px] text-muted-foreground">
                        {r.blurb}
                        {r.minutes ? ` · ~${r.minutes} min` : ""}
                      </span>
                    </span>
                    {badge && <BadgeArt id={badge.id} earned={earned} alt={`${badge.name}${earned ? "" : " (not yet)"}`} className="ml-auto size-8 shrink-0" />}
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
