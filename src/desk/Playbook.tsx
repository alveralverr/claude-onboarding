import { CheckIcon, PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { pathById } from "@/content/paths"
import { useDerived, useGame, trustOf } from "@/lib/game"
import { taskKey, type PathDef } from "@/story/types"
import { HabitBars, Hearts } from "./Summary"

/* The notebook on the desk: habits, hours, every task, and the way out to
   the real Week 1. Nothing here is locked. */
export function Playbook({ path, onPlay }: { path: PathDef; onPlay: (si: number, ti: number) => void }) {
  const g = useGame()
  const d = useDerived()
  const role = pathById(g.story.role)
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-background p-4">
          <p className="text-[13px] text-muted-foreground">{path.persona!.first}'s trust</p>
          <Hearts value={trustOf(g, path.id)} className="mt-1 block" />
        </div>
        <div className="rounded-2xl bg-background p-4">
          <p className="text-[13px] text-muted-foreground">Hours saved (estimate)</p>
          <p className="text-[24px] font-semibold tabular-nums">{d.hours}</p>
        </div>
        <div className="rounded-2xl bg-background p-4">
          <p className="text-[13px] text-muted-foreground">Level</p>
          <p className="text-[18px] font-semibold">
            {d.level.n}, {d.level.name}
          </p>
        </div>
      </div>
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
      <div className="flex flex-wrap gap-2">
        <Button render={<a href="#/launchpad" />} nativeButton={false}>
          Plan your real Week 1
        </Button>
        <Button variant="outline" render={<a href="#/start" />} nativeButton={false}>
          Change your path
        </Button>
        <Button variant="ghost" render={<a href="#/office" />} nativeButton={false}>
          Training floor
        </Button>
      </div>
    </div>
  )
}
