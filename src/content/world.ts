/* The office: rooms on the map, badges, levels, desk items, avatars.
   Images are WebP in public/assets/media, converted from the ChatGPT renders
   in assets-src/v6 (brief: assets-src/v5/asset-brief-v2.md). `spot` is where the room's label
   sits on the lobby scene (lobby-1536.webp), in % of width and height,
   measured at the top of the furniture. Re-measure all nine whenever the
   lobby render changes (current: assets-src/v6/lobby.png).

   Since v5 the desk (#/) is the only home. The office map opens from the
   desk, every room exits back to it, and two v4 rooms are retired: The Inbox
   (its lesson is Shift 1) and The Clock Tower (Shift 3 and the Shelf's
   scheduled tasks section). Their step keys still count in derive(). */

export type RoomId = "desk" | "vault" | "studio" | "switchboard" | "writing" | "workshop" | "engine" | "shelf" | "help"

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
  { id: "desk", name: "Set up your real Claude", blurb: "Invite, desktop app, connectors, skills", minutes: 20, core: true, href: "#/room/desk", spot: { x: 25, y: 48 }, image: "/assets/media/room-desk.webp" },
  { id: "vault", name: "The Vault", blurb: "Pass the safety check", minutes: 6, core: true, href: "#/room/vault", spot: { x: 39.7, y: 14.5 }, image: "/assets/media/room-vault.webp" },
  { id: "studio", name: "The Studio", blurb: "Docs, slides and files", minutes: 7, mastery: true, live: "live-studio", badge: "deck-builder", href: "#/room/studio", spot: { x: 46.5, y: 54 }, image: "/assets/media/room-studio.webp" },
  { id: "switchboard", name: "The Switchboard", blurb: "Connectors, and their limits", minutes: 6, mastery: true, live: "live-switchboard", badge: "connector-pro", href: "#/room/switchboard", spot: { x: 53.7, y: 17 }, image: "/assets/media/room-switchboard.webp" },
  { id: "writing", name: "The Writing Room", blurb: "Prompting and client voice", minutes: 8, mastery: true, live: "live-writing", badge: "prompt-whisperer", href: "#/room/writing", spot: { x: 51.5, y: 38.5 }, image: "/assets/media/room-writing.webp" },
  { id: "workshop", name: "The Workshop", blurb: "Skills, yours and Magic's", minutes: 6, mastery: true, live: "live-workshop", badge: "skill-maker", href: "#/room/workshop", spot: { x: 30.5, y: 30 }, image: "/assets/media/room-workshop.webp" },
  { id: "engine", name: "The Engine Room", blurb: "Models, limits, memory", minutes: 5, mastery: true, live: "live-engine", href: "#/room/engine", spot: { x: 72, y: 40 }, image: "/assets/media/room-engine.webp" },
  { id: "shelf", name: "The Shelf", blurb: "Reference for every day", href: "#/shelf", spot: { x: 67, y: 18 }, image: "/assets/media/room-shelf.webp" },
  { id: "help", name: "Help Desk", blurb: "Every route to a human", href: "#/shelf/help", spot: { x: 70.5, y: 64 }, image: "/assets/media/room-help.webp" },
]

export const CORE_ORDER: RoomId[] = ["desk", "vault"]
export const MASTERY_ORDER: RoomId[] = ["studio", "switchboard", "writing", "workshop", "engine"]

export type Badge = { id: string; name: string; how: string }
export const badgeImage = (id: string) => `/assets/media/badge-${id}.webp`
/* Badges that have a rendered medallion in public/assets/media (the v6 set,
   sources in assets-src/v6). Any new id draws a fallback until its render
   arrives. */
export const BADGE_ART = new Set([
  "desk-ready", "first-task", "editors-eye", "secret-keeper", "client-ready", "deck-builder",
  "connector-pro", "scheduler", "prompt-whisperer", "skill-maker", "streak", "voice-heard",
  "first-shift", "path-admin", "path-finance", "path-leadgen", "path-ops", "path-content",
])

/* Andi, the practice Account Lead who coaches and texts during shifts. */
export const COACH_ANDI = "/assets/media/coach-andi.webp"
export const BADGES: Badge[] = [
  { id: "desk-ready", name: "Desk ready", how: "Finished every setup item." },
  { id: "first-task", name: "First real task", how: "Took one task from a shift live in your real Claude, and reviewed it." },
  { id: "editors-eye", name: "Editor's eye", how: "Fixed the sentences a client would call too AI." },
  { id: "secret-keeper", name: "Secret keeper", how: "Caught a credential before it reached a prompt." },
  { id: "client-ready", name: "Client-ready", how: "Set up, first shift done, safety check passed." },
  { id: "deck-builder", name: "Deck builder", how: "Built a real doc or deck with Claude." },
  { id: "connector-pro", name: "Connector pro", how: "Connected one more app and tested it on real work." },
  { id: "scheduler", name: "Scheduler", how: "Ran your EOD with the skill for a week (the weekly quest)." },
  { id: "prompt-whisperer", name: "Prompt whisperer", how: "Wrote Instructions for Claude for a real client." },
  { id: "skill-maker", name: "Skill maker", how: "Made or used a skill on real work." },
  { id: "streak", name: "Three-week streak", how: "Came back three weeks in a row." },
  { id: "voice-heard", name: "Voice heard", how: "Sent feedback on the office." },
  { id: "first-shift", name: "First shift", how: "Finished a full shift at your desk." },
  { id: "path-admin", name: "General admin", how: "Finished every shift of the General admin path." },
  { id: "path-finance", name: "Finance admin", how: "Finished every shift of the Bookkeeping and finance path." },
  { id: "path-leadgen", name: "Lead gen", how: "Finished every shift of the Lead gen and sales path." },
  { id: "path-ops", name: "Operations", how: "Finished every shift of the Operations and data path." },
  { id: "path-content", name: "Content", how: "Finished every shift of the Content and social path." },
]

export type Level = { n: number; name: string; xp: number }
export const LEVELS: Level[] = [
  { n: 1, name: "New hire", xp: 0 },
  { n: 2, name: "Set up", xp: 250 },
  { n: 3, name: "Client-ready", xp: 800 },
  { n: 4, name: "Power user", xp: 1400 },
  { n: 5, name: "Magic pro", xp: 2000 },
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
