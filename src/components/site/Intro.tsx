import * as React from "react"
import { cn } from "cn"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GifPlay, Kicker, Voiceover } from "./shared"

type Tool = "magic" | "chat" | "claude"
const TOOLS: { key: Tool; name: string }[] = [
  { key: "magic", name: "MagicGPT" },
  { key: "chat", name: "ChatGPT" },
  { key: "claude", name: "Claude" },
]
const ROWS: { cap: React.ReactNode; magic: string; chat: string; claude: string }[] = [
  { cap: "Works in your browser", magic: "Yes", chat: "Yes", claude: "Yes" },
  { cap: "Works on your desktop", magic: "No", chat: "Companion window", claude: "Full desktop app" },
  { cap: "Runs multi-step tasks", magic: "No", chat: "Cloud sandbox, capped monthly", claude: "On your machine, built for sustained work" },
  { cap: "Works with your real files", magic: "Upload or read your screen", chat: "Upload or read your screen", claude: "Reads and writes across your folders" },
  {
    cap: (
      <>
        Connected tools
        <small className="block text-xs font-normal text-muted-foreground">Gmail, Calendar, Drive, Notion, Slack, Asana</small>
      </>
    ),
    magic: "No",
    chat: "Mostly read-only, one source at a time",
    claude: "Reads and takes action, across sources",
  },
  { cap: "Tuned for EA work", magic: "General", chat: "Consumer tasks", claude: "Magic skill templates" },
]

function Compare() {
  // On phones only one tool column shows at a time.
  const [focus, setFocus] = React.useState<Tool>("claude")
  const col = (key: Tool) => cn(key !== focus && "max-sm:hidden", key === "claude" && "bg-[#FBF3EE] font-medium text-[#7A3A22]")
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>How it stacks up</CardTitle>
        <ToggleGroup
          className="sm:hidden"
          variant="outline"
          spacing={0}
          value={[focus]}
          onValueChange={(v) => {
            const next = (v as string[])[0]
            if (next) setFocus(next as Tool)
          }}
          aria-label="Show one tool"
        >
          {TOOLS.map((t) => (
            <ToggleGroupItem key={t.key} value={t.key}>
              {t.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <Table className="text-[15px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[36%]">
                <span className="sr-only">Capability</span>
              </TableHead>
              {TOOLS.map((t) => (
                <TableHead key={t.key} className={cn("text-xs tracking-[0.1em] uppercase", col(t.key), t.key === "claude" && "rounded-t-lg text-[#A34A2C]")}>
                  {t.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold whitespace-normal text-foreground">{r.cap}</TableCell>
                {TOOLS.map((t) => (
                  <TableCell key={t.key} className={cn("whitespace-normal text-muted-foreground", col(t.key), r[t.key] === "No" && "text-muted-foreground/70")}>
                    {r[t.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function Intro() {
  return (
    <section id="intro" className="py-16 md:py-28" aria-labelledby="intro-title">
      <div className="wrap grid items-start gap-8 px-5 md:px-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
        <div className="flex flex-col gap-3.5 text-[17px] leading-relaxed text-card-foreground">
          <h2 className="h-section mb-2" id="intro-title">
            Claude <span className="grad">does</span> things, not just answers.
          </h2>
          <p>You may have used MagicGPT and ChatGPT. Claude sits in the same place: you chat, it answers. One difference changes how you'll work day to day.</p>
          <p>
            <strong>Claude Cowork runs on your own machine, with your real files and tools.</strong> It's built for the work you do, with Magic skill templates ready from day one.
          </p>
          <div>
            <Voiceover src="/assets/voice/01 - whats different.mp3" />
          </div>
        </div>
        <Compare />
      </div>

      <div className="wrap px-5 md:px-10">
        <div className="relative mt-14 overflow-hidden rounded-[32px] bg-ink-dark p-7 text-on-dark-2 md:mt-22 md:p-14">
          <div className="band-glow pointer-events-none absolute inset-x-[-10%] top-[-30%] h-[80%]" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
            <div className="text-[17px] leading-relaxed">
              <Kicker className="text-cyan">Meet Claude Cowork</Kicker>
              <h3 className="h-sub mb-3 text-white">Less chatbot, more like a colleague.</h3>
              <p>Cowork finishes tasks end to end. It reads your files, works through each step, and saves the finished result. Think of a coworker who can think, click, and get things done.</p>
              <ul className="mt-5 flex flex-col gap-3 text-base leading-snug">
                {[
                  ["Uses your local folders.", "Reads and writes files on your computer. No uploading, and output saves next to your inputs."],
                  ["Runs parallel work.", "Splits multi-part tasks and runs the independent pieces at the same time."],
                  ["Runs on a schedule.", "Set a cadence once and recurring work runs by itself."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1.5 size-2.5 shrink-0 rounded-[3px] bg-[image:var(--sphere)]" aria-hidden="true" />
                    <span>
                      <strong className="text-white">{t}</strong> {d}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Voiceover src="/assets/voice/02 - intro to cowork.mp3" onDark />
              </div>
            </div>
            <GifPlay
              src="/assets/media/cowork-in-action.webp"
              poster="/assets/media/cowork-in-action-poster.webp"
              alt="Cowork completing a task in the desktop app"
              width={1200}
              height={675}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
