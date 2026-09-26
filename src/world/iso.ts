/* Isometric projection shared by the scene and the map hotspots. */
export const U = 26
export const VW = 1600
export const VH = 900
const OX = 690
const OY = 120

export type P = [number, number]
export const px = (x: number, y: number, z = 0): P => [OX + (x - y) * 0.866 * U, OY + (x + y) * 0.5 * U - z * U]
export const poly = (pts: P[]) => pts.map((p) => p.join(",")).join(" ")


export const ZONES: Record<string, [number, number, number]> = {
  desk: [7.2, 14.4, 2.2],
  inbox: [25, 13.4, 3.2],
  vault: [0.6, 5, 1.4],
  shelf: [14, 1.4, 4.2],
  help: [24.8, 3.6, 1.6],
  studio: [25.6, 9.1, 2.4],
  switchboard: [0.3, 12.5, 2.0],
  clock: [20.5, 0.8, 3.2],
  writing: [16.5, 15.2, 2.2],
  workshop: [15, 10.5, 2.2],
  engine: [8.6, 0.9, 3.2],
}
export function zonePercent(id: string): { x: number; y: number } {
  const z = ZONES[id]
  if (!z) return { x: 50, y: 50 }
  const [sx, sy] = px(...z)
  return { x: (sx / VW) * 100, y: (sy / VH) * 100 }
}

