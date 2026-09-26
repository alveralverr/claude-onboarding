import * as React from "react"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

import { NOW } from "@/content/now"
import type { Persona, Shift } from "@/story/types"
import { bbox, matrix3dFor } from "./homography"
import { Plate } from "./Plate"
import { PLATE } from "./plateConfig"

/* What the laptop shows while you're sitting back: the practice Claude's
   home screen, as a static picture. It is mapped onto the laptop screen. */
function ScreenPreview({ userName }: { userName: string }) {
  return (
    <div className="desk-screen-preview">
      <div className="desk-screen-sidebar">
        <span className="desk-screen-brand">✳</span>
        <span className="desk-screen-new">+ New chat</span>
        <span>Projects</span>
        <span>Artifacts</span>
        <span>Scheduled</span>
        <span>Customize</span>
        <span className="desk-practice-tag">Practice space</span>
      </div>
      <div className="desk-screen-home">
        <span className="desk-screen-spark">✳</span>
        <p>
          Good morning,
          <br />
          {userName}
        </p>
        <div className="desk-screen-composer">
          <span>What can we take off your plate?</span>
          <div>
            <span>＋</span>
            <span>Chat · Cowork</span>
            <small>{NOW.defaultModel}</small>
          </div>
        </div>
        <span className="desk-screen-hint">
          A little focus. A lot of possibility.
        </span>
      </div>
    </div>
  )
}

function PhonePreview({
  persona,
  message,
  time,
}: {
  persona: Persona
  message?: string
  time: string
}) {
  return (
    <div className="desk-phone-preview">
      <span className="desk-phone-speaker" />
      <span className="desk-phone-time">{time.split(" ")[0]}</span>
      <span className="desk-phone-caption">Your workday</span>
      {message && (
        <div className="desk-phone-message">
          <span>MESSAGES</span>
          <strong>{persona.first}</strong>
          <p>{message}</p>
        </div>
      )}
      <span className="desk-phone-home" />
    </div>
  )
}

