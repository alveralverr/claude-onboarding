import * as React from "react"

import { Cowork } from "@/components/site/LibraryCowork"
import { Prompting, Model, Learn } from "@/components/site/LibraryPractice"
import { Skills, Connectors, Scheduled } from "@/components/site/LibraryTools"
import { Help, Feedback } from "@/components/site/HelpFeedback"
import { LIBRARY } from "@/lib/data"
import { UPDATES } from "@/content/updates"
import { useGame } from "@/lib/game"
import { Kicker } from "@/components/site/shared"

/* The Shelf: the reference library, one page, every old section id kept so
   deep links from claude-design.html and shared links still land. */
export function Shelf({ section }: { section?: string }) {
  const g = useGame()
  const isNew = (href: string) => {
    const id = href.split("/").pop() ?? ""
    return UPDATES.some((u) => u.rooms?.includes(id) && (!g.seenUpdates || u.date > g.seenUpdates))
  }
  React.useEffect(() => {
    if (!section) {
      window.scrollTo({ top: 0 })
      return
    }
    const el = document.getElementById(section)
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }))
  }, [section])
  return (
    <>
      <section id="library" className="hero-wash pt-10 pb-6 md:pt-16 md:pb-8" aria-labelledby="shelf-title">
        <div className="wrap px-5 md:px-10">
          <div className="mb-7 grid items-center gap-6 md:grid-cols-[1fr_minmax(0,360px)]">
            <div>
              <Kicker>The Shelf</Kicker>
              <h1 className="h-display mb-4" id="shelf-title">
                Everything else, <span className="grad">open</span> any time.
              </h1>
              <p className="lede">The reference for day-to-day questions. Come back whenever you need a refresher.</p>
            </div>
            <img src="/assets/media/room-shelf.webp" alt="" width={1200} height={800} className="mx-auto w-full max-w-[360px] rounded-[24px] max-md:hidden" />
          </div>
          <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Shelf">
            {LIBRARY.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex flex-col gap-1 rounded-xl border-1.5 border-transparent bg-card p-5 text-foreground no-underline shadow-card-sm transition-[transform,border-color] hover:-translate-y-0.5 hover:border-violet/30"
              >
                <strong className="flex items-center gap-2 text-lg">
                  {l.title}
                  {isNew(l.href) && <span className="rounded-full bg-violet px-2 py-0.5 text-[11px] font-semibold text-white">New</span>}
                </strong>
                <span className="text-[15px] leading-snug text-muted-foreground">{l.desc}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>
      <Cowork />
      <Skills />
      <Connectors />
      <Scheduled />
      <Prompting />
      <Model />
      <Learn />
      <Help />
      <Feedback />
    </>
  )
}
