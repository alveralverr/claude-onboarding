/* Content that is data rather than prose. The prose lives in the section
   components. Checkbox keys here MUST stay stable: they are the localStorage
   keys that hold every assistant's progress (see progress.ts). */

export const SETUP_PANELS = [
  { id: "s0", label: "Before you start", time: "~2 min", keys: ["need-2", "need-0", "need-5", "need-4", "need-1", "need-3"] },
  { id: "s1", label: "Accept invite", time: "~3 min", keys: ["s1-0", "s1-1", "s1-2", "s1-3", "s1-4"] },
  { id: "s2", label: "Desktop app", time: "~8 min", keys: ["s2-0", "s2-1", "s2-2", "s2-3", "s2-4", "s2-5", "s2-6", "s2-7"] },
  { id: "s3", label: "Connect apps", time: "~6 min", keys: ["s3-0", "s3-1", "s3-2", "s3-3", "s3-4", "s3-5"] },
  { id: "s4", label: "Magic skills", time: "~4 min", keys: ["s4-0", "s4-1", "s4-2", "s4-3"] },
] as const

export const SETUP_KEYS: string[] = SETUP_PANELS.flatMap((p) => [...p.keys])
export const FIRST_TASK_KEY = "s5-0"

export const PATH_STEPS = [
  { id: "setup", href: "#/room/desk", name: "Your Desk: set up Cowork", time: "~20 min" },
  { id: "first", href: "#/room/inbox", name: "The Inbox: first real task", time: "~10 min" },
  { id: "safety", href: "#/room/vault", name: "The Vault: safety check", time: "~5 min" },
] as const

export const LIBRARY = [
  { href: "#/shelf/cowork", title: "How Cowork works", desc: "Tasks, the interface, and working memory" },
  { href: "#/shelf/skills", title: "Skills", desc: "Magic templates and demos" },
  { href: "#/shelf/connectors", title: "Connectors", desc: "What each app can and can't do" },
  { href: "#/shelf/scheduled", title: "Scheduled tasks", desc: "Recurring work on autopilot" },
  { href: "#/shelf/prompting", title: "Prompting", desc: "Give context, get better results" },
  { href: "#/shelf/model", title: "Choosing a model", desc: "Opus first, and when to switch" },
  { href: "#/shelf/learn", title: "Courses", desc: "Anthropic courses and certification" },
  { href: "/claude-design.html", title: "Claude Design", desc: "Guide for MEA" },
]

export const QUIZ = [
  {
    id: "q1",
    q: "You want to speed up a client's inbox triage. Can you connect their Gmail to Cowork?",
    options: [
      { v: "a", t: "Yes, you already have their login." },
      { v: "b", t: "Only with the client's explicit approval." },
      { v: "c", t: "Yes, as long as you disconnect it afterwards." },
    ],
    answer: "b",
    wrong: "Not quite. Never connect a client's email, calendar, or storage without their explicit approval.",
  },
  {
    id: "q2",
    q: "A task needs a login to a client tool. Where can you paste the password?",
    options: [
      { v: "a", t: "In the Cowork prompt, if the task needs it." },
      { v: "b", t: "In a scheduled task, so it runs without you." },
      { v: "c", t: "Nowhere. Never paste passwords, API keys, or credentials into Cowork." },
    ],
    answer: "c",
    wrong: "Not quite. Passwords, API keys, and credentials never go into a Cowork prompt.",
  },
  {
    id: "q3",
    q: "Which folder should Cowork work in?",
    options: [
      { v: "a", t: "A dedicated working folder, such as Magic Work." },
      { v: "b", t: "Your Desktop or Downloads, so files are easy to find." },
      { v: "c", t: "Your whole home folder, so Claude can see everything." },
    ],
    answer: "a",
    wrong: "Not quite. Claude can read, write, and delete anything in its folder, so give it a dedicated one.",
  },
  {
    id: "q4",
    q: "A client's contract has a confidentiality clause that covers AI tools. What do you do?",
    options: [
      { v: "a", t: "Use Claude, but leave out the client's name." },
      { v: "b", t: "Don't use Claude for that client, and ask your Account Lead first." },
      { v: "c", t: "Use a lighter model such as Haiku." },
    ],
    answer: "b",
    wrong: "Not quite. If a confidentiality clause covers AI tools, don't use Claude for that client. Ask your Account Lead.",
  },
  {
    id: "q5",
    q: "Claude finished drafting five client emails. What's next?",
    options: [
      { v: "a", t: "Review every draft before anything goes to the client." },
      { v: "b", t: "Send them. Claude already checked its own work." },
      { v: "c", t: "Schedule them to send automatically." },
    ],
    answer: "a",
    wrong: "Not quite. Always review everything before it reaches a client. Your sign-off is the last check.",
  },
  {
    id: "q6",
    q: "A connector won't authorise. The client's admin sends you an API token to \"just paste into Claude so it works\". What do you do?",
    options: [
      { v: "a", t: "Paste it once, then delete the message." },
      { v: "b", t: "Don't paste it. Set the connector up through Customize › Connectors, and tell your Account Lead a token was shared." },
      { v: "c", t: "Paste it, but ask Claude to forget it afterwards." },
    ],
    answer: "b",
    wrong: "Not quite. Tokens and passwords never go into a prompt, even once. Use the connector flow and report the shared token.",
  },
  {
    id: "q7",
    q: "Claude wrote a weekly summary for your client. It's accurate but reads like Claude wrote it. The client is waiting. What do you send?",
    options: [
      { v: "a", t: "The summary as is. Accurate is what matters." },
      { v: "b", t: "The summary after you cut the filler and rewrite it the way you would say it to the client." },
      { v: "c", t: "A note saying Claude drafted it, with the summary attached." },
    ],
    answer: "b",
    wrong: "Not quite. Unedited AI output is the top reason clients lose trust in an assistant. Edit before you send, every time.",
  },
  {
    id: "q8",
    q: "You've run the same inbox triage five times without problems. Cowork offers Automatic mode, which skips the approve step. When is it OK to turn on?",
    options: [
      { v: "a", t: "For that routine task, on your own accounts, with drafts, not sends." },
      { v: "b", t: "For everything, since Claude has been reliable so far." },
      { v: "c", t: "For a new task on a client's connected account, to save time." },
    ],
    answer: "a",
    wrong: "Not quite. Automatic mode is for routine tasks you've already reviewed, on your own accounts, and never for sending, paying or anything hard to undo.",
  },
]


