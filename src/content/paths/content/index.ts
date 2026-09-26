import type { PathDef } from "@/story/types"
import { LEAH } from "./persona"
import { SHIFT_1 } from "./shift1"
import { SHIFT_2 } from "./shift2"
import { SHIFT_3 } from "./shift3"

export const CONTENT: PathDef = {
  id: "content",
  name: "Content and social",
  blurb: "Posts, captions, design",
  icon: "megaphone",
  live: true,
  persona: LEAH,
  shifts: [SHIFT_1, SHIFT_2, SHIFT_3],
  launchpad: {
    recurring: ["captions from episodes", "repurposing one video into posts", "content calendar", "thumbnails and design briefs", "weekly recap"],
    platforms: ["Canva", "Instagram", "YouTube", "Notion", "Google Drive", "Fathom"],
  },
}
