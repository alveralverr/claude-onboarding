# Prompting Section Edits — `index.html`

## Background

The prompting section needs to shift its message away from "write better prompts" and toward "give Claude enough context." The distinction is important: prompting still matters (clear directive, clear output), but the root cause of bad AI outputs is almost always missing context — not bad phrasing. Assistants should learn to dump the raw info (screenshots, meeting notes, Slack threads, speech-to-text) rather than stress over how they word a request.

Section headers (h2, h3, kickers) are to be retained. Only body copy, tags, and tips change.

File to edit: `index.html`

---

## Change 1 — Lead paragraph (under the h2)

**Find:**
```
Two things get you something usable: share the situation — attach the file,
screenshot the thread, paste the email — and say what you want out of it. The wording is important but the
context you provide matters the most.
```

**Replace with:**
```
Context does the heavy lifting. Attach the file, screenshot the thread, paste the email, or just speak it out loud — then tell Claude what you need out of it. Don't stress over the wording.
```

---

## Change 2 — Rule #1 body paragraph

**Find:**
```
It knows every language, industry, and format. What it doesn't know
is your client, your task, and what a good result looks like. <strong>Give it that context — the more you
hand
over, the less it has to guess.</strong>
```

**Replace with:**
```
It knows every language, industry, and format. What it doesn't know is your client, your task, and what a good result looks like. <strong>Give it that — the more you hand over, the less it has to guess.</strong> A voice-to-text rant about what you need will get you further than any perfectly worded prompt.
```

---

## Change 3 — Rule #1 second paragraph

**Find:**
```
If the output wasn't what you wanted, that is almost always a
context problem — not a Claude problem.
```

**Replace with:**
```
If the output wasn't what you wanted, that's almost always a context problem — not a Claude problem. Don't rephrase. Add more information.
```

---

## Change 4 — Bad example tag label

**Find:**
```
Polished prompt, nothing shared
```

**Replace with:**
```
Good wording, no context
```

---

## Change 5 — Principle 01 body

**Find:**
```
Connect your apps and folders, attach files, paste the email, share screenshots or other
data. What you hand over
matters far more than how you word the ask.
```

**Replace with:**
```
Connect your apps and folders, attach files, paste the email, screenshot the Slack thread, or just speak out what you need. What you hand over matters far more than how you word the ask.
```

---

## Change 6 — Principle 02 title and body

**Find:**
```
<p class="habit-title">Refine the first draft if needed.</p>
<p class="habit-body">Claude iterates. If the result isn't right, redirect it — just like you would with a
colleague.</p>
```

**Replace with:**
```
<p class="habit-title">Redirect, don't give up.</p>
<p class="habit-body">If the result isn't right, don't assume Claude can't do it — it probably just didn't have enough to go on. Add more context and redirect it, the same way you would with a colleague who needed more of the story.</p>
```

---

## Change 7 — Principle 03 body

**Find:**
```
Try the task. Claude will flag it if something is outside what it can do. Most
assistants stop short of what is actually possible — the people who get the most out of it are the ones who
keep asking.
```

**Replace with:**
```
Try the task — don't overthink whether it can handle it. Claude will flag it if something is out of reach, and if it needs more from you, it'll ask clarifying questions before it proceeds. The people who get the most out of it are the ones who just try.
```

---

## Change 8 — Tips card, tip #5 (voice-to-text / no one-size-fits-all)

**Find:**
```
There's no one-size-fits-all prompt anatomy. Given the right context, Claude even
understands <strong>voice-to-text, Taglish, abbreviations, or half-finished sentences</strong> — it
needs
to understand the situation more than receive polished wording.
```

**Replace with:**
```
You don't need polished prompts. A voice-to-text rant, a pasted Slack thread, a screenshot, a half-sentence — if Claude has the context, it figures out the rest. <strong>Worry less about how you phrase it and more about whether Claude has what it needs.</strong>
```

---

## Change 9 — Add new tip to Cowork-specific tips list (after tip #5)

After the closing `</li>` of tip #5, insert a new list item:

```html
<li class="tip-row">
  <span class="tip-ic tip-ic--vio" aria-hidden="true">&#10022;</span>
  <p class="tip-body"><strong>Switch to a new chat when switching topics.</strong> Long conversations where you've jumped between subjects can confuse Claude — it has to read all of that history first. Finish one topic, take what you need, then start fresh.</p>
</li>
```

---

## Change 10 — Add new item to "Things that trip people up" list

After the last `</li>` in the trip-card list (the "always confirm the folder or file path" tip), insert:

```html
<li class="tip-row">
  <span class="tip-ic tip-ic--warn" aria-hidden="true">!</span>
  <p class="tip-body">If Claude <strong>goes off track</strong>, don't just rephrase — add more information. Generic or wrong outputs almost always mean Claude couldn't see what you could. Screenshot it, paste it, explain it.</p>
</li>
```

---

## Verification

After making all changes, open `index.html` in a browser and:

1. Confirm the lead paragraph no longer says "The wording is important"
2. Confirm Rule #1 mentions voice-to-text rant
3. Confirm Rule #1 second paragraph ends with "Don't rephrase. Add more information."
4. Confirm Principle 02 title reads "Redirect, don't give up."
5. Confirm Principle 03 mentions clarifying questions
6. Confirm tip #5 leads with "You don't need polished prompts."
7. Confirm the new tip about switching chats appears in the Cowork tips list
8. Confirm the new "goes off track" item appears in the trip list
9. Confirm all section headers (h2, h3, kickers) are unchanged
