import * as React from "react"
import { cn } from "cn"
import { MenuIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { LIBRARY, PATH_STEPS } from "@/lib/data"
import { continueTarget, useStatus } from "@/lib/progress"

const NAV = [
  { href: "#setup", label: "Setup" },
  { href: "#first-task", label: "First task" },
  { href: "#safety", label: "Safety check" },
  { href: "#library", label: "Library" },
  { href: "#help", label: "Help" },
]

function StepBadge({ id }: { id: (typeof PATH_STEPS)[number]["id"] }) {
  const st = useStatus()
  const done = st[id]
  if (done) return <Badge variant="success">{id === "safety" ? "Passed" : "Done"}</Badge>
  if (id === "setup" && st.setupDone > 0) return <Badge variant="secondary">{st.setupDone} of {st.setupTotal}</Badge>
  return <Badge variant="outline">{PATH_STEPS.find((s) => s.id === id)?.time}</Badge>
}

function SheetLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <SheetClose
      render={<a href={href} />}
      nativeButton={false}
      className="flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 text-base text-foreground no-underline hover:bg-muted"
    >
      {children}
    </SheetClose>
  )
}

export function TopBar() {
  const st = useStatus()
  const target = continueTarget(st)
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-background/95">
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-4 px-5 md:px-10">
        <a href="#main" className="flex min-h-11 items-center gap-2 text-foreground no-underline" aria-label="Claude × Magic onboarding, back to top">
          <svg className="size-6 text-claude" viewBox="75 223 150 150" aria-hidden="true">
            <path fill="currentColor" d="m 105.01,322.07 29.14,-16.35 0.49,-1.42 -0.49,-0.79 h -1.42 l -4.87,-0.3 -16.65,-0.45 -14.44,-0.6 -13.99,-0.75 -3.52,-0.75 -3.3,-4.35 0.34,-2.17 2.96,-1.99 4.24,0.37 9.37,0.64 14.06,0.97 10.2,0.6 15.11,1.57 h 2.4 l 0.34,-0.97 -0.82,-0.6 -0.64,-0.6 -14.55,-9.86 -15.75,-10.42 -8.25,-6 -4.46,-3.04 -2.25,-2.85 -0.97,-6.22 4.05,-4.46 5.44,0.37 1.39,0.37 5.51,4.24 11.77,9.11 15.37,11.32 2.25,1.87 0.9,-0.64 0.11,-0.45 -1.01,-1.69 -8.36,-15.11 -8.92,-15.37 -3.97,-6.37 -1.05,-3.82 c -0.37,-1.57 -0.64,-2.89 -0.64,-4.5 l 4.61,-6.26 2.55,-0.82 6.15,0.82 2.59,2.25 3.82,8.74 6.19,13.76 9.6,18.71 2.81,5.55 1.5,5.14 0.56,1.57 h 0.97 v -0.9 l 0.79,-10.54 1.46,-12.94 1.42,-16.65 0.49,-4.69 2.32,-5.62 4.61,-3.04 3.6,1.72 2.96,4.24 -0.41,2.74 -1.76,11.44 -3.45,17.92 -2.25,12 h 1.31 l 1.5,-1.5 6.07,-8.06 10.2,-12.75 4.5,-5.06 5.25,-5.59 3.37,-2.66 h 6.37 l 4.69,6.97 -2.1,7.2 -6.56,8.32 -5.44,7.05 -7.8,10.5 -4.87,8.4 0.45,0.67 1.16,-0.11 17.62,-3.75 9.52,-1.72 11.36,-1.95 5.14,2.4 0.56,2.44 -2.02,4.99 -12.15,3 -14.25,2.85 -21.22,5.02 -0.26,0.19 0.3,0.37 9.56,0.9 4.09,0.22 h 10.01 l 18.64,1.39 4.87,3.22 2.92,3.94 -0.49,3 -7.5,3.82 -10.12,-2.4 -23.62,-5.62 -8.1,-2.02 h -1.12 v 0.67 l 6.75,6.6 12.37,11.17 15.49,14.4 0.79,3.56 -1.99,2.81 -2.1,-0.3 -13.61,-10.24 -5.25,-4.61 -11.89,-10.01 h -0.79 v 1.05 l 2.74,4.01 14.47,21.75 0.75,6.67 -1.05,2.17 -3.75,1.31 -4.12,-0.75 -8.47,-11.89 -8.74,-13.39 -7.05,-12 -0.86,0.49 -4.16,44.81 -1.95,2.29 -4.5,1.72 -3.75,-2.85 -1.99,-4.61 1.99,-9.11 2.4,-11.89 1.95,-9.45 1.76,-11.74 1.05,-3.9 -0.07,-0.26 -0.86,0.11 -8.85,12.15 -13.46,18.19 -10.65,11.4 -2.55,1.01 -4.42,-2.29 0.41,-4.09 2.47,-3.64 14.74,-18.75 8.89,-11.62 5.74,-6.71 -0.04,-0.97 h -0.34 l -39.15,25.42 -6.97,0.9 -3,-2.81 0.37,-4.61 1.42,-1.5 11.77,-8.1 z" />
          </svg>
          <span className="text-sm text-muted-foreground" aria-hidden="true">×</span>
          <img src="/assets/media/magic-logo.webp" alt="Magic" width={26} height={26} className="size-6.5" />
          <span className="ml-1.5 hidden border-l pl-3 text-[17px] font-semibold sm:inline">Onboarding</span>
        </a>

        <nav className="ml-auto hidden gap-1 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <Button key={n.href} variant="ghost" render={<a href={n.href} />} nativeButton={false}>
              {n.label}
            </Button>
          ))}
        </nav>

        <div className={cn("flex items-center gap-2", "ml-auto lg:ml-0")}>
          <Button variant="outline" render={<a href={target.href} />} nativeButton={false} aria-label={`Your progress: ${st.pct} percent done`}>
            <span className="relative size-5" aria-hidden="true">
              <svg viewBox="0 0 36 36" className="size-5 -rotate-90">
                <circle cx="18" cy="18" r="15" className="fill-none stroke-secondary" strokeWidth="5" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  className="fill-none stroke-violet transition-[stroke-dashoffset] duration-500"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="94.25"
                  strokeDashoffset={94.25 * (1 - st.pct / 100)}
                />
              </svg>
            </span>
            {st.pct}%<span className="hidden font-normal text-muted-foreground sm:inline"> done</span>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button aria-label="All sections" />}>
              <MenuIcon data-icon="inline-start" />
              <span className="hidden sm:inline">Sections</span>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>All sections</SheetTitle>
                <SheetDescription>Your path is tracked. The library is always open.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pb-6">
                <p className="mt-2 mb-1 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Your path</p>
                {PATH_STEPS.map((s) => (
                  <SheetLink key={s.id} href={s.href}>
                    <span>{s.name}</span>
                    <StepBadge id={s.id} />
                  </SheetLink>
                ))}
                <Separator className="my-3" />
                <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Library</p>
                <SheetLink href="#intro">What's different about Claude</SheetLink>
                {LIBRARY.map((l) => (
                  <SheetLink key={l.href} href={l.href}>
                    {l.title}
                  </SheetLink>
                ))}
                <Separator className="my-3" />
                <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Support</p>
                <SheetLink href="#help">Get help</SheetLink>
                <SheetLink href="#feedback">Give feedback</SheetLink>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