function DeskClock({
  clock,
}: {
  clock: { label: string; hourDeg: number; minDeg: number }
}) {
  const { x, y, r } = PLATE.clock
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox={`0 0 ${PLATE.w} ${PLATE.h}`}
      aria-hidden="true"
    >
      <g transform={`translate(${x} ${y})`}>
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1="0"
            y1={-r + 4}
            x2="0"
            y2={-r + (i % 3 === 0 ? 13 : 9)}
            transform={`rotate(${i * 30})`}
            stroke="#80796f"
            strokeWidth={i % 3 === 0 ? 3 : 2}
            strokeLinecap="round"
          />
        ))}
        <text
          y="43"
          textAnchor="middle"
          fill="#746b61"
          fontSize="16"
          fontFamily="inherit"
        >
          {clock.label}
        </text>
        <g strokeLinecap="round" className="desk-clock-hands">
          <line
            x1="0"
            y1="5"
            x2="0"
            y2="-34"
            transform={`rotate(${clock.hourDeg})`}
            stroke="#46404d"
            strokeWidth="6"
          />
          <line
            x1="0"
            y1="8"
            x2="0"
            y2="-51"
            transform={`rotate(${clock.minDeg})`}
            stroke="#786485"
            strokeWidth="4"
          />
          <circle r="5" fill="#46404d" />
          <circle r="2" fill="#c7b7a0" />
        </g>
      </g>
    </svg>
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
  onBoard,
  boardUnread,
  onSticky,
  onOffice,
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
  onBoard: () => void
  boardUnread: number
  onSticky: (taskIndex: number) => void
  onOffice: () => void
}) {
  const wrap = React.useRef<HTMLDivElement>(null)
  const layer = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(0)

  React.useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver((e) =>
      setScale(e[0].contentRect.width / PLATE.w)
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // A few pixels of parallax, written straight to the layer (no re-render).
  const onMove = (e: React.PointerEvent) => {
    const el = layer.current
    if (
      !el ||
      e.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return
    const r = e.currentTarget.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width - 0.5) * -5
    const dy = ((e.clientY - r.top) / r.height - 0.5) * -3
    el.style.translate = `${dx}px ${dy}px`
  }

  const screenBox = bbox(PLATE.screen)
  const phoneBox = bbox(PLATE.phone)

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={() => {
        if (layer.current) layer.current.style.translate = "0px 0px"
      }}
      className="desk-scene relative w-full overflow-hidden rounded-[24px]"
      role="group"
      aria-label="Your interactive desk. Open the laptop, phone, noticeboard or notebook, choose a task note, or look out to the office."
      style={{ aspectRatio: `${PLATE.w} / ${PLATE.h}` }}
    >
      <div ref={layer} className="desk-scene-layer absolute inset-0">
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: PLATE.w,
            height: PLATE.h,
            transform: `scale(${scale})`,
          }}
        >
          <Plate />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 origin-top-left overflow-hidden"
            style={{
              width: 1000,
              height: 620,
              transform: matrix3dFor(1000, 620, PLATE.screen),
            }}
          >
            <ScreenPreview userName={userName} />
          </div>
          <div
            aria-hidden="true"
            className="desk-phone-surface absolute top-0 left-0 origin-top-left overflow-hidden"
            style={{
              width: 300,
              height: 540,
              transform: matrix3dFor(300, 540, PLATE.phone),
            }}
          >
            <PhonePreview
              persona={persona}
              message={message}
              time={clock.label}
            />
          </div>
          <DeskClock clock={clock} />
          <div
            className="desk-steam"
            aria-hidden="true"
            style={{ left: PLATE.mug.x, top: PLATE.mug.y }}
          >
            <span />
            <span />
            <span />
          </div>

          {shift && (
            <ul
              className="desk-notes absolute grid grid-cols-2 gap-4"
              style={{
                left: PLATE.notes.x,
                top: PLATE.notes.y,
                width: PLATE.notes.w,
              }}
              aria-label={`${shift.day}'s tasks`}
            >
              {shift.tasks.map((t, i) => {
                const done = doneIds.includes(t.id)
                const next = t.id === nextId || t.id === activeId
                return (
                  <li
                    key={t.id}
                    style={{ rotate: `${(i % 2 ? 2 : -2) + (i % 3) - 1}deg` }}
                  >
                    <button
                      type="button"
                      onClick={() => onSticky(i)}
                      className={cn(
                        "desk-sticky",
                        done && "is-done",
                        next && !done && "is-next"
                      )}
                      aria-label={`${t.title}${done ? ", done" : next ? ", up next" : ""}`}
                    >
                      <span className="desk-sticky-status">
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        {done ? (
                          <CheckIcon className="size-5" strokeWidth={3} />
                        ) : next ? (
                          <span>Up next ↗</span>
                        ) : null}
                      </span>
                      <span>{t.sticky}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={onLaptop}
            className="desk-hotspot absolute rounded-md"
            style={{
              left: screenBox.x,
              top: screenBox.y,
              width: screenBox.w,
              height: screenBox.h,
            }}
            aria-label="Open the laptop"
          >
            <span className="desk-object-label">
              Open laptop <span>↗</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onPhone}
            className="desk-hotspot desk-phone-hotspot absolute rounded-2xl"
            style={{
              left: phoneBox.x - 10,
              top: phoneBox.y - 12,
              width: phoneBox.w + 24,
              height: phoneBox.h + 30,
            }}
            aria-label={
              unread > 0
                ? `Phone: ${unread} new message${unread > 1 ? "s" : ""} from ${persona.first}`
                : "Phone"
            }
          >
            <span className="desk-object-label">
              Pick up phone <span>↗</span>
            </span>
            {unread > 0 && (
              <span className="desk-notification desk-notification-phone">
                {unread}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onBoard}
            className="desk-hotspot absolute rounded-2xl"
            style={{
              left: PLATE.board.x - 6,
              top: PLATE.board.y - 6,
              width: PLATE.board.w + 12,
              height: PLATE.board.h + 12,
            }}
            aria-label={
              boardUnread > 0
                ? `Noticeboard: ${boardUnread} new update${boardUnread > 1 ? "s" : ""}`
                : "Noticeboard: what's new in Claude"
            }
          >
            <span className="desk-object-label">
              What’s new <span>↗</span>
            </span>
            {boardUnread > 0 && (
              <span className="desk-notification">{boardUnread}</span>
            )}
          </button>
          <button
            type="button"
            onClick={onNotebook}
            className="desk-hotspot absolute rounded-md"
            style={{
              left: PLATE.notebook.x,
              top: PLATE.notebook.y,
              width: PLATE.notebook.w,
              height: PLATE.notebook.h,
            }}
            aria-label="Open your notebook: progress, habits, every task"
          >
            <span className="desk-object-label">
              Your notebook <span>↗</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onOffice}
            className="desk-hotspot absolute rounded-xl"
            style={{
              left: PLATE.window.x,
              top: PLATE.window.y,
              width: PLATE.window.w,
              height: PLATE.window.h,
            }}
            aria-label="The office: drills, setup and the safety check"
          >
            <span className="desk-object-label desk-object-label-top">
              The office <span>↗</span>
            </span>
          </button>
          <a
            href="#/shelf"
            className="desk-hotspot absolute rounded-md"
            style={{
              left: PLATE.books.x,
              top: PLATE.books.y,
              width: PLATE.books.w,
              height: PLATE.books.h,
            }}
            aria-label="The Shelf: reference for every day"
          >
            <span className="desk-object-label">
              The Shelf <span>↗</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
