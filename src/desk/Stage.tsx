import * as React from "react"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

import type { Persona, Shift } from "@/story/types"
import { bbox, matrix3dFor } from "./homography"
import { Plate } from "./Plate"
import { PLATE } from "./plateConfig"

/* What the laptop shows while you're sitting back: the practice Claude's
   home screen, as a static picture. It is mapped onto the laptop screen. */
function ScreenPreview({ userName }: { userName: string }) {
  return (
    <div className="flex size-full bg-[#FAF9F5] font-sans text-[#1F1E1D]">
      <div className="flex w-[230px] flex-col gap-3 border-r border-[#E7E5DD] bg-[#F3F2EC] p-5 text-[18px] text-[#73726C]">
        <span className="font-medium text-[#1F1E1D]">New</span>
        <span>Projects</span>
        <span>Artifacts</span>
        <span>Scheduled</span>
        <span>Design</span>
        <span>Customize</span>
        <span className="mt-auto w-fit rounded-md bg-[#EFEAFF] px-2.5 py-1 text-[14px] font-semibold text-[#3B0FA8] uppercase">Practice</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-16">
        <p className="text-[46px]" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
          Good morning, {userName}
        </p>
        <div className="w-full max-w-[760px] rounded-3xl border-2 border-[#E1DFD6] bg-white p-6 text-[22px] text-[#9C9A92]">
          Type / for skills
          <div className="mt-8 flex items-center gap-4 text-[18px] text-[#1F1E1D]">
            <span className="rounded-lg border px-3 py-1">+</span>
            <span className="rounded-lg bg-[#F3F2EC] px-3 py-1">Chat · Cowork</span>
            <span className="ml-auto">Opus 5.5 High</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PhonePreview({ persona, message }: { persona: Persona; message?: string }) {
  return (
    <div className="flex size-full flex-col items-center gap-6 bg-[#1B1A2E] p-6 font-sans text-white">
      <p className="mt-6 text-[64px] font-light">9:41</p>
      {message && (
        <div className="w-full rounded-3xl bg-white/15 p-5 text-left">
          <p className="text-[22px] font-semibold">{persona.first}</p>
          <p className="mt-1 line-clamp-3 text-[22px] leading-snug text-white/85">{message}</p>
        </div>
      )}
    </div>
  )
}

export function Stage({
  userName,
  persona,
  shift,
  doneIds,
  nextId,
  activeId,
  clock,
  message,
  unread,
  onLaptop,
  onPhone,
  onNotebook,
  onSticky,
}: {
  userName: string
  persona: Persona
  shift: Shift | null
  doneIds: string[]
  nextId: string | null
  activeId: string | null
  clock: { label: string; hourDeg: number; minDeg: number }
  message?: string
  unread: number
  onLaptop: () => void
  onPhone: () => void
  onNotebook: () => void
  onSticky: (taskIndex: number) => void
}) {
  const wrap = React.useRef<HTMLDivElement>(null)
  const layer = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(0)

  React.useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver((e) => setScale(e[0].contentRect.width / PLATE.w))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // A few pixels of parallax, written straight to the layer (no re-render).
  const onMove = (e: React.PointerEvent) => {
    const el = layer.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = e.currentTarget.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width - 0.5) * -10
    const dy = ((e.clientY - r.top) / r.height - 0.5) * -6
    el.style.translate = `${dx}px ${dy}px`
  }

  const screenBox = bbox(PLATE.screen)
  const phoneBox = bbox(PLATE.phone)

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      className="relative w-full overflow-hidden rounded-[28px] border-2 border-white bg-[#ECEAF8] shadow-lift"
      style={{ aspectRatio: `${PLATE.w} / ${PLATE.h}` }}
    >
      <div ref={layer} className="absolute inset-[-8px] transition-[translate] duration-300 ease-out">
        <div className="absolute top-2 left-2 origin-top-left" style={{ width: PLATE.w, height: PLATE.h, transform: `scale(${scale})` }}>
          <Plate />
          <div aria-hidden="true" className="absolute top-0 left-0 origin-top-left overflow-hidden" style={{ width: 1280, height: 800, transform: matrix3dFor(1280, 800, PLATE.screen) }}>
            <ScreenPreview userName={userName} />
          </div>
          <div aria-hidden="true" className="absolute top-0 left-0 origin-top-left overflow-hidden" style={{ width: 300, height: 540, transform: matrix3dFor(300, 540, PLATE.phone) }}>
            <PhonePreview persona={persona} message={message} />
          </div>
          <div aria-hidden="true" className="absolute" style={{ left: PLATE.clock.x, top: PLATE.clock.y }}>
            <span className="absolute h-[42px] w-[8px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-ink-dark" style={{ rotate: `${clock.hourDeg}deg` }} />
            <span className="absolute h-[56px] w-[5px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-violet" style={{ rotate: `${clock.minDeg}deg` }} />
            <span className="absolute size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-dark" />
            <span className="absolute top-[86px] w-[160px] -translate-x-1/2 text-center text-[26px] font-semibold text-ink-dark">{clock.label}</span>
          </div>

          {shift && (
            <ul className="absolute grid grid-cols-2 gap-4" style={{ left: PLATE.notes.x, top: PLATE.notes.y, width: PLATE.notes.w }} aria-label={`${shift.day}'s tasks`}>
              {shift.tasks.map((t, i) => {
                const done = doneIds.includes(t.id)
                const next = t.id === nextId || t.id === activeId
                return (
                  <li key={t.id} style={{ rotate: `${(i % 2 ? 2 : -2) + (i % 3) - 1}deg` }}>
                    <button
                      type="button"
                      onClick={() => onSticky(i)}
                      className={cn(
                        "flex h-[110px] w-full flex-col justify-between rounded-md p-3 text-left text-[22px] leading-tight font-medium shadow-[0_10px_20px_rgba(92,68,0,0.18)] transition-transform hover:-translate-y-1 focus-visible:ring-8 focus-visible:ring-violet/60 focus-visible:outline-none",
                        done ? "bg-[#DDF3E6] text-[#0B6B3D]" : next ? "bg-[#FFE27A] text-[#4A3600] ring-6 ring-violet" : "bg-[#FFF3C4] text-[#5C4400]"
                      )}
                      aria-label={`${t.title}${done ? ", done" : next ? ", up next" : ""}`}
                    >
                      {t.sticky}
                      {done && <CheckIcon className="size-8" strokeWidth={3} />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={onLaptop}
            className="absolute rounded-md focus-visible:ring-8 focus-visible:ring-violet/60 focus-visible:outline-none"
            style={{ left: screenBox.x, top: screenBox.y, width: screenBox.w, height: screenBox.h }}
            aria-label="Open the laptop"
          />
          <button
            type="button"
            onClick={onPhone}
            className={cn("absolute rounded-2xl focus-visible:ring-8 focus-visible:ring-violet/60 focus-visible:outline-none", unread > 0 && "animate-[buzz_1.2s_ease-in-out_infinite]")}
            style={{ left: phoneBox.x - 10, top: phoneBox.y - 12, width: phoneBox.w + 24, height: phoneBox.h + 30 }}
            aria-label={unread > 0 ? `Phone: ${unread} new message${unread > 1 ? "s" : ""} from ${persona.first}` : "Phone"}
          >
            {unread > 0 && (
              <span className="absolute -top-4 -right-4 flex size-12 items-center justify-center rounded-full bg-[#E24B4A] text-[24px] font-bold text-white">{unread}</span>
            )}
          </button>
          <button
            type="button"
            onClick={onNotebook}
            className="absolute rounded-md focus-visible:ring-8 focus-visible:ring-violet/60 focus-visible:outline-none"
            style={{ left: PLATE.notebook.x, top: PLATE.notebook.y, width: PLATE.notebook.w, height: PLATE.notebook.h }}
            aria-label="Open your playbook"
          />
        </div>
      </div>
    </div>
  )
}
