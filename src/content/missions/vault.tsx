import type { Mission } from "../types"
import { QUIZ } from "@/lib/data"
import { passSafety } from "@/lib/progress"

/* Room 3: The Vault. The rules are rendered here and quizzed in QUIZ
   (src/lib/data.ts). Change one, change the other. */

const HABITS: [string, string][] = [
  ["Be selective about file access.", "Claude can read, write and delete any file it can reach. Use a dedicated working folder and keep backups of anything important."],
  ["Watch the task, not every command.", "Look for surprises: files or sites you didn't mention, or scope creeping beyond your ask. If something feels off, stop the task."],
  ["Be cautious with scheduled tasks.", "They run without you watching. Start low-risk, don't schedule messages, purchases or hard-to-undo actions, and review results often."],
  ["Keep permission mode on Manual until a task is routine.", "Automatic mode skips the approve step. Use it only for tasks you have run and reviewed before."],
  ["Skip unfamiliar plugins and skills.", "Stick to Anthropic-verified connectors and Magic skills. The new marketplace has thousands of plugins; review permissions before installing any."],
  ["Take care with Claude add-ins in other apps.", "Claude can share data across apps like Excel and PowerPoint without being told to. Avoid sensitive information while Cowork is active."],
]

const RULES: ["no" | "warn" | "yes", React.ReactNode][] = [
  ["no", <><strong>Never paste passwords, API keys or credentials</strong> into a prompt. Not "just this once", not to get a connector working. If you already did, tell your Account Lead so it can be rotated.</>],
  ["no", <><strong>Never connect a client's email, calendar or cloud storage</strong> without their explicit approval.</>],
  ["no", <><strong>Never send unedited AI output</strong> to a client. Summaries and drafts that read like Claude wrote them are the top reason clients lose trust.</>],
  ["no", <><strong>Never impersonate someone.</strong> Ask instead: "Based on their communication style, how would they respond?"</>],
  ["no", <><strong>Don't use Claude for clients whose confidentiality clauses cover AI tools.</strong> Ask your Account Lead first.</>],
  ["warn", <><strong>Aerospace, defense or government clients:</strong> don't connect any client accounts. Personal productivity only.</>],
  ["warn", <><strong>Your seat is for client work.</strong> Personal errands burn the quota you need at 4pm on a Friday.</>],
  ["yes", <><strong>Always review everything</strong> before it goes to a client. Your sign-off is the last check.</>],
]

export const VAULT: Mission = {
  id: "vault",
  title: "Use Cowork safely",
  tagline: "What Claude can reach, what never goes in a prompt, and the check that makes you client-ready.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "reach",
      title: "What Cowork can reach.",
      body: (
        <>
          <p>Cowork works on your computer with access to your files, your browser, your connected apps and, if you allow it, your screen. That is the point, and it is the risk.</p>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>Don't give Claude local files with <strong>sensitive information</strong>, such as financial documents and passwords.</li>
            <li>With <strong>computer use</strong>, Claude changes things on your computer directly and skips permission checks. Be especially careful.</li>
            <li>Claude in Chrome can take control of your browser. Never automate <strong>logins, payments or anything irreversible</strong>.</li>
          </ul>
        </>
      ),
      media: { type: "image", src: "/assets/media/claude-graphic.webp", alt: "", w: 600, h: 576, className: "mx-auto max-w-[220px] border-0 shadow-none" },
    },
    {
      kind: "explain",
      id: "habits",
      title: "Six habits that protect you and your client.",
      body: (
        <ol className="grid gap-3 sm:grid-cols-2">
          {HABITS.map(([t, d], i) => (
            <li key={t} className="flex gap-3 rounded-xl bg-background p-4 text-base leading-relaxed text-muted-foreground">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[image:var(--sphere)] text-sm font-semibold text-white" aria-hidden="true">
                {i + 1}
              </span>
              <span>
                <strong className="block">{t}</strong>
                {d}
              </span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      kind: "spot",
      id: "secret",
      title: "Spot the secret.",
      intro: (
        <p>
          An assistant is trying to get a Notion sync working and pastes this into Cowork. Two things in it must never go into a prompt. Find both.
        </p>
      ),
      frame: "prompt",
      segments: [
        { text: "Set up the Notion sync for the Reyes Dental tracker. Here is the integration token so you can connect: " },
        { text: "ntn_EXAMPLE00000000000000000000", flag: "An API token. Anything pasted here can be logged, retained and read by people who should not have it. Connect Notion through Customize › Connectors instead.", fix: "Use the Notion connector, and rotate the token if it was ever shared." },
        { text: ". The workspace login is dana@reyesdental.example with password " },
        { text: "Molars2026!", flag: "A password. Claude never needs your password or the client's. If a task needs a login, you do the login.", fix: "Sign in yourself in the browser, then hand Claude the task." },
        { text: ". Then move every row with status Done to the archive database." },
      ],
      done: (
        <p>
          <strong>Secret keeper earned.</strong> In the last month, real Magic assistants pasted live tokens into prompts. If you ever do, tell your Account Lead the same day so it can be rotated.
        </p>
      ),
    },
    {
      kind: "explain",
      id: "rules",
      title: "Magic rules.",
      body: (
        <div className="grid gap-4 md:grid-cols-[1.2fr_.8fr]">
          <ul className="flex flex-col gap-3 text-base leading-relaxed text-muted-foreground">
            {RULES.map(([kind, node], i) => (
              <li key={i} className="flex gap-3">
                <span
                  className={
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white " +
                    (kind === "no" ? "bg-destructive" : kind === "warn" ? "bg-warning" : "bg-success")
                  }
                  aria-hidden="true"
                >
                  {kind === "no" ? "✕" : kind === "warn" ? "!" : "✓"}
                </span>
                <span>{node}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-background p-4 text-base text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">You stay responsible for</p>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-violet-mid">
              <li>Content published and messages sent.</li>
              <li>Purchases or financial transactions.</li>
              <li>Data accessed or changed.</li>
              <li>Actions taken by scheduled tasks on your behalf.</li>
              <li>Actions taken through computer use on your desktop and apps.</li>
              <li>Respecting third-party terms of service, including limits on automated access.</li>
            </ul>
            <p className="mt-3">
              Report suspicious behaviour or critical issues to <a href="mailto:product-team@getmagicea.com">product-team@getmagicea.com</a>.
            </p>
          </div>
        </div>
      ),
    },
    {
      kind: "quiz",
      id: "check",
      title: "Safety check.",
      intro: <p>Eight quick scenarios, one at a time. Get them all right to finish your path. You can retry as often as you like.</p>,
      questions: QUIZ,
      onPass: passSafety,
    },
    {
      kind: "reveal",
      id: "done",
      title: "Client-ready.",
      badge: "client-ready",
      body: (
        <p>
          If your desk is set up and your first task is done, your certificate is waiting in the lobby. Keep the Shelf handy: it answers most day-to-day questions.
        </p>
      ),
      next: { href: "#/", label: "Back to the office" },
    },
  ],
}
