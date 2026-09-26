import * as React from "react"
import { cn } from "cn"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import { FIRST_TASK_KEY, QUIZ, SETUP_PANELS } from "@/lib/data"
import { firstIncompletePanel, getStatus, isPanelComplete, passSafety, setChecked, useProgress, useStatus } from "@/lib/progress"
import { CopyPrompt, Ext, Note, Section, StepNo, Sub, Ticks, Voiceover, YouTube } from "./shared"

/* ---------- Checklist item bound to the progress store ---------- */

function Check({ k, children, big }: { k: string; children: React.ReactNode; big?: boolean }) {
  const s = useProgress()
  const checked = !!s.checkboxes[k]
  const id = `cb-${k}`
  return (
    <Field orientation="horizontal" className="rounded-lg px-3 py-2.5 hover:bg-background">
      <Checkbox id={id} checked={checked} onCheckedChange={(c) => setChecked(k, c)} className={cn("size-6 rounded-lg", big && "size-7")} />
      <FieldLabel htmlFor={id} className={cn("font-normal leading-snug", big ? "text-lg font-medium" : "text-[17px]", checked && "text-muted-foreground")}>
        <span>{children}</span>
      </FieldLabel>
    </Field>
  )
}

function Checks({ children }: { children: React.ReactNode }) {
  return <FieldGroup className="my-2 gap-1">{children}</FieldGroup>
}

function Shot({ src, alt, w, h, className }: { src: string; alt: string; w: number; h: number; className?: string }) {
  return <img src={src} alt={alt} width={w} height={h} loading="lazy" className={cn("my-3 rounded-lg border", className)} />
}

function More({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Collapsible className="mt-6 rounded-xl border bg-card/70">
      <CollapsibleTrigger render={<Button variant="ghost" size="lg" className="w-full justify-start" />}>
        <ChevronDownIcon data-icon="inline-start" />
        {label}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">{children}</CollapsibleContent>
    </Collapsible>
  )
}

/* ---------- Step 1: Setup ---------- */

