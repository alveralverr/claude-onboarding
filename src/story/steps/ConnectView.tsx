import * as React from "react"
import { CalculatorIcon, CalendarIcon, CheckIcon, FolderIcon, KanbanSquareIcon, MailIcon, MagnetIcon, PaletteIcon, PlugIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ClaudeMsg, UserBubble, Why } from "@/sim/parts"
import { Shell, Thread } from "@/sim/Shell"
import type { ConnectStep, Option } from "../types"
import type { RunnerApi } from "../useRunner"

/* One icon per connector the paths ask for; anything else gets a plug. */
const CONNECTOR_ICON: Record<string, typeof PlugIcon> = {
  "Google Calendar": CalendarIcon,
  QuickBooks: CalculatorIcon,
  HubSpot: MagnetIcon,
  ClickUp: KanbanSquareIcon,
  Canva: PaletteIcon,
}

/* Claude can't reach a tool. Connect it in Customize, with the right account. */
export function ConnectView({ step, api, userName }: { step: ConnectStep; api: RunnerApi; userName: string }) {
  const persona = api.path.persona!
  const [screen, setScreen] = React.useState<"chat" | "customize">("chat")
  const [choosing, setChoosing] = React.useState(false)
  const [picked, setPicked] = React.useState<Option | null>(null)
  const [mistakes, setMistakes] = React.useState(0)
  const [told, setTold] = React.useState<string[]>([])
  const connected = !!picked?.good

  const pick = (o: Option) => {
    setPicked(o)
    if (!o.good) {
      setMistakes((m) => m + 1)
      if (o.consequence && !told.includes(o.id)) {
        api.consequence(o.consequence, false)
        setTold((t) => [...t, o.id])
      }
    }
  }

  if (screen === "chat") {
    return (
      <Shell active="new" userName={userName} project={persona.company}>
        <Thread>
          <UserBubble>{api.lastPrompt || api.task?.open}</UserBubble>
          <ClaudeMsg>
            <p>{step.says}</p>
            <Button size="sm" className="mt-3 font-sans" onClick={() => setScreen("customize")}>
              Open Customize
            </Button>
          </ClaudeMsg>
        </Thread>
      </Shell>
    )
  }

  const rows = [
    { name: "Gmail", Icon: MailIcon, on: true },
    { name: "Google Drive", Icon: FolderIcon, on: true },
    { name: step.connector, Icon: CONNECTOR_ICON[step.connector] ?? PlugIcon, on: connected },
  ]

  return (
    <Shell active="customize" userName={userName} project={persona.company}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-4 py-6 font-sans md:px-6">
          <div>
            <p className="text-[12px] text-[#73726C]">Customize › Connectors</p>
            <h2 className="text-[22px] font-medium">Connectors</h2>
          </div>
          <ul className="divide-y divide-[#E7E5DD] rounded-2xl border border-[#E7E5DD] bg-white">
            {rows.map(({ name, Icon, on }) => (
              <li key={name} className="flex items-center gap-3 px-4 py-3">
                <Icon className="size-5 text-[#73726C]" />
                <span className="flex-1 text-[14.5px]">{name}</span>
                {on ? (
                  <span className="flex items-center gap-1 text-[13px] text-[#0E8A4F]">
                    <CheckIcon className="size-4" /> Connected
                  </span>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setChoosing(true)}>
                    Connect
                  </Button>
                )}
              </li>
            ))}
          </ul>
          {choosing && !connected && (
            <div className="flex flex-col gap-2 rounded-2xl border border-[#E1DFD6] bg-white p-4">
              <p className="text-[14.5px] font-medium">Connect {step.connector} with which account?</p>
              {step.options.map((o) => (
                <button key={o.id} type="button" onClick={() => pick(o)} className="rounded-xl border border-[#E7E5DD] px-3.5 py-2.5 text-left text-[14px] hover:border-[#CFCBBF] hover:bg-[#FAF9F5]">
                  {o.label}
                </button>
              ))}
              {picked && !picked.good && <Why>{picked.why}</Why>}
            </div>
          )}
          {connected && (
            <>
              <Why good>{picked?.why}</Why>
              <Button className="w-fit" onClick={() => api.done(mistakes === 0)}>
                Back to the chat
              </Button>
            </>
          )}
        </div>
      </div>
    </Shell>
  )
}