export type Access = "rw" | "interactive" | "ro"
export const ACCESS_LABEL: Record<Access, string> = { rw: "Read and write", interactive: "Interactive", ro: "Read only" }
export type Connector = { name: string; access: Access; cat: string; logo: string; note?: string; can: string[]; cant: string[] }
export const CONNECTORS: Connector[] = [
  { name: "Gmail", access: "rw", cat: "Google Workspace", logo: "/assets/media/logo-gmail.webp",
    can: ["Search threads and messages", "Read thread content", "Create and list draft emails", "Create and list labels", "Label or unlabel threads and messages", "Trash emails (via the TRASH label)"],
    cant: ["Rename or recolor labels", "Delete labels", "Send emails directly (drafts only)", "Permanently delete emails (trash only)", "Read attachment contents directly"] },
  { name: "Google Calendar", access: "rw", cat: "Google Workspace", logo: "/assets/media/logo-calendar.webp",
    can: ["List calendars and events", "Get event details", "Create events", "Update events", "Delete events (hard delete)", "Respond to event invites", "Suggest available times"],
    cant: ["Create or delete calendars", "Manage recurring event series (instances only)", "Set calendar permissions"] },
  { name: "Google Drive", access: "rw", cat: "Google Workspace", logo: "/assets/media/logo-drive.webp",
    can: ["Search and list files", "Read and download file content", "Get file metadata and permissions", "Copy files", "Create new files (converted to Google Docs)", "Upload files"],
    cant: ["Delete files", "Edit or overwrite existing files", "Move files between folders"] },
  { name: "Slack", access: "rw", cat: "Productivity", logo: "/assets/media/logo-slack.svg",
    can: ["Send and schedule messages", "Create message drafts", "Read channels, threads, and files", "Search public and private channels", "List channel members and user profiles", "Create conversations", "Create, read, and update canvases", "Add and get reactions", "Search emojis and users"],
    cant: ["Edit or delete sent messages", "Upload files", "Delete channels"] },
  { name: "Notion", access: "rw", cat: "Productivity", logo: "/assets/media/logo-notion.webp",
    can: ["Search pages and databases", "Create and update pages", "Create databases and views", "Duplicate and move pages", "Create and get comments", "Get teams and users", "Fetch page content", "Update views and data sources"],
    cant: ["Permanently delete pages", "Upload file attachments", "Manage workspace permissions"] },
  { name: "Canva", access: "interactive", cat: "Design", logo: "/assets/media/logo-canva.webp",
    can: ["Search, create, copy, and export designs", "Generate designs with AI", "Resize and merge designs", "Import designs from a URL", "Move designs between folders", "Manage folders and brand kits", "Edit design content and elements", "Upload assets", "Comment on and reply to designs", "Publish brand templates"],
    cant: ["Delete designs or files", "Delete folders"] },
  { name: "Asana", access: "rw", cat: "Project management", logo: "/assets/media/logo-asana.webp",
    can: ["View and search tasks, projects, and goals", "Create and update tasks with owners and due dates", "Set task priority and assignees", "Delete tasks", "Add comments to tasks", "Create and update goals and metrics", "Set task dependencies and parents", "Add or remove task followers", "Create projects and project status"],
    cant: ["Delete projects or goals", "Manage billing or workspace settings"] },
  { name: "ClickUp", access: "rw", cat: "Project management", logo: "/assets/media/logo-clickup.webp",
    can: ["Create, update, and delete tasks", "Set task priority and details", "Add tags, links, and dependencies", "Attach files to tasks", "Merge and move tasks", "Create folders, lists, and reminders", "Create and manage documents and pages", "Track time on tasks", "Add comments and send team chat messages"],
    cant: ["Delete spaces or folders", "Manage billing or workspace-level settings"] },
  { name: "Fathom", access: "ro", cat: "Productivity", logo: "/assets/media/logo-fathom.webp",
    can: ["List and search past meetings", "Get meeting summaries", "Get full transcripts", "Get recordings by URL or call ID", "Find people", "List teams and identity"],
    cant: ["Schedule or create meetings", "Delete meetings or recordings", "Edit transcripts", "Any write action (read-only connector)"] },
  { name: "Microsoft 365", access: "ro", cat: "Productivity", logo: "/assets/media/logo-microsoft.webp", note: "Available on Team and Enterprise plans only.",
    can: ["Search documents across SharePoint and OneDrive", "Analyze email threads in Outlook", "Get calendar event insights", "Review Teams chat conversations", "Summarize documents and communications"],
    cant: ["Send emails or Teams messages", "Create or edit documents", "Create calendar events", "Any write action (read-only connector)"] },
]

