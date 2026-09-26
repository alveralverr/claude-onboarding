/* The office: rooms on the map, badges, levels, desk items, avatars.
   Images are WebP in public/assets/media, converted from the ChatGPT renders
   in assets-src/v4 (see the README there). `spot` is where the room's label
   sits on the lobby scene (lobby-1536.webp), in % of width and height,
   measured at the top of the furniture. */

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
  spot: { x: number; y: number }
  /* banner at the top of the room, public/assets/media/room-<id>.webp */
  image: string
}

export const ROOMS: Room[] = [
  { id: "desk", name: "Your Desk", blurb: "Set up Claude and Cowork", minutes: 20, core: true, href: "#/room/desk", spot: { x: 20, y: 52 }, image: "/assets/media/room-desk.webp" },
  { id: "inbox", name: "The Inbox", blurb: "Run a first task, safely", minutes: 10, core: true, href: "#/room/inbox", spot: { x: 78, y: 64 }, image: "/assets/media/room-inbox.webp" },
  { id: "vault", name: "The Vault", blurb: "Pass the safety check", minutes: 6, core: true, href: "#/room/vault", spot: { x: 24, y: 12 }, image: "/assets/media/room-vault.webp" },
  { id: "studio", name: "The Studio", blurb: "Docs, slides and files", minutes: 7, mastery: true, live: "live-studio", badge: "deck-builder", href: "#/room/studio", spot: { x: 47, y: 58 }, image: "/assets/media/room-studio.webp" },
  { id: "switchboard", name: "The Switchboard", blurb: "Connectors, and their limits", minutes: 6, mastery: true, live: "live-switchboard", badge: "connector-pro", href: "#/room/switchboard", spot: { x: 41, y: 8 }, image: "/assets/media/room-switchboard.webp" },
  { id: "clock", name: "The Clock Tower", blurb: "Scheduled tasks and EOD", minutes: 7, mastery: true, live: "live-clock", badge: "scheduler", href: "#/room/clock", spot: { x: 15, y: 27 }, image: "/assets/media/room-clock.webp" },
  { id: "writing", name: "The Writing Room", blurb: "Prompting and client voice", minutes: 8, mastery: true, live: "live-writing", badge: "prompt-whisperer", href: "#/room/writing", spot: { x: 60, y: 41 }, image: "/assets/media/room-writing.webp" },
  { id: "workshop", name: "The Workshop", blurb: "Skills, yours and Magic's", minutes: 6, mastery: true, live: "live-workshop", badge: "skill-maker", href: "#/room/workshop", spot: { x: 40, y: 29 }, image: "/assets/media/room-workshop.webp" },
  { id: "engine", name: "The Engine Room", blurb: "Models, limits, memory", minutes: 5, mastery: true, live: "live-engine", href: "#/room/engine", spot: { x: 83, y: 46 }, image: "/assets/media/room-engine.webp" },
  { id: "shelf", name: "The Shelf", blurb: "Reference for every day", href: "#/shelf", spot: { x: 59, y: 10 }, image: "/assets/media/room-shelf.webp" },
  { id: "help", name: "Help Desk", blurb: "Every route to a human", href: "#/shelf/help", spot: { x: 81, y: 27 }, image: "/assets/media/room-help.webp" },
]

export const CORE_ORDER: RoomId[] = ["desk", "inbox", "vault"]
export const MASTERY_ORDER: RoomId[] = ["studio", "switchboard", "clock", "writing", "workshop", "engine"]

export type Badge = { id: string; name: string; how: string }
export const badgeImage = (id: string) => `/assets/media/badge-${id}.webp`
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

/* Ids stay a1..a6 because the chosen id is stored in each browser. */
export const AVATARS = [
  { id: "a1", name: "Bea", src: "/assets/media/avatar-bea.webp" },
  { id: "a2", name: "Marco", src: "/assets/media/avatar-marco.webp" },
  { id: "a3", name: "Lea", src: "/assets/media/avatar-lea.webp" },
  { id: "a4", name: "Jun", src: "/assets/media/avatar-jun.webp" },
  { id: "a5", name: "Ria", src: "/assets/media/avatar-ria.webp" },
  { id: "a6", name: "Paolo", src: "/assets/media/avatar-paolo.webp" },
]

/* The practice client in The Inbox and The Clock Tower. Fictional. */
export const CLIENT_DANA = "/assets/media/client-dana.webp"
