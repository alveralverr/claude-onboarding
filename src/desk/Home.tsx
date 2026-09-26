import { useGame } from "@/lib/game"
import { Desk } from "./Desk"
import { FirstRun } from "./FirstRun"

export function Home({ drill }: { drill?: string }) {
  const g = useGame()
  return g.story.started ? <Desk drill={drill} /> : <FirstRun />
}
