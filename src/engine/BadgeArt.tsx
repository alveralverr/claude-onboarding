import { cn } from "cn"
import { AwardIcon } from "lucide-react"

import { BADGE_ART, badgeImage } from "@/content/world"

/* A badge medallion: the rendered WebP when it exists, otherwise a drawn
   stand-in in the same shape so the grid never shows a broken image. */
export function BadgeArt({ id, earned, alt = "", className }: { id: string; earned: boolean; alt?: string; className?: string }) {
  if (BADGE_ART.has(id)) {
    return <img src={badgeImage(id)} alt={alt} width={256} height={256} loading="lazy" className={cn("aspect-square", !earned && "opacity-30 grayscale", className)} />
  }
  return (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn(
        "flex aspect-square items-center justify-center rounded-full border-[6px] border-violet bg-white text-violet",
        !earned && "opacity-30 grayscale",
        className
      )}
    >
      <AwardIcon className="size-1/2" strokeWidth={1.75} />
    </span>
  )
}
