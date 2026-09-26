/* The office: rooms on the map, badges, levels. Positions are percentages of
   the lobby scene (public/assets/media/office-lobby.webp). */

export type RoomId = "desk" | "inbox" | "vault" | "shelf" | "help"

export type Room = {
  id: RoomId
  name: string
  blurb: string
  minutes?: number
  core?: boolean
  href: string
  /* hotspot centre on the scene, in % */
  x: number
  y: number
}

export const ROOMS: Room[] = [
  { id: "desk", name: "Your Desk", blurb: "Set up Claude and Cowork", minutes: 20, core: true, href: "#/room/desk", x: 22, y: 66 },
  { id: "inbox", name: "The Inbox", blurb: "Run a first task, safely", minutes: 10, core: true, href: "#/room/inbox", x: 78, y: 66 },
  { id: "vault", name: "The Vault", blurb: "Pass the safety check", minutes: 6, core: true, href: "#/room/vault", x: 20, y: 30 },
  { id: "shelf", name: "The Shelf", blurb: "Reference for every day", href: "#/shelf", x: 50, y: 22 },
  { id: "help", name: "Help Desk", blurb: "Every route to a human", href: "#/shelf/help", x: 80, y: 28 },
]

export const CORE_ORDER: RoomId[] = ["desk", "inbox", "vault"]

export type Badge = { id: string; name: string; how: string }
export const BADGES: Badge[] = [
  { id: "desk-ready", name: "Desk ready", how: "Finished every setup item." },
  { id: "first-task", name: "First real task", how: "Ran a real Cowork task and reviewed it." },
  { id: "editors-eye", name: "Editor's eye", how: "Fixed the sentences a client would call too AI." },
  { id: "secret-keeper", name: "Secret keeper", how: "Caught a credential before it reached a prompt." },
  { id: "client-ready", name: "Client-ready", how: "Passed the safety check with everything else done." },
]

export type Level = { n: number; name: string; xp: number }
export const LEVELS: Level[] = [
  { n: 1, name: "New hire", xp: 0 },
  { n: 2, name: "Set up", xp: 200 },
  { n: 3, name: "Client-ready", xp: 500 },
  { n: 4, name: "Power user", xp: 900 },
  { n: 5, name: "Magic pro", xp: 1400 },
]

export const AVATARS = [
  { id: "a1", name: "Bea", src: "/assets/media/avatar-1.svg" },
  { id: "a2", name: "Marco", src: "/assets/media/avatar-2.svg" },
  { id: "a3", name: "Lea", src: "/assets/media/avatar-3.svg" },
  { id: "a4", name: "Jun", src: "/assets/media/avatar-4.svg" },
]
