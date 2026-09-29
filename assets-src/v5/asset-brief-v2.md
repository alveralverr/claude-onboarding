# Image brief v2: the whole office in the desk-render look

**Goal:** regenerate every image the site still uses so it matches `desk-pov-v2.png`, the rendered desk that is now the home screen. The v4 set (flat lavender, saturated violet, low-poly toy look, light from the upper left) no longer sits well next to it. This brief replaces the v4 style guide for all new work.

**Total:** 44 images in four batches. Three v4 images are retired and not remade (see the end).

---

## 1. Before you start

**Where to save:** this folder, `claude-onboarding/assets-src/v5/`. Full path on this Mac: `/Users/alver/Documents/GitHub/claude-onboarding/assets-src/v5/`

**Format:** PNG straight from ChatGPT's download button. No screenshots, crops, compression or upscaling.

**Sizes:** landscape `1536 x 1024`, square `1024 x 1024`.

**Filenames:** exactly as listed, lowercase. Most keep their v4 names on purpose: Claude converts them to WebP over the old files, so the site picks them up with no code changes. If you make two versions and can't choose, save the second as `name-alt.png`.

**Transparency:** where a table says "transparent", the PNG must have a real transparent background. A grey-and-white checkerboard painted into the image is fake; ask again with "true transparent PNG, no checkerboard, no backdrop".

**Git:** PNGs in this folder are git-ignored. Only the converted WebP copies get committed.

## 2. How to run the ChatGPT sessions

Use **one new chat per batch**. Long chats drift, and four short ones stay closer to the reference.

1. Start a new chat.
2. **Attach `desk-pov-v2.png`** from this folder. This is the style reference, and it matters more than any words below.
3. Paste the **style guide** (section 3) and wait for ChatGPT to confirm.
4. Send the batch's prompts one per message, in order. The first image of each batch sets the look for the rest of that batch.
5. Check each image against the checklist (section 9). Regenerate if it fails.
6. Tell Claude when a batch is saved. Claude converts, resizes, re-measures the map hotspots and wires in the new files.

## 3. Style guide (paste first, in every batch)

```
I'm attaching a reference image, desk-pov-v2.png. It is the home screen of a learning app called "The Magic Office". I'm going to ask you for a series of images for the same app, and every one must look like it belongs in that exact room. Please study the reference and follow this style guide for every image in this chat. Confirm you understand before I send the first request.

RENDER STYLE (match the reference)
- High-fidelity, premium 3D render in a cozy clay / miniature architectural style. Tactile, believable, dimensional objects with soft bevels, fine material texture, ambient occlusion and soft contact shadows.
- NOT low-poly, NOT flat vector, NOT cartoon, NOT photorealistic. Think a beautifully lit architectural miniature.
- Everything sharp. No depth-of-field blur, no tilt-shift, no bloom, no lens flare.

LIGHT (match the reference)
- Warm morning daylight coming from the UPPER RIGHT, as if through a window. Shadows fall softly to the lower left.
- Soft, even, warm reflected fill. Calm and inviting. Never dark, moody, neon or high-contrast.

MATERIALS AND PALETTE (taken from the reference)
- Walls: pale, muted lavender plaster, dusty and soft (around #C8BCD0, shading to #9E8F9A). Never saturated purple.
- Wood: natural blonde oak with visible grain (#D29C67 to #F1C598). Shelves and tabletops use this oak.
- Soft goods: charcoal-lavender felt (#705B68), like the desk mat.
- Accents: dusty violet (#A78B9B, deeper #8A707F), used with restraint, like the notebook and the books.
- Ceramics: warm ivory (#EDE6DC) with a thin dusty-violet band, like the mug.
- Plants: sage and olive greens (#6E7A23, #8F8B6B) in textured ivory pots.
- Metal: brushed silver and graphite, like the laptop and phone.
- Small extras only: cork (#9E6B3E), cream and sage paper cards, soft lavender sprigs.
- The only strong colour is the brand violet #5200E3, and only where a prompt asks for it, in small amounts.

HARD RULES
- No text, letters, numbers, words, logos or brand marks anywhere. Screens, books, papers, signs and gauges use abstract shapes only.
- Screens show a soft, abstract ivory and lavender interface: blocks and lines, no readable UI.
- No people in room or object images. Characters are their own images.
- Keep every image uncluttered, spacious and carefully composed, like the reference.
```

