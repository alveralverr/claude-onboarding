import * as React from "react"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LIBRARY, TOUR } from "@/lib/data"
import { stopVoiceover } from "@/lib/voiceover"
import { InViewVideo, Note, Section, Sub, Ticks, Voiceover, YouTube } from "./shared"

export function LibraryIndex() {
  return (
    <Section id="library" wide className="border-t pb-6 md:pb-8" aria-labelledby="library-title">
      <h2 className="h-section mb-4" id="library-title">
        The <span className="grad">library</span>.
      </h2>
      <p className="lede mb-7">Everything else, open any time. Come back whenever you need a refresher.</p>
      <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Library">
        {LIBRARY.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="flex flex-col gap-1 rounded-xl border-1.5 border-transparent bg-card p-5 text-foreground no-underline shadow-card-sm transition-[transform,border-color] hover:-translate-y-0.5 hover:border-violet/30"
          >
            <strong className="text-lg">{l.title}</strong>
            <span className="text-[15px] leading-snug text-muted-foreground">{l.desc}</span>
          </a>
        ))}
      </nav>
    </Section>
  )
}

function Tour() {
  const [screen, setScreen] = React.useState<"home" | "task">("home")
  const [pin, setPin] = React.useState<number | null>(null)
  const t = TOUR[screen]
  const item = t.items.find((i) => i.n === pin) ?? null
  return (
    <div className="mt-4">
      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[screen]}
        onValueChange={(v) => {
          const next = (v as string[])[0]
          if (next) {
            setScreen(next as "home" | "task")
            setPin(null)
            stopVoiceover()
          }
        }}
        aria-label="Screens"
        className="mb-3.5"
      >
        <ToggleGroupItem value="home">Home screen</ToggleGroupItem>
        <ToggleGroupItem value="task">Inside a task</ToggleGroupItem>
      </ToggleGroup>

      <div className="relative overflow-hidden rounded-xl bg-card shadow-card">
        <img src={t.img} alt={t.alt} width={t.w} height={t.h} loading="lazy" className="w-full" />
        {t.items.map((i) => (
          <Button
            key={i.n}
            type="button"
            size="icon-xs"
            variant={pin === i.n ? "default" : "violet"}
            className="absolute size-6 -translate-x-1/2 -translate-y-1/2 border-2 border-white text-[11px] font-bold shadow-btn sm:size-7.5 sm:text-xs"
            style={{ left: `${i.left}%`, top: `${i.top}%` }}
            aria-pressed={pin === i.n}
            aria-label={`Label ${i.n}: ${i.title}`}
            onClick={() => setPin(i.n)}
          >
            {i.n}
          </Button>
        ))}
      </div>

      <Card size="sm" className="mt-3 min-h-16" aria-live="polite">
        <CardContent className="text-base">
          {item ? (
            <p>
              <strong className="text-violet">{item.n}. {item.title}.</strong> {item.desc}
            </p>
          ) : (
            <p className="text-muted-foreground">Tap a number on the screenshot.</p>
          )}
        </CardContent>
      </Card>

      <Collapsible className="mt-4 rounded-xl border bg-card/70">
        <CollapsibleTrigger render={<Button variant="ghost" size="lg" className="w-full justify-start" />}>
          <ChevronDownIcon data-icon="inline-start" />
          All {t.items.length} labels
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-base leading-snug text-muted-foreground">
            {t.items.map((i) => (
              <li key={i.n} className={cn(pin === i.n && "text-foreground")}>
                <strong>{i.title}.</strong> {i.desc}
              </li>
            ))}
          </ol>
        </CollapsibleContent>
      </Collapsible>
      <div className="mt-3">
        <Voiceover src={t.voice} label={screen === "home" ? "Listen to the home screen tour" : "Listen to the task tour"} />
      </div>
    </div>
  )
}

