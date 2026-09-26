import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kicker } from "@/components/site/shared"
import { LIVE_PATH, pathById } from "@/content/paths"
import { useGame } from "@/lib/game"
import { LaunchpadForm } from "@/story/steps/LaunchpadForm"

export function LaunchpadPage() {
  const g = useGame()
  const path = pathById(g.story.play) ?? LIVE_PATH
  return (
    <section className="tint py-10 md:py-14" aria-labelledby="lp-title">
      <div className="wrap-mid flex flex-col gap-5 px-5 md:px-10">
        <Button variant="ghost" className="w-fit" render={<a href="#/" />} nativeButton={false}>
          <ArrowLeftIcon data-icon="inline-start" /> Back to your desk
        </Button>
        <div>
          <Kicker>Your real client</Kicker>
          <h1 className="h-section" id="lp-title">
            Plan your real Week 1.
          </h1>
        </div>
        <div className="rounded-[28px] border-2 border-white bg-card p-5 shadow-card md:p-7">
          <LaunchpadForm path={path} />
        </div>
      </div>
    </section>
  )
}
