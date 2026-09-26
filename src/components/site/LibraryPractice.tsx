import * as React from "react"
import { cn } from "cn"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MODELS, RESOURCES, type ModelKey } from "@/lib/data"
import { Kicker, Note, Section, Ticks } from "./shared"

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-secondary px-1.5 py-0.5 text-[0.85em] text-secondary-foreground">{children}</code>
}

/* ---------- Prompting ---------- */

const PAIRS: { cat: string; weak: string; strong: React.ReactNode; why: string; fix?: boolean }[] = [
  {
    cat: "Pre-call research",
    weak: "“Research this company before my call.”",
    strong: (
      <>
        “<em>[pastes booking email]</em> Investor call Thursday with <strong>Acme Corp</strong>, a Series B fintech. Pull their latest news and funding history from the web, use <Code>/calendar-management</Code> to check the attendees against our notes (<strong>Meeting Insights - 2026.docx</strong>) in the <strong>Clients folder</strong>, and write me a <strong>one-page prep brief</strong> using our <strong>call-prep template</strong> in that same file. Goal: open <strong>Q4</strong> project talks.”
      </>
    ),
    why: "A pasted email, where the rest lives (web, calendar, notes, template), and a clear goal. You didn't word it perfectly. You pointed Claude at everything it needed.",
  },
  {
    cat: "Follow-up email",
    weak: "“Write a follow-up email to the client about the call.”",
    strong: (
      <>
        “<em>[screenshots the thread]</em> They no-showed our Monday call. Use <Code>/calendar-management</Code> to pull two open slots from my <strong>Google Calendar</strong> next week, use <Code>/email-management</Code> to draft a warm reply offering both, and match the voice in our <strong>email guide</strong>. Under 5 sentences.”
      </>
    ),
    why: "A screenshot of the thread, two skills, and your voice guide. Show Claude the history instead of retyping it.",
  },
  {
    cat: "Inbox triage",
    weak: "“Check my inbox for anything important.”",
    strong: (
      <>
        “Use <Code>/email-management</Code> to go through my <strong>Gmail</strong> from the last 24 hours. Flag only client emails or anything urgent, cross-check each sender against the <strong>active-accounts list</strong> in our team <strong>Google Drive</strong>, and summarize each in one line with what it needs and the account it ties to. <strong>Save them all into one Word doc</strong> in <strong>/active accounts/2026-06/week 1</strong>.”
      </>
    ),
    why: "A connector, a cross-check file, and an exact output format and location. The scope (last 24 hours, client or urgent) keeps it focused.",
  },
  {
    cat: "Recurring task",
    weak: "“Summarize this weekly.”",
    strong: (
      <>
        “<strong>Every Monday before 8am Pacific</strong>, open the latest <strong>Fathom transcript</strong> of the <strong>Marketing Team Sync</strong> from my inbox. Pull every action item with its owner and due date into a table, add them to our team <strong>Notion</strong>, then notify the team in <Code>#core-marketing</Code>. Save the summary as a spreadsheet in the <strong>Core Team Archives</strong> folder for client <strong>John Doe</strong>.”
      </>
    ),
    why: "A hands-off recurring task only works because you named the exact source, destination, and people. Set the context once and it runs every week.",
  },
  {
    cat: "Client proposal",
    weak: "“Write a proposal for this client.”",
    strong: (
      <>
        “Use the <strong>proposal template</strong> in our <strong>Google Drive</strong> and the pricing in our <strong>Sales Playbook</strong> (sales folder). Draft one for <strong>Acme Corp</strong> from the discovery notes in their client sub-folder and the draft presentation they sent <em>[attached]</em>. Run it through <Code>/writing</Code> so it sounds human and on-brand, then export a clean <strong>PDF</strong>.”
      </>
    ),
    why: "A template, your pricing, the discovery notes, their deck, and the format you want out. Your files do the heavy lifting.",
  },
  {
    cat: "Too generic?",
    fix: true,
    weak: "The output exists. It just needs more to go on.",
    strong: (
      <>
        “That's too generic. This is for a <strong>healthcare client</strong> preparing a board update. Lead with the compliance risks from our <strong>Q2 deck</strong>, frame them against the targets in our <strong>KPI sheet</strong>, and keep it to the three slides that matter.”
      </>
    ),
    why: "Audience, two source files, and a sharper frame. You didn't rephrase the ask. You added what Claude couldn't see.",
  },
]

