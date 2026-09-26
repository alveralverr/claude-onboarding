# Your Desk — rendered scene v2

Created with the built-in image generation tool. The runtime asset is
`public/assets/media/desk-pov-v2.webp` (1536 × 1024, quality 88, about 212 KB).
The original source is `assets-src/v5/desk-pov-v2.png` (ignored by Git).

The room uses a pre-rendered image, not a runtime 3D engine. The laptop and
phone have real DOM previews mapped over their chroma screens. Clock hands,
task notes, unread indicators, steam, object labels and pointer movement are
rendered separately. All gameplay callbacks remain in `Desk.tsx`.

Screen quads and object hit areas are measured in `src/desk/plateConfig.ts`.
Re-measure these against the image whenever replacing the render. Do not use
the prompt's approximate coordinates as final coordinates. The CSS screen
borders deliberately overlap the green edges by a few pixels.

Reduced-motion settings disable pointer movement, steam and notification
pulses. The existing mobile task list and toolbar provide larger touch targets.

## Generation prompt

Use case: stylized-concept. Asset type: production background plate for an interactive cozy office game, landscape 1536 x 1024, 3:2 ratio. Create a beautiful high-fidelity premium 3D rendered desk scene, from seated first-person perspective, looking slightly down at a desk against a wall. Full bleed scene, no border. Tactile, believable dimensional objects with soft bevels, delicate material texture, ambient occlusion, beautiful warm morning daylight from upper right. Sophisticated cozy clay / miniature architectural render, not a flat vector illustration, not low poly. Pale muted lavender plaster wall, natural blonde oak wood desktop, brushed silver laptop, ivory ceramics, restrained violet accents, sage green plant. Detailed physical material finish, soft contact shadows, warm reflected light. All objects sharp, no depth of field blur.
Strict layout relative to 1536x1024 canvas: wall behind desk occupies top 570px; oak desktop visible from y570 all the way to bottom. CENTER open laptop: large thin dark bezel with brushed aluminum housing, screen corners approximately (505,275),(1040,275),(1070,630),(470,630). Screen MUST be solid flat pure #00FF00 chroma green, absolutely no UI/text/reflections, intended for a live UI overlay. Laptop detailed keyboard with individual dark keycaps, speaker grilles and trackpad, base extends from (470,640),(1070,640) to (1160,815),(385,815). Add charcoal-lavender felt desk mat below the laptop, kept entirely in center area.
LEFT FRONT desk from x60 to x365 and y640 to y980 must be completely EMPTY usable wooden surface for digital sticky notes. No physical sticky notes on the desk.
RIGHT desk: a modern smartphone with thin graphite frame lying screen up, length from y770 to y955, screen roughly (1230,770),(1330,758),(1370,936),(1265,958). Phone screen MUST be entirely flat pure #00FF00 chroma green without UI/reflections. Small closed violet fabric notebook positioned behind the phone at x1160 y620 to x1345 y745, clearly visible, with ivory page edges, elastic strap and satin ribbon, no text. White ceramic coffee cup with small violet band, coffee visible inside, on matching saucer at x1430 y680, fully in frame. No steam (will be animated later).
WALL: upper left round ivory clock, center (240,180), radius 65, completely blank white face NO hands, NO tick marks, NO numbers (will be overlaid). Dimensional rounded frame and soft cast shadow. A small oak floating shelf below clock at x90..360 y435 with a beautiful leafy sage plant in a textured ivory ceramic pot and three small violet/cream/sage books. Cork noticeboard x410 y105 width300 height150, slim ivory frame, three pastel cards pinned with dimensional pins, NO TEXT. Upper right inset window x1120 y80 width330 height380: dimensional ivory deep frame, mullions, hazy serene greenery outside, warm clear sky. Soft window light and gentle angled shadows across wall and desk. Tasteful, polished, immersive, carefully composed, uncluttered, spacious, inviting. No people, no hands, no text, no watermarks, no logo. Laptop and phone screens bright pure green is essential; clock blank essential.
