import type { Mission } from "../types"

/* Mastery: The Switchboard. Connectors are the centre of real usage (90k
   calls in 60 days); the failures are about limits, accounts and knowing
   when to stop. */
export const SWITCHBOARD: Mission = {
  id: "switchboard",
  title: "Know what each wire can carry",
  tagline: "Connectors do the real work. Their limits decide when to stop.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "wires",
      title: "Three things to know about every connector.",
      body: (
        <>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong>What it can and cannot do.</strong> Gmail and Calendar read and write. Fathom and Microsoft 365 are read-only. Nutshell cannot read attachments. The full list is on the Shelf under <a href="#/shelf/connectors">Connectors</a>.
            </li>
            <li>
              <strong>Whose account it is.</strong> Connectors use your login. Ask any time: "Which email and calendar are connected right now?" If the answer is a client's account, stop and check you had explicit approval.
            </li>
            <li>
              <strong>Its permission level.</strong> Customize › Connectors › Tool permissions. Keep new connectors on "Needs approval" until you have watched them work.
            </li>
          </ul>
          <p>
            When a connector cannot do something, Claude falls back to the browser, one page at a time. That is how a one-hour CRM report became a three-hour one for a Magic assistant last month. The browser is the slow last resort, not the plan.
          </p>
        </>
      ),
      note: { variant: "warning", body: <>An app that is not a connector is not connected. Thunderbird, a client's in-house portal, a desktop app: paste the content or do that part yourself.</> },
    },
    {
      kind: "spot",
      id: "plan",
      title: "Catch the two bad steps.",
      intro: <p>Claude proposed this plan for a connector job. Two steps should never run. Find both.</p>,
      frame: "plan",
      segments: [
        { text: "1. Add the Gmail connector and connect it with your own Google account.\n" },
        { text: "2. Connect the client's Gmail too, using the password saved in onboarding.docx, so both inboxes are covered.\n", flag: "A client account, connected without their approval, using a password from a document. Three rules broken in one step.", fix: "Only your own accounts. If the client wants their inbox covered, they connect it themselves after agreeing in writing." },
        { text: "3. Set the Gmail connector to Needs approval while we watch the first runs.\n" },
        { text: "4. Set every other connector to Always allow so nothing interrupts the task.\n", flag: "Blanket 'Always allow' removes the approve step everywhere, including connectors that send and delete.", fix: "Always allow only the read-only tools you have watched. Keep sends and edits on Needs approval." },
        { text: "5. Test with: what meetings do I have tomorrow?" },
      ],
      done: <p>Your own accounts, one permission decision per tool, and a test prompt before the real work.</p>,
    },
    {
      kind: "quiz",
      id: "check",
      title: "When the wire is too short.",
      questions: [
        {
          id: "sw1",
          q: "You asked for a CRM report. The connector can't read attachments, so Claude is opening each PDF in Chrome. Forty minutes in, it's a third done. What now?",
          options: [
            { v: "a", t: "Let it run. It will finish eventually." },
            { v: "b", t: "Stop the task. Pull the PDFs yourself or ask the client for an export, then hand Claude the files." },
            { v: "c", t: "Switch to Automatic mode so it stops asking and goes faster." },
          ],
          answer: "b",
          wrong: "Not quite. The browser fallback is the slow path. When you see it, stop and give Claude the files another way.",
          right: "Right. Knowing when to stop is part of the skill.",
        },
        {
          id: "sw2",
          q: "The client uses Outlook. Which of these is true?",
          options: [
            { v: "a", t: "Microsoft 365 is read-only in Claude, so Claude can summarise but not send. Drafting still works; you send." },
            { v: "b", t: "Connect the client's Outlook with their password and it works like Gmail." },
            { v: "c", t: "Claude can't use Outlook at all." },
          ],
          answer: "a",
          wrong: "Not quite. Microsoft 365 is a read-only connector on Team and Enterprise plans. Claude reads and drafts; you send. Never a client password.",
        },
        {
          id: "sw3",
          q: "Claude says it has no access to your calendar, but you connected it last week.",
          options: [
            { v: "a", t: "Ask which account is connected, then check Customize › Connectors. It may be signed in to a different Google account." },
            { v: "b", t: "Paste your calendar login into the chat so it can get in." },
            { v: "c", t: "Reinstall the desktop app." },
          ],
          answer: "a",
          wrong: "Not quite. Nine times out of ten it's the wrong Google account. Check the connector, never paste a login.",
        },
      ],
    },
    {
      kind: "live",
      id: "live",
      title: "Connect one more app and test it.",
      k: "live-switchboard",
      body: (
        <>
          <p>Add one connector you don't have yet that your client's work touches, on your own account, on Needs approval. Then run the test prompt and one real task through it.</p>
        </>
      ),
      prompts: [
        "Which email, calendar and drive accounts are connected right now, and what can you do with each?",
        "Using my Google Drive, find the three most recent files in the client folder and tell me what each one is for.",
        "Using Fathom, summarise my last meeting with the client in five bullets with any action items.",
      ],
      label: <>I connected one more app on my own account, checked its permissions, and used it on a real task.</>,
    },
    {
      kind: "reveal",
      id: "done",
      title: "Connector pro.",
      badge: "connector-pro",
      body: <p>The Clock Tower is next: the work that runs while you are off shift, and how to keep it safe.</p>,
      next: { href: "#/room/clock", label: "Go to The Clock Tower" },
    },
  ],
}