## 4. Batch A: the office floor and the rooms (10 landscape)

The office map opens from the desk's window, so it should feel like the building that desk sits in: same oak, same plaster, same light.

| # | Filename | Size | Background |
|---|---|---|---|
| 1 | `lobby.png` | 1536 x 1024 | soft lavender, full bleed |
| 2 | `room-desk.png` | 1536 x 1024 | soft lavender |
| 3 | `room-vault.png` | 1536 x 1024 | soft lavender |
| 4 | `room-studio.png` | 1536 x 1024 | soft lavender |
| 5 | `room-switchboard.png` | 1536 x 1024 | soft lavender |
| 6 | `room-writing.png` | 1536 x 1024 | soft lavender |
| 7 | `room-workshop.png` | 1536 x 1024 | soft lavender |
| 8 | `room-engine.png` | 1536 x 1024 | soft lavender |
| 9 | `room-shelf.png` | 1536 x 1024 | soft lavender |
| 10 | `room-help.png` | 1536 x 1024 | soft lavender |

### 1. lobby.png

Claude places a clickable label over each zone, so the nine zones must be clearly separate and recognisable at a glance.

```
Image 1. Landscape, 1536 x 1024.

An open-plan office floor as a miniature architectural model, seen from a high three-quarter isometric camera (orthographic, about 30 degrees down, 45 degrees rotated), no ceiling, with only a low back wall and a low left wall in lavender plaster. The floor is pale oak planks. It floats on a soft, plain lavender background with a comfortable margin on every side. Warm daylight from the upper right, as in the reference.

The floor holds NINE clearly separated zones in a tidy 3 x 3 grid with generous walkways between them. Each zone is one recognisable setup, roughly the same visual size, with a little empty floor above it for a label.

BACK ROW, left to right
1. A round brushed-steel vault door set into the left wall, closed, with a small dusty-violet keypad.
2. A wall-mounted oak switchboard panel with rows of plugged fabric patch cables in dusty violet, sage, cream and one brand-violet cable.
3. A tall oak bookshelf full of dusty-violet, cream and sage books, with a charcoal-lavender felt armchair and a slim reading lamp.

MIDDLE ROW
4. An oak workbench with an open ivory toolbox, a few paper stencils and wooden puzzle pieces.
5. A cosy writing nook: a small oak desk, a keyboard, four neat stacks of paper cards (ivory, cream, sage, dusty violet) and a pen.
6. A compact brushed-steel cabinet with three round gauges of different sizes (plain needles, no numbers) and two gently curving pipes.

FRONT ROW
7. FRONT LEFT, the most important zone and slightly more detailed: the desk from the reference in miniature. Oak desk against a small section of lavender wall, an open silver laptop with an abstract ivory screen, a charcoal-lavender felt mat, a violet notebook, an ivory mug on a saucer, a sage plant in an ivory pot, and a felt office chair.
8. FRONT CENTRE: a design table with a slim monitor showing an abstract slide layout and an oak easel holding a board with three simple bars.
9. FRONT RIGHT: an ivory reception counter with a dusty-violet front panel, a small silver call bell and a headset.

No people, no text, no labels. Walkways clear, everything readable at a glance.
```

### 2 to 10. Room banners

These sit at the top of each room. Claude crops them to 1200 x 800, so keep the subject centred with background around it.

Paste this shared block first, then the room line:

```
Same series, same render style, light and palette as the reference and the lobby. Landscape, 1536 x 1024. A close-up miniature vignette of one zone from the lobby, same high three-quarter isometric camera, standing on a single floating square of pale oak floor with a short section of lavender plaster wall behind it. Centred, filling about the middle 60 percent of the width, soft plain lavender background around it. No people, no text.
```

