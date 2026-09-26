import { CalculatorIcon, HeadsetIcon, HouseIcon, InboxIcon, MagnetIcon, MegaphoneIcon, PartyPopperIcon, ScaleIcon, ShoppingBagIcon, StethoscopeIcon, UsersIcon, WorkflowIcon } from "lucide-react"

export const PATH_ICONS = {
  inbox: InboxIcon,
  calculator: CalculatorIcon,
  magnet: MagnetIcon,
  workflow: WorkflowIcon,
  megaphone: MegaphoneIcon,
  headset: HeadsetIcon,
  stethoscope: StethoscopeIcon,
  scale: ScaleIcon,
  shopping: ShoppingBagIcon,
  users: UsersIcon,
  house: HouseIcon,
  party: PartyPopperIcon,
} as const

export const pathIcon = (key: string) => PATH_ICONS[key as keyof typeof PATH_ICONS] ?? InboxIcon

/* Shift clock: 9:00 am plus 90 minutes per finished task, capped at 5:00 pm. */
export function shiftClock(doneTasks: number) {
  const mins = Math.min(9 * 60 + doneTasks * 90, 17 * 60)
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const hh = ((h + 11) % 12) + 1
  return { label: `${hh}:${m.toString().padStart(2, "0")} ${h < 12 ? "am" : "pm"}`, hourDeg: ((h % 12) + m / 60) * 30, minDeg: m * 6 }
}
