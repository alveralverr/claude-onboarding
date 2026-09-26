/* Voiceover playback: one Audio object for the whole page, created on the
   first click so nothing is fetched until someone presses play. */
import { useSyncExternalStore } from "react"

import { toast } from "@/components/ui/toast"

let current: string | null = null
let audio: HTMLAudioElement | null = null
const listeners = new Set<() => void>()

function set(src: string | null) {
  current = src
  listeners.forEach((l) => l())
}

export function stopVoiceover() {
  if (audio) {
    audio.pause()
    audio = null
  }
  set(null)
}

export function playVoiceover(src: string) {
  stopVoiceover()
  const a = new Audio(src)
  audio = a
  a.addEventListener("ended", stopVoiceover)
  a.addEventListener("error", () => {
    stopVoiceover()
    toast.add({ title: "Audio unavailable right now.", type: "error" })
  })
  set(src)
  const p = a.play()
  if (p && typeof p.catch === "function") p.catch(() => stopVoiceover())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
const get = () => current

/** The src that is currently playing, or null. */
export function useVoiceoverSrc() {
  return useSyncExternalStore(subscribe, get, get)
}