```
room-desk: the desk from the reference, set up and ready. Open silver laptop with an abstract ivory screen, charcoal-lavender felt mat, a slim cable plugged in, a closed violet notebook with an elastic strap, an ivory mug with a violet band on a saucer, a sage plant in a textured ivory pot, and a felt office chair pulled up. A quiet sense of "everything is ready".
```
```
room-vault: a round brushed-steel vault door in a short plaster wall, slightly ajar, a soft warm glow from inside. A dusty-violet keypad beside it and a small silver key on a hook. On a little oak pedestal in front, a simple ceramic shield in dusty violet with an ivory keyhole shape. Calm and reassuring, not threatening.
```
```
room-studio: an oak design table with a slim monitor showing an abstract slide layout, an oak easel holding a board with three rising bars (one in brand violet #5200E3), a neat stack of ivory documents and a fan of paper colour swatches in dusty violet, sage and cream.
```
```
room-switchboard: the oak switchboard panel on the wall, fabric patch cables connecting a row of rounded ceramic tiles (plain coloured squares, no logos) to a silver laptop on a small oak stand in front.
```
```
room-writing: the cosy writing nook, a small oak desk with a keyboard, four neat stacks of paper cards in ivory, cream, sage and dusty violet side by side, a pen, and two small blank paper speech bubbles standing on the desk.
```
```
room-workshop: the oak workbench with an open ivory toolbox, paper shape stencils, wooden puzzle pieces clicking together, and a small friendly brushed-silver robotic arm placing a white card.
```
```
room-engine: the compact brushed-steel cabinet with three round gauges (small, medium, large, plain needles, no numbers), a tall glass meter half filled with soft brand violet, and a few gently curving pipes.
```
```
room-shelf: the tall oak bookshelf full of dusty-violet, cream and sage books, a charcoal-lavender felt armchair, a slim reading lamp, and one open book resting on the armchair's arm in a pool of warm light.
```
```
room-help: the ivory reception counter with its dusty-violet front panel, a small silver call bell, a headset, two small paper tickets, and a round ceramic sign on a stand showing a simple speech-bubble shape (no text).
```

## 5. Batch B: people (12 transparent squares)

Six avatars the assistant picks from, five practice clients, and Andi, the practice Account Lead. All twelve must share identical framing.

| # | Filename | Size | Background |
|---|---|---|---|
| 11 to 16 | `avatar-bea.png`, `avatar-marco.png`, `avatar-lea.png`, `avatar-jun.png`, `avatar-ria.png`, `avatar-paolo.png` | 1024 x 1024 | transparent |
| 17 to 21 | `client-priya.png`, `client-marco.png`, `client-nadia.png`, `client-tom.png`, `client-leah.png` | 1024 x 1024 | transparent |
| 22 | `coach-andi.png` | 1024 x 1024 | transparent |

Shared block, at the top of every portrait prompt:

```
Character portrait for the same series. Square, 1024 x 1024, TRUE TRANSPARENT background: no checkerboard, no backdrop, no circle behind them.

Head and shoulders of one person as a finely sculpted clay miniature figure in the same render style as the reference: matte, softly textured skin, real fabric texture on clothing, gentle bevels, no plastic shine. Warm daylight from the upper right, soft fill, no harsh shadows. Three-quarter view turned slightly toward the viewer, relaxed friendly expression, looking at the viewer. Centred, filling about 80 percent of the image height, shoulders cut off cleanly at the bottom edge. Clothing colours stay within the reference palette: ivory, oak, sage, dusty violet, charcoal-lavender, cream. No text, no logos, no name badges.
```

**Avatars.** The assistant picks one of these. They are Filipino remote executive assistants.

```
avatar-bea: A woman in her mid-20s, long straight black hair in a low ponytail, light brown skin, a dusty-violet cardigan over an ivory top, small silver stud earrings.
```
```
avatar-marco: A man in his early 30s, short black hair with a neat fade, medium brown skin, round thin-framed glasses, a charcoal-lavender crewneck sweater.
```
```
avatar-lea: A woman in her late 20s, shoulder-length wavy dark brown hair, warm tan skin, a slim headset with a small microphone, a soft cream blouse.
```
```
avatar-jun: A man in his mid-20s, medium-length straight black hair swept to one side, light skin, a sage hoodie, one wireless earbud visible.
```
```
avatar-ria: A woman in her early 30s wearing a soft lavender hijab, warm brown skin, an ivory blazer over a dusty-violet top.
```
```
avatar-paolo: A man in his late 30s, short curly black hair with a little grey at the temples, deep brown skin, a short neat beard, a dusty-violet polo shirt.
```

**Practice clients.** Fictional. Nothing about them is real.