export function Cowork() {
  return (
    <Section id="cowork" className="border-t" aria-labelledby="cowork-title">
      <h2 className="h-section mb-4" id="cowork-title">
        How Cowork <span className="grad">works</span>.
      </h2>
      <p className="lede mb-7">Cowork is the mode in Claude desktop that runs on your computer and completes work across your files, browser, and tools. As a Magic assistant, make Cowork your default mode.</p>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#F4F1EA] p-6 text-base text-[#4B463D]">
          <p className="text-[22px] font-semibold text-foreground">Chat</p>
          <p className="mb-2 italic text-[#6E6A60]">You drive every step</p>
          <p>You ask, follow up, and refine, one reply at a time. Then you assemble the output yourself.</p>
        </div>
        <div className="rounded-2xl border-2 border-claude bg-card p-6 text-base text-muted-foreground shadow-card">
          <p className="text-[22px] font-semibold text-foreground">Cowork</p>
          <p className="mb-2 italic text-claude">You delegate, it delivers</p>
          <p>You give one goal. It reads files, searches Drive, and drafts in parallel, then saves finished work to your folder.</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Sub className="mt-0">Always use Cowork when</Sub>
            <Ticks items={["You have a clear deliverable or outcome.", "The work touches your files or connected tools.", "You'd rather hand off the job and review the output.", "You're running recurring tasks on a schedule."]} />
          </div>
          <Voiceover src="/assets/voice/06 - using cowork.mp3" />
        </CardContent>
      </Card>

      <h3 className="h-sub mt-12 mb-4 md:mt-20" id="task-runs">How a task runs.</h3>
      <div className="grid items-center gap-6 md:grid-cols-[1.2fr_.8fr]">
        <ol className="relative flex flex-col text-base leading-relaxed text-muted-foreground before:absolute before:top-3.5 before:bottom-3.5 before:left-3.25 before:w-0.5 before:bg-gradient-to-b before:from-violet-mid before:to-cyan before:opacity-50">
          {[
            ["You delegate the work.", "Describe the goal: what you need done and what done looks like."],
            ["Claude understands.", "It asks clarifying questions to be sure of your goal."],
            ["Claude plans.", "It breaks the work into steps you can see in the sidebar."],
            ["Claude executes.", "It works across your files, tools, and the web."],
            ["Claude verifies.", "It checks its own output for quality and accuracy."],
            ["You come back to finished work.", "Files in your folder, actions taken in your tools, and a summary of what happened."],
          ].map(([t, d], i, arr) => (
            <li key={t} className="relative pb-3.5 pl-11">
              <span
                className={cn(
                  "absolute top-0 left-0 flex size-7 items-center justify-center rounded-full border-2 border-violet-mid bg-card text-[13px] font-semibold text-violet",
                  i === arr.length - 1 && "border-success bg-success text-white"
                )}
                aria-hidden="true"
              >
                {i === arr.length - 1 ? "✓" : i + 1}
              </span>
              <strong>{t}</strong> {d}
            </li>
          ))}
        </ol>
        <figure className="m-0 flex flex-col gap-3">
          <img src="/assets/media/claude-task-runs.webp" alt="A Cowork task showing its step-by-step progress" width={728} height={554} loading="lazy" className="rounded-xl shadow-card" />
          <Voiceover src="/assets/voice/07 - how a task runs.mp3" className="self-start" />
        </figure>
      </div>
      <Note>Every action shows in the sidebar. Claude pauses and asks for your approval before doing anything consequential in your working folder.</Note>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <figure className="m-0">
          <InViewVideo src="/assets/claude-usecase-3.mp4" label="Data extraction demo" />
          <figcaption className="mt-2.5 text-[15px] leading-snug text-muted-foreground">Hand Claude a pile of receipts, invoices, or screenshots. Come back to a formatted spreadsheet with the data extracted and organized.</figcaption>
        </figure>
        <figure className="m-0">
          <InViewVideo src="/assets/claude-usecase-4.mp4" label="Document generation demo" />
          <figcaption className="mt-2.5 text-[15px] leading-snug text-muted-foreground">Give Claude your templates and source material. It produces polished docs, decks, or reports, and can run on a schedule to keep them current.</figcaption>
        </figure>
      </div>

      <h3 className="h-sub mt-12 mb-2 md:mt-20" id="tour">The desktop app, labelled.</h3>
      <p className="text-[17px] text-muted-foreground">Tap a number to see what each part does, or open the full list below the screenshot.</p>
      <Tour />

      <h3 className="h-sub mt-12 mb-2 md:mt-20" id="context-window">Claude's working memory has a limit.</h3>
      <p className="text-[17px] text-muted-foreground">Every session holds a fixed amount of input, called the context window. When it fills, older context drops off and quality slips.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["What it is", "Everything Claude can see in a session: your prompts, its replies, attached files, and tool calls. It has a fixed size and doesn't grow mid-session."],
          ["When it fills", "Claude loses sight of earlier instructions. Replies get shorter, repeat themselves, or miss details you already gave."],
          ["How to manage it", "Start a fresh session for each new task. Don't chain unrelated work in one conversation. Paste a short summary if context needs to carry over."],
        ].map(([t, d], i) => (
          <Card key={t} size="sm" className={cn(i === 2 && "bg-gradient-to-br from-card to-secondary")}>
            <CardHeader>
              <CardTitle className="text-sm tracking-[0.08em] text-muted-foreground uppercase">{t}</CardTitle>
            </CardHeader>
            <CardContent className="text-base leading-relaxed text-card-foreground">{d}</CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-3">
        <Voiceover src="/assets/voice/08 - context window.mp3" />
      </div>

      <Collapsible className="mt-6 rounded-xl border bg-card/70">
        <CollapsibleTrigger render={<Button variant="ghost" size="lg" className="w-full justify-start" />}>
          <ChevronDownIcon data-icon="inline-start" />
          Watch: Cowork is now generally available
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <YouTube id="-AkiUPvAqbU" title="Cowork is now generally available" />
        </CollapsibleContent>
      </Collapsible>
    </Section>
  )
}
