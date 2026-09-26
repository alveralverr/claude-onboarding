import type { Mission } from "../types"
import { DESK } from "./desk"
import { INBOX_MISSION } from "./inbox"
import { VAULT } from "./vault"

export const MISSIONS: Record<string, Mission> = {
  desk: DESK,
  inbox: INBOX_MISSION,
  vault: VAULT,
}