```
client-priya: Practice client, not a real person. A woman in her early 40s who runs an architecture studio in Austin. Shoulder-length black hair, warm brown skin, thin dark-rimmed glasses, a charcoal blazer over an ivory top, calm confident smile.
```
```
client-marco: Practice client. A man in his mid-40s who owns two coffee shops and a roastery in Portland. Short dark wavy hair, light tan skin, trimmed stubble, a faded denim shirt under a brown canvas apron.
```
```
client-nadia: Practice client. A woman in her mid-30s who runs a recruiting agency in Chicago. Natural curly hair pulled back, deep brown skin, small silver hoop earrings, a warm oak-toned blazer over an ivory top.
```
```
client-tom: Practice client. A man in his early 50s who runs a landscaping company in Denver. Short grey-brown hair, light skin with a little sun, a sage polo shirt, practical and friendly.
```
```
client-leah: Practice client. A woman in her early 30s, a wellness coach in Vancouver who films a weekly vlog. Long straight dark hair, light skin, a soft sage knit sweater, relaxed warm smile.
```

**The practice Account Lead.**

```
coach-andi: A friendly Magic Account Lead, a Filipino man in his early 30s. Short neat black hair, medium brown skin, a dusty-violet quarter-zip over an ivory collar, encouraging smile.
```

## 6. Batch C: badges (18 transparent squares)

Earned rewards, shown in a grid of seven and greyed out in code until earned. They must read as one set: only the centre symbol changes.

| # | Filename |
|---|---|
| 23 | `badge-desk-ready.png` |
| 24 | `badge-first-task.png` |
| 25 | `badge-editors-eye.png` |
| 26 | `badge-secret-keeper.png` |
| 27 | `badge-client-ready.png` |
| 28 | `badge-deck-builder.png` |
| 29 | `badge-connector-pro.png` |
| 30 | `badge-scheduler.png` |
| 31 | `badge-prompt-whisperer.png` |
| 32 | `badge-skill-maker.png` |
| 33 | `badge-streak.png` |
| 34 | `badge-voice-heard.png` |
| 35 | `badge-first-shift.png` |
| 36 | `badge-path-admin.png` |
| 37 | `badge-path-finance.png` |
| 38 | `badge-path-leadgen.png` |
| 39 | `badge-path-ops.png` |
| 40 | `badge-path-content.png` |

All are 1024 x 1024 with a transparent background.

Shared block:

```
Badge for the same series. Square, 1024 x 1024, TRUE TRANSPARENT background.

A round medallion seen straight on (flat front view, not isometric), made as a small, tactile ceramic-and-metal object in the render style of the reference. A thick rounded outer rim in glazed dusty-violet ceramic (#8A707F shading to #6B5A73), a thin brushed-silver inner ring, and a warm ivory ceramic face (#EDE6DC) with a faint glaze. In the centre, ONE simple raised symbol described below, sculpted in relief, in dusty violet with at most one small accent from this list: brand violet #5200E3, sage #8F8B6B, oak #D29C67, cream #E6D3B3. The symbol fills about half the face. Warm light from the upper right, a soft highlight on the rim. The medallion fills 85 percent of the image. No ribbon, no stars around the edge, no text, no numbers. Every badge in the set uses this identical medallion; only the centre symbol changes. The symbol must still read clearly at 48 pixels wide.
```

Then add one line:

```
badge-desk-ready: a tiny desk with an open laptop and a small plant, sage accent on the plant.
```
```
badge-first-task: a sheet of paper with a bold checkmark, brand violet accent on the checkmark.
```
```
badge-editors-eye: a friendly open eye above a short line with a small pen nib, brand violet accent in the iris.
```
```
badge-secret-keeper: a small shield with a key in front of it, oak accent on the key.
```
```
badge-client-ready: a five-pointed star with a small checkmark inside, cream star with a brand violet checkmark.
```
```
badge-deck-builder: a small presentation board on a stand with three rising bars, brand violet accent on the tallest bar.
```
```
badge-connector-pro: two rounded plugs meeting in the middle, one dusty violet and one sage.
```
```
badge-scheduler: a round clock face (no numbers) with a circular arrow around it, sage accent on the arrow.
```
```
badge-prompt-whisperer: a speech bubble with a small four-pointed sparkle inside, cream sparkle.
```
```
badge-skill-maker: a puzzle piece with a small wrench across it, oak accent on the wrench.
```
```
badge-streak: a simple rounded flame, cream-to-oak flame.
```
```
badge-voice-heard: a small megaphone with two sound waves, sage accent on the waves.
```
```
badge-first-shift: an ivory mug with a violet band and a small cream star rising from it like steam.
```
```
badge-path-admin: an inbox tray holding an envelope with a small checkmark, brand violet accent on the checkmark.
```
```
badge-path-finance: a small calculator with a sage display.
```
```
badge-path-leadgen: a horseshoe magnet with two small cream sparks.
```
```
badge-path-ops: two interlocking gears, one dusty violet and one sage.
```
```
badge-path-content: a small megaphone with one sound wave and a tiny sparkle, cream sparkle.
```

