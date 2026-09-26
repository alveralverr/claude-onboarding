import * as React from "react"
import { cn } from "cn"
import { AwardIcon, CheckIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { AVATARS, BADGES, CORE_ORDER, ROOMS } from "@/content/world"
import { setAvatar, useDerived, useGame } from "@/lib/game"
import { continueTarget, useStatus } from "@/lib/progress"
import { Kicker } from "@/components/site/shared"
import { OfficeMap } from "./Map"

function AvatarPick() {
  const g = useGame()
  const [name, setName] = React.useState(g.name ?? "")
  return (
    <Card className="rounded-[32px] border-2 border-white shadow-lift">
      <CardHeader>
        <CardTitle className="text-[22px] font-semibold">Who's working today?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Pick an avatar">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={g.avatar === a.id}
              onClick={() => setAvatar(a.id, name)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border-2 bg-background p-2 text-sm transition-colors hover:border-violet/40 focus-visible:ring-3 focus-visible:ring-ring/50",
                g.avatar === a.id ? "border-violet bg-secondary" : "border-transparent"
              )}
            >
              <img src={a.src} alt="" width={96} height={96} loading="lazy" className="size-16 rounded-full bg-[#E6E6F8] object-cover" />
              {a.name}
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Your name (optional, stays in this browser)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => g.avatar && setAvatar(g.avatar, name)}
            className="h-11 rounded-xl border bg-white px-3 text-base text-foreground"
            placeholder="Bea"
          />
        </label>
      </CardContent>
    </Card>
  )
}

function StatusCard() {
  const st = useStatus()
  const d = useDerived()
  const g = useGame()
  const avatar = AVATARS.find((a) => a.id === g.avatar)
  const target = continueTarget(st)
  return (
    <Card className="rounded-[32px] border-2 border-white shadow-lift" aria-label="Your progress">
      <CardHeader className="flex flex-row items-center gap-3">
        {avatar && <img src={avatar.src} alt="" width={56} height={56} className="size-14 rounded-full bg-[#E6E6F8] object-cover" />}
        <div className="flex flex-col">
          <CardTitle className="text-[22px] font-semibold">{g.name ? `${g.name}, ` : ""}Level {d.level.n}: {d.level.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {d.xp} XP{d.nextLevel ? ` · ${d.nextLevel.xp - d.xp} to ${d.nextLevel.name}` : " · top level"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={st.pct}>
          <ProgressLabel>Core path</ProgressLabel>
          <ProgressValue />
        </Progress>
        <ol className="flex flex-col gap-2">
          {CORE_ORDER.map((id, i) => {
            const room = ROOMS.find((r) => r.id === id)!
            const done = id === "desk" ? st.setup : id === "inbox" ? st.first : st.safety
            const current = st.current === (id === "desk" ? "setup" : id === "inbox" ? "first" : "safety")
            return (
              <li key={id}>
                <a
                  href={room.href}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl border-1.5 border-transparent bg-background px-3.5 py-3 text-foreground no-underline transition-colors hover:border-violet-mid/40 hover:bg-card",
                    current && "border-violet-mid bg-card shadow-card-sm"
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex size-8.5 shrink-0 items-center justify-center rounded-full border-1.5 border-violet/25 bg-card text-base font-semibold text-violet",
                      current && "border-violet bg-violet text-white",
                      done && "border-success bg-success text-white"
                    )}
                    aria-hidden="true"
                  >
                    {done ? <CheckIcon className="size-4" /> : i + 1}
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[17px] font-semibold">{room.name}</span>
                    <span className={cn("mt-0.5 text-sm text-muted-foreground", done && "text-success")}>
                      {done ? "Done" : id === "desk" && st.setupDone ? `${st.setupDone} of ${st.setupTotal} ticked` : `~${room.minutes} min`}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
        <div className="flex flex-wrap gap-1.5" aria-label="Badges">
          {BADGES.map((b) => {
            const has = d.badges.includes(b.id)
            return (
              <span
                key={b.id}
                title={has ? b.how : `${b.name}: ${b.how}`}
                className={cn("flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold", has ? "border-violet/30 bg-secondary text-secondary-foreground" : "border-dashed text-muted-foreground")}
              >
                <AwardIcon className="size-3.5" /> {b.name}
              </span>
            )
          })}
        </div>
        <div className={cn("flex items-start gap-3 rounded-xl border-1.5 border-dashed border-violet/25 p-3.5 text-sm text-muted-foreground", st.all && "border-solid border-success bg-success-soft text-success")}>
          {st.all ? <CheckIcon className="mt-0.5 size-5 shrink-0" /> : <LockIcon className="mt-0.5 size-5 shrink-0" />}
          <p className="flex flex-col leading-snug">
            <strong className={cn("text-base", st.all && "text-success")}>Ready for client work</strong>
            {st.all ? (
              <a href="/certificate.html" target="_blank" rel="noopener" className="text-success underline">
                Get your certificate
              </a>
            ) : (
              <span>Finish the three core rooms first.</span>
            )}
          </p>
        </div>
        <Button size="xl" render={<a href={target.href} />} nativeButton={false}>
          {target.label}
        </Button>
      </CardContent>
    </Card>
  )
}

export function Lobby() {
  const g = useGame()
  const st = useStatus()
  return (
    <>
      <section className="hero-wash pt-10 pb-10 md:pt-16 md:pb-14" aria-labelledby="lobby-title">
        <div className="wrap grid items-start gap-10 px-5 md:px-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
          <div>
            <Kicker>The Magic Office</Kicker>
            <h1 className="h-display mb-5" id="lobby-title">
              Learn Claude by <span className="grad">doing</span> the job.
            </h1>
            <p className="lede mb-7">
              Three rooms, about 35 minutes, and you're ready for client work. Practise on a pretend client first, then take it live. Nothing is locked and nothing is timed.
            </p>
            {st.all && (
              <p className="mb-6 text-lg text-success">
                Path complete.{" "}
                <a href="/certificate.html" target="_blank" rel="noopener" className="underline">
                  Get your certificate
                </a>
                , then keep the Shelf handy.
              </p>
            )}
            <OfficeMap />
          </div>
          {g.avatar ? <StatusCard /> : <AvatarPick />}
        </div>
      </section>
    </>
  )
}
