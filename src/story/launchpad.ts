/* Builds the "Week 1 Launchpad" block in the exact shape the
   assistant-onboarding skill parses (references/launchpad-block.md in that
   skill). Unanswered fields are written as "not set", which it accepts. */
export type LaunchpadFields = {
  ea: string
  client: string
  company: string
  industry: string
  comms: string[]
  commsOther: string
  schedule: string
  preferences: string
  platforms: string[]
  platformsOther: string
  recurring: string[]
  timeSink: string
  connected: string[]
  al: string
  alEmail: string
}

export const emptyLaunchpad = (): LaunchpadFields => ({
  ea: "",
  client: "",
  company: "",
  industry: "",
  comms: [],
  commsOther: "",
  schedule: "",
  preferences: "",
  platforms: [],
  platformsOther: "",
  recurring: [],
  timeSink: "",
  connected: [],
  al: "",
  alEmail: "",
})

const val = (s: string) => (s.trim() ? s.trim() : "not set")
const list = (items: string[], other: string) => {
  const parts = [...items]
  if (other.trim()) parts.push(`Other (${other.trim()})`)
  return parts.length ? parts.join(", ") : "not set"
}

export function buildLaunchpad(f: LaunchpadFields, setup: { desktop: boolean }) {
  const connect = f.platforms.filter((p) => !f.connected.includes(p))
  const al = f.al.trim() ? `${f.al.trim()}${f.alEmail.trim() ? ` <${f.alEmail.trim()}>` : ""}` : "not set"
  return [
    "Week 1 walkthrough is done. Use the context below, skip anything it already answers,",
    "connect what is still missing, then run one workflow with me and document it.",
    `Week 1 Launchpad: ${val(f.ea)} / ${val(f.client)}`,
    `Company: ${val(f.company)}`,
    `Industry: ${val(f.industry)}`,
    `Comms: ${list(f.comms, f.commsOther)}`,
    `Schedule: ${val(f.schedule)}`,
    `Preferences: ${val(f.preferences)}`,
    `Platforms: ${list(f.platforms, f.platformsOther)}`,
    `Recurring tasks: ${f.recurring.length ? f.recurring.join("; ") : "not set"}`,
    `Biggest time sink: ${val(f.timeSink)}`,
    `Already connected: ${f.connected.length ? f.connected.join(", ") : "not set"}`,
    `Connect: ${connect.length ? connect.join(", ") : "not set"}`,
    `AL: ${al}`,
    "Progress: step 8 of 8",
    `Setup: Install the Claude desktop app ${setup.desktop ? "yes" : "no"}; Install the Chrome extension not set; Activated onboarding skill in Cowork no`,
  ].join("\n")
}

export function parseStored(raw?: Record<string, string>): LaunchpadFields {
  if (!raw) return emptyLaunchpad()
  const base = emptyLaunchpad()
  const out = { ...base } as Record<string, unknown>
  for (const [k, v] of Object.entries(raw)) {
    if (!(k in base)) continue
    out[k] = Array.isArray((base as Record<string, unknown>)[k]) ? v.split("|").filter(Boolean) : v
  }
  return out as LaunchpadFields
}

export function toStored(f: LaunchpadFields): Record<string, string> {
  return Object.fromEntries(Object.entries(f).map(([k, v]) => [k, Array.isArray(v) ? v.join("|") : String(v)]))
}
