/* Every role card on "What were you hired for?". Live paths have a client
   and shifts; the rest are listed so assistants can say what they do, and
   play General admin meanwhile. Build order comes from onboarding-call data
   (see docs-internal/PLAN_V5.md, not in the public repo). */
import type { PathDef } from "@/story/types"
import { ADMIN } from "./admin"

export const PATHS: PathDef[] = [
  ADMIN,
  { id: "finance", name: "Bookkeeping and finance admin", blurb: "Invoices, bills, reconciliation", icon: "calculator", live: false, next: true },
  { id: "leadgen", name: "Lead gen and sales", blurb: "Lead lists, outreach, CRM", icon: "magnet", live: false, next: true },
  { id: "ops", name: "Operations and data", blurb: "Trackers, SOPs, spreadsheets", icon: "workflow", live: false, next: true },
  { id: "content", name: "Content and social", blurb: "Posts, captions, design", icon: "megaphone", live: false, next: true },
  { id: "support", name: "Customer service", blurb: "Tickets, replies, policies", icon: "headset", live: false },
  { id: "health", name: "Healthcare admin", blurb: "Scheduling, insurance, patients", icon: "stethoscope", live: false },
  { id: "legal", name: "Legal admin", blurb: "Contracts, deadlines, filings", icon: "scale", live: false },
  { id: "ecom", name: "E-commerce", blurb: "Listings, orders, inventory", icon: "shopping", live: false },
  { id: "recruit", name: "Recruiting", blurb: "Candidates, interviews, job posts", icon: "users", live: false },
  { id: "realestate", name: "Real estate", blurb: "Listings, showings, leads", icon: "house", live: false },
  { id: "events", name: "Events", blurb: "Vendors, run of show, guests", icon: "party", live: false },
]

export const pathById = (id?: string) => PATHS.find((p) => p.id === id)
export const LIVE_PATH = ADMIN
