# Image brief for The Magic Office (v4)

Generate these in ChatGPT, save them here with the exact filenames below, and tell Claude when a batch is in. Claude converts them to WebP, resizes them, places the map hotspots on the lobby scene, and wires everything in.

## Where and how to save

- **Folder:** `claude-onboarding/assets-src/v4/` (this folder). Full path on this Mac: `/Users/alver/Documents/GitHub/claude-onboarding/assets-src/v4/`
- **Format:** PNG, straight from ChatGPT's download button. Don't screenshot, crop, compress or upscale.
- **Size:** landscape images at **1536 x 1024**, square images at **1024 x 1024**.
- **Transparency:** where the table says "transparent", the PNG must have a real transparent background. If you see a grey-and-white checkerboard painted into the image, it's fake; ask again with "true transparent PNG, no checkerboard".
- **Filenames:** exactly as listed, lowercase. If you make two versions and can't choose, save the second as `name-alt.png`.
- These PNGs are git-ignored on purpose. Only the converted WebP copies get committed.

## How to run the ChatGPT session

1. Start **one new chat** for the whole series so the style stays consistent.
2. Paste the **style guide** below as the first message and wait for ChatGPT to confirm.
3. Generate **Batch 1** in the order listed, one prompt per message. Start with `lobby.png`: it sets the look for everything else.
4. After each image, check it against the checklist at the bottom. Regenerate if it fails.
5. Batch 2 can be done now or later; Phase 2 needs it.

## Style guide (paste first, once)

```
I'm going to ask you for a series of images for one learning app called "The Magic Office". Every image must share one consistent style. Please follow this style guide for every image in this chat, and confirm you understand before I send the first request.

STYLE
- 3D isometric illustration, true isometric camera (orthographic, 30 degrees elevation, 45 degrees rotation), no perspective distortion, same angle in every scene.
- Clean low-poly, toy-like render with soft matte clay materials, gently rounded edges, subtle ambient occlusion, soft contact shadows.
- One consistent light: soft key light from the upper left, shadows falling to the lower right.
- Mood: calm, premium, optimistic, friendly. Think Apple product illustration meets Monument Valley. Not childish, not cluttered.

PALETTE (use these exact colours)
- Background: flat lavender #E6E6F8 with a very faint pastel glow behind the subject (violet #754EFF, pink #FF8EA9, cyan #14E9ED at low opacity).
- Main surfaces: white #FFFFFF, pale lavender #F3F5FA and #DEDAF3.
- Primary accent: deep violet #5200E3 and violet #754EFF.
- Small accents only: cyan #14E9ED, soft pink #FF8EA9, magenta #9B00FF, warm yellow #F7C948.
- Furniture tops: light warm wood #DCC3AA.
- Screens show abstract UI only: soft violet and lavender blocks and lines.

HARD RULES
- No text, letters, numbers, words, logos, brand marks or readable UI anywhere. Screens, signs, books and papers use abstract shapes only.
- No people in room scenes. Characters are separate images.
- No dark or moody lighting, no neon, no grunge, no photorealism.
```

## Batch 1 (needed now, 16 images)

| # | Filename | Size | Background |
|---|---|---|---|
| 1 | `lobby.png` | 1536 x 1024 | lavender |
| 2 | `room-desk.png` | 1536 x 1024 | lavender |
| 3 | `room-inbox.png` | 1536 x 1024 | lavender |
| 4 | `room-vault.png` | 1536 x 1024 | lavender |
| 5-10 | `avatar-1.png` to `avatar-6.png` | 1024 x 1024 | transparent |
| 11 | `dana.png` | 1024 x 1024 | transparent |
| 12-16 | `badge-desk-ready.png`, `badge-first-task.png`, `badge-editors-eye.png`, `badge-secret-keeper.png`, `badge-client-ready.png` | 1024 x 1024 | transparent |

### 1. lobby.png

Used as the clickable office map on the home screen. Claude will place a label over each zone, so the zones must be clearly separate and easy to recognise.

