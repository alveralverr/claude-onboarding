import type { Mission } from "../types"
import { CLOCK } from "./clock"
import { DESK } from "./desk"
import { ENGINE } from "./engine"
import { INBOX_MISSION } from "./inbox"
import { STUDIO } from "./studio"
import { SWITCHBOARD } from "./switchboard"
import { VAULT } from "./vault"
import { WORKSHOP } from "./workshop"
import { WRITING } from "./writing"

export const MISSIONS: Record<string, Mission> = {
  desk: DESK,
  inbox: INBOX_MISSION,
  vault: VAULT,
  studio: STUDIO,
  switchboard: SWITCHBOARD,
  clock: CLOCK,
  writing: WRITING,
  workshop: WORKSHOP,
  engine: ENGINE,
}
