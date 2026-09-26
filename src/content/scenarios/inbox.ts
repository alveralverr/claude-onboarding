import type { Scenario } from "./types"

/* Fictional client for the first-task simulator. Nothing here is real. */
export const INBOX: Scenario = {
  id: "inbox",
  client: "Dana Reyes, Reyes Dental",
  model: "Opus",
  context: ["Magic Work / Reyes Dental", "Gmail (your account)", "/email-management"],
  prompt:
    "Go through my Gmail from the last 24 hours. Flag only client emails or anything urgent, and draft a reply for each one that needs a response. Dana writes short, warm and plain, no exclamation marks. Save the drafts in Gmail for my review and list what you skipped.",
  plan: [
    { text: "Read the 14 unread emails from the last 24 hours in your Gmail." },
    { text: "Sort them: client and urgent first, newsletters and notifications skipped." },
    { text: "Draft a reply for the three that need one, in Dana's short, warm, plain voice." },
    {
      text: "Send the three replies from your Gmail.",
      bad: {
        why: "Step 4 sends email to real people before you have read a word of it. Nothing goes to a client without your review.",
        options: [
          { text: "Save the three replies as Gmail drafts for my review.", good: true },
          { text: "Send them, but CC me so I can see them.", why: "A copy after the fact is not a review. The client already has it." },
          { text: "Send only the two that look safe.", why: "Claude cannot judge what is safe to send for you. Your sign-off is the last check, every time." },
        ],
        fixed: "Save the three replies as Gmail drafts for your review.",
      },
    },
    { text: "List what was skipped and why, so nothing important is missed." },
  ],
  tools: ["Reading 14 emails in Gmail", "Checking senders against the Reyes Dental folder", "Drafting 3 replies", "Saving drafts to Gmail", "Writing the skipped list"],
  approveWarning: "Read the plan once more before you approve. One step does something a client would not want.",
  output: {
    title: "3 drafts saved to Gmail, 11 emails skipped",
    drafts: [
      {
        to: "Priya Natarajan (patient)",
        subject: "Re: Moving my cleaning to next week",
        body: "Hi Priya, I hope this message finds you well! Thursday the 8th at 10:30 is open, and I have pencilled you in. Reply yes and it is yours. Dana",
      },
      {
        to: "Northline Dental Supply",
        subject: "Re: Invoice 4471 past due",
        body: "Hi Marcus, thanks for the nudge. The payment went out this morning, reference 4471. Please don't hesitate to reach out should you have any further questions. Dana",
      },
      {
        to: "Oak Street Pediatrics",
        subject: "Re: Referral partnership call",
        body: "Hi Dr. Chen, yes, let's talk. I have Tuesday 2pm or Wednesday 9am. Which suits you? Dana",
      },
    ],
  },
}
