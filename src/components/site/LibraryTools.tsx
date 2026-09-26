import * as React from "react"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ACCESS_LABEL, CONNECTORS, SKILL_DEMOS, type Access } from "@/lib/data"
import { CopyPrompt, Ext, GifPlay, Note, Section, Sub, YouTube } from "./shared"

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-secondary px-1.5 py-0.5 text-[0.85em] text-secondary-foreground">{children}</code>
}

/* ---------- Skills ---------- */

const SKILLS = [
  { name: "Email Management", cmd: "/email-management", desc: "Triage your inbox, summarize threads, draft replies and follow-ups, flag urgent items, and match client tone." },
  { name: "Calendar Management", cmd: "/calendar-management", desc: "Pull availability, summarize the week ahead, schedule across time zones, set recurring blocks, and flag conflicts." },
  { name: "Writing", cmd: "/writing", desc: "Long-form drafts, memos, briefings, and formatted documents in your voice and context." },
]

export function Skills() {
  const [demo, setDemo] = React.useState(SKILL_DEMOS[0])
  return (
    <Section id="skills" className="tint border-t" aria-labelledby="skills-title">
      <h2 className="h-section mb-4" id="skills-title">
        Skills: reusable task <span className="grad">templates</span>.
      </h2>
      <p className="lede mb-7">
        Instead of prompting from scratch, call a skill and Claude loads the right approach. Type <Code>/skill-name</Code>, or describe your task in plain English and Claude spots when a skill applies. Always check for a skill before you start from scratch.
      </p>

      <Card>
        <CardContent className="flex flex-col">
          {SKILLS.map((s) => (
            <div key={s.cmd} className="grid gap-1 border-b py-4 text-base text-muted-foreground last:border-0 sm:grid-cols-[300px_1fr] sm:gap-5">
              <p className="flex flex-col items-start gap-1.5 font-semibold text-foreground">
                {s.name}
                <Code>{s.cmd}</Code>
              </p>
              <p>{s.desc}</p>
            </div>
          ))}
          <p className="pt-3 text-[15px] text-muted-foreground">More Magic skills are coming soon.</p>
        </CardContent>
      </Card>

      <h3 className="h-sub mt-12 mb-4 md:mt-20">See Magic skills at work.</h3>
      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[demo.key]}
        onValueChange={(v) => {
          const next = SKILL_DEMOS.find((d) => d.key === (v as string[])[0])
          if (next) setDemo(next)
        }}
        aria-label="Skill demos"
      >
        {SKILL_DEMOS.map((d) => (
          <ToggleGroupItem key={d.key} value={d.key}>
            {d.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <YouTube key={demo.yt} id={demo.yt} title={demo.title} className="mt-3.5" />

      <Collapsible className="mt-6 rounded-xl border bg-card/70">
        <CollapsibleTrigger render={<Button variant="ghost" size="lg" className="w-full justify-start" />}>
          <ChevronDownIcon data-icon="inline-start" />
          More videos about skills
        </CollapsibleTrigger>
        <CollapsibleContent className="grid items-start gap-5 px-4 pb-4 sm:grid-cols-[.7fr_1.3fr]">
          <div>
            <YouTube id="hRDoLqdfE7A" title="How skills change your workflow" tall />
            <p className="mt-2.5 text-[15px] text-muted-foreground">How skills change your workflow.</p>
          </div>
          <div>
            <YouTube id="bjdBVZa66oU" title="What are skills?" />
            <p className="mt-2.5 text-[15px] text-muted-foreground">A deeper look at Claude skills.</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Note variant="warning">Don't see Magic skills? Message your Account Lead or email the Product Team. It's usually a permissions issue.</Note>
    </Section>
  )
}

/* ---------- Connectors ---------- */

const ACCESS_BADGE: Record<Access, "success" | "secondary" | "warning"> = { rw: "success", interactive: "secondary", ro: "warning" }

export function Connectors() {
  const [filter, setFilter] = React.useState<"all" | Access>("all")
  const counts = { all: CONNECTORS.length, rw: 0, interactive: 0, ro: 0 }
  CONNECTORS.forEach((c) => counts[c.access]++)
  const shown = CONNECTORS.filter((c) => filter === "all" || c.access === filter)

  return (
    <Section id="connectors" className="border-t" aria-labelledby="connectors-title">
      <h2 className="h-section mb-4" id="connectors-title">
        Connectors: Claude inside your <span className="grad">apps</span>.
      </h2>
      <p className="lede mb-7">Connectors let Claude read data and take actions in your tools for you, with no copy-pasting between apps. Once connected, they're available in every conversation.</p>

      <Card className="mb-7">
        <CardContent className="grid gap-4">
          <div>
            <Sub className="mt-0">Where to set permissions</Sub>
            <p className="text-[17px] text-muted-foreground">
              <b className="font-semibold text-foreground">Customize</b> <span className="mx-1">›</span> <b className="font-semibold text-foreground">Connectors</b> <span className="mx-1">›</span> pick a connector <span className="mx-1">›</span> <b className="font-semibold text-foreground">Tool permissions</b>
            </p>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-3">
            {[
              ["Always allow", "Claude uses the tool without asking.", "border-success"],
              ["Needs approval", "Claude pauses for your OK each time.", "border-violet-mid"],
              ["Blocked", "Claude can't use the tool at all.", "border-muted-foreground"],
            ].map(([t, d, b]) => (
              <li key={t} className={cn("flex flex-col gap-0.5 rounded-lg border-t-[3px] bg-background p-3.5 text-[15px] leading-snug text-muted-foreground", b)}>
                <strong className="text-base">{t}</strong>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <ToggleGroup
        variant="outline"
        value={[filter]}
        onValueChange={(v) => {
          const next = (v as string[])[0]
          if (next) setFilter(next as "all" | Access)
        }}
        aria-label="Filter connectors"
        className="mb-4 flex-wrap"
      >
        {(["all", "rw", "interactive", "ro"] as const).map((k) => (
          <ToggleGroupItem key={k} value={k}>
            {k === "all" ? "All" : ACCESS_LABEL[k]}
            <span className="text-muted-foreground">{counts[k]}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Accordion multiple className="gap-3">
        {shown.map((c) => (
          <AccordionItem key={c.name} value={c.name} className="rounded-xl border-0 bg-card px-4 shadow-card-sm">
            <AccordionTrigger className="items-center gap-3.5 py-3.5 text-base hover:no-underline">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-card ring-1 ring-border">
                <img src={c.logo} alt="" width={26} height={26} loading="lazy" className="size-6.5 object-contain" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="text-[17px] font-semibold text-foreground">{c.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {c.cat} · {c.can.length} can, {c.cant.length} can’t
                </span>
              </span>
              <Badge variant={ACCESS_BADGE[c.access]} className="mr-2">
                {ACCESS_LABEL[c.access]}
              </Badge>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3.5 text-[15px] leading-snug sm:grid-cols-2">
              {c.note && <p className="rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning sm:col-span-2">{c.note}</p>}
              <div>
                <h4 className="mb-1.5 text-sm font-semibold tracking-[0.06em] text-success uppercase">Can do</h4>
                <ul className="flex list-disc flex-col gap-1 pl-4.5 text-muted-foreground">
                  {c.can.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="mb-1.5 text-sm font-semibold tracking-[0.06em] text-muted-foreground uppercase">Can’t do</h4>
                <ul className="flex list-disc flex-col gap-1 pl-4.5 text-muted-foreground">
                  {c.cant.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Note>Skills that depend on a missing connector won't run until you add it. Claude will tell you if a connector isn't set up.</Note>

      <GifPlay
        className="mt-8"
        src="/assets/media/connectors-browse.webp"
        poster="/assets/media/connectors-browse-poster.webp"
        alt="Browsing the Claude connectors directory"
        width={1000}
        height={446}
      />
      <p className="mt-3 text-center text-base text-muted-foreground">
        Browse hundreds more in the <Ext href="https://claude.com/connectors">Claude connectors directory</Ext>.
      </p>

      <Collapsible className="mt-6 rounded-xl border bg-card/70">
        <CollapsibleTrigger render={<Button variant="ghost" size="lg" className="w-full justify-start" />}>
          <ChevronDownIcon data-icon="inline-start" />
          Videos about connectors
        </CollapsibleTrigger>
        <CollapsibleContent className="grid items-start gap-5 px-4 pb-4 sm:grid-cols-[.7fr_1.3fr]">
          <div>
            <YouTube id="lUF_bjBSgXM" title="How connectors power your workflow" tall />
            <p className="mt-2.5 text-[15px] text-muted-foreground">How connectors power your workflow.</p>
          </div>
          <div>
            <YouTube id="_jjSS0qGFbI" title="Getting started with connectors in Claude" />
            <p className="mt-2.5 text-[15px] text-muted-foreground">Getting started with connectors.</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Section>
  )
}

/* ---------- Scheduled tasks ---------- */

export function Scheduled() {
  return (
    <Section id="scheduled" className="tint border-t" aria-labelledby="scheduled-title">
      <h2 className="h-section mb-4" id="scheduled-title">
        Scheduled tasks run <span className="grad">themselves</span>.
      </h2>
      <p className="lede mb-7">
        Type <Code>/schedule</Code> in Cowork. Claude asks what, when, and how often, and confirms before creating anything. Define it once and it takes it from there.
      </p>
      <div className="flex flex-col gap-2.5">
        <CopyPrompt text="Every weekday morning at 8am, check my inbox and save a summary of unread client emails to my folder." />
        <CopyPrompt text="Every Friday at 4pm, pull my completed tasks for the week and create a short summary for my AL." />
        <CopyPrompt text="Every Monday, check my client's calendar for the week and flag any conflicts or gaps in scheduling." />
      </div>
      <Note variant="warning">
        Scheduled tasks run while you're not watching. Start with low-risk tasks and don't schedule messages, purchases, or hard-to-undo actions. See <a href="#safety">safety</a>.
      </Note>
    </Section>
  )
}
