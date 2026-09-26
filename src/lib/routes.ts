/* Hash routes. The app is a single page on Cloudflare assets, so routes live
   after "#/" and old section links ("#setup", "#connectors") stay valid via
   the alias table below. Nothing here is ever locked. */
import { useSyncExternalStore } from "react"

export type Route =
  | { kind: "lobby" }
  | { kind: "office" }
  | { kind: "start" }
  | { kind: "launchpad" }
  | { kind: "whatsnew" }
  | { kind: "drill"; id: string }
  | { kind: "room"; id: string }
  | { kind: "shelf"; section?: string }

/* Old v1/v2/v3 section ids -> new routes. Keep every id: they're linked from
   claude-design.html and from links already shared with assistants. */
const LEGACY: Record<string, string> = {
  intro: "/shelf/cowork",
  setup: "/room/desk",
  need: "/room/desk",
  "first-task": "/room/inbox",
  safety: "/room/vault",
  ready: "/",
  library: "/shelf",
  cowork: "/shelf/cowork",
  tour: "/shelf/cowork",
  "task-runs": "/shelf/cowork",
  "context-window": "/shelf/context-window",
  skills: "/shelf/skills",
  connectors: "/shelf/connectors",
  scheduled: "/shelf/scheduled",
  prompting: "/shelf/prompting",
  model: "/shelf/model",
  learn: "/shelf/learn",
  help: "/shelf/help",
  feedback: "/shelf/feedback",
  main: "/",
}

export function parseHash(hash: string): Route {
  let h = decodeURIComponent(hash.replace(/^#/, ""))
  if (!h.startsWith("/")) {
    if (h in LEGACY) h = LEGACY[h]
    else if (h === "") h = "/"
    else h = "/"
  }
  const parts = h.split("/").filter(Boolean)
  if (parts[0] === "room" && parts[1]) return { kind: "room", id: parts[1] }
  if (parts[0] === "shelf") return { kind: "shelf", section: parts[1] }
  if (parts[0] === "office") return { kind: "office" }
  if (parts[0] === "start") return { kind: "start" }
  if (parts[0] === "launchpad") return { kind: "launchpad" }
  if (parts[0] === "whats-new") return { kind: "whatsnew" }
  if (parts[0] === "drill" && parts[1]) return { kind: "drill", id: parts[1] }
  return { kind: "lobby" }
}

export function href(route: Route): string {
  if (route.kind === "room") return `#/room/${route.id}`
  if (route.kind === "shelf") return route.section ? `#/shelf/${route.section}` : "#/shelf"
  if (route.kind === "office") return "#/office"
  if (route.kind === "start") return "#/start"
  if (route.kind === "launchpad") return "#/launchpad"
  if (route.kind === "whatsnew") return "#/whats-new"
  if (route.kind === "drill") return `#/drill/${route.id}`
  return "#/"
}

export function navigate(route: Route) {
  location.hash = href(route)
}

const listeners = new Set<() => void>()
let current = parseHash(location.hash)
window.addEventListener("hashchange", () => {
  current = parseHash(location.hash)
  listeners.forEach((l) => l())
})
function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
export function useRoute(): Route {
  return useSyncExternalStore(subscribe, () => current, () => current)
}
