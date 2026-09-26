import type { Quad } from "./homography"

/* The first-person desk. Coordinates are pixels on a 1536 x 1024 plate.
   While `src` is null a drawn placeholder is used (Plate.tsx). When the
   ChatGPT render arrives (assets-src/v5/README.md), set `src` and
   re-measure the quads: the laptop and phone screens are flat green in the
   render so they can be found exactly. */
export const PLATE = {
  src: null as string | null,
  w: 1536,
  h: 1024,
  screen: [
    [500, 212],
    [1036, 212],
    [1060, 592],
    [476, 592],
  ] as Quad,
  phone: [
    [1244, 762],
    [1332, 753],
    [1360, 918],
    [1268, 930],
  ] as Quad,
  clock: { x: 250, y: 170, r: 62 },
  board: { x: 420, y: 90, w: 300, h: 210 },
  notes: { x: 70, y: 660, w: 360 },
  notebook: { x: 1060, y: 840, w: 170, h: 160 },
}
