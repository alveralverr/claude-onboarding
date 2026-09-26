import * as React from "react"
import { cn } from "cn"
import { CheckIcon, FlameIcon, LockIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { AVATARS, BADGES, CORE_ORDER, DESK_ITEMS, MASTERY_ORDER, ROOMS } from "@/content/world"
import { BadgeArt } from "@/engine/BadgeArt"
import { currentQuest } from "@/content/quests"
import { UPDATES } from "@/content/updates"
import { Checkbox } from "@/components/ui/checkbox"
import { completeStep, stepKey } from "@/lib/game"
import { setAvatar, useDerived, useGame } from "@/lib/game"
import { useProgress } from "@/lib/progress"
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
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Pick an avatar">
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
              <img src={a.src} alt="" width={256} height={256} className="size-20 rounded-full bg-[#E6E6F8] object-cover" />
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
        {avatar && <img src={avatar.src} alt="" width={256} height={256} className="size-16 rounded-full bg-[#E6E6F8] object-cover" />}
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
        <ul className="grid grid-cols-7 gap-1.5" aria-label={`Badges: ${d.badges.length} of ${BADGES.length}`}>
          {BADGES.map((b) => {
            const has = d.badges.includes(b.id)
            return (
              <li key={b.id} title={`${b.name}: ${b.how}`}>
                <BadgeArt id={b.id} earned={has} alt={`${b.name}${has ? "" : " (not yet)"}`} className="w-full" />
              </li>
            )
          })}
        </ul>
        <DeskItems level={d.level.n} streak={d.streak} />
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

function DeskItems({ level, streak }: { level: number; streak: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Desk items">
      {DESK_ITEMS.map((it) => {
        const has = level >= it.level
        return (
          <span
            key={it.id}
            title={has ? `${it.name}: on your desk` : `${it.name}: unlocks at level ${it.level}`}
            className={cn("flex size-12 items-center justify-center rounded-xl border", has ? "border-violet/30 bg-secondary" : "border-dashed")}
          >
            <img src={it.src} alt="" width={256} height={256} loading="lazy" className={cn("size-10", !has && "opacity-30 grayscale")} />
            <span className="sr-only">{has ? `${it.name} on your desk` : `${it.name} unlocks at level ${it.level}`}</span>
          </span>
        )
      })}
      {streak > 0 && (
        <span className="ml-auto flex items-center gap-1 text-sm text-muted-foreground" title="Weeks in a row with progress">
          <FlameIcon className="size-4 text-warning" /> {streak} week{streak === 1 ? "" : "s"} in a row
        </span>
      )}
    </div>
  )
}

function QuestCard() {
  const g = useGame()
  const { quest, week } = currentQuest()
  const key = `${quest.id}-${week}`
  const done = !!g.steps[stepKey("quest", key)]
  const id = `quest-${key}`
  return (
    <Card className={cn(done && "bg-success-soft")}>
      <CardContent className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.16em] text-violet uppercase">This week's quest</p>
        <div className="flex items-start gap-3">
          <Checkbox id={id} checked={done} onCheckedChange={(c) => c && completeStep("quest", key)} className="mt-1 size-6 rounded-lg" />
          <label htmlFor={id} className="flex flex-col gap-1">
            <span className="text-lg font-semibold">{quest.title}</span>
            <span className="text-base text-muted-foreground">{quest.body}</span>
          </label>
        </div>
        {quest.room && !done && (
          <a href={quest.room} className="ml-9 text-sm text-violet">
            Practise it in the room first
          </a>
        )}
        {done && <p className="ml-9 text-sm text-success">Done for this week. A new quest lands every Monday.</p>}
      </CardContent>
    </Card>
  )
}

function MasteryWing() {
  const p = useProgress()
  const d = useDerived()
  const g = useGame()
  const isNew = (id: string) => UPDATES.some((u) => u.rooms?.includes(id) && (!g.seenUpdates || u.date > g.seenUpdates))
  return (
    <section className="py-12 md:py-16" aria-labelledby="mastery-title">
      <div className="wrap px-5 md:px-10">
        <Kicker>The mastery wing</Kicker>
        <h2 className="h-section mb-3" id="mastery-title">
          Six more rooms, five to eight minutes each.
        </h2>
        <p className="lede mb-7">In any order, whenever a task calls for it. Each one ends with a real piece of work and a badge.</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MASTERY_ORDER.map((id) => {
            const r = ROOMS.find((x) => x.id === id)!
            const done = !!(r.live && p.checkboxes[r.live])
            const badge = r.badge ? BADGES.find((b) => b.id === r.badge) : undefined
            const earned = !!r.badge && d.badges.includes(r.badge)
            return (
              <li key={id}>
                <a href={r.href} className="flex h-full flex-col gap-2 overflow-hidden rounded-2xl border-1.5 border-transparent bg-card p-5 pt-0 text-foreground no-underline shadow-card-sm transition-[transform,border-color] hover:-translate-y-0.5 hover:border-violet/30">
                  <img src={r.image} alt="" width={1200} height={800} loading="lazy" className="-mx-5 mb-1 aspect-[2/1] w-[calc(100%+2.5rem)] max-w-none object-cover" />
                  <span className="flex items-center justify-between gap-2">
                    <strong className="text-lg">{r.name}</strong>
                    <span className="flex items-center gap-1.5">
                      {isNew(r.id) && <Badge>New</Badge>}
                      {done ? <Badge variant="success">Done</Badge> : <Badge variant="outline">~{r.minutes} min</Badge>}
                    </span>
                  </span>
                  <span className="text-[15px] leading-snug text-muted-foreground">{r.blurb}</span>
                  {badge && (
                    <span className={cn("mt-auto flex items-center gap-2 text-sm", earned ? "text-violet" : "text-muted-foreground")}>
                      <BadgeArt id={badge.id} earned={earned} className="size-7" /> {badge.name}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
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
            <Kicker>The training floor</Kicker>
            <h1 className="h-display mb-5" id="lobby-title">
              Drills for every <span className="grad">Claude</span> skill.
            </h1>
            <p className="lede mb-7">
              Your shifts happen at <a href="#/">your desk</a>. Come here to set up your real Claude, pass the safety check, or drill one skill. Nothing is locked and nothing is timed.
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
          <div className="flex flex-col gap-4">
            {g.avatar ? <StatusCard /> : <AvatarPick />}
            <QuestCard />
          </div>
        </div>
      </section>
      <MasteryWing />
    </>
  )
}
