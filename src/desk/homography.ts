/* CSS matrix3d that maps a w x h box onto any four-point quad, so a real
   DOM screen can sit exactly on the laptop in a rendered photo. Points are
   top-left, top-right, bottom-right, bottom-left. */
export type Pt = [number, number]
export type Quad = [Pt, Pt, Pt, Pt]

function solve(A: number[][], b: number[]): number[] {
  const n = b.length
  const M = A.map((row, i) => [...row, b[i]])
  for (let c = 0; c < n; c++) {
    let p = c
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r
    ;[M[c], M[p]] = [M[p], M[c]]
    for (let r = 0; r < n; r++) {
      if (r === c) continue
      const f = M[r][c] / M[c][c]
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]
    }
  }
  return M.map((row, i) => row[n] / row[i])
}

export function matrix3dFor(w: number, h: number, q: Quad): string {
  const src: Pt[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ]
  const A: number[][] = []
  const b: number[] = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]
    const [u, v] = q[i]
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y])
    b.push(u)
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y])
    b.push(v)
  }
  const [a, bb, c, d, e, f, g, hh] = solve(A, b)
  const m = [a, d, 0, g, bb, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1]
  return `matrix3d(${m.map((x) => +x.toFixed(10)).join(",")})`
}

export const bbox = (q: Quad) => {
  const xs = q.map((p) => p[0])
  const ys = q.map((p) => p[1])
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }
}
