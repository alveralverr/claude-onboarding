import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { InViewVideo, Note, Section, Sub, Ticks, Voiceover, YouTube } from "./shared"

export function Cowork() {
  return (
    <Section id="cowork" className="border-t" aria-labelledby="cowork-title">
      <h2 className="h-section mb-4" id="cowork-title">
        How Cowork <span className="grad">works</span>.
      </h2>
      <p className="lede mb-7">Cowork is the mode in Claude desktop that runs on your computer and completes work across your files, browser, and tools. As a Magic assistant, make Cowork your default mode. Anthropic is folding Cowork into the main Claude interface; when your seat gets it, Claude will decide for itself whether to answer or run a task.</p>

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


      <div className="mt-8 rounded-2xl border-2 border-white bg-card p-5 text-base shadow-card-sm">
        <p className="mb-1 font-semibold">New since September 2026</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-muted-foreground">
          <li><strong className="text-foreground">Claude Docs and Claude Slides</strong> build the document or deck inside the conversation; export to Word, PDF, PowerPoint or Google Docs. <strong className="text-foreground">Claude Design</strong> mocks up pages in a chat.</li>
          <li><strong className="text-foreground">Manual or Automatic.</strong> Manual asks before each action; keep it while you learn. Automatic is for routine tasks you have already reviewed.</li>
          <li><strong className="text-foreground">Projects</strong> now run parallel threads with shared memory, so a new thread in the same project isn't starting from zero.</li>
          <li>Pro and Max got these first; Team seats follow. Practise the document side in <a href="#/room/studio">the Studio</a>.</li>
        </ul>
      </div>

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
