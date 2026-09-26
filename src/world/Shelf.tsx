import * as React from "react"

import { Cowork } from "@/components/site/LibraryCowork"
import { Prompting, Model, Learn } from "@/components/site/LibraryPractice"
import { Skills, Connectors, Scheduled } from "@/components/site/LibraryTools"
import { Help, Feedback } from "@/components/site/HelpFeedback"
import { LIBRARY } from "@/lib/data"
import { Kicker } from "@/components/site/shared"

/* The Shelf: the reference library, one page, every old section id kept so
   deep links from claude-design.html and shared links still land. */
export function Shelf({ section }: { section?: string }) {
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
          <Kicker>The Shelf</Kicker>
          <h1 className="h-display mb-4" id="shelf-title">
            Everything else, <span className="grad">open</span> any time.
          </h1>
          <p className="lede mb-7">The reference for day-to-day questions. Come back whenever you need a refresher.</p>
          <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Shelf">
            {LIBRARY.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex flex-col gap-1 rounded-xl border-1.5 border-transparent bg-card p-5 text-foreground no-underline shadow-card-sm transition-[transform,border-color] hover:-translate-y-0.5 hover:border-violet/30"
              >
                <strong className="text-lg">{l.title}</strong>
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
