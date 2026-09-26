import { useEffect } from "react"

import { TopBar } from "@/components/site/TopBar"
import { Footer } from "@/components/site/HelpFeedback"
import { useRoute } from "@/lib/routes"
import { Home } from "@/desk/Home"
import { FirstRun } from "@/desk/FirstRun"
import { LaunchpadPage } from "@/desk/LaunchpadPage"
import { WhatsNewPage } from "@/desk/WhatsNew"
import { RoomPage } from "@/world/RoomPage"
import { Shelf } from "@/world/Shelf"

export default function App() {
  const route = useRoute()

  // Room changes start at the top; the Shelf handles its own anchors.
  useEffect(() => {
    if (route.kind !== "shelf") window.scrollTo({ top: 0 })
  }, [route])

  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById("main")?.focus()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <TopBar />
      <main id="main" tabIndex={-1} className="outline-none">
        {/* Your desk is the only home. The office map opens over it (#/office), and so do drills. */}
        {route.kind === "lobby" && <Home />}
        {route.kind === "office" && <Home office />}
        {route.kind === "drill" && <Home drill={route.id} />}
        {route.kind === "start" && <FirstRun />}
        {route.kind === "launchpad" && <LaunchpadPage />}
        {route.kind === "whatsnew" && <WhatsNewPage />}
        {route.kind === "room" && <RoomPage id={route.id} />}
        {route.kind === "shelf" && <Shelf section={route.section} />}
      </main>
      <Footer />
    </>
  )
}
