import { PLATE } from "./plateConfig"

/* The room is pre-rendered; Stage supplies live screens, clock and controls. */
export function Plate() {
  return (
    <img
      src={PLATE.src}
      alt=""
      width={PLATE.w}
      height={PLATE.h}
      draggable={false}
      fetchPriority="high"
      className="pointer-events-none absolute inset-0 size-full select-none"
    />
  )
}
