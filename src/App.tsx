import { useEffect } from "react"

import { TopBar } from "@/components/site/TopBar"
import { Hero } from "@/components/site/Hero"
import { Intro } from "@/components/site/Intro"
import { Setup, FirstTask, Safety, Ready } from "@/components/site/Path"
import { LibraryIndex, Cowork } from "@/components/site/LibraryCowork"
import { Skills, Connectors, Scheduled } from "@/components/site/LibraryTools"
import { Prompting, Model, Learn } from "@/components/site/LibraryPractice"
import { Help, Feedback, Footer } from "@/components/site/HelpFeedback"

export default function App() {
  // The browser tries to scroll to #hash before React has rendered anything,
  // so repeat the jump once the sections exist.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id) return
    const el = document.getElementById(id)
    if (el) requestAnimationFrame(() => el.scrollIntoView())
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <TopBar />
      <main id="main">
        <Hero />
        <Intro />
        <Setup />
        <FirstTask />
        <Safety />
        <Ready />
        <LibraryIndex />
        <Cowork />
        <Skills />
        <Connectors />
        <Scheduled />
        <Prompting />
        <Model />
        <Learn />
        <Help />
        <Feedback />
      </main>
      <Footer />
    </>
  )
}