```
Image 1 of the series. Landscape, 1536 x 1024.

A single open-plan office floor seen from the isometric camera, cut away with no ceiling and only two low walls (back and left), floating on the lavender background. The whole floor is fully visible with a comfortable margin on every side.

The floor is divided into 11 clearly separated zones arranged in a tidy grid of 4 across and 3 deep, with clear walkways between them. Each zone is one recognisable piece of furniture or setup, roughly the same visual size, with a little empty space above it. From back to front, and left to right as seen in the image:

BACK ROW
1. A large round steel vault door set into the left wall, closed, with a small violet keypad.
2. A wall-mounted switchboard panel with rows of colourful plugged patch cables (cyan, pink, violet, yellow).
3. A tall white bookshelf wall full of violet, pink and cyan books, with a violet armchair and a reading lamp in front.
4. A white reception help desk counter with a violet front panel, a small golden call bell and a headset on it.

MIDDLE ROW
5. A tall standing clock kiosk with a round white clock face (no numbers), next to a wall calendar with a few days highlighted in violet.
6. A wooden workbench with an open pink toolbox, a few stencils and puzzle pieces.
7. A cosy writing nook: small wooden desk with a keyboard, four neat stacks of paper cards, and a pen.
8. A compact steel engine cabinet with three round gauges of different sizes and a couple of pipes.

FRONT ROW
9. FRONT LEFT: a tidy personal work desk, white with a wooden top, an open laptop showing an abstract violet screen, a desk lamp, a small plant, a mug, and a violet office chair. This is the most important zone; make it slightly more detailed and inviting.
10. FRONT CENTRE: a design studio table with a monitor showing an abstract slide layout and an easel holding a board with simple bar-chart shapes.
11. FRONT RIGHT: a mailroom with a white wall of pigeonholes, some holding white and pink envelopes, and a small wooden sorting table with envelopes on it.

No people, no text, no labels. Generous walkways, everything readable at a glance.
```

### 2. room-desk.png

Banner at the top of the "Your Desk" room (setup). Keep the subject centred with empty background around it; Claude will crop.

```
Image 2 of the series. Landscape, 1536 x 1024. Same style, same camera angle, same lighting as the lobby.

A close-up isometric vignette of the personal work desk from the lobby, standing on a single floating square floor tile, centred, filling about the middle 60 percent of the width, with plain lavender background around it.

The desk: white base with a warm wooden top, an open laptop showing an abstract violet interface, a small violet folder beside it, a desk lamp with a violet arm, a small potted plant, a white mug, a neat cable plugged into the laptop, and a violet office chair pulled up. A soft sense of "everything is set up and ready".

No people, no text.
```

### 3. room-inbox.png

Banner for "The Inbox" room (first task, email drafting simulator).

```
Image 3 of the series. Landscape, 1536 x 1024. Same style, same camera angle, same lighting as the lobby.

A close-up isometric vignette of the mailroom from the lobby on a single floating square floor tile, centred, filling the middle 60 percent of the width, plain lavender background around it.

A white wall of pigeonholes, some holding white, pink and lavender envelopes. In front, a wooden sorting table with an open laptop. Three envelopes float in a gentle arc from the laptop toward three pigeonholes, as if being sorted. A large magnifying glass rests on the table next to a short stack of envelopes, suggesting careful review before anything is sent.

No people, no text.
```

### 4. room-vault.png

Banner for "The Vault" room (safety).

```
Image 4 of the series. Landscape, 1536 x 1024. Same style, same camera angle, same lighting as the lobby.

A close-up isometric vignette of the vault from the lobby on a single floating square floor tile, centred, filling the middle 60 percent of the width, plain lavender background around it.

A large round steel vault door set in a short section of wall, slightly ajar, with a soft violet glow from inside. A violet keypad beside it. A small key hangs on a hook. On a little pedestal in front sits a simple shield shape in violet with a white keyhole symbol. Calm and reassuring, not threatening.

No people, no text.
```

### 5 to 10. avatar-1.png to avatar-6.png

Players pick one of these in the lobby. Send one prompt per avatar. First paste the shared block, then the person.

Shared block (put this at the top of each avatar prompt):

