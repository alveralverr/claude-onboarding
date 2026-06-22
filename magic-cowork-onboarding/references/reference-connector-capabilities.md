---
Type: Appendix (reference, not a taught lesson)
Used by: Lesson 9 — Skills, connectors & scheduled tasks
Source: index.html — "Connector Capabilities" reference (10 approved connectors for Magic assistants)
---

# Connector capabilities reference

The approved connectors for Magic assistants, and exactly where each one can read, write, or act. Check a tool here before you ask Claude to use it.

**Where to find this in the app:** Customize › Connectors › select a connector › Tool permissions.

**Permission states for each tool:**

- **Always allow** — Claude runs the tool without asking.
- **Needs approval** — Claude pauses for your OK each time.
- **Blocked** — Claude can't use the tool at all.

**Access-level legend:** Read & write (7) · Interactive (1) · Read only (2).
**Categories:** Google Workspace (3) · Productivity (4) · Project Management (2) · Design (1).

---

## Gmail — Read & write · Google Workspace

**Can do:**
- Search threads & messages
- Read thread content
- Create & list draft emails
- Create labels
- List labels
- Label / unlabel threads & messages
- Trash emails (via TRASH label)

**Can't do:**
- Rename or recolor labels
- Delete labels
- Send emails directly (drafts only)
- Permanently delete emails (trash only)
- Read attachment contents directly

## Google Calendar — Read & write · Google Workspace

**Can do:**
- List calendars & events
- Get event details
- Create events
- Update events
- Delete events (hard delete)
- Respond to event invites
- Suggest available times

**Can't do:**
- Create or delete calendars
- Manage recurring event series (instances only)
- Set calendar permissions

## Google Drive — Read & write · Google Workspace

**Can do:**
- Search & list files
- Read & download file content
- Get file metadata & permissions
- Copy files
- Create new files (auto-converts to Google Docs)
- Upload files

**Can't do:**
- Delete files
- Edit / overwrite existing files
- Move files between folders

## Slack — Read & write · Productivity

**Can do:**
- Send & schedule messages
- Create message drafts
- Read channels, threads & files
- Search channels (public + private)
- List channel members & user profiles
- Create conversations
- Create, read & update canvases
- Add / get reactions
- Search emojis & users

**Can't do:**
- Edit or delete sent messages
- Upload files
- Delete channels

## Notion — Read & write · Productivity

**Can do:**
- Search pages & databases
- Create & update pages
- Create databases & views
- Duplicate & move pages
- Create & get comments
- Get teams & users
- Fetch page content
- Update views & data sources

**Can't do:**
- Permanently delete pages
- Upload file attachments
- Manage workspace permissions

## Canva — Interactive · Design

**Can do:**
- Search, create, copy & export designs
- Generate designs with AI
- Resize & merge designs
- Import designs from URL
- Move designs between folders
- Manage folders & brand kits
- Edit design content & elements
- Upload assets
- Comment on & reply to designs
- Publish brand templates

**Can't do:**
- Delete designs or files
- Delete folders

## Asana — Read & write · Project Management

**Can do:**
- View & search tasks, projects & goals
- Create & update tasks with owners & due dates
- Set task priority & assignees
- Delete tasks
- Add comments to tasks
- Create & update goals & metrics
- Set task dependencies, dependents & parent
- Add or remove task followers
- Create projects & project status

**Can't do:**
- Delete projects or goals
- Manage billing or workspace settings

## ClickUp — Read & write · Project Management

**Can do:**
- Create, update & delete tasks
- Set task priority & details
- Add tags, links & dependencies
- Attach files to tasks
- Merge & move tasks
- Create folders, lists & reminders
- Create & manage documents & pages
- Track time on tasks
- Add comments & send team chat messages

**Can't do:**
- Delete spaces or folders
- Manage billing or workspace-level settings

## Fathom — Read only · Productivity

**Can do:**
- List & search past meetings
- Get meeting summaries
- Get full transcripts
- Get recordings by URL or call ID
- Find persons
- List teams & identity

**Can't do:**
- Schedule or create meetings
- Delete meetings or recordings
- Edit transcripts
- Any write operations (read-only connector)

## Microsoft 365 — Read only · Productivity

> ⊘ Available on Team / Enterprise plans only.

**Can do:**
- Search documents across SharePoint & OneDrive
- Analyze email threads in Outlook
- Get calendar event insights
- Review Teams chat conversations
- Summarize documents & communications

**Can't do:**
- Send emails or Teams messages
- Create or edit documents
- Create calendar events
- Any write operations (read-only connector)
