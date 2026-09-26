import * as React from "react"

import { Button } from "@/components/ui/button"
import type { RevealStep } from "@/content/types"
import { BadgeArt } from "../BadgeArt"
import { badgeInfo, markSeen, useDerived } from "@/lib/game"
import { burst } from "../burst"

export function Reveal({ step, onDone }: { step: RevealStep; onDone: () => void }) {
  const d = useDerived()
  const ref = React.useRef<HTMLDivElement>(null)
  const badge = step.badge ? badgeInfo(step.badge) : undefined
  const earned = !!step.badge && d.badges.includes(step.badge)
  React.useEffect(() => {
    onDone()
    if (earned) {
      burst(ref.current)
      markSeen(step.badge!)
    }
  }, [onDone, earned, step.badge])
  return (
    <div ref={ref} className="flex flex-col items-center gap-4 py-4 text-center text-[17px] text-card-foreground">
      {badge && (
        <div className="flex flex-col items-center gap-2">
          <BadgeArt id={badge.id} earned={earned} className="size-32 drop-shadow-[0_18px_30px_rgba(82,0,227,0.25)]" />
          <p className="text-xl font-semibold">{earned ? badge.name : `${badge.name} (not yet)`}</p>
          <p className="text-base text-muted-foreground">{badge.how}</p>
        </div>
      )}
      <div className="flex max-w-[52ch] flex-col gap-3">{step.body}</div>
      <p className="text-base text-muted-foreground">
        Level {d.level.n}, {d.level.name} · {d.xp} XP
      </p>
      {step.next && (
        <Button size="xl" render={<a href={step.next.href} />} nativeButton={false}>
          {step.next.label}
        </Button>
      )}
    </div>
  )
}
