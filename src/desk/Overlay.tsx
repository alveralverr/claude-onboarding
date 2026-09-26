import * as React from "react"
import { XIcon } from "lucide-react"

/* A card over the desk for things you do at the desk (sorting, planning,
   summaries). Normal flow on phones; over the stage on wider screens. */
export function Overlay({ title, kicker, onClose, children }: { title: string; kicker?: string; onClose?: () => void; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <div className="md:absolute md:inset-0 md:z-10 md:flex md:items-start md:justify-center md:overflow-y-auto md:bg-ink-dark/25 md:p-6 md:backdrop-blur-[2px]">
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-label={title}
        className="w-full max-w-[860px] rounded-[28px] border-2 border-white bg-card p-5 shadow-lift outline-none md:p-7"
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            {kicker && <p className="kicker mb-1">{kicker}</p>}
            <h2 className="text-[24px] leading-tight font-semibold">{title}</h2>
          </div>
          {onClose && (
            <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-muted" aria-label="Close">
              <XIcon className="size-5" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
