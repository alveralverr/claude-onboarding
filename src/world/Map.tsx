import * as React from "react"
import { cn } from "cn"
import { AwardIcon, CheckIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { ROOMS, type Room } from "@/content/world"
import { useProgress, useStatus } from "@/lib/progress"
import { navigate, parseHash } from "@/lib/routes"

/* The 2.5D office. A rendered isometric scene with hotspots; clicking a
   room zooms the scene toward it, then routes. Reduced motion skips the zoom.
   A plain list of the same rooms sits beside it for keyboard and screen
   reader users, and for phones. */
export function OfficeMap() {
  const st = useStatus()
  const p = useProgress()
  const reduce = useReducedMotion()
  const [zoom, setZoom] = React.useState<Room | null>(null)
  const done = (r: Room) => (r.id === "desk" ? st.setup : r.id === "inbox" ? st.first : r.id === "vault" ? st.safety : !!(r.live && p.checkboxes[r.live]))

  const enter = (r: Room) => {
    if (reduce || !(r.core || r.mastery)) {
      navigate(parseHash(r.href))
      return
    }
    setZoom(r)
    setTimeout(() => navigate(parseHash(r.href)), 420)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-[28px] border-2 border-white bg-[#E6E6F8] shadow-card" style={{ aspectRatio: "3 / 2" }}>
        <motion.div
          className="absolute inset-0"
          animate={zoom ? { scale: 1.7, x: `${(50 - zoom.spot.x) * 1.3}%`, y: `${(50 - zoom.spot.y) * 1.3}%` } : { scale: 1, x: 0, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/assets/media/lobby-1536.webp"
            srcSet="/assets/media/lobby-768.webp 768w, /assets/media/lobby-1536.webp 1536w"
            sizes="(min-width: 1024px) 640px, 100vw"
            width={1536}
            height={1024}
            alt="An isometric office floor with a desk, a mailroom, a vault, a studio, a switchboard, a clock tower, a writing nook, a workshop, an engine room, a bookshelf and a help desk."
            className="size-full object-cover"
            fetchPriority="high"
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
              <span className={cn("flex size-6 items-center justify-center rounded-full text-[11px] text-white", done(r) ? "bg-success" : r.core ? "bg-violet" : r.mastery ? "bg-violet-mid" : "bg-muted-foreground")} aria-hidden="true">
                {done(r) ? <CheckIcon className="size-3.5" /> : r.core ? ROOMS.filter((x) => x.core).indexOf(r) + 1 : r.mastery ? <AwardIcon className="size-3" /> : "·"}
              </span>
              {/* Core rooms always show their name; the rest are pins that name themselves on hover or focus. */}
              <span className={r.core ? "max-sm:sr-only" : "sr-only group-hover:not-sr-only group-focus-visible:not-sr-only"}>{r.name}</span>
            </span>
          </button>
        ))}
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-label="Rooms">
        {ROOMS.filter((r) => !r.mastery).map((r) => (
          <li key={r.id}>
            <a href={r.href} className="flex items-center gap-3 rounded-xl border-1.5 border-transparent bg-card px-3.5 py-2.5 text-foreground no-underline shadow-card-sm transition-colors hover:border-violet/30">
              <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white", done(r) ? "bg-success" : r.core ? "bg-violet" : r.mastery ? "bg-violet-mid" : "bg-muted-foreground")} aria-hidden="true">
                {done(r) ? <CheckIcon className="size-4" /> : r.core ? ROOMS.filter((x) => x.core).indexOf(r) + 1 : r.mastery ? <AwardIcon className="size-3.5" /> : "·"}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-semibold">{r.name}</span>
                <span className="text-sm text-muted-foreground">
                  {r.blurb}
                  {r.minutes ? ` · ~${r.minutes} min` : ""}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
