import * as React from "react"
import { cn } from "cn"
import { CheckIcon, CopyIcon, PlayIcon, SquareIcon, Volume2Icon } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { playVoiceover, stopVoiceover, useVoiceoverSrc } from "@/lib/voiceover"

/* ---------- Layout helpers ---------- */

export function Section({
  id,
  className,
  wide,
  children,
  ...props
}: React.ComponentProps<"section"> & { wide?: boolean }) {
  return (
    <section id={id} className={cn("py-16 md:py-28", className)} {...props}>
      <div className={cn(wide ? "wrap" : "wrap-mid", "px-5 md:px-10")}>{children}</div>
    </section>
  )
}

export function Kicker({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("kicker mb-3", className)} {...props} />
}

export function StepNo({ n, time }: { n: number; time: string }) {
  return (
    <p className="mb-3 text-[15px] font-semibold text-violet">
      Step {n} of 3 <span className="mx-1 text-muted-foreground">·</span> about {time}
    </p>
  )
}

export function Sub({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("mt-6 mb-3 text-sm font-semibold tracking-[0.08em] text-muted-foreground uppercase", className)}
      {...props}
    />
  )
}

export function Ticks({ items, warn }: { items: React.ReactNode[]; warn?: boolean }) {
  return (
    <ul className="flex flex-col gap-3 text-[17px] leading-relaxed">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span
            className={cn(
              "mt-1.5 flex size-4 shrink-0 items-center justify-center rounded-full",
              warn ? "bg-warning-soft text-warning" : "text-violet"
            )}
            aria-hidden="true"
          >
            {warn ? <span className="size-1.5 rounded-full bg-current" /> : <CheckIcon className="size-4" />}
          </span>
          <span className="text-card-foreground">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Note({
  variant = "info",
  className,
  children,
}: {
  variant?: "info" | "warning"
  className?: string
  children: React.ReactNode
}) {
  return (
    <Alert variant={variant} className={cn("mt-5", className)}>
      <AlertDescription className="text-base">{children}</AlertDescription>
    </Alert>
  )
}

export function Ext({ className, ...props }: React.ComponentProps<"a">) {
  return <a target="_blank" rel="noopener" className={cn("text-violet underline", className)} {...props} />
}

/* ---------- Voiceover button (store lives in lib/voiceover.ts) ---------- */

export function Voiceover({
  src,
  label = "Listen",
  onDark,
  className,
}: {
  src: string
  label?: string
  onDark?: boolean
  className?: string
}) {
  const playing = useVoiceoverSrc() === src
  return (
    <Button
      type="button"
      variant={onDark ? "outline-light" : "outline"}
      size="lg"
      aria-pressed={playing}
      className={cn(playing && "bg-violet text-white hover:bg-violet", className)}
      onClick={() => (playing ? stopVoiceover() : playVoiceover(src))}
    >
      <Volume2Icon data-icon="inline-start" className={cn(playing && "animate-pulse")} />
      {playing ? "Stop" : label}
    </Button>
  )
}

/* ---------- Copy-to-clipboard prompt ---------- */

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      /* fall through */
    }
  }
  const ta = document.createElement("textarea")
  ta.value = text
  ta.setAttribute("readonly", "")
  ta.style.position = "fixed"
  ta.style.opacity = "0"
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand("copy")
  document.body.removeChild(ta)
  if (!ok) throw new Error("copy failed")
}

export function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
      <p className="flex-1 text-base leading-relaxed text-card-foreground">{text}</p>
      <Button
        type="button"
        variant={copied ? "success" : "secondary"}
        onClick={() =>
          copyText(text).then(
            () => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1600)
            },
            () => toast.add({ title: "Copy failed. Select the text and copy it manually.", type: "error" })
          )
        }
      >
        {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}

/* ---------- YouTube facade: nothing loads until clicked ---------- */

export function YouTube({ id, title, tall, className }: { id: string; title: string; tall?: boolean; className?: string }) {
  const [open, setOpen] = React.useState(false)
  // Callers pass key={id} so a new video remounts with fresh state.
  const [thumb, setThumb] = React.useState(`https://i.ytimg.com/vi/${id}/hq720.jpg`)
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-ink-dark",
        tall ? "mx-auto aspect-[9/16] max-w-xs" : "aspect-video",
        className
      )}
    >
      {open ? (
        <iframe
          className="absolute inset-0 size-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="group absolute inset-0 flex size-full flex-col items-center justify-center text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label={`Play video: ${title}`}
          onClick={() => setOpen(true)}
        >
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
            onError={() => setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
          />
          <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          <span className="relative flex h-12 w-17 items-center justify-center rounded-2xl bg-[#FF0033] shadow-btn transition-transform group-hover:scale-105">
            <PlayIcon className="size-6 fill-current" />
          </span>
          <span className="absolute right-4 bottom-3 left-4 text-left text-base font-medium leading-snug">{title}</span>
        </button>
      )}
    </div>
  )
}

/* ---------- Click-to-play animated WebP with a still poster ---------- */

export function GifPlay({
  src,
  poster,
  alt,
  width,
  height,
  className,
}: {
  src: string
  poster: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  const [playing, setPlaying] = React.useState(false)
  return (
    <figure className={cn("relative m-0 overflow-hidden rounded-xl bg-black shadow-card", className)}>
      <img src={playing ? src : poster} alt={alt} width={width} height={height} loading="lazy" className="w-full" />
      <Button
        type="button"
        variant="light"
        size="lg"
        className="absolute right-4 bottom-4"
        onClick={() => setPlaying((p) => !p)}
      >
        {playing ? <SquareIcon data-icon="inline-start" /> : <PlayIcon data-icon="inline-start" />}
        {playing ? "Stop" : "Play demo"}
      </Button>
    </figure>
  )
}

/* ---------- Muted demo video that plays only while on screen ---------- */

export function InViewVideo({ src, label }: { src: string; label: string }) {
  const ref = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    const v = ref.current
    if (!v) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce || !("IntersectionObserver" in window)) {
      v.controls = true
      v.preload = "metadata"
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const p = v.play()
            if (p && typeof p.catch === "function") p.catch(() => (v.controls = true))
          } else v.pause()
        })
      },
      { threshold: 0.4 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="aspect-video w-full rounded-xl bg-black object-cover"
    />
  )
}