export const MODELS = {
  opus: { model: "Opus", why: "Your default. Best quality and reasoning for all EA work: research, writing, Cowork, and complex tasks. Start here and only step down if limits actually stop you." },
  sonnet: { model: "Sonnet", why: "Your fallback when Opus says you’ve hit your limit. Still strong for most tasks and lighter on quota." },
  haiku: { model: "Haiku", why: "Bulk data only: high-volume rote work such as bulk categorization or simple extraction at scale. Almost never right for day-to-day EA work." },
} as const
export type ModelKey = keyof typeof MODELS

export const PRODUCT_EMAIL = "product-team@getmagicea.com"
export const ROUTES = {
  invite: { label: "Can't accept the invite or sign in", who: "Product Team", why: "Can’t accept the invite or sign in? Email the Product Team.", email: PRODUCT_EMAIL },
  templates: { label: "Can't see Magic templates or skills", who: "Product Team", why: "Can’t see Magic templates or skills? It’s usually a permissions issue. Email the Product Team.", email: PRODUCT_EMAIL },
  google: { label: "Google account won't connect", who: "Connectors, then your Account Lead", why: "Check Customize › Connectors in the desktop app first. Still not connecting? Message your Account Lead." },
  refuse: { label: "Claude refuses a task", who: "Your Account Lead", why: "First add more context to your request (see Prompting). Still stuck? Ask your Account Lead." },
  limit: { label: "Hit the usage limit", who: "Wait, or switch to Sonnet", why: "Hit your Opus limit? Wait for the reset, or switch to Sonnet for the rest of the task. Don’t drop to Haiku for client work. Hitting Sonnet limits too? Tell your Account Lead." },
  general: { label: "General Claude questions", who: "Your Account Lead", why: "General Claude questions go to your Account Lead first." },
  tech: { label: "Technical issue with the app or extension", who: "Product Team", why: "Technical issues with the desktop app or extension go to the Product Team.", email: PRODUCT_EMAIL },
} as const
export type RouteKey = keyof typeof ROUTES

export const SKILL_DEMOS = [
  { key: "email", label: "Email", yt: "pF11MNtnZ7Y", title: "Magic x Claude Skills: Email Management" },
  { key: "calendar", label: "Calendar", yt: "yalDIOSi6oU", title: "Magic x Claude Skills: Calendar Management" },
  { key: "writing", label: "Writing", yt: "cSfLvBQDkOU", title: "Magic x Claude Skills: Writing" },
]

export const RESOURCES = [
  { href: "https://anthropic.skilljar.com/claude-101", tag: "Start here · Course", title: "Claude 101", desc: "What Claude is, and organizing work with projects, artifacts, and skills." },
  { href: "https://anthropic.skilljar.com/ai-fluency-framework-foundations", tag: "Start here · Certificate", title: "AI Fluency: Framework and Foundations", desc: "How AI works, ethical grounding, and responsible use. Aligned with Claude Certified.", cert: true },
  { href: "https://anthropic.skilljar.com/introduction-to-claude-cowork", tag: "Start here · Free · ~1 hr", title: "Introduction to Claude Cowork", desc: "The task loop, skills, file and research workflows, and steering multi-step work." },
  { href: "https://anthropic.skilljar.com/introduction-to-agent-skills", tag: "Start here · Course", title: "Introduction to Skills", desc: "What skills are, how they work, and how to create your own." },
  { href: "https://claude.com/resources/courses", tag: "Library", title: "All courses", desc: "Structured learning paths with video lessons and assessments." },
  { href: "https://claude.com/resources/tutorials", tag: "Library", title: "All tutorials", desc: "Step-by-step guides for specific features and workflows." },
  { href: "https://claude.com/resources/tutorials/customize-claude-cowork", tag: "Tutorial", title: "Customize Claude Cowork", desc: "Tailor Cowork to your working style and recurring tasks." },
  { href: "https://support.claude.com/en/articles/13837440-use-plugins-in-claude", tag: "Guide", title: "Use plugins with Cowork", desc: "Plugins customize how Claude works for your role, team, and company." },
]
