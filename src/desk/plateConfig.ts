import type { Quad } from "./homography"

/* Measured against desk-pov-v2.webp (1536 × 1024). Screen coordinates
   include a small bleed to cover the chroma edges after WebP compression.
   Keep the image, screen quads, and object hit areas in sync. */
export const PLATE = {
  src: "/assets/media/desk-pov-v2.webp",
  w: 1536,
  h: 1024,
  screen: [
    [534, 319],
    [1018, 319],
    [1033, 628],
    [523, 628],
  ] as Quad,
  phone: [
    [1190, 741],
    [1288, 731],
    [1370, 884],
    [1253, 899],
  ] as Quad,
  clock: { x: 273, y: 126, r: 70 },
  board: { x: 470, y: 54, w: 366, h: 209 },
  notes: { x: 42, y: 682, w: 350 },
  notebook: { x: 1108, y: 569, w: 225, h: 147 },
  mug: { x: 1435, y: 605 },
}
