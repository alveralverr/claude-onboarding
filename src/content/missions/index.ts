import type { Mission } from "../types"
import { DESK } from "./desk"
import { ENGINE } from "./engine"
import { STUDIO } from "./studio"
import { SWITCHBOARD } from "./switchboard"
import { VAULT } from "./vault"
import { WORKSHOP } from "./workshop"
import { WRITING } from "./writing"

export const MISSIONS: Record<string, Mission> = {
  desk: DESK,
  vault: VAULT,
  studio: STUDIO,
  switchboard: SWITCHBOARD,
  writing: WRITING,
  workshop: WORKSHOP,
  engine: ENGINE,
}
