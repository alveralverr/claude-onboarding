# Image brief for v5 (First Shift)

Same routine as `assets-src/v4`: one ChatGPT chat, paste the style guide from `../v4/README.md` first, then these prompts. Save the PNGs here with the exact filenames. Claude measures, converts and wires them in.

## Batch (10 images, 1 optional)

| # | Filename | Size | Background |
|---|---|---|---|
| 1 | `desk-pov.png` | 1536 x 1024 | full scene |
| 2 | `client-priya.png` | 1024 x 1024 | transparent |
| 3 | `client-marco.png` | 1024 x 1024 | transparent |
| 4 | `client-nadia.png` | 1024 x 1024 | transparent |
| 5 | `client-tom.png` | 1024 x 1024 | transparent |
| 6 | `client-leah.png` | 1024 x 1024 | transparent |
| 7 | `coach-andi.png` | 1024 x 1024 | transparent |
| 8 | `badge-first-shift.png` | 1024 x 1024 | transparent |
| 9 | `badge-path-admin.png` | 1024 x 1024 | transparent |
| 10 | `badge-path-finance.png`, `badge-path-leadgen.png`, `badge-path-ops.png`, `badge-path-content.png` | 1024 x 1024 | transparent (optional now, needed as paths ship) |

### 1. desk-pov.png

This is the new home screen: what the assistant sees sitting at their desk. The laptop and phone screens must be **flat pure green (#00FF00)** so Claude can find their exact corners and place the real, clickable screens on top.

```
Same series and style as the office images. Landscape, 1536 x 1024.

A first-person view from a chair, looking straight ahead at a tidy desk against a wall, as if the viewer is sitting down to work. Soft, bright, calm, same clay style, palette and upper-left light as the lobby. No people, no hands, no text anywhere.

Layout, which matters, please follow it closely:
- CENTRE: an open laptop facing the viewer head-on, with only slight perspective. Its screen is a flat, evenly lit, pure green #00FF00 rectangle, no reflections, no UI, no glare, with a thin dark bezel. The screen spans roughly the middle third of the image width, its top edge about a fifth of the way down, its bottom edge a little above the middle. The keyboard is visible below it.
- RIGHT, on the desk: a smartphone lying flat, screen up, seen in perspective. Its screen is also a flat pure green #00FF00, no reflections. Next to it a small violet notebook, and a white mug with a violet band with a little steam.
- LEFT FRONT: a clear, empty stretch of wooden desk surface (about the left quarter of the desk) with nothing on it. Sticky notes will be placed there digitally.
- WALL, top left: a round wall clock with a completely blank white face: no numbers, no marks, no hands.
- WALL, between the clock and the window: a small cork noticeboard in a thin white frame, with three blank pastel note cards (violet, pink, cyan) pinned to it and two round white pins. No writing on the cards.
- WALL, top right: a window with soft daylight. Below the board, a small shelf with a plant and three books.
- Desk surface: warm light wood (#DCC3AA to #EAD9C6). Wall: soft lavender (#ECEAF8).

Everything evenly lit, uncluttered, inviting. No text, no logos, no people.
```

### 2 to 7. Portraits

Use the avatar shared block from `../v4/README.md` (true transparent background, head and shoulders, same framing as the avatars), then:

```
client-priya: A practice client, not a real person. Woman in her early 40s, founder of an architecture studio. Shoulder-length black hair, warm brown skin, thin dark-rimmed glasses, a charcoal blazer over a white top, calm confident smile.
```
```
client-marco: A practice client. Man in his mid 40s who owns two coffee shops. Short dark wavy hair, light tan skin, trimmed stubble, a denim shirt with a brown canvas apron.
```
```
client-nadia: A practice client. Woman in her mid 30s, founder of a recruiting agency. Natural curly hair pulled back, deep brown skin, gold hoop earrings, a mustard blazer.
```
```
client-tom: A practice client. Man in his early 50s, operations lead at a landscaping company. Short grey-brown hair, light skin with a little sun, a green polo shirt, friendly and practical.
```
```
client-leah: A practice client. Woman in her early 30s, a wellness coach who films videos. Long straight dark hair, light skin, a soft sage knit sweater, relaxed warm smile.
```
```
coach-andi: A friendly Magic Account Lead, a Filipino man in his early 30s. Short neat black hair, medium brown skin, a violet quarter-zip over a white collar, encouraging smile.
```

### 8 to 10. Badges

Use the medallion shared block from `../v4/README.md` (identical medallion, only the centre symbol changes), then:

```
badge-first-shift: centre symbol is a white mug with a violet band and a small yellow #F7C948 star rising from it like steam.
```
```
badge-path-admin: centre symbol is an inbox tray with a pink envelope and a small checkmark.
```
```
badge-path-finance: centre symbol is a small calculator with a cyan display.
badge-path-leadgen: centre symbol is a horseshoe magnet with two small pink sparks.
badge-path-ops: centre symbol is two interlocking gears, one violet and one cyan.
badge-path-content: centre symbol is a small megaphone with a pink sound wave and a sparkle.
```

## Checklist

- [ ] Laptop and phone screens are flat #00FF00 with no reflections or UI (desk-pov).
- [ ] Clock face is blank: no numbers, no hands (desk-pov).
- [ ] The noticeboard has blank cards, no writing (desk-pov).
- [ ] The left front of the desk is empty (desk-pov).
- [ ] Portraits match the avatar framing and are truly transparent.
- [ ] Badges use the identical medallion.
- [ ] No text, letters or logos anywhere.