```
Character portrait for the same series. Square, 1024 x 1024, TRUE TRANSPARENT background (no checkerboard, no backdrop, no circle behind them).

Head and shoulders of one person, same low-poly clay 3D style and soft upper-left lighting as the scenes, turned slightly (three-quarter view) toward the viewer, friendly relaxed smile, looking at the viewer. Centred, the figure fills about 80 percent of the image height, with the shoulders cut off cleanly at the bottom edge. This person is a Filipino remote executive assistant. No text, no logos on clothing.
```

Then add one of these:

```
avatar-1: A woman in her mid-20s, long straight black hair in a low ponytail, light brown skin, a violet cardigan over a white top, small silver stud earrings.
```
```
avatar-2: A man in his early 30s, short black hair with a neat fade, medium brown skin, round thin-framed glasses, a navy crewneck sweater.
```
```
avatar-3: A woman in her late 20s, shoulder-length wavy dark brown hair, warm tan skin, wearing a slim headset with a small microphone, a soft pink blouse.
```
```
avatar-4: A man in his mid-20s, medium-length straight black hair swept to one side, light skin, a cyan hoodie, one wireless earbud visible.
```
```
avatar-5: A woman in her early 30s wearing a lavender hijab, warm brown skin, a white blazer over a violet top.
```
```
avatar-6: A man in his late 30s, short curly black hair with a little grey at the temples, deep brown skin, a short neat beard, a violet polo shirt.
```

### 11. dana.png

The pretend client in The Inbox room. She's fictional.

```
Character portrait for the same series, matching the avatar style exactly. Square, 1024 x 1024, TRUE TRANSPARENT background.

Head and shoulders of a friendly dentist in her mid-40s who runs a small dental practice: short dark bob haircut, warm light-brown skin, a white clinic coat over teal scrubs, a small pen in the coat pocket, confident warm smile, three-quarter view toward the viewer. Centred, fills about 80 percent of the image height. No text, no name badge, no logos.
```

### 12 to 16. Badges

Earned rewards. They must look like one matching set. Paste the shared block, then the symbol. Claude makes the "not earned yet" greyed-out version in code, so only one version of each is needed.

Shared block:

```
Badge icon for the same series. Square, 1024 x 1024, TRUE TRANSPARENT background.

A round medallion seen straight on (flat front view, not isometric), soft 3D clay style. A thick rounded outer rim with a smooth violet gradient from #754EFF at the top to #5200E3 at the bottom, a thin white inner ring, and a white inner disc. In the centre sits ONE simple symbol described below, in violet with at most one accent colour, sized to about half the disc. Centred, the medallion fills 85 percent of the image. No ribbon, no stars around the edge, no text or numbers. Every badge in the set must use this identical medallion, only the centre symbol changes.
```

Then add one of these:

```
badge-desk-ready: centre symbol is a tiny desk with an open laptop and a small plant, cyan accent on the laptop screen.
```
```
badge-first-task: centre symbol is a sheet of paper with a bold checkmark on it, pink accent on the checkmark.
```
```
badge-editors-eye: centre symbol is a friendly open eye above a short horizontal line with a small pen nib, cyan accent in the iris.
```
```
badge-secret-keeper: centre symbol is a small shield with a key in front of it, yellow #F7C948 accent on the key.
```
```
badge-client-ready: centre symbol is a five-pointed star with a small checkmark inside, yellow #F7C948 star with a white checkmark.
```

## Batch 2 (for Phase 2, 19 images)

| # | Filename | Size | Background |
|---|---|---|---|
| 17 | `room-shelf.png` | 1536 x 1024 | lavender |
| 18 | `room-help.png` | 1536 x 1024 | lavender |
| 19 | `room-studio.png` | 1536 x 1024 | lavender |
| 20 | `room-switchboard.png` | 1536 x 1024 | lavender |
| 21 | `room-clock.png` | 1536 x 1024 | lavender |
| 22 | `room-writing.png` | 1536 x 1024 | lavender |
| 23 | `room-workshop.png` | 1536 x 1024 | lavender |
| 24 | `room-engine.png` | 1536 x 1024 | lavender |
| 25-31 | seven more badges | 1024 x 1024 | transparent |
| 32-35 | `item-mug.png`, `item-plant.png`, `item-lamp.png`, `item-monitor.png` | 1024 x 1024 | transparent |

