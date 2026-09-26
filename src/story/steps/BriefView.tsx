import * as React from "react"
import { cn } from "cn"
import { CheckIcon, CircleIcon, PlusIcon } from "lucide-react"

import { Composer } from "@/sim/Composer"
import { emptyComposer, type ComposerState } from "@/sim/composerState"
import { ClaudeMsg, PanelCard, UserBubble } from "@/sim/parts"
import { Shell, Thread } from "@/sim/Shell"
import { SIM } from "@/sim/theme"
import type { BriefStep } from "../types"
import type { RunnerApi } from "../useRunner"
import { matches } from "./common"

/* Write the brief in the practice composer. A live checklist shows which
   ingredients are in; sending an incomplete brief gets Claude's questions
   back, the way the real thing would ask or guess. */
export function BriefView({ step, api, userName }: { step: BriefStep; api: RunnerApi; userName: string }) {
  const persona = api.path.persona!
  const [c, setC] = React.useState<ComposerState>(emptyComposer)
  const [tries, setTries] = React.useState<{ text: string; missing: string[] }[]>([])

  const checks = step.ingredients.map((i) => ({ ...i, ok: matches(i.test, c.text) }))
  const proj = step.projects.find((p) => p.id === c.project)
  const okProject = step.projects.find((p) => p.ok)
  const modeOk = step.mode === "any" || c.mode === step.mode
  const fileName = (id: string) => step.files.find((f) => f.id === id)?.name ?? id

  const send = () => {
    const missing: string[] = []
    checks.filter((x) => !x.ok).forEach((x) => missing.push(x.label))
    step.needFiles.filter((f) => !c.files.includes(f)).forEach((f) => missing.push(`The file ${fileName(f)}`))
    if (!proj) missing.push("Which project or folder to work in")
    else if (!proj.ok) missing.push(`A narrower place than ${proj.label}. ${proj.why ?? ""}`.trim())
    if (!modeOk) missing.push(step.mode === "cowork" ? "Cowork mode: this job needs your files and tools" : "Chat mode is enough for this one")
    if (missing.length) {
      setTries((t) => [...t, { text: c.text, missing }])
      return
    }
    api.setLastPrompt(c.text)
    api.done(tries.length === 0)
  }

  const insert = (text: string) => setC((s) => ({ ...s, text: s.text.trim() ? `${s.text.trim()} ${text}` : text }))

  const panel = (
    <div className="flex flex-col gap-5 font-sans">
      <PanelCard title="Brief checklist">
        <ul className="flex flex-col gap-1.5">
          {checks.map((x) => (
            <li key={x.id} className="flex items-center gap-2 text-[13.5px]">
              {x.ok ? <CheckIcon className="size-4 shrink-0 text-[#0E8A4F]" /> : <CircleIcon className="size-4 shrink-0 text-[#B8B5AA]" />}
              <span className={cn("min-w-0 flex-1", x.ok && "text-[#73726C]")}>{x.label}</span>
              {!x.ok && (
                <button type="button" onClick={() => insert(x.insert)} className="flex items-center gap-1 rounded-md border border-[#E1DFD6] bg-white px-2 py-0.5 text-[12px] hover:bg-[#F3F2EC]">
                  <PlusIcon className="size-3" /> Insert
                </button>
              )}
            </li>
          ))}
        </ul>
        <p className="text-[12.5px] text-[#73726C]">Wording doesn't matter. Having each ingredient does.</p>
      </PanelCard>
      <PanelCard title="Set up">
        <ul className="flex flex-col gap-1.5 text-[13.5px]">
          {step.needFiles.map((f) => (
            <li key={f} className="flex items-center gap-2">
              {c.files.includes(f) ? <CheckIcon className="size-4 text-[#0E8A4F]" /> : <CircleIcon className="size-4 text-[#B8B5AA]" />}
              Attach {fileName(f)} <span className="text-[#73726C]">(the + button)</span>
            </li>
          ))}
          <li className="flex items-center gap-2">
            {proj?.ok ? <CheckIcon className="size-4 text-[#0E8A4F]" /> : <CircleIcon className="size-4 text-[#B8B5AA]" />}
            Work in {okProject?.label ?? "the client's project"}
          </li>
          {step.mode !== "any" && (
            <li className="flex items-center gap-2">
              {modeOk ? <CheckIcon className="size-4 text-[#0E8A4F]" /> : <CircleIcon className="size-4 text-[#B8B5AA]" />}
              {step.mode === "cowork" ? "Cowork on" : "Chat on"}
            </li>
          )}
          {step.skill && (
            <li className="flex items-center gap-2 text-[#73726C]">
              <CircleIcon className="size-4 text-transparent" />
              Optional: start with /{step.skill}
            </li>
          )}
        </ul>
      </PanelCard>
    </div>
  )

  const composer = <Composer state={c} onChange={setC} onSend={send} files={step.files} projects={step.projects} autoFocus />

  return (
    <Shell active="new" userName={userName} project={persona.company} panel={panel}>
      {tries.length === 0 ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[680px] flex-col gap-5 px-4 py-8 md:px-6 md:py-12">
            <h2 className="text-center text-[30px] text-[#1F1E1D]" style={SIM.serif}>
              Good morning, {userName}
            </h2>
            <div className="rounded-2xl border border-[#E7E5DD] bg-white px-4 py-3 font-sans text-[14px] leading-relaxed">
              <p className="text-[12px] font-semibold tracking-[0.06em] text-[#73726C] uppercase">{persona.first} asked</p>
              <p className="mt-1">“{api.task?.open}”</p>
              <p className="mt-2 text-[#73726C]">{step.prompt}</p>
            </div>
            {composer}
          </div>
        </div>
      ) : (
        <>
          <Thread>
            {tries.map((t, i) => (
              <React.Fragment key={i}>
                <UserBubble>{t.text}</UserBubble>
                <ClaudeMsg>
                  <p>Before I start, I'm missing a few things:</p>
                  <ul className="mt-1.5 list-disc pl-5">
                    {t.missing.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                  <p className="mt-1.5">Add them and send it again. Otherwise I'd be guessing.</p>
                </ClaudeMsg>
              </React.Fragment>
            ))}
          </Thread>
          <div className="mx-auto w-full max-w-[720px] px-4 pb-4 md:px-6">{composer}</div>
        </>
      )}
    </Shell>
  )
}
