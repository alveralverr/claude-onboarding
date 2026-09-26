import * as React from "react"
import { cn } from "cn"
import { ArrowUpIcon, ChevronDownIcon, FileSpreadsheetIcon, FileTextIcon, FolderIcon, InfoIcon, MicIcon, PlusIcon, ShieldCheckIcon, VideoIcon, XIcon, ZapIcon } from "lucide-react"

import { NOW } from "@/content/now"
import type { ClientFile } from "@/story/types"
import { MenuItem, MenuList } from "./parts"
import { useMenu } from "./useMenu"
import { SKILLS, type ComposerState } from "./composerState"

const FILE_ICON = { doc: FileTextIcon, sheet: FileSpreadsheetIcon, pdf: FileTextIcon, recording: VideoIcon, email: FileTextIcon }

export function Composer({
  state,
  onChange,
  onSend,
  files = [],
  projects = [],
  sendLabel = "Send",
  autoFocus,
}: {
  state: ComposerState
  onChange: (s: ComposerState) => void
  onSend: () => void
  files?: ClientFile[]
  projects?: { id: string; label: string }[]
  sendLabel?: string
  autoFocus?: boolean
}) {
  const { open: attachOpen, setOpen: setAttachOpen, ref: attachRef } = useMenu()
  const { open: projectOpen, setOpen: setProjectOpen, ref: projectRef } = useMenu()
  const { open: permOpen, setOpen: setPermOpen, ref: permRef } = useMenu()
  const taRef = React.useRef<HTMLTextAreaElement>(null)
  const set = (patch: Partial<ComposerState>) => onChange({ ...state, ...patch })

  // "/" at the start opens the skills list, filtered by what follows it.
  const slash = /^\/([\w-]*)$/.exec(state.text.trim())
  const skillMatches = slash ? SKILLS.filter((s) => s.id.startsWith(slash[1])) : []
  const pickSkill = (id: string) => {
    set({ text: `/${id} ` })
    taRef.current?.focus()
  }

  const canSend = state.text.trim().length > 0
  const projectLabel = projects.find((p) => p.id === state.project)?.label

  return (
    <div className="font-sans">
      <div className="relative rounded-2xl border border-[#E1DFD6] bg-white p-3 shadow-[0_1px_2px_rgba(20,10,60,0.04)] focus-within:border-[#CFCBBF]">
        {state.files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {state.files.map((id) => {
              const f = files.find((x) => x.id === id)
              if (!f) return null
              const Icon = FILE_ICON[f.kind]
              return (
                <span key={id} className="flex items-center gap-1.5 rounded-lg border border-[#E7E5DD] bg-[#FAF9F5] py-1 pr-1 pl-2 text-[12.5px]">
                  <Icon className="size-3.5 text-[#73726C]" /> {f.name}
                  <button type="button" onClick={() => set({ files: state.files.filter((x) => x !== id) })} className="rounded p-0.5 hover:bg-[#EFEDE6]" aria-label={`Remove ${f.name}`}>
                    <XIcon className="size-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}
        <textarea
          ref={taRef}
          value={state.text}
          autoFocus={autoFocus}
          onChange={(e) => set({ text: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (canSend) onSend()
            }
          }}
          rows={3}
          placeholder="Type / for skills"
          aria-label="Message the practice Claude"
          className="block max-h-56 min-h-[4.5rem] w-full resize-y bg-transparent text-[14.5px] leading-relaxed outline-none placeholder:text-[#9C9A92]"
        />
        {skillMatches.length > 0 && (
          <MenuList up className="left-3 w-72">
            <p className="px-2.5 pt-1 pb-1.5 text-[11.5px] font-semibold tracking-[0.06em] text-[#73726C] uppercase">Skills</p>
            {skillMatches.map((s) => (
              <MenuItem key={s.id} onSelect={() => pickSkill(s.id)} hint={s.hint}>
                /{s.id}
              </MenuItem>
            ))}
          </MenuList>
        )}
        <div className="mt-2 flex items-center gap-2">
          <div className="relative" ref={attachRef}>
            <button type="button" onClick={() => setAttachOpen((o) => !o)} className="flex size-8 items-center justify-center rounded-lg border border-[#E7E5DD] hover:bg-[#F3F2EC]" aria-label="Attach a file" aria-expanded={attachOpen}>
              <PlusIcon className="size-4" />
            </button>
            {attachOpen && (
              <MenuList up className="w-72">
                <p className="px-2.5 pt-1 pb-1.5 text-[11.5px] font-semibold tracking-[0.06em] text-[#73726C] uppercase">Client folder</p>
                {files.length === 0 && <p className="px-2.5 py-2 text-[#73726C]">No files for this task.</p>}
                {files.map((f) => {
                  const on = state.files.includes(f.id)
                  const Icon = FILE_ICON[f.kind]
                  return (
                    <MenuItem key={f.id} active={on} onSelect={() => set({ files: on ? state.files.filter((x) => x !== f.id) : [...state.files, f.id] })}>
                      <span className="flex items-center gap-2">
                        <Icon className="size-4 text-[#73726C]" /> {f.name}
                      </span>
                    </MenuItem>
                  )
                })}
              </MenuList>
            )}
          </div>
          <div className="flex rounded-lg bg-[#F3F2EC] p-0.5 text-[13px]" role="radiogroup" aria-label="Mode">
            {(["chat", "cowork"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={state.mode === m}
                onClick={() => set({ mode: m })}
                className={cn("rounded-md px-2.5 py-1 capitalize", state.mode === m ? "border border-[#E1DFD6] bg-white font-medium shadow-sm" : "text-[#73726C]")}
              >
                {m === "chat" ? "Chat" : "Cowork"}
              </button>
            ))}
          </div>
          <span className="ml-auto hidden items-center gap-1 text-[13px] sm:flex">
            {NOW.defaultModel} <span className="text-[#73726C]">{NOW.effortDefault}</span>
          </span>
          <MicIcon className="hidden size-4 text-[#73726C] sm:block" aria-hidden="true" />
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className="ml-auto flex size-8 items-center justify-center rounded-lg bg-[#D97757] text-white transition-opacity disabled:opacity-40 sm:ml-0"
            aria-label={sendLabel}
          >
            <ArrowUpIcon className="size-4" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 px-1 text-[13px]">
        <div className="relative" ref={projectRef}>
          <button type="button" onClick={() => setProjectOpen((o) => !o)} className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-[#F3F2EC]" aria-expanded={projectOpen}>
            <FolderIcon className="size-4 text-[#73726C]" />
            {projectLabel ?? "Project or folder"}
            <ChevronDownIcon className="size-3.5 text-[#73726C]" />
          </button>
          {projectOpen && (
            <MenuList className="w-64">
              {projects.map((p) => (
                <MenuItem
                  key={p.id}
                  active={state.project === p.id}
                  onSelect={() => {
                    set({ project: p.id })
                    setProjectOpen(false)
                  }}
                >
                  {p.label}
                </MenuItem>
              ))}
            </MenuList>
          )}
        </div>
        <div className="relative" ref={permRef}>
          <button type="button" onClick={() => setPermOpen((o) => !o)} className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-[#F3F2EC]" aria-expanded={permOpen}>
            {state.permission === "ask" ? <ShieldCheckIcon className="size-4 text-[#73726C]" /> : <ZapIcon className="size-4 text-[#73726C]" />}
            {state.permission === "ask" ? "Ask first" : "Auto"}
            <ChevronDownIcon className="size-3.5 text-[#73726C]" />
          </button>
          {permOpen && (
            <MenuList className="w-72">
              <MenuItem active={state.permission === "ask"} hint="Claude asks before each action. Best while you learn." onSelect={() => { set({ permission: "ask" }); setPermOpen(false) }}>
                Ask first
              </MenuItem>
              <MenuItem active={state.permission === "auto"} hint="Claude acts without asking. Only for routine tasks you've reviewed." onSelect={() => { set({ permission: "auto" }); setPermOpen(false) }}>
                Auto
              </MenuItem>
            </MenuList>
          )}
        </div>
        <InfoIcon className="ml-auto size-4 text-[#9C9A92]" aria-hidden="true" />
      </div>
    </div>
  )
}
