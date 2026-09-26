/* A scripted Claude run for the simulator. No model is ever called. */
export type PlanStep = {
  text: string
  /* Present on the one step the assistant must catch. */
  bad?: {
    why: string
    options: { text: string; good?: boolean; why?: string }[]
    fixed: string
  }
}
export type Scenario = {
  id: string
  client: string
  model: string
  context: string[]
  prompt: string
  plan: PlanStep[]
  tools: string[]
  output: { title: string; drafts: { to: string; subject: string; body: string }[] }
  approveWarning: string
}