export function Setup() {
  const s = useProgress()
  const [tab, setTab] = React.useState<string>(() => SETUP_PANELS[firstIncompletePanel(s)].id)
  const idx = SETUP_PANELS.findIndex((p) => p.id === tab)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const prevComplete = React.useRef(SETUP_PANELS.map((p) => isPanelComplete(s, p.keys)))

  // "Continue setup" links land on the first unfinished tab.
  React.useEffect(() => {
    const onHash = () => {
      if (location.hash === "#setup") setTab(SETUP_PANELS[firstIncompletePanel(s)].id)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [s])

  // Announce a panel finishing.
  React.useEffect(() => {
    SETUP_PANELS.forEach((p, i) => {
      const done = isPanelComplete(s, p.keys)
      if (done && !prevComplete.current[i]) {
        const next = SETUP_PANELS[i + 1]
        if (next) toast.add({ title: `${p.label} done.`, description: `Next: ${next.label}.`, type: "success" })
        else if (getStatus(s).setup) toast.add({ title: "Setup complete.", description: "Now run your first real task.", type: "success" })
      }
      prevComplete.current[i] = done
    })
  }, [s])

  const go = (i: number) => {
    setTab(SETUP_PANELS[Math.max(0, Math.min(SETUP_PANELS.length - 1, i))].id)
    rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" })
  }

  return (
    <Section id="setup" className="border-t" aria-labelledby="setup-title">
      <span id="need" className="relative -top-28 block" aria-hidden="true" />
      <StepNo n={1} time="20 minutes" />
      <h2 className="h-section mb-4" id="setup-title">
        Set up <span className="grad">Cowork</span>.
      </h2>
      <p className="lede mb-7">Work through the tabs and tick each item as you go. Your progress saves in this browser.</p>

      <div ref={rootRef} className="scroll-mt-24">
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
          <TabsList variant="line" className="h-auto max-w-full flex-wrap justify-start gap-2 p-0 group-data-horizontal/tabs:h-auto" aria-label="Setup steps">
            {SETUP_PANELS.map((p, i) => {
              const done = isPanelComplete(s, p.keys)
              return (
                <TabsTrigger key={p.id} value={p.id} className="h-11 flex-none rounded-full border-border bg-card px-4 text-base data-active:border-violet data-active:shadow-card-sm">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full bg-background text-xs font-semibold text-violet",
                      done && "bg-success text-white"
                    )}
                    aria-hidden="true"
                  >
                    {done ? <CheckIcon className="size-3.5" /> : i + 1}
                  </span>
                  {p.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Panel 0 */}
          <TabsContent value="s0">
            <Panel title="Before you start." time="~2 min">
              <Checks>
                <Check k="need-2">Google Chrome.</Check>
                <Check k="need-0"><strong>magicassistant.ai</strong> webmail. Your Account Lead sends you the login details.</Check>
                <Check k="need-5">Your <strong>Claude.ai</strong> invite. You'll find the link inside your webmail inbox.</Check>
                <Check k="need-4"><strong>macOS 11 (Big Sur)</strong> or later, or <strong>Windows 10</strong> or later.</Check>
                <Check k="need-1"><strong>Claude desktop</strong> installed from <Ext href="https://claude.com/download">claude.com/download</Ext>.</Check>
                <Check k="need-3">Your webmail account signed in to Claude desktop.</Check>
              </Checks>
              <Voiceover src="/assets/voice/03- requirements.mp3" label="Listen to the requirements" />
              <More label="Prefer video? Watch the setup walkthroughs">
                <video src="/assets/setup-guide.mp4" controls playsInline preload="none" className="aspect-video w-full rounded-xl bg-black" />
                <p className="mt-2 mb-4 text-sm text-muted-foreground">This demo will be updated soon. Getting the Claude invite link from your magicassistant.ai webmail is the correct, current process.</p>
                <YouTube id="Lbml7IuGJYw" title="Getting started with Claude Cowork" />
              </More>
            </Panel>
          </TabsContent>

          {/* Panel 1 */}
          <TabsContent value="s1">
            <Panel title="Accept your invite." time="~3 min">
              <Checks>
                <Check k="s1-0">Get your webmail login from your Account Lead.</Check>
                <Check k="s1-1">Go to <Ext href="http://magicassistant.ai/webmail">magicassistant.ai/webmail</Ext> and sign in with your new webmail username and password.</Check>
                <Check k="s1-2">Open your inbox and find the Claude invite email.</Check>
                <Check k="s1-3">Click <strong>Accept invite</strong> and follow the steps.</Check>
                <Check k="s1-4">Check that you can see the Claude home page.</Check>
              </Checks>
              <Shot src="/assets/media/webmail-login.webp" alt="The magicassistant.ai webmail sign-in page" w={1400} h={871} />
              <Shot src="/assets/media/webmail-claude-invite.webp" alt="The Claude invite email in the webmail inbox" w={1400} h={879} />
              <Note variant="warning">
                <strong>Heads up.</strong> The invite can expire without notice. If that happens, email <a href="mailto:product-team@getmagicea.com">product-team@getmagicea.com</a>.
              </Note>
            </Panel>
          </TabsContent>

          {/* Panel 2 */}
          <TabsContent value="s2">
            <Panel title="Install the desktop app and open Cowork." time="~8 min">
              <p>The desktop app unlocks <strong>Cowork</strong>: Claude working with your files and running tasks, not just answering questions.</p>
              <Sub>Install</Sub>
              <Checks>
                <Check k="s2-0">Go to <Ext href="https://claude.com/download">claude.com/download</Ext>, or follow the link on your first sign-in.</Check>
                <Check k="s2-1">Download the version for Mac or Windows.</Check>
                <Check k="s2-2">Open the installer and follow the steps.</Check>
                <Check k="s2-3">Sign in with the <strong>same account</strong> you used to accept the invite.</Check>
              </Checks>
              <Shot src="/assets/media/cowork-homescreen.webp" alt="The Cowork home screen in the Claude desktop app" w={1600} h={1098} />
              <Sub>Start Cowork</Sub>
              <Checks>
                <Check k="s2-4">When the app opens, switch to <strong>Cowork</strong> in the mode picker in the left sidebar.</Check>
                <Check k="s2-5">In your first Cowork session, type <code className="rounded-md bg-secondary px-1.5 py-0.5 text-sm text-secondary-foreground">/setup-cowork</code> and press Enter to run the guided setup.</Check>
              </Checks>
              <Shot src="/assets/media/setup-cowork.webp" alt="Typing /setup-cowork in a new Cowork session" w={900} h={266} className="mx-auto max-w-[520px]" />
              <Sub>Pick your project folder</Sub>
              <Checks>
                <Check k="s2-6">Select <strong>Work in a project</strong> in the chat bar. This is where Claude reads context from and saves finished work.</Check>
                <Check k="s2-7">Choose an existing folder or create a new project. Use a dedicated folder such as <em>Magic Work</em> or <em>Claude Tasks</em>, not your Desktop or Downloads.</Check>
              </Checks>
              <div className="my-3 grid gap-3 text-base sm:grid-cols-2">
                <div className="rounded-xl bg-background p-4">
                  <p className="mb-1 font-semibold text-claude">A folder</p>
                  <p>A folder on your computer. Cowork reads what's there and saves new files alongside it. Scope it to one piece of work, or use a broader folder that several tasks share.</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="mb-1 font-semibold text-claude">A project</p>
                  <p>A workspace with its own files, instructions, and memory across sessions. Create one in Cowork's sidebar, or import a project you already use in Chat.</p>
                </div>
              </div>
              <Shot src="/assets/media/project-folder.webp" alt="The Work in a project folder picker" w={452} h={321} className="mx-auto max-w-[340px]" />
              <Note>
                <strong>Keep the desktop app open while you work.</strong> Cowork only runs in the desktop app, not the browser. The folder you pick is Claude's workspace: it can read, write, and delete files there.
              </Note>
              <p className="mt-4 text-base text-muted-foreground">
                New to the app? Take the <a href="#tour">labelled tour of the interface</a>.
              </p>
            </Panel>
          </TabsContent>

          {/* Panel 3 */}
          <TabsContent value="s3">
            <Panel title="Connect your apps." time="~6 min">
              <p>Claude connects to the apps your client already uses, such as Google Workspace, Microsoft 365, Notion, Slack, Canva, and Asana. That's where Cowork's real power comes from.</p>
              <Checks>
                <Check k="s3-0">In the desktop app, click <strong>Customize</strong> in the left sidebar.</Check>
                <Check k="s3-1">Go to <strong>Connectors</strong> and click <strong>Add connector</strong> (the plus sign).</Check>
                <Shot src="/assets/media/connectors-1.webp" alt="The Connectors panel in Customize" w={1400} h={821} className="sm:ml-12" />
                <Check k="s3-2">Find the <strong>Google Workspace</strong> apps and add them.</Check>
                <Shot src="/assets/media/connectors-2.webp" alt="Adding Google Workspace connectors" w={1384} h={880} className="sm:ml-12" />
                <Check k="s3-3">The app now appears in your Connectors list under <strong>Not connected</strong>.</Check>
                <Check k="s3-4">Click <strong>Connect</strong> and sign in with your Google account to allow access.</Check>
                <Shot src="/assets/media/connectors-4.webp" alt="Signing in with a Google account" w={1400} h={744} className="sm:ml-12" />
                <Check k="s3-5">Repeat for <strong>Gmail</strong>, <strong>Google Calendar</strong>, <strong>Google Drive</strong>, or other apps.</Check>
                <Shot src="/assets/media/connectors-5.webp" alt="A connected app in the Connectors list" w={1400} h={823} className="sm:ml-12" />
              </Checks>
              <Sub>Test it</Sub>
              <p className="mb-3">If your calendar is connected, open a new Cowork session and type:</p>
              <CopyPrompt text="What meetings do I have tomorrow?" />
              <p className="mt-3">If Claude lists your events, you're connected. If it says it has no access, go back to Connectors and check.</p>
              <Note variant="warning">
                <strong>Connect your own Google account only.</strong> Never connect a client's email or calendar without their explicit permission.
              </Note>
            </Panel>
          </TabsContent>

          {/* Panel 4 */}
          <TabsContent value="s4">
            <Panel title="Add your Magic skill templates." time="~4 min">
              <p>Magic built skill templates for the most common EA tasks. Always start from a template when one fits.</p>
              <div className="my-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="h-7 px-3 text-sm">Email Management</Badge>
                <Badge variant="secondary" className="h-7 px-3 text-sm">Calendar Management</Badge>
                <Badge variant="secondary" className="h-7 px-3 text-sm">Writing</Badge>
                <Badge variant="outline" className="h-7 border-dashed px-3 text-sm">More coming soon</Badge>
              </div>
              <Checks>
                <Check k="s4-0">In the desktop app, click <strong>Customize</strong> in the left sidebar.</Check>
                <Check k="s4-1">Go to <strong>Skills</strong>, click <strong>Add skill</strong> (the plus sign), then <strong>Browse skills</strong>.</Check>
                <Shot src="/assets/media/skills-1.webp" alt="Browse skills in Customize" w={1400} h={821} className="sm:ml-12" />
                <Check k="s4-2">Open the <strong>Your organization</strong> tab and add the skills available to you.</Check>
                <Shot src="/assets/media/skills-2.webp" alt="Adding a skill from Your organization" w={1400} h={827} className="sm:ml-12" />
                <Check k="s4-3">Check that the skill now shows in your <strong>skills list</strong>.</Check>
                <Shot src="/assets/media/skills-3.webp" alt="The skills list with a Magic skill added" w={1391} h={881} className="sm:ml-12" />
              </Checks>
              <p>
                Use a skill by typing its slash command, such as <code className="rounded-md bg-secondary px-1.5 py-0.5 text-sm text-secondary-foreground">/email-management</code> or <code className="rounded-md bg-secondary px-1.5 py-0.5 text-sm text-secondary-foreground">/calendar-management</code>, then add your own request. When the task is clear, Claude often picks the right skill by itself. You can also ask Claude what a skill does.
              </p>
              <Note variant="warning">Don't see any skills? Message your Account Lead or email the Product Team. It's usually a permissions issue on your account.</Note>
            </Panel>
          </TabsContent>
        </Tabs>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button variant="outline" size="lg" disabled={idx === 0} onClick={() => go(idx - 1)}>
            Previous
          </Button>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {idx + 1} of {SETUP_PANELS.length}
          </p>
          {idx === SETUP_PANELS.length - 1 ? (
            <Button size="lg" render={<a href="#first-task" />} nativeButton={false}>
              Next: first task
            </Button>
          ) : (
            <Button size="lg" onClick={() => go(idx + 1)}>
              Next
            </Button>
          )}
        </div>
      </div>
    </Section>
  )
}

function Panel({ title, time, children }: { title: string; time: string; children: React.ReactNode }) {
  return (
    <Card className="mt-3 text-[17px]">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-[clamp(22px,2.3vw,28px)] leading-tight font-semibold tracking-[-0.01em] text-balance">{title}</CardTitle>
        <Badge variant="secondary" className="h-6 px-2.5 text-sm">
          {time}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col text-card-foreground">{children}</CardContent>
    </Card>
  )
}

/* ---------- Step 2: First task ---------- */

const FIRST_PROMPTS = [
  "Go through my inbox, find unread client emails from the last 24 hours, and draft a reply for each one that needs a response. Save the drafts to my Magic Work folder.",
  "Check my Google Calendar for next week and write a summary of my client's availability. Save it as availability.md in my folder.",
  "Research [company name]: their industry, recent news, and key people. Write a one-page briefing and save it to my folder.",
  "Summarize these meeting notes and pull out every action item with the owner and deadline.",
]

export function FirstTask() {
  const s = useProgress()
  const done = !!s.checkboxes[FIRST_TASK_KEY]
  const wasDone = React.useRef(done)
  React.useEffect(() => {
    // Toast only when it flips to done, not on load.
    if (done && !wasDone.current) toast.add({ title: "First task done.", description: "One step left: the safety check.", type: "success" })
    wasDone.current = done
  }, [done])
  return (
    <Section id="first-task" className="tint border-t" aria-labelledby="first-title">
      <StepNo n={2} time="10 minutes" />
      <h2 className="h-section mb-4" id="first-title">
        Run your first <span className="grad">real</span> task.
      </h2>
      <p className="lede mb-7">Open a new Cowork session and pick something real from your to-do list, ideally a task that spans a few tools or steps.</p>

      <div className="grid items-start gap-7 md:grid-cols-[.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>How to run it</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex list-none flex-col gap-3.5 text-[17px] leading-snug [counter-reset:h]">
              {[
                <><strong>Pick the working folder</strong> to send with your prompt.</>,
                <>Write <strong>specific instructions</strong> for what you need.</>,
                <>If Claude shows a plan or asks <strong>clarifying questions</strong>, approve it if it's right. Redirect if not.</>,
                <>Watch it work, or step away and come back.</>,
                <><strong>Always review</strong> the output before anything goes to a client.</>,
                <>If it's off, <strong>add context and re-prompt</strong> until it's right.</>,
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="text-card-foreground">{item}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <div>
          <Sub className="mt-0">Try one of these</Sub>
          <p className="mb-3 text-base text-muted-foreground">Link the right folders, files, connectors, or skills first. Always ask yourself what Claude needs to know.</p>
          <div className="flex flex-col gap-2.5">
            {FIRST_PROMPTS.map((p) => (
              <CopyPrompt key={p} text={p} />
            ))}
          </div>
        </div>
      </div>

      <Card className="mt-7">
        <CardContent className="flex flex-col gap-2">
          <Check k={FIRST_TASK_KEY} big>
            I ran my first real Cowork task and reviewed the output.
          </Check>
          <p className="px-3 text-base text-muted-foreground">
            Keep practising on real work. Your first few tasks are where it clicks. <a href="#prompting">Prompting tips</a> help when an answer misses.
          </p>
        </CardContent>
      </Card>
    </Section>
  )
}

/* ---------- Step 3: Safety + check ---------- */

function Quiz() {
  const s = useProgress()
  const passed = !!s.v2.safety
  const [answers, setAnswers] = React.useState<Record<string, string>>(() =>
    passed ? Object.fromEntries(QUIZ.map((q) => [q.id, q.answer])) : {}
  )
  const [checked, setChecked] = React.useState(passed)
  const [result, setResult] = React.useState<string>(passed ? "Passed. You know the rules for safe client work." : "")
  const formRef = React.useRef<HTMLFormElement>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setChecked(true)
    const missing = QUIZ.filter((q) => !answers[q.id])
    if (missing.length) {
      setResult("Answer all five questions first.")
      formRef.current?.querySelector<HTMLElement>(`[data-q="${missing[0].id}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" })
      return
    }
    const wrong = QUIZ.filter((q) => answers[q.id] !== q.answer).length
    if (wrong) {
      setResult(`${QUIZ.length - wrong} of ${QUIZ.length} right. Check the notes above and try again.`)
      return
    }
    passSafety()
    setResult("Passed. You know the rules for safe client work.")
    const all = getStatus({ ...s, v2: { safety: true } }).all
    toast.add({ title: all ? "Path complete. You're ready for client work." : "Safety check passed.", type: "success" })
    if (all) setTimeout(() => document.getElementById("ready")?.scrollIntoView({ behavior: "smooth" }), 500)
  }

  return (
    <Card className="mt-10 rounded-[32px] border-2 border-white shadow-lift md:mt-16">
      <CardHeader>
        <CardTitle className="text-[clamp(22px,2.3vw,28px)] leading-tight font-semibold tracking-[-0.01em]">Safety check.</CardTitle>
        <CardDescription className="text-base">Five quick scenarios. Get all five right to finish your path. You can retry as often as you like.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col">
          {QUIZ.map((q, i) => {
            const picked = answers[q.id]
            const wrong = checked && !!picked && picked !== q.answer
            const right = checked && picked === q.answer
            const missing = checked && !picked
            return (
              <FieldSet key={q.id} data-q={q.id} className="border-t py-5" data-invalid={wrong || missing || undefined}>
                <FieldLegend className="flex gap-3 text-lg leading-snug">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm text-secondary-foreground" aria-hidden="true">
                    {i + 1}
                  </span>
                  {q.q}
                </FieldLegend>
                <RadioGroup
                  value={picked ?? null}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: String(v) }))}
                  disabled={passed}
                  aria-invalid={wrong || undefined}
                  className="gap-1.5 sm:ml-10"
                >
                  {q.options.map((o) => {
                    const id = `${q.id}-${o.v}`
                    const on = picked === o.v
                    return (
                      <Field
                        key={o.v}
                        orientation="horizontal"
                        data-invalid={(wrong && on) || undefined}
                        className={cn(
                          "rounded-lg border-1.5 border-transparent px-3 py-2.5 hover:bg-background",
                          on && "border-violet/30 bg-[#FBFAFF]",
                          wrong && on && "border-destructive bg-[#FFF4F2]",
                          right && on && "border-success bg-success-soft"
                        )}
                      >
                        <RadioGroupItem value={o.v} id={id} aria-invalid={(wrong && on) || undefined} className="size-5" />
                        <FieldLabel htmlFor={id} className="text-[17px] leading-snug font-normal">
                          {o.t}
                        </FieldLabel>
                      </Field>
                    )
                  })}
                </RadioGroup>
                {wrong && <FieldError className="sm:ml-10 text-base">{q.wrong}</FieldError>}
                {missing && <FieldError className="sm:ml-10 text-base">Pick an answer.</FieldError>}
                {right && passed && (
                  <FieldDescription className="sm:ml-10 text-success">
                    <CheckIcon className="mr-1 inline size-4" aria-hidden="true" />Correct
                  </FieldDescription>
                )}
              </FieldSet>
            )
          })}
          <div className="flex flex-wrap items-center gap-4 border-t pt-5">
            {!passed && (
              <Button type="submit" size="lg">
                Check my answers
              </Button>
            )}
            <p className={cn("text-[17px] font-semibold", passed ? "text-success" : "text-destructive")} aria-live="polite">
              {result}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function Safety() {
  return (
    <Section id="safety" className="border-t" aria-labelledby="safety-title">
      <StepNo n={3} time="5 minutes" />
      <h2 className="h-section mb-4" id="safety-title">
        Use Cowork <span className="grad">safely</span>.
      </h2>
      <p className="lede mb-7">Cowork works on your computer with access to your files, browser, connected services, and apps. Read this, then pass the short check before any client work.</p>

      <Card>
        <CardContent className="grid items-center gap-5 sm:grid-cols-[150px_1fr]">
          <img src="/assets/media/claude-graphic.webp" alt="" width={600} height={576} loading="lazy" className="w-30 rounded-xl sm:w-37.5" />
          <div>
            <Sub className="mt-0">To keep risk low</Sub>
            <Ticks
              items={[
                <>Don't give Claude access to local files with <strong>sensitive information</strong>, such as financial documents and passwords.</>,
                <>Be especially careful with computer use. When you allow it, Claude makes changes on your computer directly and skips <strong>permission checks</strong>.</>,
                <>Cowork may have access to Claude in Chrome. Be extremely careful with anything that takes control of your screen. Don't automate risky or irreversible actions such as <strong>logins, payments, or deletions</strong>.</>,
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <h3 className="h-sub mt-12 mb-4 md:mt-20">Six habits that protect you and your client.</h3>
      <ol className="grid gap-3 sm:grid-cols-2">
        {[
          ["Be selective about file access.", "Claude can read, write, and delete any file it can reach. Use a dedicated working folder and keep backups of anything important."],
          ["Watch the task, not every command.", "Look for surprises: files or sites you didn't mention, or scope creeping beyond your ask. If something feels off, stop the task."],
          ["Be cautious with scheduled tasks.", "They run without you watching. Start low-risk, don't schedule messages, purchases, or hard-to-undo actions, and review results often."],
          ["Be cautious with computer use.", "Avoid anything that takes over your screen, apps, or browser."],
          ["Skip unfamiliar plugins and skills.", "Stick to Anthropic-verified connectors from the desktop directory, and review permissions when you install."],
          ["Take care with Claude add-ins in other apps.", "Claude can share data across apps like Excel and PowerPoint without being told to. Avoid sensitive information while Cowork is active."],
        ].map(([t, d], i) => (
          <li key={t} className="flex gap-3 rounded-xl bg-card p-4 text-base leading-relaxed text-muted-foreground shadow-card-sm">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[image:var(--sphere)] text-sm font-semibold text-white" aria-hidden="true">
              {i + 1}
            </span>
            <span>
              <strong className="block">{t}</strong>
              {d}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-7 grid gap-4 md:grid-cols-[1.2fr_.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Magic rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3 text-base leading-relaxed text-muted-foreground">
              {[
                ["no", <><strong>Never paste passwords, API keys, or credentials</strong> into a Cowork prompt. Don't ask it to reach private data or scrape personal information, especially your client's.</>],
                ["no", <><strong>Never connect a client's email, calendar, or cloud storage</strong> without their explicit approval.</>],
                ["no", <><strong>Never impersonate someone.</strong> Ask instead: "Based on their communication style, how would they respond?"</>],
                ["no", <><strong>Don't change security settings directly.</strong> Claude will refuse.</>],
                ["no", <><strong>Don't use Claude for clients whose confidentiality clauses cover AI tools.</strong> Ask your Account Lead first.</>],
                ["warn", <><strong>Aerospace, defense, or government clients:</strong> don't connect any client accounts. Personal productivity only.</>],
                ["yes", <><strong>Always review everything</strong> before it goes to a client. Your sign-off is the last check.</>],
              ].map(([kind, node], i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white",
                      kind === "no" && "bg-destructive",
                      kind === "warn" && "bg-warning",
                      kind === "yes" && "bg-success"
                    )}
                    aria-hidden="true"
                  >
                    {kind === "no" ? "✕" : kind === "warn" ? "!" : "✓"}
                  </span>
                  <span>{node}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>You stay responsible for</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-muted-foreground marker:text-violet-mid">
              <li>Content published and messages sent.</li>
              <li>Purchases or financial transactions.</li>
              <li>Data accessed or changed.</li>
              <li>Actions taken by scheduled tasks on your behalf.</li>
              <li>Actions taken through computer use on your desktop and apps.</li>
              <li>Respecting third-party terms of service, including limits on automated access.</li>
            </ul>
            <p className="text-base text-muted-foreground">
              Anthropic has built in safety measures, but you're still responsible for how you use Claude. Report suspicious behaviour or critical issues to <a href="mailto:product-team@getmagicea.com">product-team@getmagicea.com</a>. Not sure if something is allowed? Ask your Account Lead.
            </p>
          </CardContent>
        </Card>
      </div>

      <Quiz />
    </Section>
  )
}

/* ---------- Shown only when the path is complete ---------- */

export function Ready() {
  const st = useStatus()
  if (!st.all) return null
  return (
    <Section id="ready" className="pb-0" aria-labelledby="ready-title">
      <div className="relative overflow-hidden rounded-[32px] bg-black p-8 text-center text-on-dark-2 md:p-16">
        <div className="band-glow pointer-events-none absolute inset-x-[-10%] top-[-30%] h-[80%]" aria-hidden="true" />
        <div className="relative">
          <p className="kicker mb-3 text-cyan">Path complete</p>
          <h2 className="h-section mb-4 text-white" id="ready-title">
            You're ready for <span className="grad">client</span> work.
          </h2>
          <p className="mx-auto mb-4 max-w-[58ch] text-lg">Grab your certificate, then keep this page handy. The library below answers most day-to-day questions.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="xl" variant="light" render={<a href="/certificate.html" target="_blank" rel="noopener" />} nativeButton={false}>
              Get your certificate
            </Button>
            <Button size="xl" variant="outline-light" render={<a href="#library" />} nativeButton={false}>
              Open the library
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