### Room banners 17 to 24

Use this shared block, then the room:

```
Same series. Landscape, 1536 x 1024. Same style, same camera angle, same lighting as the lobby. A close-up isometric vignette of one zone from the lobby, standing on a single floating square floor tile, centred, filling about the middle 60 percent of the width, plain lavender background around it. No people, no text.
```

```
room-shelf: the tall white bookshelf wall full of violet, pink and cyan books, a violet armchair, a reading lamp, and one open book floating gently above the armchair with a soft glow.
```
```
room-help: the white reception help desk with its violet front panel, a golden call bell, a headset, two small paper tickets, and a round sign on a stand showing a simple speech-bubble shape (no text).
```
```
room-studio: a design studio table with a monitor showing an abstract slide layout, an easel holding a board with simple bar-chart shapes, a neat stack of documents, and a few colour swatches in violet, pink and cyan.
```
```
room-switchboard: the wall switchboard panel with colourful patch cables connecting a row of rounded app-like tiles (plain coloured squares, no logos) to a laptop on a small stand in front.
```
```
room-clock: the tall standing clock kiosk (plain clock face, no numbers), a wall calendar with a few days highlighted in violet, and a short conveyor belt carrying three small envelopes and a document forward on a steady rhythm.
```
```
room-writing: the cosy writing nook, a small wooden desk with a keyboard, four neat stacks of paper cards in four colours (violet, pink, cyan, yellow) side by side, a pen, and two small blank speech bubbles floating above.
```
```
room-workshop: the wooden workbench with an open pink toolbox, shape stencils and cutters, a few puzzle pieces clicking together, and a small friendly robotic arm assembling a white card.
```
```
room-engine: the compact steel engine cabinet with three round gauges of different sizes (small, medium, large, with plain needles and no numbers), a large fuel-style meter half full in violet, and a few gently curving pipes.
```

### Badges 25 to 31

Same medallion shared block as Batch 1, then:

```
badge-connector-pro: centre symbol is two rounded plugs meeting in the middle, one violet and one cyan.
```
```
badge-scheduler: centre symbol is a round clock face (no numbers) with a circular arrow wrapping around it, pink accent on the arrow.
```
```
badge-deck-builder: centre symbol is a small presentation board on a stand with three rising bars, cyan accent on the tallest bar.
```
```
badge-prompt-whisperer: centre symbol is a speech bubble with a small four-pointed sparkle inside, yellow #F7C948 sparkle.
```
```
badge-skill-maker: centre symbol is a puzzle piece with a small wrench across it, pink accent on the puzzle piece.
```
```
badge-streak: centre symbol is a simple rounded flame, pink-to-yellow flame.
```
```
badge-voice-heard: centre symbol is a small megaphone with two sound waves, cyan accent on the waves.
```

### Desk items 32 to 35

Unlocked at levels 2 to 5 and shown as collectible tiles. Shared block:

```
Same series. Square, 1024 x 1024, TRUE TRANSPARENT background. One single object from the isometric camera angle, same clay style and upper-left lighting as the desk scene, centred, filling about 70 percent of the image, with a soft contact shadow directly under it. No text, no logos.
```

```
item-mug: a white ceramic mug with a violet band and a little curl of steam.
```
```
item-plant: a small monstera plant in a round white pot.
```
```
item-lamp: a modern desk lamp with a violet arm and a white shade, switched on with a soft warm glow.
```
```
item-monitor: a slim second monitor on a stand, showing an abstract violet and lavender interface.
```

## Checklist before saving each image

- [ ] No letters, numbers, words or logos anywhere, including on screens, books and signs.
- [ ] Same camera angle and lighting as `lobby.png` (scenes and items).
- [ ] Colours match the palette; background is lavender, not white or grey.
- [ ] Transparent images are really transparent (no painted checkerboard, no backdrop).
- [ ] Badges all share the identical medallion; only the centre symbol differs.
- [ ] Avatars all share the same framing and size.
- [ ] Filename matches the table exactly.
