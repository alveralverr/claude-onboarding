import * as React from "react"
import { cn } from "cn"
import { CheckIcon, CopyIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { saveLaunchpad, useGame } from "@/lib/game"
import { useProgress } from "@/lib/progress"
import type { PathDef } from "../types"
import { buildLaunchpad, parseStored, toStored, type LaunchpadFields } from "../launchpad"

const COMMS = ["Email", "WhatsApp", "Slack", "Viber", "Phone", "Microsoft Teams"]
const CONNECTED = ["Gmail", "Google Calendar", "Google Drive", "Outlook", "Slack", "ClickUp", "Notion", "Fathom", "Canva"]

function Chips({ options, value, onToggle, label }: { options: string[]; value: string[]; onToggle: (o: string) => void; label: string }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
      {options.map((o) => {
        const on = value.includes(o)
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o)}
            className={cn("rounded-full border px-3 py-1.5 text-[14px]", on ? "border-violet bg-secondary text-secondary-foreground" : "border-border bg-card hover:border-violet/40")}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-[14px]">
      <span className="font-medium">{label}</span>
      {children}
      {hint && <span className="text-[13px] text-muted-foreground">{hint}</span>}
    </label>
  )
}

const input = "h-11 rounded-xl border bg-white px-3 text-[15px]"

/* Plan your real Week 1: the fields the assistant-onboarding skill needs,
   pre-filled from the path, turned into a block to paste into Claude. */
export function LaunchpadForm({ path, onDone, doneLabel = "Continue" }: { path: PathDef; onDone?: () => void; doneLabel?: string }) {
  const g = useGame()
  const p = useProgress()
  const [f, setF] = React.useState<LaunchpadFields>(() => {
    const stored = parseStored(g.story.launchpad)
    return {
      ...stored,
      ea: stored.ea || g.name || "",
      platforms: stored.platforms.length ? stored.platforms : [...(path.launchpad?.platforms ?? [])],
      recurring: stored.recurring.length ? stored.recurring : [...(path.launchpad?.recurring ?? [])],
    }
  })
  const [copied, setCopied] = React.useState(false)
  const set = (patch: Partial<LaunchpadFields>) => setF((s) => ({ ...s, ...patch }))
  type ListKey = "comms" | "platforms" | "connected" | "recurring"
  const toggle = (key: ListKey) => (o: string) => setF((s) => ({ ...s, [key]: s[key].includes(o) ? s[key].filter((x) => x !== o) : [...s[key], o] }))
  const block = buildLaunchpad(f, { desktop: !!p.checkboxes["need-1"] })

  // Keep what's typed in this browser only.
  React.useEffect(() => {
    const t = setTimeout(() => saveLaunchpad(toStored(f)), 400)
    return () => clearTimeout(t)
  }, [f])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.add({ title: "Copy failed. Select the text and copy it.", type: "error" })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[16px] text-card-foreground">
        Now plan the real thing. Fill in what you know about your real client, then paste the block into Claude. It starts Magic's onboarding skill, which connects your tools and runs one real workflow with you.
      </p>
      <p className="flex items-center gap-2 rounded-xl bg-background px-3.5 py-2.5 text-[14px] text-muted-foreground">
        <LockIcon className="size-4 shrink-0" /> What you type stays in this browser. Nothing is sent anywhere.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Your first name">
          <input className={input} value={f.ea} onChange={(e) => set({ ea: e.target.value })} placeholder="Bea" />
        </Field>
        <Field label="Your client's name">
          <input className={input} value={f.client} onChange={(e) => set({ client: e.target.value })} placeholder="First and last name" />
        </Field>
        <Field label="Company">
          <input className={input} value={f.company} onChange={(e) => set({ company: e.target.value })} placeholder="Their business" />
        </Field>
        <Field label="Industry">
          <input className={input} value={f.industry} onChange={(e) => set({ industry: e.target.value })} placeholder="Architecture, real estate, health..." />
        </Field>
        <Field label="Working schedule" hint="Days and hours, with the time zone.">
          <input className={input} value={f.schedule} onChange={(e) => set({ schedule: e.target.value })} placeholder="M-F, 9-5 CT" />
        </Field>
        <Field label="Your Account Lead">
          <div className="flex gap-2">
            <input className={cn(input, "min-w-0 flex-1")} value={f.al} onChange={(e) => set({ al: e.target.value })} placeholder="Name" />
            <input className={cn(input, "min-w-0 flex-1")} value={f.alEmail} onChange={(e) => set({ alEmail: e.target.value })} placeholder="Email" />
          </div>
        </Field>
      </div>
      <Field label="How they like to hear from you">
        <Chips label="Channels" options={COMMS} value={f.comms} onToggle={toggle("comms")} />
      </Field>
      <Field label="Their preferences" hint="Everything that matters. Separate with semicolons.">
        <textarea className="min-h-20 rounded-xl border bg-white px-3 py-2 text-[15px]" value={f.preferences} onChange={(e) => set({ preferences: e.target.value })} placeholder="Brief updates; no contractions; bullets, never paragraphs" />
      </Field>
      <Field label="Tools the work touches">
        <Chips label="Platforms" options={Array.from(new Set([...(path.launchpad?.platforms ?? []), ...CONNECTED]))} value={f.platforms} onToggle={toggle("platforms")} />
        <input className={input} value={f.platformsOther} onChange={(e) => set({ platformsOther: e.target.value })} placeholder="Other tools, comma separated" />
      </Field>
      <Field label="Already connected in your Claude">
        <Chips label="Connected" options={CONNECTED} value={f.connected} onToggle={toggle("connected")} />
      </Field>
      <Field label="Recurring tasks">
        <Chips label="Recurring tasks" options={path.launchpad?.recurring ?? []} value={f.recurring} onToggle={toggle("recurring")} />
      </Field>
      <Field label="The one that eats most of your day">
        <select className={input} value={f.timeSink} onChange={(e) => set({ timeSink: e.target.value })}>
          <option value="">Pick one</option>
          {f.recurring.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>
      <div className="flex flex-col gap-2">
        <p className="text-[14px] font-medium">Your Week 1 Launchpad</p>
        <pre className="overflow-x-auto rounded-2xl bg-ink-dark p-4 text-[13px] leading-relaxed whitespace-pre-wrap text-on-dark-2">{block}</pre>
        <div className="flex flex-wrap gap-2">
          <Button onClick={copy} variant={copied ? "success" : "default"}>
            {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
            {copied ? "Copied" : "Copy the block"}
          </Button>
          {onDone && (
            <Button variant="outline" onClick={onDone}>
              {doneLabel}
            </Button>
          )}
        </div>
        <p className="text-[14px] text-muted-foreground">Paste it into a new Cowork session in your real Claude. If your Magic skills are installed, it picks up from there.</p>
      </div>
    </div>
  )
}
