import { cn } from "cn"

import type { Persona } from "@/story/types"

export function ClientAvatar({ persona, className }: { persona: Persona; className?: string }) {
  if (persona.portrait) return <img src={persona.portrait} alt="" width={256} height={256} className={cn("rounded-full bg-[#E6E6F8] object-cover", className)} />
  return (
    <span className={cn("flex items-center justify-center rounded-full bg-[#E6E6F8] font-semibold text-violet", className)} aria-hidden="true">
      {persona.initials}
    </span>
  )
}
