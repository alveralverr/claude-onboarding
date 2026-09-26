import { useGame } from "@/lib/game"
import { Desk } from "./Desk"
import { FirstRun } from "./FirstRun"

/* #/ is the front door. Before the first shift it is the two-minute first
   run; after that it is your desk, with the office map or a drill open
   when the route asks for one. */
export function Home({ drill, office }: { drill?: string; office?: boolean }) {
  const g = useGame()
  return g.story.started ? <Desk drill={drill} office={office} /> : <FirstRun />
}
