/* The office: rooms on the map, badges, levels, desk items. Hotspot positions
   come from ZONES in src/world/iso.ts so they sit on the furniture. */

export type RoomId = "desk" | "inbox" | "vault" | "studio" | "switchboard" | "clock" | "writing" | "workshop" | "engine" | "shelf" | "help"

export type Room = {
  id: RoomId
  name: string
  blurb: string
  minutes?: number
  core?: boolean
  mastery?: boolean
  /* the v1 key its "take it live" step ticks, if any */
  live?: string
  badge?: string
  href: string
}

export const ROOMS: Room[] = [
  { id: "desk", name: "Your Desk", blurb: "Set up Claude and Cowork", minutes: 20, core: true, href: "#/room/desk" },
  { id: "inbox", name: "The Inbox", blurb: "Run a first task, safely", minutes: 10, core: true, href: "#/room/inbox" },
  { id: "vault", name: "The Vault", blurb: "Pass the safety check", minutes: 6, core: true, href: "#/room/vault" },
  { id: "studio", name: "The Studio", blurb: "Docs, slides and files", minutes: 7, mastery: true, live: "live-studio", badge: "deck-builder", href: "#/room/studio" },
  { id: "switchboard", name: "The Switchboard", blurb: "Connectors, and their limits", minutes: 6, mastery: true, live: "live-switchboard", badge: "connector-pro", href: "#/room/switchboard" },
  { id: "clock", name: "The Clock Tower", blurb: "Scheduled tasks and EOD", minutes: 7, mastery: true, live: "live-clock", badge: "scheduler", href: "#/room/clock" },
  { id: "writing", name: "The Writing Room", blurb: "Prompting and client voice", minutes: 8, mastery: true, live: "live-writing", badge: "prompt-whisperer", href: "#/room/writing" },
  { id: "workshop", name: "The Workshop", blurb: "Skills, yours and Magic's", minutes: 6, mastery: true, live: "live-workshop", badge: "skill-maker", href: "#/room/workshop" },
  { id: "engine", name: "The Engine Room", blurb: "Models, limits, memory", minutes: 5, mastery: true, live: "live-engine", href: "#/room/engine" },
  { id: "shelf", name: "The Shelf", blurb: "Reference for every day", href: "#/shelf" },
  { id: "help", name: "Help Desk", blurb: "Every route to a human", href: "#/shelf/help" },
]

export const CORE_ORDER: RoomId[] = ["desk", "inbox", "vault"]
export const MASTERY_ORDER: RoomId[] = ["studio", "switchboard", "clock", "writing", "workshop", "engine"]

export type Badge = { id: string; name: string; how: string }
export const BADGES: Badge[] = [
  { id: "desk-ready", name: "Desk ready", how: "Finished every setup item." },
  { id: "first-task", name: "First real task", how: "Ran a real Cowork task and reviewed it." },
  { id: "editors-eye", name: "Editor's eye", how: "Fixed the sentences a client would call too AI." },
  { id: "secret-keeper", name: "Secret keeper", how: "Caught a credential before it reached a prompt." },
  { id: "client-ready", name: "Client-ready", how: "Passed the safety check with everything else done." },
  { id: "deck-builder", name: "Deck builder", how: "Built a real doc or deck with Claude." },
  { id: "connector-pro", name: "Connector pro", how: "Connected one more app and tested it on real work." },
  { id: "scheduler", name: "Scheduler", how: "Set up a low-risk scheduled task or ran the EOD skill." },
  { id: "prompt-whisperer", name: "Prompt whisperer", how: "Wrote Instructions for Claude for a real client." },
  { id: "skill-maker", name: "Skill maker", how: "Made or used a skill on real work." },
  { id: "streak", name: "Three-week streak", how: "Came back three weeks in a row." },
  { id: "voice-heard", name: "Voice heard", how: "Sent feedback on the office." },
]

export type Level = { n: number; name: string; xp: number }
export const LEVELS: Level[] = [
  { n: 1, name: "New hire", xp: 0 },
  { n: 2, name: "Set up", xp: 250 },
  { n: 3, name: "Client-ready", xp: 880 },
  { n: 4, name: "Power user", xp: 1250 },
  { n: 5, name: "Magic pro", xp: 1500 },
]

/* Cosmetic rewards on your desk, one per level after the first. */
export type DeskItem = { id: string; name: string; level: number; src: string }
export const DESK_ITEMS: DeskItem[] = [
  { id: "mug", name: "Mug", level: 2, src: "/assets/media/item-mug.webp" },
  { id: "plant", name: "Plant", level: 3, src: "/assets/media/item-plant.webp" },
  { id: "lamp", name: "Lamp", level: 4, src: "/assets/media/item-lamp.webp" },
  { id: "monitor", name: "Second monitor", level: 5, src: "/assets/media/item-monitor.webp" },
]

export const AVATARS = [
  { id: "a1", name: "Bea", src: "/assets/media/avatar-1.svg" },
  { id: "a2", name: "Marco", src: "/assets/media/avatar-2.svg" },
  { id: "a3", name: "Lea", src: "/assets/media/avatar-3.svg" },
  { id: "a4", name: "Jun", src: "/assets/media/avatar-4.svg" },
]
