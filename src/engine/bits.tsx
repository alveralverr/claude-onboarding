/* Small pieces shared by the step renderers. */
import * as React from "react"
import { cn } from "cn"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Media } from "@/content/types"
import { setChecked, useProgress } from "@/lib/progress"
import { GifPlay, InViewVideo, YouTube } from "@/components/site/shared"

/* A checklist item bound to the v1 progress store. */
export function Check({ k, children, big }: { k: string; children: React.ReactNode; big?: boolean }) {
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

export function Checks({ children }: { children: React.ReactNode }) {
  return <FieldGroup className="my-2 gap-1">{children}</FieldGroup>
}

export function Shot({ src, alt, w, h, className }: { src: string; alt: string; w: number; h: number; className?: string }) {
  return <img src={src} alt={alt} width={w} height={h} loading="lazy" className={cn("my-3 w-full rounded-xl border-2 border-white shadow-card-sm", className)} />
}

export function MediaView({ media, className }: { media?: Media; className?: string }) {
  if (!media) return null
  switch (media.type) {
    case "image":
      return <Shot src={media.src} alt={media.alt} w={media.w} h={media.h} className={cn(media.className, className)} />
    case "gif":
      return <GifPlay className={cn("my-3", className)} src={media.src} poster={media.poster} alt={media.alt} width={media.w} height={media.h} />
    case "video":
      return (
        <div className={cn("my-3", className)}>
          <InViewVideo src={media.src} label={media.label} />
        </div>
      )
    case "youtube":
      return <YouTube id={media.id} title={media.title} className={cn("my-3", className)} />
  }
}

export function NoteBox({ variant = "info", children }: { variant?: "info" | "warning"; children: React.ReactNode }) {
  return (
    <Alert variant={variant} className="mt-5">
      <AlertDescription className="text-base">{children}</AlertDescription>
    </Alert>
  )
}

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-secondary px-1.5 py-0.5 text-[0.85em] text-secondary-foreground">{children}</code>
}