export function Prompting() {
  return (
    <Section id="prompting" className="border-t" aria-labelledby="prompting-title">
      <h2 className="h-section mb-4" id="prompting-title">
        Give Claude the <span className="grad">context</span>.
      </h2>
      <p className="lede mb-7">Context does the heavy lifting. Add your files, attach screenshots, paste the email, link connector data, or call a skill. Then say what you need out of it.</p>

      <div className="rounded-[32px] border-2 border-white bg-gradient-to-br from-card via-[#F4F0FF] to-[#EAF9FB] p-6 shadow-card md:p-11">
        <Kicker>The number one rule</Kicker>
        <h3 className="h-sub mb-3 text-[clamp(24px,2.8vw,32px)]">Claude is brilliant on day one. It just doesn't know your situation yet.</h3>
        <p className="max-w-[70ch] text-[17px] leading-relaxed text-muted-foreground">
          It knows every language, industry, and format. It doesn't know your client, your task, or what a good result looks like. <strong>The more relevant material you hand over, the less it has to guess.</strong> If the output missed, it's almost always a context problem. Add information instead of polishing the wording.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1.3fr]">
          <div className="rounded-xl border-t-[3px] border-[#D8D5E3] bg-card p-4 text-base leading-relaxed text-muted-foreground">
            <p className="mb-1.5 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">Polished prompt, no context</p>
            <p>“Analyze our sales data and turn it into a slide deck with charts. Keep it accurate and clear.”</p>
          </div>
          <div className="rounded-xl border-t-[3px] border-success bg-card p-4 text-base leading-relaxed text-muted-foreground">
            <p className="mb-1.5 text-xs font-semibold tracking-[0.08em] text-success uppercase">The context, handed over</p>
            <p>“Go to my Q2 Reports folder and open regional_sales.csv. Read every row, analyze the trends, and turn the key insights into charts for the quarterly business review. Build it into a slide deck, and double-check every figure against the sheet before you finalize.”</p>
          </div>
        </div>
      </div>

      <h3 className="h-sub mt-12 mb-4 md:mt-20">What Anthropic says works now.</h3>
      <p className="mb-4 text-[17px] text-muted-foreground">Newer models follow short, clear instructions better than long rule lists. From Anthropic's 2026 guidance:</p>
      <ul className="mb-2 grid gap-2.5 text-base sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["State the intent, not the steps.", "\"Draft a reply that gets the invoice paid\" beats a ten-step recipe."],
          ["Say why a constraint matters.", "\"Short, she reads on her phone\" is followed better than \"be concise\"."],
          ["Describe what done looks like.", "Format, length, where it goes."],
          ["Say what to do, not what to avoid.", "\"One paragraph\" instead of \"no bullets\"."],
          ["One example when format matters.", "Paste a past email the client liked."],
          ["Let it say it's unsure.", "\"If the file doesn't cover it, say so.\""],
        ].map(([t, d]) => (
          <li key={t} className="rounded-xl bg-card p-4 shadow-card-sm">
            <strong className="block">{t}</strong>
            <span className="text-muted-foreground">{d}</span>
          </li>
        ))}
      </ul>
      <p className="mb-10 text-base text-muted-foreground">
        What no longer helps: "you are a world-class expert", "double-check your work", and rule lists in capitals. Set the client's voice once in the project's <strong>Instructions for Claude</strong> instead of repeating it per prompt. Practise both in <a href="#/room/writing">the Writing Room</a>.
      </p>

      <h3 className="h-sub mt-12 mb-4 md:mt-20">Three things to focus on.</h3>
      <ol className="grid gap-3 md:grid-cols-3">
        {[
          ["Link and feed the raw data.", "Connect apps and folders, attach files, paste the email, share screenshots, then say what you need. What you hand over matters far more than how you word it."],
          ["Refine the first draft if needed.", "If it isn't right, add context and redirect, the way you would with a colleague who needed more of the story."],
          ["Assume it can do it until it says otherwise.", "Try the task. Claude flags what's out of reach and asks questions when it needs more. The people who get the most out of it keep asking."],
        ].map(([t, d], i) => (
          <li key={t} className="rounded-2xl bg-card p-5.5 text-base leading-relaxed text-muted-foreground shadow-card-sm">
            <span className="grad mb-3 block text-[34px] leading-none font-medium">0{i + 1}</span>
            <strong className="mb-1 block text-lg">{t}</strong>
            {d}
          </li>
        ))}
      </ol>

      <h3 className="h-sub mt-12 mb-2 md:mt-20">Weak ask, strong ask.</h3>
      <p className="mb-4 text-[17px] text-muted-foreground">Open a card to see the same request rewritten with context.</p>
      <Accordion className="gap-2.5">
        {PAIRS.map((p) => (
          <AccordionItem key={p.cat} value={p.cat} className="rounded-xl border-1.5 border-transparent bg-card px-4 shadow-card-sm data-open:border-violet/20">
            <AccordionTrigger className="flex-col items-start gap-1 py-4 hover:no-underline">
              <span className={cn("text-xs font-semibold tracking-[0.1em] uppercase", p.fix ? "text-warning" : "text-violet")}>{p.cat}</span>
              <span className="text-[17px] font-normal text-muted-foreground">{p.weak}</span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2.5 pb-4">
              <p className="rounded-lg bg-success-soft px-4 py-3.5 text-base leading-relaxed text-foreground [&_em]:font-semibold [&_em]:text-success [&_em]:not-italic">{p.strong}</p>
              <p className="text-[15px] text-muted-foreground">{p.why}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 grid gap-4 md:mt-16 md:grid-cols-[1.1fr_.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Cowork tips</CardTitle>
          </CardHeader>
          <CardContent>
            <Ticks
              items={[
                <>State the <strong>output format</strong> up front: "save as a .md file", "create a table", "write bullet points".</>,
                <>State the <strong>output location</strong>: "save to my Magic Work folder in Google Drive".</>,
                <>For <strong>inbox or calendar</strong> tasks, set the scope: "only emails from the last 48 hours" or "just the three meetings on Thursday".</>,
                <><strong>Don't interrupt mid-step</strong> unless it's clearly going wrong. Wait for a result, then redirect.</>,
                <>You don't need polished prompts. Voice-to-text, Taglish, abbreviations, and typos are fine. <strong>Worry less about phrasing and more about whether Claude has what it needs.</strong></>,
                <><strong>Start a new chat when you switch topics.</strong> Long conversations that jump between subjects confuse Claude.</>,
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Things that trip people up</CardTitle>
          </CardHeader>
          <CardContent>
            <Ticks
              warn
              items={[
                <>Claude <strong>can hit usage limits</strong>. "Resets at 5am" means your cap was reached. Switch to a simpler task or step down to Sonnet.</>,
                <>If Claude <strong>goes quiet mid-task</strong>, it may be waiting on a permission prompt. Check the task sidebar before restarting.</>,
                <><strong>Confirm the project folder, file path, skills, and connectors</strong> before a task runs, so Claude reads and saves exactly where you intend.</>,
                <>If Claude <strong>goes off track</strong>, don't reword the same ask. Redirect it with the right context. Generic or wrong output usually means Claude couldn't see what you could.</>,
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}

/* ---------- Model ---------- */

const SITUATIONS: { v: ModelKey; t: string }[] = [
  { v: "opus", t: "Everyday EA work" },
  { v: "sonnet", t: "I hit my Opus limit" },
  { v: "haiku", t: "High-volume extraction or very quick summaries (rare)" },
]
const MODEL_ROWS: { k: ModelKey; use: string; avoid: string }[] = [
  { k: "opus", use: "Everything by default: all EA work, research, writing, Cowork, complex reasoning.", avoid: "Nothing. Start here unless limits stop you." },
  { k: "sonnet", use: "When you've hit your Opus limit. Still strong for most work and lighter on quota.", avoid: "Accuracy-critical or complex multi-step tasks where quality matters most." },
  { k: "haiku", use: "High-volume rote data only, such as bulk categorization or simple extraction at scale.", avoid: "Almost everything. Never for reasoning, writing, or anything that needs judgement." },
]

export function Model() {
  const [pick, setPick] = React.useState<ModelKey>("opus")
  return (
    <Section id="model" className="tint border-t" aria-labelledby="model-title">
      <h2 className="h-section mb-4" id="model-title">
        Start on Opus. Switch only when <span className="grad">limits</span> push you.
      </h2>
      <p className="lede mb-7">Opus is your default for all EA work: best quality, richest output, strongest reasoning. Switch to Sonnet only if you hit your Opus limit.</p>

      <Card>
        <CardContent className="grid items-center gap-5 sm:grid-cols-2">
          <FieldSet>
            <FieldLegend variant="label" className="text-sm tracking-[0.08em] text-muted-foreground uppercase">What's your situation?</FieldLegend>
            <RadioGroup value={pick} onValueChange={(v) => setPick(v as ModelKey)} className="gap-1.5">
              {SITUATIONS.map((s) => (
                <Field key={s.v} orientation="horizontal" className={cn("rounded-lg border-1.5 px-3.5 py-3", pick === s.v && "border-violet bg-[#FBFAFF]")}>
                  <RadioGroupItem value={s.v} id={`model-${s.v}`} className="size-5" />
                  <FieldLabel htmlFor={`model-${s.v}`} className="text-[17px] leading-snug font-normal">
                    {s.t}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>
          <div className="rounded-xl bg-background p-5" aria-live="polite">
            <p className="mb-2 text-sm font-semibold tracking-[0.08em] text-muted-foreground uppercase">Use</p>
            <p className="grad mb-3 text-[44px] leading-none font-medium">{MODELS[pick].model}</p>
            <p className="text-base text-muted-foreground">{MODELS[pick].why}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <Table className="text-base">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 text-xs tracking-[0.1em] uppercase">Model</TableHead>
              <TableHead className="px-4 text-xs tracking-[0.1em] uppercase">Use for</TableHead>
              <TableHead className="px-4 text-xs tracking-[0.1em] uppercase">Avoid for</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MODEL_ROWS.map((r) => (
              <TableRow key={r.k} className={cn(pick === r.k && "bg-[#FBFAFF] shadow-[inset_3px_0_0_var(--violet)]")}>
                <TableCell className="px-4 py-3.5 align-top font-semibold text-foreground">{MODELS[r.k].model}</TableCell>
                <TableCell className="min-w-56 px-4 py-3.5 align-top whitespace-normal text-muted-foreground">{r.use}</TableCell>
                <TableCell className="min-w-56 px-4 py-3.5 align-top whitespace-normal text-muted-foreground">{r.avoid}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Note variant="warning">
        <strong>Hitting Sonnet limits?</strong> Don't drop to Haiku, because a weaker model can hurt the quality of your results. Tell your Account Lead so your quota can be reviewed.
      </Note>
      <Note>
        <strong>Effort levels.</strong> Leave effort on its default (or high) for client work. An assistant turned it down to conserve tokens, quality dropped, and the client bought a different tool. Ration low-value tasks, not the thinking. Practise this in <a href="#/room/engine">the Engine Room</a>.
      </Note>
    </Section>
  )
}

/* ---------- Learn ---------- */

export function Learn() {
  return (
    <Section id="learn" className="border-t" aria-labelledby="learn-title">
      <h2 className="h-section mb-4" id="learn-title">
        Go beyond the <span className="grad">basics</span>.
      </h2>
      <p className="lede mb-7">Anthropic's official courses. The certificates they issue line up with Magic's Claude Certified program, and your Account Lead tracks them as part of your onboarding.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {RESOURCES.map((r) => (
          <a
            key={r.href}
            href={r.href}
            target="_blank"
            rel="noopener"
            className={cn(
              "flex flex-col gap-1 rounded-xl border-1.5 border-transparent bg-card p-5 text-[15px] leading-snug text-muted-foreground no-underline shadow-card-sm hover:border-violet/30",
              r.cert && "bg-gradient-to-br from-card to-secondary"
            )}
          >
            <Badge variant="secondary" className="mb-1 w-fit">{r.tag}</Badge>
            <strong className="text-lg">{r.title}</strong>
            <span>{r.desc}</span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-base text-muted-foreground">Account Leads: these resources double as your coaching toolkit. Reach out to the Product Team for support.</p>
    </Section>
  )
}
