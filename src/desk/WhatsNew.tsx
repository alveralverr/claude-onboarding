import * as React from "react"
import { cn } from "cn"
import { ArrowLeftIcon, ExternalLinkIcon, PlayIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyPrompt, Kicker, YouTube } from "@/components/site/shared"
import { KIND_LABEL, LATEST_UPDATE_DATE, STATUS_LABEL, UPDATES } from "@/content/updates"
import type { Update, UpdateKind } from "@/content/updates/types"
import { ROOMS } from "@/content/world"
import { HABITS } from "@/story/types"
import { markUpdatesSeen, useGame } from "@/lib/game"

const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

const STATUS_VARIANT: Record<Update["status"], "success" | "secondary" | "warning"> = { live: "success", "rolling-out": "secondary", "team-pending": "warning" }

function roomLink(id: string) {
  const room = ROOMS.find((r) => r.id === id)
  if (room) return { href: room.href, label: room.name }
  return { href: `#/shelf/${id}`, label: `Shelf: ${id.replace("-", " ")}` }
}

/* One announcement, full size. */
export function UpdateCard({ u, isNew, compact }: { u: Update; isNew?: boolean; compact?: boolean }) {
  return (
    <article className={cn("flex flex-col gap-3 rounded-2xl border-2 border-white bg-card p-5 shadow-card-sm", isNew && "border-violet/40")}>
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
        <Badge variant="secondary">{KIND_LABEL[u.kind]}</Badge>
        <Badge variant={STATUS_VARIANT[u.status]}>{STATUS_LABEL[u.status]}</Badge>
        {isNew && <Badge variant="outline">New for you</Badge>}
        <span className="ml-auto">{fmt(u.date)}</span>
      </div>
      <h3 className="text-[20px] leading-tight font-semibold">{u.title}</h3>
      <p className="text-[15px] leading-relaxed text-card-foreground">{u.summary}</p>
      <p className="rounded-xl bg-secondary/60 px-3.5 py-2.5 text-[15px] leading-relaxed text-secondary-foreground">
        <strong>Why it matters:</strong> {u.why}
      </p>
      {!compact && u.video && <YouTube id={u.video.youtube} title={u.video.title} />}
      {!compact && u.try && (
        <div>
          <p className="mb-1.5 text-[13px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">Try it on real work</p>
          <CopyPrompt text={u.try} />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 text-[14px]">
        {u.drill && (
          <Button size="sm" render={<a href={`#/drill/${u.id}`} />} nativeButton={false}>
            <PlayIcon data-icon="inline-start" /> Practise it (3 min)
          </Button>
        )}
        {u.rooms?.map((r) => {
          const l = roomLink(r)
          return (
            <a key={r} href={l.href} className="text-violet">
              {l.label}
            </a>
          )
        })}
        {u.habits?.map((h) => (
          <span key={h} className="rounded-full bg-background px-2.5 py-0.5 text-[12.5px] text-muted-foreground">
            {HABITS.find((x) => x.id === h)?.name}
          </span>
        ))}
        {u.links?.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener" className="ml-auto flex items-center gap-1 text-muted-foreground hover:text-violet">
            {l.label} <ExternalLinkIcon className="size-3.5" />
          </a>
        ))}
      </div>
    </article>
  )
}

/* #/whats-new: every update, newest first, with a kind filter. Opening it
   marks everything as seen. */
export function WhatsNewPage() {
  const g = useGame()
  // What counted as new when the page opened; marking everything seen below must not change it mid-view.
  const [seenAtOpen] = React.useState(g.seenUpdates)
  const [kind, setKind] = React.useState<UpdateKind | "all">("all")
  React.useEffect(() => {
    markUpdatesSeen(LATEST_UPDATE_DATE)
  }, [])
  const shown = UPDATES.filter((u) => kind === "all" || u.kind === kind)
  const kinds = Array.from(new Set(UPDATES.map((u) => u.kind)))
  return (
    <section className="tint py-10 md:py-14" aria-labelledby="wn-title">
      <div className="wrap-mid flex flex-col gap-5 px-5 md:px-10">
        <Button variant="ghost" className="w-fit" render={<a href="#/" />} nativeButton={false}>
          <ArrowLeftIcon data-icon="inline-start" /> Back to your desk
        </Button>
        <div>
          <Kicker>The noticeboard</Kicker>
          <h1 className="h-section" id="wn-title">
            What's new in Claude.
          </h1>
          <p className="lede mt-3">Every change that matters for client work, what it means for you, and one way to try it today. Posted by Magic's Product Team.</p>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by kind">
          {(["all", ...kinds] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={cn("rounded-full border px-3.5 py-1.5 text-[14px]", kind === k ? "border-violet bg-secondary text-secondary-foreground" : "border-border bg-card hover:border-violet/40")}
            >
              {k === "all" ? `All (${UPDATES.length})` : KIND_LABEL[k]}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {shown.map((u) => (
            <UpdateCard key={u.id} u={u} isNew={!seenAtOpen || u.date > seenAtOpen} />
          ))}
          {shown.length === 0 && <p className="text-muted-foreground">Nothing in this category yet.</p>}
        </div>
      </div>
    </section>
  )
}
