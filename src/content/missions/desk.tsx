import type { Mission } from "../types"
import { Code } from "@/engine/bits"
import { Ext } from "@/components/site/shared"
import { MERGED_UI } from "@/lib/flags"

/* Room 1: Your Desk. Every checklist key here is a v1 key (see data.ts
   SETUP_PANELS). Keep them stable; rename the labels freely. */
export const DESK: Mission = {
  id: "desk",
  title: "Set up your desk",
  tagline: "From the invite in your webmail to a working Cowork session.",
  minutes: 20,
  steps: [
    {
      kind: "explain",
      id: "welcome",
      title: "Your seat is ready.",
      body: (
        <>
          <p>
            Magic gives you a <strong>Claude Team seat</strong>, worth about ₱1,500 a month. Claude Cowork runs on your own machine with your real files and tools, so it does the work, not just the talking.
          </p>
          <p>This room walks you from the invite email to your first working session. Tick each item as you go; your progress saves in this browser.</p>
        </>
      ),
      voice: "/assets/voice/00 - intro.mp3",
    },
    {
      kind: "checklist",
      id: "need",
      title: "Before you start.",
      items: [
        { k: "need-2", label: <>Google Chrome.</> },
        { k: "need-0", label: <><strong>magicassistant.ai</strong> webmail. Your Account Lead sends you the login details.</> },
        { k: "need-5", label: <>Your <strong>Claude.ai</strong> invite. You'll find the link inside your webmail inbox.</> },
        { k: "need-4", label: <><strong>macOS 11 (Big Sur)</strong> or later, or <strong>Windows 10</strong> or later.</> },
        { k: "need-1", label: <><strong>Claude desktop</strong> installed from <Ext href="https://claude.com/download">claude.com/download</Ext>.</> },
        { k: "need-3", label: <>Your webmail account signed in to Claude desktop.</> },
      ],
      voice: "/assets/voice/03- requirements.mp3",
      after: (
        <p className="text-base text-muted-foreground">
          Prefer video? <Ext href="https://www.youtube.com/watch?v=Lbml7IuGJYw">Getting started with Claude Cowork</Ext> on YouTube.
        </p>
      ),
    },
    {
      kind: "checklist",
      id: "invite",
      title: "Accept your invite.",
      items: [
        { k: "s1-0", label: <>Get your webmail login from your Account Lead.</> },
        { k: "s1-1", label: <>Go to <Ext href="http://magicassistant.ai/webmail">magicassistant.ai/webmail</Ext> and sign in with your new webmail username and password.</>, media: { type: "image", src: "/assets/media/webmail-login.webp", alt: "The magicassistant.ai webmail sign-in page", w: 1400, h: 871 } },
        { k: "s1-2", label: <>Open your inbox and find the Claude invite email.</>, media: { type: "image", src: "/assets/media/webmail-claude-invite.webp", alt: "The Claude invite email in the webmail inbox", w: 1400, h: 879 } },
        { k: "s1-3", label: <>Click <strong>Accept invite</strong> and follow the steps.</> },
        { k: "s1-4", label: <>Check that you can see the Claude home page.</> },
      ],
      note: {
        variant: "warning",
        body: (
          <>
            <strong>Heads up.</strong> The invite can expire without notice. If that happens, email <a href="mailto:product-team@getmagicea.com">product-team@getmagicea.com</a>.
          </>
        ),
      },
    },
    {
      kind: "checklist",
      id: "install",
      title: "Install the desktop app.",
      intro: <p>The desktop app unlocks <strong>Cowork</strong>: Claude working with your files and running tasks, not just answering questions.</p>,
      items: [
        { k: "s2-0", label: <>Go to <Ext href="https://claude.com/download">claude.com/download</Ext>, or follow the link on your first sign-in.</> },
        { k: "s2-1", label: <>Download the version for Mac or Windows.</> },
        { k: "s2-2", label: <>Open the installer and follow the steps.</> },
        { k: "s2-3", label: <>Sign in with the <strong>same account</strong> you used to accept the invite.</>, media: { type: "image", src: "/assets/media/cowork-homescreen.webp", alt: "The Cowork home screen in the Claude desktop app", w: 1600, h: 1098 } },
      ],
    },
    {
      kind: "checklist",
      id: "folder",
      title: MERGED_UI ? "Start a task and pick your folder." : "Open Cowork and pick your folder.",
      items: MERGED_UI
        ? [
            { k: "s2-4", label: <>Open the app. There is no separate Cowork mode any more: describe what you need and Claude decides whether to answer or run a task.</> },
            { k: "s2-5", label: <>Leave the permission menu on <strong>Ask first</strong> while you learn. Claude asks before each action. Switch to Auto only for tasks you have run before.</> },
            { k: "s2-6", label: <>Open <strong>Project or folder</strong> under the message box. This is where Claude reads context from and saves finished work.</> },
            { k: "s2-7", label: <>Choose an existing folder or create a new project. Use a dedicated folder such as <em>Magic Work</em>, not your Desktop or Downloads.</>, media: { type: "image", src: "/assets/media/project-folder.webp", alt: "The project or folder picker", w: 452, h: 321, className: "mx-auto max-w-[340px]" } },
          ]
        : [
            { k: "s2-4", label: <>When the app opens, pick <strong>Cowork</strong> in the <strong>Chat | Cowork</strong> switch inside the message box. Keep the permission menu under the box on <strong>Ask first</strong> while you learn.</> },
            { k: "s2-5", label: <>In your first Cowork session, type <Code>/setup-cowork</Code> and press Enter to run the guided setup. Type it on its own, not in front of a task.</>, media: { type: "image", src: "/assets/media/setup-cowork.webp", alt: "Typing /setup-cowork in a new Cowork session", w: 900, h: 266, className: "mx-auto max-w-[520px]" } },
            { k: "s2-6", label: <>Open <strong>Project or folder</strong> under the message box. This is where Claude reads context from and saves finished work.</> },
            { k: "s2-7", label: <>Choose an existing folder or create a new project. Use a dedicated folder such as <em>Magic Work</em>, not your Desktop or Downloads.</>, media: { type: "image", src: "/assets/media/project-folder.webp", alt: "The project or folder picker", w: 452, h: 321, className: "mx-auto max-w-[340px]" } },
          ],
      after: (
        <div className="grid gap-3 text-base sm:grid-cols-2">
          <div className="rounded-xl bg-background p-4">
            <p className="mb-1 font-semibold text-claude">A folder</p>
            <p>A folder on your computer. Cowork reads what's there and saves new files alongside it. Scope it to one client or one piece of work.</p>
          </div>
          <div className="rounded-xl bg-background p-4">
            <p className="mb-1 font-semibold text-claude">A project</p>
            <p>A workspace with its own files, instructions and memory across sessions. Put the client's voice and preferences in its instructions once, and every task uses them.</p>
          </div>
        </div>
      ),
      note: {
        body: (
          <>
            <strong>Keep the desktop app open while you work.</strong> The folder you pick is Claude's workspace: it can read, write and delete files there, so never point it at your whole home folder.
          </>
        ),
      },
    },
    {
      kind: "checklist",
      id: "connect",
      title: "Connect your apps.",
      intro: <p>Claude connects to the apps your client already uses: Google Workspace, Microsoft 365, Notion, Slack, Canva, Asana. That is where most of Cowork's value comes from.</p>,
      items: [
        { k: "s3-0", label: <>In the desktop app, click <strong>Customize</strong> in the left sidebar.</> },
        { k: "s3-1", label: <>Go to <strong>Connectors</strong> and click <strong>Add connector</strong> (the plus sign).</>, media: { type: "image", src: "/assets/media/connectors-1.webp", alt: "The Connectors panel in Customize", w: 1400, h: 821 } },
        { k: "s3-2", label: <>Find the <strong>Google Workspace</strong> apps and add them.</>, media: { type: "image", src: "/assets/media/connectors-2.webp", alt: "Adding Google Workspace connectors", w: 1384, h: 880 } },
        { k: "s3-3", label: <>The app now appears in your Connectors list under <strong>Not connected</strong>.</> },
        { k: "s3-4", label: <>Click <strong>Connect</strong> and sign in with your <strong>own</strong> Google account.</>, media: { type: "image", src: "/assets/media/connectors-4.webp", alt: "Signing in with a Google account", w: 1400, h: 744 } },
        { k: "s3-5", label: <>Repeat for <strong>Gmail</strong>, <strong>Google Calendar</strong>, <strong>Google Drive</strong>, or other apps. Test it: ask "What meetings do I have tomorrow?"</>, media: { type: "image", src: "/assets/media/connectors-5.webp", alt: "A connected app in the Connectors list", w: 1400, h: 823 } },
      ],
      note: {
        variant: "warning",
        body: (
          <>
            <strong>Connect your own accounts only.</strong> Never connect a client's email, calendar or storage without their explicit permission. Not sure which account is connected? Ask Claude: "Which email is connected in the Gmail connector?"
          </>
        ),
      },
    },
    {
      kind: "checklist",
      id: "skills",
      title: "Add your Magic skills.",
      intro: <p>Magic built skill templates for common EA work: <strong>Email Management</strong>, <strong>Calendar Management</strong>, <strong>Writing</strong>, and the <strong>EOD/SOD report</strong>. Start from a template when one fits; it loads the right approach for you.</p>,
      items: [
        { k: "s4-0", label: <>In the desktop app, click <strong>Customize</strong> in the left sidebar.</> },
        { k: "s4-1", label: <>Go to <strong>Skills</strong>, click <strong>Add skill</strong> (the plus sign), then <strong>Browse skills</strong>.</>, media: { type: "image", src: "/assets/media/skills-1.webp", alt: "Browse skills in Customize", w: 1400, h: 821 } },
        { k: "s4-2", label: <>Open the <strong>Your organization</strong> tab and add the skills available to you.</>, media: { type: "image", src: "/assets/media/skills-2.webp", alt: "Adding a skill from Your organization", w: 1400, h: 827 } },
        { k: "s4-3", label: <>Check that the skill now shows in your <strong>skills list</strong>. Use one by typing its slash command, such as <Code>/email-management</Code>.</>, media: { type: "image", src: "/assets/media/skills-3.webp", alt: "The skills list with a Magic skill added", w: 1391, h: 881 } },
      ],
      note: { variant: "warning", body: <>Don't see any skills? Message your Account Lead or email the Product Team. It's usually a permissions issue on your account.</> },
    },
    {
      kind: "reveal",
      id: "done",
      title: "Desk ready.",
      badge: "desk-ready",
      body: <p>Everything Claude needs is in place. Next door, you run a real task for a practice client before you touch your own inbox.</p>,
      next: { href: "#/room/inbox", label: "Go to The Inbox" },
    },
  ],
}
