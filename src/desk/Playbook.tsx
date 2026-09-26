import { CheckIcon, FlameIcon, PlayIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { pathById } from "@/content/paths"
import { currentQuest } from "@/content/quests"
import { BADGES, DESK_ITEMS } from "@/content/world"
import { BadgeArt } from "@/engine/BadgeArt"
import { completeStep, stepKey, useDerived, useGame, trustOf } from "@/lib/game"
import { useStatus } from "@/lib/progress"
import { taskKey, type PathDef } from "@/story/types"
import { HabitBars, Hearts } from "./Summary"

function Stat({ label, value, title }: { label: string; value: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl bg-background p-4" title={title}>
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <div className="mt-1">{value}</div>
    </div>
  )
}

/* Set up, first shift, safety check: the three things that make you
   client-ready, and the certificate when all three are done. */
function ClientReady() {
  const d = useDerived()
  const st = useStatus()
  const rows = [
    { done: d.ready.setup, href: "#/room/desk", label: "Set up your real Claude", meta: d.ready.setup ? "Done" : st.setupDone ? `${st.setupDone} of ${st.setupTotal} ticked · ~20 min` : "~20 min, in the office" },
    { done: d.ready.shift, href: "#/", label: "Your first shift at the desk", meta: d.ready.shift ? "Done" : "Monday with your practice client · ~12 min" },
    { done: d.ready.safety, href: "#/room/vault", label: "The safety check", meta: d.ready.safety ? "Passed" : "Eight scenarios · ~6 min, in the Vault" },
  ]
  return (
    <section aria-label="Client-ready" className={cn("rounded-2xl border-1.5 p-4", d.ready.all ? "border-success bg-success-soft" : "border-dashed border-violet/25 bg-background")}>
      <p className="mb-2 flex items-center justify-between text-[14px] font-semibold">
        Client-ready
        <span className={cn("text-[13px] font-normal", d.ready.all ? "text-success" : "text-muted-foreground")}>{d.ready.all ? "All three done" : `${d.ready.count} of 3`}</span>
      </p>
      <ol className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <li key={r.href}>
            <a href={r.href} className="flex items-center gap-3 rounded-xl bg-card px-3 py-2 text-foreground no-underline hover:bg-white">
              <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full", r.done ? "bg-success text-white" : "border-1.5 border-violet/30 bg-background")} aria-hidden="true">
                {r.done && <CheckIcon className="size-3.5" />}
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-[14.5px] font-medium">{r.label}</span>
                <span className={cn("text-[12.5px]", r.done ? "text-success" : "text-muted-foreground")}>{r.meta}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
      {d.ready.all && (
        <Button className="mt-3" variant="success" render={<a href="/certificate.html" target="_blank" rel="noopener" />} nativeButton={false}>
          Get your certificate
        </Button>
      )}
    </section>
  )
}

function Quest() {
  const g = useGame()
  const { quest, week } = currentQuest()
  const key = `${quest.id}-${week}`
  const done = !!g.steps[stepKey("quest", key)]
  const id = `quest-${key}`
  return (
    <section aria-label="This week's quest" className={cn("rounded-2xl bg-background p-4", done && "bg-success-soft")}>
      <p className="mb-2 text-[12px] font-semibold tracking-[0.14em] text-violet uppercase">This week's quest, on real work</p>
      <div className="flex items-start gap-3">
        <Checkbox id={id} checked={done} onCheckedChange={(c) => c && completeStep("quest", key)} className="mt-0.5 size-6 rounded-lg" />
        <label htmlFor={id} className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold">{quest.title}</span>
          <span className="text-[14px] text-muted-foreground">{quest.body}</span>
        </label>
      </div>
      {quest.room && !done && (
        <a href={quest.room} className="ml-9 text-[13px] text-violet">
          Practise it first
        </a>
      )}
      {done && <p className="ml-9 text-[13px] text-success">Done for this week. A new one lands every Monday.</p>}
    </section>
  )
}

/* The notebook on the desk: where you stand, what makes you client-ready,
   this week's quest, your habits, every task, badges, and the way out to
   the real Week 1. Nothing here is locked. */
export function Playbook({ path, onPlay, onOffice }: { path: PathDef; onPlay: (si: number, ti: number) => void; onOffice: () => void }) {
  const g = useGame()
  const d = useDerived()
  const role = pathById(g.story.role)
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={`${path.persona!.first}'s trust`} title="Starts at three hearts. Clean tasks earn half a heart; a consequence costs some, and a rewind gives it back." value={<Hearts value={trustOf(g, path.id)} className="block" />} />
        <Stat label="Hours saved (estimate)" title="Time by hand minus time with Claude and a review, summed over the tasks you have finished." value={<p className="text-[24px] leading-none font-semibold tabular-nums">{d.hours}</p>} />
        <Stat
          label="Level"
          title={d.nextLevel ? `${d.xp} XP. ${d.nextLevel.xp - d.xp} more to ${d.nextLevel.name}.` : `${d.xp} XP, top level.`}
          value={
            <p className="text-[18px] leading-tight font-semibold">
              {d.level.n}, {d.level.name}
              <span className="block text-[12.5px] font-normal text-muted-foreground">{d.nextLevel ? `${d.nextLevel.xp - d.xp} XP to ${d.nextLevel.name}` : `${d.xp} XP`}</span>
            </p>
          }
        />
      </div>
      <ClientReady />
      {d.ready.shift && <Quest />}
      {role && role.id !== path.id && (
        <p className="rounded-2xl bg-secondary px-4 py-3 text-[14px] text-secondary-foreground">
          You said you were hired for {role.name}. That path is {role.next ? "next on our list" : "on our list"}. The five habits you practise here work the same in every role.
        </p>
      )}
      <div>
        <p className="mb-3 text-[14px] font-semibold">Your five habits</p>
        <HabitBars />
      </div>
      <div className="flex flex-col gap-4">
        {path.shifts!.map((s, si) => (
          <section key={s.id}>
            <p className="mb-2 text-[14px] font-semibold">
              {s.day}: {s.title}
            </p>
            <ul className="flex flex-col gap-1.5">
              {s.tasks.map((t, ti) => {
                const done = !!g.story.tasks[taskKey(path.id, s.id, t.id)]
                return (
                  <li key={t.id} className="flex items-center gap-3 rounded-xl bg-background px-3 py-2">
                    <span className={`flex size-6 items-center justify-center rounded-full text-[12px] ${done ? "bg-success text-white" : "bg-card text-muted-foreground"}`} aria-hidden="true">
                      {done ? <CheckIcon className="size-3.5" /> : ti + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-[14.5px]">{t.title}</span>
                    <Button size="sm" variant="ghost" onClick={() => onPlay(si, ti)} aria-label={`${done ? "Replay" : "Play"} ${t.title}`}>
                      <PlayIcon data-icon="inline-start" />
                      {done ? "Replay" : "Play"}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
      <section aria-label={`Badges: ${d.badges.length} of ${BADGES.length}`}>
        <p className="mb-2 text-[14px] font-semibold">
          Badges <span className="font-normal text-muted-foreground">{d.badges.length} of {BADGES.length}</span>
        </p>
        <ul className="grid grid-cols-7 gap-1.5">
          {BADGES.map((b) => {
            const has = d.badges.includes(b.id)
            return (
              <li key={b.id} title={`${b.name}: ${b.how}`}>
                <BadgeArt id={b.id} earned={has} alt={`${b.name}${has ? "" : " (not yet)"}`} className="w-full" />
              </li>
            )
          })}
        </ul>
        <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Desk items">
          {DESK_ITEMS.map((it) => {
            const has = d.level.n >= it.level
            return (
              <span key={it.id} title={has ? `${it.name}: on your desk` : `${it.name}: unlocks at level ${it.level}`} className={cn("flex size-11 items-center justify-center rounded-xl border", has ? "border-violet/30 bg-secondary" : "border-dashed")}>
                <img src={it.src} alt="" width={256} height={256} loading="lazy" className={cn("size-9", !has && "opacity-30 grayscale")} />
                <span className="sr-only">{has ? `${it.name} on your desk` : `${it.name} unlocks at level ${it.level}`}</span>
              </span>
            )
          })}
          {d.streak > 0 && (
            <span className="ml-auto flex items-center gap-1 text-[13px] text-muted-foreground" title="Weeks in a row with progress">
              <FlameIcon className="size-4 text-warning" /> {d.streak} week{d.streak === 1 ? "" : "s"} in a row
            </span>
          )}
        </div>
      </section>
      <div className="flex flex-wrap gap-2">
        <Button render={<a href="#/launchpad" />} nativeButton={false}>
          Plan your real Week 1
        </Button>
        <Button variant="outline" onClick={onOffice}>
          The office
        </Button>
        <Button variant="ghost" render={<a href="#/start" />} nativeButton={false}>
          Change your path
        </Button>
      </div>
    </div>
  )
}
