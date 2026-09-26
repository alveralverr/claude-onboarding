import { cn } from "cn"
import { CheckIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { PATH_STEPS } from "@/lib/data"
import { continueTarget, useStatus } from "@/lib/progress"
import { Kicker, Voiceover } from "./shared"

function PathCard() {
  const st = useStatus()
  const meta = {
    setup: st.setup ? "Done" : st.setupDone ? `${st.setupDone} of ${st.setupTotal} ticked` : "~20 min",
    first: st.first ? "Done" : "~10 min",
    safety: st.safety ? "Passed" : "~5 min",
  }
  return (
    <Card className="rounded-[32px] border-2 border-white shadow-lift" aria-label="Your onboarding path">
      <CardHeader>
        <CardTitle className="text-[22px] font-semibold">Your path</CardTitle>
        <CardDescription>Three steps before client work.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={st.pct}>
          <ProgressLabel>Progress</ProgressLabel>
          <ProgressValue />
        </Progress>
        <ol className="flex flex-col gap-2">
          {PATH_STEPS.map((s, i) => {
            const done = st[s.id]
            const current = st.current === s.id
            return (
              <li key={s.id}>
                <a
                  href={s.href}
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
                    <span className="text-[17px] font-semibold">{s.name}</span>
                    <span className={cn("mt-0.5 text-sm text-muted-foreground", done && "text-success")}>{meta[s.id]}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
        <div
          className={cn(
            "flex items-start gap-3 rounded-xl border-1.5 border-dashed border-violet/25 p-3.5 text-sm text-muted-foreground",
            st.all && "border-solid border-success bg-success-soft text-success"
          )}
        >
          {st.all ? <CheckIcon className="mt-0.5 size-5 shrink-0" /> : <LockIcon className="mt-0.5 size-5 shrink-0" />}
          <p className="flex flex-col leading-snug">
            <strong className={cn("text-base", st.all && "text-success")}>Ready for client work</strong>
            {st.all ? (
              <a href="/certificate.html" target="_blank" rel="noopener" className="text-success underline">
                Get your certificate
              </a>
            ) : (
              <span>Finish all three steps first.</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function Hero() {
  const st = useStatus()
  const target = continueTarget(st)
  return (
    <section className="hero-wash pt-10 pb-14 md:pt-22 md:pb-24" aria-labelledby="hero-title">
      <div className="wrap grid items-center gap-10 px-5 md:px-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
        <div>
          <Kicker>Onboarding for Magic assistants</Kicker>
          <h1 className="h-display mb-5" id="hero-title">
            Get set up with Claude <span className="grad">Cowork</span>.
          </h1>
          <p className="lede mb-7">Set up in about 20 minutes, run your first real task, then keep this page open as your reference.</p>
          <div className="mb-7 flex flex-wrap gap-3">
            <Button size="xl" render={<a href={target.href} />} nativeButton={false}>
              {target.label}
            </Button>
            <Button size="xl" variant="outline" render={<a href="#library" />} nativeButton={false}>
              Browse the library
            </Button>
          </div>
          <div className="inline-flex max-w-full items-center gap-4 rounded-xl bg-ink-dark py-3 pr-3 pl-5 text-white shadow-card">
            <div>
              <p className="mb-0.5 text-xs font-semibold tracking-[0.18em] text-cyan uppercase">Your Magic benefit</p>
              <p className="text-[17px] leading-snug text-on-dark-2">
                A Claude Team Standard seat worth <strong className="text-xl text-white">₱1,500</strong>/month
              </p>
            </div>
            <Voiceover src="/assets/voice/00 - intro.mp3" label="Listen" onDark />
          </div>
        </div>
        <PathCard />
      </div>
    </section>
  )
}
