import * as React from "react"
import { cn } from "cn"
import { BookOpenIcon, CheckIcon, DoorOpenIcon, LaptopIcon, SmartphoneIcon, XIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { LIVE_PATH, pathById } from "@/content/paths"
import { AVATARS } from "@/content/world"
import { LATEST_UPDATE_DATE, UPDATES, unseenUpdates } from "@/content/updates"
import { markUpdatesSeen, useDerived, useGame, trustOf } from "@/lib/game"
import { surfaceOf, taskKey, type PathDef, type Shift } from "@/story/types"
import { useRunner, type MsgAction } from "@/story/useRunner"
import { LaunchpadForm } from "@/story/steps/LaunchpadForm"
import { LiveView } from "@/story/steps/LiveView"
import { SortBoard } from "@/story/steps/SortBoard"
import { OfficeMap } from "@/world/Map"
import { ClientAvatar } from "./ClientAvatar"
import { Coach } from "./Coach"
import { Laptop } from "./Laptop"
import { Overlay } from "./Overlay"
import { PhonePanel } from "./Phone"
import { Playbook } from "./Playbook"
import { Stage } from "./Stage"
import { Hearts, ShiftSummary } from "./Summary"
import { UpdateCard } from "./WhatsNew"
import { shiftClock } from "./pathIcons"

/* Drills shipped with updates play as a bonus shift after the real ones.
   They never count toward the path badge (derive() reads PATHS, not this). */
const BONUS_ID = "updates"
function withBonus(path: PathDef): { runPath: PathDef; bonus: Shift | null } {
  const tasks = UPDATES.filter((u) => u.drill).map((u) => ({ ...u.drill!, id: u.id }))
  if (!tasks.length) return { runPath: path, bonus: null }
  const bonus: Shift = { id: BONUS_ID, day: "New", title: "What's new in Claude", clock: "", tasks }
  return { runPath: { ...path, shifts: [...path.shifts!, bonus] }, bonus }
}

/* The only home from v5 on: your desk, first person. The client texts your
   phone, tasks sit on sticky notes, the laptop opens the practice Claude
   where most of the work happens, and the window looks out on the office
   floor, where setup, the safety check and the drills are. Every room out
   there comes back here. */
export function Desk({ drill, office }: { drill?: string; office?: boolean }) {
  const g = useGame()
  const d = useDerived()
  const reduce = useReducedMotion()
  const path = pathById(g.story.play) ?? LIVE_PATH
  const persona = path.persona!
  const { runPath, bonus } = React.useMemo(() => withBonus(path), [path])
  const shifts = runPath.shifts!
  const coreCount = path.shifts!.length
  const api = useRunner(runPath)
  const userName = g.name || AVATARS.find((a) => a.id === g.avatar)?.name || "there"
  // The noticeboard stays quiet until the first shift is done: one thing at a time.
  const unread = d.ready.shift ? unseenUpdates(g.seenUpdates).length : 0

  const [laptopOpen, setLaptopOpen] = React.useState(false)
  const [phoneOpen, setPhoneOpen] = React.useState(false)
  const [playbook, setPlaybook] = React.useState(false)
  const [board, setBoard] = React.useState(false)
  const [officeOpen, setOfficeOpen] = React.useState(false)
  const [pending, setPending] = React.useState<{ si: number; ti: number } | null>(null)
  const [viewShift, setViewShift] = React.useState<number | null>(null)
  const showOffice = !!office || officeOpen

  const isDone = (si: number, ti: number) => !!g.story.tasks[taskKey(path.id, shifts[si].id, shifts[si].tasks[ti].id)]
  let next: { si: number; ti: number } | null = null
  for (let si = 0; si < coreCount && !next; si++)
    for (let ti = 0; ti < shifts[si].tasks.length; ti++)
      if (!isDone(si, ti)) {
        next = { si, ti }
        break
      }

  const shiftIdx = api.active?.si ?? pending?.si ?? viewShift ?? next?.si ?? coreCount - 1
  const shift = shifts[shiftIdx]
  const doneIds = shift.tasks.filter((_, ti) => isDone(shiftIdx, ti)).map((t) => t.id)
  const clock = shiftClock(doneIds.length)
  const surface = api.step ? surfaceOf(api.step) : null
  const onLaptop = surface === "laptop" || (!api.step && laptopOpen)
  const phoneVisible = surface === "phone" || phoneOpen
  const pendingTask = pending ? shifts[pending.si].tasks[pending.ti] : null
  const nextTask = next ? shifts[next.si].tasks[next.ti] : null
  const waiting = !api.active && !pending && !!nextTask
  const phoneUnread = api.unread + (waiting ? 1 : 0)

  const open = (si: number, ti: number) => {
    if (api.active) return
    setPending({ si, ti })
    setPhoneOpen(true)
    setLaptopOpen(false)
    setViewShift(null)
    setOfficeOpen(false)
    api.markRead()
    api.dismissFinished()
  }
  const begin = () => {
    if (!pending) return
    api.start(pending.si, pending.ti)
    setPending(null)
    setPhoneOpen(false)
  }
  const openPhone = () => {
    if (waiting && next) open(next.si, next.ti)
    else {
      setPhoneOpen(true)
      api.markRead()
    }
  }
  const leanBack = () => {
    if (api.active) api.quit()
    setLaptopOpen(false)
  }
  const openOffice = () => {
    setOfficeOpen(true)
    setLaptopOpen(false)
    setPlaybook(false)
  }
  const closeOffice = () => {
    setOfficeOpen(false)
    // #/office rendered this; go back to the plain desk so the URL matches.
    if (office) location.hash = "#/"
  }

  const deskStep = api.step && surface === "desk" ? api.step : null
  const finishedTask = api.finished ? shifts[api.finished.si].tasks[api.finished.ti] : null
  const finishedBonus = !!api.finished && shifts[api.finished.si].id === BONUS_ID

  // The latest `open` for effects that fire from a route or on first arrival.
  const openRef = React.useRef<((si: number, ti: number) => void) | null>(null)
  React.useEffect(() => {
    openRef.current = open
  })
  // #/drill/<update id> opens that update's drill straight from the noticeboard or What's new.
  React.useEffect(() => {
    if (!drill || !bonus) return
    const ti = bonus.tasks.findIndex((t) => t.id === drill)
    if (ti >= 0) openRef.current?.(coreCount, ti)
    history.replaceState(null, "", "#/")
  }, [drill, bonus, coreCount])
  // First arrival with a task waiting: the phone is already in your hand, one tap to start.
  const arrived = React.useRef(false)
  React.useEffect(() => {
    if (arrived.current || drill || office || !next) return
    arrived.current = true
    openRef.current?.(next.si, next.ti)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // After the first shift, Andi texts what still stands between you and client-ready.
  const announced = React.useRef<string | null>(null)
  const shiftKey = api.finished?.shiftDone ? `${api.finished.si}` : null
  const readySetup = d.ready.setup
  const readySafety = d.ready.safety
  const readyAll = d.ready.all
  React.useEffect(() => {
    if (shiftKey !== "0" || announced.current === shiftKey) return
    announced.current = shiftKey
    const first = g.name ? `, ${g.name}` : ""
    const actions: MsgAction[] = []
    let text: string
    if (readyAll) {
      text = `Nice first day${first}. You're client-ready: your certificate is in the notebook on your desk. Tuesday's tasks are on your sticky notes when you're ready.`
      actions.push({ label: "Get your certificate", href: "/certificate.html" })
    } else {
      const todo: string[] = []
      if (!readySafety) {
        todo.push("the safety check (six minutes, and it's what makes you client-ready)")
        actions.push({ label: "Safety check, 6 min", href: "#/room/vault" })
      }
      if (!readySetup) {
        todo.push("setting up your real Claude (twenty minutes, whenever you have them)")
        actions.push({ label: "Set up your real Claude", href: "#/room/desk" })
      }
      text = `Nice first day${first}. ${todo.length === 2 ? "Two things" : "One thing"} before Tuesday, out the window on the office floor: ${todo.join(", and ")}. Both come straight back to your desk.`
    }
    api.say("al", text, undefined, actions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftKey, readyAll, readySafety, readySetup])

  const openBoard = () => {
    setBoard(true)
    markUpdatesSeen(LATEST_UPDATE_DATE)
  }

  return (
    <section className="hero-wash min-h-[calc(100dvh-4rem)] pt-4 pb-12 md:pt-6" aria-labelledby="desk-title">
      <div className="wrap flex flex-col gap-4 px-4 md:px-8">
        <h1 id="desk-title" className="sr-only">
          Your desk: {shift.day}, {shift.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border-2 border-white bg-card/90 px-4 py-3 shadow-card-sm">
          <ClientAvatar persona={persona} className="size-11 text-[15px]" />
          <div className="min-w-0 leading-tight">
            <p className="text-[16px] font-semibold">{persona.name}</p>
            <p className="text-[13px] text-muted-foreground">
              {persona.company} · {persona.city} ({persona.tzShort})
            </p>
            <Hearts value={trustOf(g, path.id)} className="mt-0.5 block" />
          </div>
          <div className="hidden border-l pl-4 leading-tight md:block">
            <p className="text-[15px] font-semibold">
              {shift.day}: {shift.title}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {clock.label} · {doneIds.length} of {shift.tasks.length} tasks done
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <span className="hidden text-[13px] text-muted-foreground sm:inline" title="Estimated: time by hand minus time with Claude plus a review, over the tasks you have finished.">
              {d.hours} h saved
            </span>
            <Button variant="outline" size="lg" onClick={openPhone} aria-label={phoneUnread ? `Phone, ${phoneUnread} new` : "Phone"}>
              <SmartphoneIcon data-icon="inline-start" />
              Phone
              {phoneUnread > 0 && <span className="ml-1 rounded-full bg-[#E24B4A] px-1.5 text-[12px] font-bold text-white">{phoneUnread}</span>}
            </Button>
            <Button variant="outline" size="lg" onClick={() => setLaptopOpen(true)} disabled={onLaptop || !!api.step}>
              <LaptopIcon data-icon="inline-start" />
              Laptop
            </Button>
            <Button variant="outline" size="lg" onClick={() => setPlaybook(true)}>
              <BookOpenIcon data-icon="inline-start" />
              Notebook
            </Button>
          </div>
        </div>

        {finishedTask && (finishedBonus || !api.finished?.shiftDone) && (
          <div role="status" className="flex flex-wrap items-center gap-3 rounded-2xl bg-success-soft px-4 py-3 text-success">
            <CheckIcon className="size-5 shrink-0" />
            <p className="min-w-0 flex-1 text-[15px]">
              <span className="font-semibold">{finishedTask.title}</span> done. {api.finished?.clean ? "Clean run, and trust went up." : "A lesson or two on the way."}
            </p>
            {api.placement !== null && api.placement >= 7 && finishedTask.id === "sort" && shifts[1] && (
              <Button variant="outline" onClick={() => open(1, 0)}>
                You know this. Skip to {shifts[1].day}
              </Button>
            )}
            {next && <Button onClick={() => open(next.si, next.ti)}>Next: {shifts[next.si].tasks[next.ti].title}</Button>}
          </div>
        )}

        {!api.active && !finishedTask && !phoneVisible && !showOffice && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-card/70 px-4 py-3">
            {pendingTask ? (
              <>
                <p className="min-w-0 flex-1 text-[15px]">
                  <span className="font-semibold">Ready: {pendingTask.title}.</span> <span className="text-muted-foreground">Pick up your phone to start.</span>
                </p>
                <Button onClick={() => setPhoneOpen(true)}>Open the phone</Button>
              </>
            ) : nextTask && next ? (
              <>
                <p className="min-w-0 flex-1 text-[15px]">
                  <span className="font-semibold">Next up: {nextTask.title}.</span> <span className="text-muted-foreground">{persona.first} texted you.</span>
                </p>
                <Button onClick={() => open(next.si, next.ti)}>Pick up the phone</Button>
              </>
            ) : (
              <>
                <p className="min-w-0 flex-1 text-[15px]">
                  <span className="font-semibold">Week one with {persona.first} is done.</span> <span className="text-muted-foreground">Replay any task from your notebook, or plan your real week.</span>
                </p>
                <Button render={<a href="#/launchpad" />} nativeButton={false}>
                  Plan your real Week 1
                </Button>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Andi sits above the work, never below the fold. */}
            <Coach api={api} />

            {onLaptop ? (
              <Laptop api={api} userName={userName} onLeanBack={leanBack} />
            ) : showOffice ? (
              <motion.div
                key="office"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[28px] border-2 border-white bg-card p-5 shadow-lift md:p-7"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="kicker mb-1">Out the window</p>
                    <h2 className="text-[24px] leading-tight font-semibold">The office</h2>
                    <p className="mt-1 text-[15px] text-muted-foreground">Setup, the safety check and one-skill drills. Every room comes straight back to your desk.</p>
                  </div>
                  <Button variant="outline" onClick={closeOffice}>
                    <XIcon data-icon="inline-start" /> Back to your desk
                  </Button>
                </div>
                <OfficeMap onLeave={closeOffice} />
              </motion.div>
            ) : (
              <motion.div
                key="desk"
                initial={reduce ? false : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto w-full md:max-w-[calc((100dvh-15rem)*1.5)]"
              >
                <Stage
                  userName={userName}
                  persona={persona}
                  shift={shift}
                  doneIds={doneIds}
                  nextId={next && next.si === shiftIdx ? shift.tasks[next.ti].id : null}
                  activeId={api.task?.id ?? null}
                  clock={clock}
                  message={waiting ? nextTask?.open : undefined}
                  unread={phoneUnread}
                  onBoard={openBoard}
                  boardUnread={unread}
                  onLaptop={() => setLaptopOpen(true)}
                  onPhone={openPhone}
                  onNotebook={() => setPlaybook(true)}
                  onSticky={(ti) => open(shiftIdx, ti)}
                  onOffice={openOffice}
                />
                {deskStep && api.task && (
                  <Overlay kicker={api.task.title} title={deskStep.title} onClose={api.quit}>
                    {deskStep.kind === "sort" && <SortBoard key={`${api.task.id}-${api.epoch}`} step={deskStep} api={api} />}
                    {deskStep.kind === "live" && <LiveView step={deskStep} api={api} />}
                    {deskStep.kind === "launchpad" && <LaunchpadForm path={path} onDone={() => api.done(true)} doneLabel="Finish the week" />}
                  </Overlay>
                )}
                {board && (
                  <Overlay kicker="The noticeboard" title="What's new in Claude" onClose={() => setBoard(false)}>
                    <div className="flex flex-col gap-3">
                      {UPDATES.slice(0, 4).map((u) => (
                        <UpdateCard key={u.id} u={u} compact />
                      ))}
                      <Button className="w-fit" render={<a href="#/whats-new" />} nativeButton={false}>
                        Open What's new
                      </Button>
                    </div>
                  </Overlay>
                )}
                {api.finished?.shiftDone && !finishedBonus && (
                  <Overlay kicker="Shift complete" title={`${shifts[api.finished.si].day}: ${shifts[api.finished.si].title}`} onClose={api.dismissFinished}>
                    <ShiftSummary
                      path={path}
                      si={api.finished.si}
                      onNext={() => {
                        const si = api.finished!.si
                        api.dismissFinished()
                        if (si + 1 < coreCount) open(si + 1, 0)
                      }}
                    />
                  </Overlay>
                )}
                {playbook && (
                  <Overlay kicker="Your notebook" title="Where you stand" onClose={() => setPlaybook(false)}>
                    <Playbook
                      path={path}
                      onPlay={(si, ti) => {
                        setPlaybook(false)
                        open(si, ti)
                      }}
                      onOffice={openOffice}
                    />
                  </Overlay>
                )}
              </motion.div>
            )}

            {!onLaptop && !showOffice && (
              <ul className="flex flex-col gap-2 md:hidden" aria-label={`${shift.day}'s tasks`}>
                {shift.tasks.map((t, ti) => {
                  const done = doneIds.includes(t.id)
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => open(shiftIdx, ti)}
                        className={cn("flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left shadow-card-sm", done ? "bg-success-soft" : "bg-[#FFF3C4]")}
                      >
                        <span className={cn("flex size-6 items-center justify-center rounded-full text-[12px]", done ? "bg-success text-white" : "bg-white")} aria-hidden="true">
                          {done ? <CheckIcon className="size-3.5" /> : ti + 1}
                        </span>
                        <span className="text-[15px] font-medium">{t.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
              <span title="Three shifts, one working day each. Pick one to see its tasks.">Shifts:</span>
              {shifts.slice(0, coreCount).map((s, si) => (
                <button
                  key={s.id}
                  type="button"
                  disabled={!!api.active}
                  onClick={() => setViewShift(si)}
                  className={cn("rounded-full px-3 py-1", si === shiftIdx ? "bg-secondary font-semibold text-secondary-foreground" : "hover:bg-card")}
                >
                  {s.day}
                </button>
              ))}
              <span className="ml-auto flex items-center gap-3">
                <button type="button" onClick={showOffice ? closeOffice : openOffice} className="flex items-center gap-1 text-violet hover:underline">
                  <DoorOpenIcon className="size-4" /> {showOffice ? "Back to your desk" : "The office"}
                </button>
                <a href="#/shelf" className="text-violet">
                  The Shelf
                </a>
              </span>
            </div>
          </div>

          {phoneVisible && (
            <div className="order-first w-full lg:order-none lg:sticky lg:top-20 lg:w-[360px] lg:shrink-0">
              <PhonePanel api={api} pending={pendingTask} onStart={begin} onClose={() => setPhoneOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
