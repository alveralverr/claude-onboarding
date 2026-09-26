import type { ExplainStep } from "@/content/types"
import { Voiceover } from "@/components/site/shared"
import { MediaView, NoteBox } from "../bits"

export function Explain({ step }: { step: ExplainStep }) {
  return (
    <div className="flex flex-col gap-3 text-[17px] leading-relaxed text-card-foreground">
      <div className="flex flex-col gap-3">{step.body}</div>
      <MediaView media={step.media} />
      {step.voice && (
        <div>
          <Voiceover src={step.voice} />
        </div>
      )}
      {step.note && <NoteBox variant={step.note.variant}>{step.note.body}</NoteBox>}
    </div>
  )
}
