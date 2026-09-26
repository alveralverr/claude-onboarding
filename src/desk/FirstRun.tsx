import * as React from "react"
import { cn } from "cn"
import { ArrowLeftIcon, CheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kicker } from "@/components/site/shared"
import { LIVE_PATH, PATHS, pathById } from "@/content/paths"
import { AVATARS } from "@/content/world"
import { setAvatar, startStory, useGame } from "@/lib/game"
import { useStatus } from "@/lib/progress"
import { HABITS } from "@/story/types"
import { ClientAvatar } from "./ClientAvatar"
import { pathIcon } from "./pathIcons"

/* Two minutes from landing to the desk: what this is, who you are, what you
   were hired for, and who your practice client is. Every step has a default,
   so nothing here blocks the first shift. */
export function FirstRun() {
  const g = useGame()
  const st = useStatus()
  const [stage, setStage] = React.useState<0 | 1 | 2>(g.avatar ? 1 : 0)
  const [name, setName] = React.useState(g.name ?? "")
  const [avatar, setAvatarLocal] = React.useState(g.avatar ?? AVATARS[0].id)
  const [role, setRole] = React.useState<string>(g.story.role ?? "")
  const chosen = pathById(role)
  const play = chosen?.live ? chosen : LIVE_PATH
  const persona = play.persona!

  React.useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [stage])

  const finish = (setupFirst: boolean) => {
    startStory(role || play.id, play.id)
    if (setupFirst) location.hash = "#/room/desk"
    else location.hash = "#/"
  }

  return (
    <section className="hero-wash min-h-[calc(100dvh-4rem)] py-8 md:py-14" aria-labelledby="first-title">
      <div className="wrap-mid flex flex-col gap-6 px-5 md:px-10">
        <ol className="flex gap-2" aria-label="Getting started">
          {["You", "Your role", "Your client"].map((l, i) => (
            <li key={l} className={cn("flex items-center gap-2 rounded-full px-3 py-1 text-[13px]", i === stage ? "bg-violet text-white" : i < stage ? "bg-success-soft text-success" : "bg-card text-muted-foreground")}>
              {i < stage ? <CheckIcon className="size-3.5" /> : <span aria-hidden="true">{i + 1}</span>}
              {l}
            </li>
          ))}
        </ol>

        {stage === 0 && (
          <div className="flex flex-col gap-5">
            <Kicker>The Magic Office</Kicker>
            <h1 className="h-display" id="first-title">
              Your first <span className="grad">shift</span> starts now.
            </h1>
            <p className="lede">This is how Magic assistants learn to work with Claude for a client. You sit at a desk, a practice client texts you, and you do their work with a practice Claude. Nothing you do here can go wrong.</p>
            <ul className="grid gap-3 sm:grid-cols-3">
              {[
                ["Three shifts", "About twelve minutes each: Monday, Tuesday, Wednesday. Leave and come back any time."],
                ["Five habits", "Spot, Brief, Steer, Check, Show. Every task trains one, and you see your scores after each shift."],
                ["Then the real thing", "Set up your real Claude, pass the safety check, and leave with a plan for your real Week 1."],
              ].map(([t, b]) => (
                <li key={t} className="rounded-2xl border-2 border-white bg-card/80 p-4">
                  <p className="text-[15px] font-semibold">{t}</p>
                  <p className="text-[14px] text-muted-foreground">{b}</p>
                </li>
              ))}
            </ul>
            <p className="text-[14px] font-semibold">Pick a face for your badge. You can change it later.</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6" role="radiogroup" aria-label="Pick your avatar">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  role="radio"
                  aria-checked={avatar === a.id}
                  onClick={() => setAvatarLocal(a.id)}
                  className={cn("flex flex-col items-center gap-1.5 rounded-2xl border-2 bg-card p-2 text-[14px] hover:border-violet/40", avatar === a.id ? "border-violet" : "border-transparent")}
                >
                  <img src={a.src} alt="" width={256} height={256} className="size-20 rounded-full bg-[#E6E6F8] object-cover" />
                  {a.name}
                </button>
              ))}
            </div>
            <label className="flex max-w-sm flex-col gap-1.5 text-[14px] text-muted-foreground">
              Your first name (optional, stays in this browser)
              <input value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl border bg-white px-3 text-[16px] text-foreground" placeholder="Bea" />
            </label>
            <Button
              size="xl"
              className="w-fit"
              onClick={() => {
                setAvatar(avatar, name)
                setStage(1)
              }}
            >
              Next
            </Button>
          </div>
        )}

        {stage === 1 && (
          <div className="flex flex-col gap-5">
            <h1 className="h-section" id="first-title">
              What were you hired for?
            </h1>
            <p className="lede">Your client and tasks match the work. Pick the closest one; you can change it any time.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Your role">
              {PATHS.map((p) => {
                const Icon = pathIcon(p.icon)
                const on = role === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setRole(p.id)}
                    className={cn("flex items-start gap-3 rounded-2xl border-2 bg-card p-4 text-left shadow-card-sm transition-colors hover:border-violet/40", on ? "border-violet" : "border-transparent")}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[16px] font-semibold">{p.name}</span>
                      <span className="text-[14px] text-muted-foreground">{p.blurb}</span>
                      <span className="mt-1">
                        {p.live ? <Badge variant="success">Ready</Badge> : p.next ? <Badge variant="secondary">Coming next</Badge> : <Badge variant="outline">Later</Badge>}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
            {chosen && !chosen.live && (
              <p className="rounded-2xl bg-secondary px-4 py-3 text-[15px] text-secondary-foreground">
                {chosen.name} is {chosen.next ? "coming next" : "on our list"}. Meanwhile you'll work with a General admin client. The five habits are the same in every role.
              </p>
            )}
            <div className="flex gap-2">
              <Button size="xl" variant="outline" onClick={() => setStage(0)}>
                <ArrowLeftIcon data-icon="inline-start" /> Back
              </Button>
              <Button size="xl" disabled={!role} onClick={() => setStage(2)}>
                Next
              </Button>
            </div>
          </div>
        )}

        {stage === 2 && (
          <div className="flex flex-col gap-5">
            <h1 className="h-section" id="first-title">
              Meet your client.
            </h1>
            <div className="flex flex-col gap-4 rounded-[28px] border-2 border-white bg-card p-5 shadow-lift sm:flex-row sm:items-start md:p-7">
              <ClientAvatar persona={persona} className="size-24 shrink-0 text-[28px]" />
              <div className="flex min-w-0 flex-col gap-2">
                <p className="text-[22px] font-semibold">{persona.name}</p>
                <p className="text-[15px] text-muted-foreground">
                  Runs {persona.company}, {persona.what} in {persona.city} ({persona.tzShort}). Practice client, not a real person.
                </p>
                <p className="mt-1 text-[14px] font-semibold">Three things {persona.first} cares about</p>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-[15px]">
                  {persona.prefs.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="text-[14px] text-muted-foreground">How {persona.pron.they} writes: {persona.voice}</p>
              </div>
            </div>
            <p className="text-[15px] text-muted-foreground">
              Each task trains one of five habits: {HABITS.map((h) => h.name).join(", ")}. Already use Claude with a client? Ace the first task and you can skip ahead.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="xl" variant="outline" onClick={() => setStage(1)}>
                <ArrowLeftIcon data-icon="inline-start" /> Back
              </Button>
              <Button size="xl" onClick={() => finish(false)}>
                Start my first shift
              </Button>
              {!st.setup && (
                <Button size="xl" variant="outline" onClick={() => finish(true)}>
                  Set up my real Claude first
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