## 7. Batch D: desk items (4 transparent squares)

Cosmetic rewards unlocked at levels 2 to 5. The mug and the plant already appear in the reference, so match those two exactly.

| # | Filename | Size | Background |
|---|---|---|---|
| 41 | `item-mug.png` | 1024 x 1024 | transparent |
| 42 | `item-plant.png` | 1024 x 1024 | transparent |
| 43 | `item-lamp.png` | 1024 x 1024 | transparent |
| 44 | `item-monitor.png` | 1024 x 1024 | transparent |

Shared block:

```
Same series. Square, 1024 x 1024, TRUE TRANSPARENT background. One single object in the render style of the reference, seen from a slightly high three-quarter angle, warm light from the upper right, centred, filling about 70 percent of the image, with a soft contact shadow directly under it. No text, no logos.
```

```
item-mug: the ivory ceramic coffee cup from the reference, with its thin dusty-violet band, coffee visible inside, on its matching saucer. No steam.
```
```
item-plant: a leafy sage plant in a textured ivory ceramic pot, like the one on the shelf in the reference.
```
```
item-lamp: a slim modern desk lamp with a brushed-silver arm, an oak base and an ivory shade, switched on with a soft warm glow.
```
```
item-monitor: a slim second monitor on a brushed-silver stand, showing an abstract ivory and lavender interface.
```

## 8. What Claude does when a batch lands

- **Batch A:** converts `lobby.png` to `lobby-1536.webp` and `lobby-768.webp`, re-measures every room's `spot` in `src/content/world.ts` against the new floor, and converts each room banner to a 1200 x 800 WebP over the old one.
- **Batch B:** converts to 256 x 256 WebP. The avatars replace the old files in place. The client portraits get wired to each persona's `portrait` field, and Andi's portrait replaces the "A" initial in the coach bar.
- **Batch C:** converts to 256 x 256 WebP and adds the six new ids to `BADGE_ART` in `world.ts`, so they stop drawing the fallback medallion.
- **Batch D:** converts to 256 x 256 WebP over the old files.
- Keeps any v4 image whose replacement fails the checklist, so nothing on the site breaks mid-way.

## 9. Checklist before saving each image

- [ ] It looks like it belongs in `desk-pov-v2.png`: same materials, same warm light from the upper right, same muted palette.
- [ ] Rendered, not flat and not low-poly. Nothing is blurred.
- [ ] No letters, numbers, words or logos anywhere, including screens, books, signs and gauges.
- [ ] Brand violet #5200E3 appears only where the prompt asks, and only a little.
- [ ] Transparent images are really transparent: no painted checkerboard, no backdrop, no circle.
- [ ] All twelve portraits share the same framing and size.
- [ ] All eighteen badges share the identical medallion; only the centre symbol differs, and it reads at a glance when small.
- [ ] The lobby's nine zones are clearly separate, with walkways between them.
- [ ] The filename matches the table exactly.

## 10. Retired, not remade

| v4 file | Why |
|---|---|
| `room-inbox.png` | The Inbox room is retired; its lesson is Shift 1 at the desk. |
| `room-clock.png` | The Clock Tower room is retired; Shift 3 and the Shelf cover scheduled tasks. |
| `client-dana.png` | Dana only appeared in The Inbox. Each path now has its own client (Batch B). |

The old WebP copies of these stay in `public/assets/media` until Claude confirms nothing links to them, then they go.
