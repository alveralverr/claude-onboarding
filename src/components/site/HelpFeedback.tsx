import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PRODUCT_EMAIL, ROUTES, type RouteKey } from "@/lib/data"
import { resetProgress } from "@/lib/progress"
import { resetGame } from "@/lib/game"
import { Section } from "./shared"
import { Check } from "@/engine/bits"

export function Help() {
  const [key, setKey] = React.useState<RouteKey>("invite")
  const r = ROUTES[key]
  return (
    <Section id="help" className="tint border-t" aria-labelledby="help-title">
      <h2 className="h-section mb-7" id="help-title">
        Stuck? Find the right <span className="grad">person</span>.
      </h2>
      <Card>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <ToggleGroup
            orientation="vertical"
            variant="outline"
            spacing={1.5}
            value={[key]}
            onValueChange={(v) => {
              const next = (v as string[])[0]
              if (next) setKey(next as RouteKey)
            }}
            aria-label="What's wrong?"
            className="w-full"
          >
            {(Object.keys(ROUTES) as RouteKey[]).map((k) => (
              <ToggleGroupItem key={k} value={k} className="h-auto min-h-12 justify-start px-3.5 py-2.5 text-left text-base whitespace-normal data-pressed:border-violet data-pressed:bg-[#FBFAFF] data-pressed:text-foreground aria-pressed:border-violet aria-pressed:bg-[#FBFAFF] aria-pressed:text-foreground">
                {ROUTES[k].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="self-start rounded-xl bg-background p-5" aria-live="polite">
            <p className="mb-2 text-sm font-semibold tracking-[0.08em] text-muted-foreground uppercase">Who to contact</p>
            <p className="mb-2 text-[26px] leading-tight font-semibold text-foreground">{r.who}</p>
            <p className="text-base text-muted-foreground">{r.why}</p>
            {"email" in r && (
              <Button className="mt-3" render={<a href={`mailto:${r.email}`} />} nativeButton={false}>
                Email {r.email}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Section>
  )
}

export function Feedback() {
  return (
    <Section id="feedback" aria-labelledby="feedback-title">
      <div className="relative overflow-hidden rounded-[32px] bg-black p-8 text-center text-on-dark-2 md:p-16">
        <div className="band-glow pointer-events-none absolute inset-x-[-10%] top-[-30%] h-[80%]" aria-hidden="true" />
        <div className="relative">
          <p className="kicker mb-3 text-cyan">After a week of use</p>
          <h2 className="h-section mb-4 text-white" id="feedback-title">
            Tell us what's <span className="grad">working</span>.
          </h2>
          <p className="mx-auto mb-5 max-w-[58ch] text-lg">The short form (about 5 minutes) asks what you ran in Cowork, what worked, what was frustrating, and what would make you use it more. Your answers shape what we build for the next group of assistants.</p>
          <Button size="xl" variant="light" render={<a href="https://forms.gle/1sHmHWHQ7BpeKaUN7" target="_blank" rel="noopener" />} nativeButton={false}>
            Open the feedback form
          </Button>
          <div className="mx-auto mt-6 max-w-[520px] rounded-2xl bg-white/10 p-1 text-left text-white [&_label]:text-white">
            <Check k="fb-0">I sent feedback on the office (earns the Voice heard badge).</Check>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function Footer() {
  return (
    <footer className="border-t py-8 pb-12 text-[15px] text-muted-foreground">
      <div className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 px-5 md:px-10">
        <p>Claude Cowork onboarding for Magic assistants · v4, September 2026</p>
        <p>
          Questions? <a href={`mailto:${PRODUCT_EMAIL}`}>{PRODUCT_EMAIL}</a> · <a href="/claude-design.html">Claude Design guide</a> ·{" "}
          <Button
            variant="link"
            className="h-auto p-0 text-[15px] font-normal text-violet"
            onClick={() => {
              if (confirm("Reset your onboarding progress in this browser?")) {
                resetProgress()
                resetGame()
                location.reload()
              }
            }}
          >
            Reset my progress
          </Button>
        </p>
      </div>
    </footer>
  )
}
