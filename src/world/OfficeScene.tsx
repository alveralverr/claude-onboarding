/* The office floor, drawn as a low-poly isometric diorama in SVG. Every
   solid is a box() so the whole scene shares one light and one palette.
   Zone centres are exported so the map's hotspots always sit on the
   furniture. Swap this for a rendered image later by replacing the
   component; keep zonePercent() so the hotspots still line up. */

import { VH, VW, px, poly, type P } from "./iso"

type Shade = { top: string; left: string; right: string; stroke?: string }
const LAV: Shade = { top: "#F6F5FC", left: "#DEDAF3", right: "#CBC5EB" }
const WALL: Shade = { top: "#F1EFFA", left: "#ECEAF9", right: "#E1DDF5" }
const WHITE: Shade = { top: "#FFFFFF", left: "#E9E6F7", right: "#D8D3F0" }
const VIOLET: Shade = { top: "#8B6BFF", left: "#5200E3", right: "#3E00B0" }
const INK: Shade = { top: "#3A3852", left: "#24233A", right: "#17162A" }
const STEEL: Shade = { top: "#E7E9F2", left: "#C4C8DA", right: "#A9AEC6" }
const WOOD: Shade = { top: "#F2E2D2", left: "#DCC3AA", right: "#C6A98C" }

function Box({ x, y, z = 0, w, d, h, s, r }: { x: number; y: number; z?: number; w: number; d: number; h: number; s: Shade; r?: number }) {
  const t = z + h
  const top = [px(x, y, t), px(x + w, y, t), px(x + w, y + d, t), px(x, y + d, t)]
  const left = [px(x, y + d, t), px(x + w, y + d, t), px(x + w, y + d, z), px(x, y + d, z)]
  const right = [px(x + w, y, t), px(x + w, y + d, t), px(x + w, y + d, z), px(x + w, y, z)]
  return (
    <g strokeLinejoin="round" strokeWidth={r ?? 0.8} stroke={s.stroke ?? "rgba(20,10,60,0.10)"}>
      <polygon points={poly(left)} fill={s.left} />
      <polygon points={poly(right)} fill={s.right} />
      <polygon points={poly(top)} fill={s.top} />
    </g>
  )
}

/* A circle lying on a vertical plane. plane "x": spans y and z at fixed x.
   plane "y": spans x and z at fixed y. */
function Disc({ plane, at, c1, c2, z, r, fill, stroke }: { plane: "x" | "y"; at: number; c1: number; c2?: number; z: number; r: number; fill: string; stroke?: string }) {
  const pts: P[] = []
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2
    const u = c1 + Math.cos(a) * r
    const v = z + Math.sin(a) * r
    pts.push(plane === "x" ? px(at, u, v) : px(u, at, v))
  }
  void c2
  return <polygon points={poly(pts)} fill={fill} stroke={stroke ?? "rgba(20,10,60,0.12)"} strokeWidth={0.8} />
}

/* A rectangle on a vertical plane. */
function Panel({ plane, at, u0, u1, z0, z1, fill }: { plane: "x" | "y"; at: number; u0: number; u1: number; z0: number; z1: number; fill: string }) {
  const p = (u: number, z: number) => (plane === "x" ? px(at, u, z) : px(u, at, z))
  return <polygon points={poly([p(u0, z1), p(u1, z1), p(u1, z0), p(u0, z0)])} fill={fill} />
}

function Shadow({ x, y, w, d }: { x: number; y: number; w: number; d: number }) {
  return <polygon points={poly([px(x, y), px(x + w, y), px(x + w, y + d), px(x, y + d)])} fill="rgba(60,30,140,0.10)" />
}

export function OfficeScene({ className }: { className?: string }) {
  const books = ["#5200E3", "#FF8EA9", "#14E9ED", "#754EFF", "#9B00FF", "#FF8EA9", "#5200E3", "#14E9ED", "#754EFF", "#9B00FF", "#5200E3", "#FF8EA9"]
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className={className} role="img" aria-label="An isometric office floor: a desk at the front left, a mailroom at the front right, a vault door on the left wall, a bookshelf on the back wall and a help desk at the back right." preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#754EFF" stopOpacity="0.28" />
          <stop offset="45%" stopColor="#FF8EA9" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#14E9ED" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={VW} height={VH} fill="#E6E6F8" />
      <ellipse cx={VW / 2} cy={VH * 0.55} rx={VW * 0.5} ry={VH * 0.42} fill="url(#glow)" />

      {/* floor slab */}
      <Box x={0} y={0} z={-0.7} w={30} d={20} h={0.7} s={LAV} />
      {/* subtle floor grid */}
      {Array.from({ length: 5 }, (_, i) => (
        <polyline key={`gx${i}`} points={poly([px((i + 1) * 5, 0), px((i + 1) * 5, 20)])} stroke="rgba(82,0,227,0.06)" fill="none" />
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <polyline key={`gy${i}`} points={poly([px(0, (i + 1) * 5), px(30, (i + 1) * 5)])} stroke="rgba(82,0,227,0.06)" fill="none" />
      ))}
      {/* walls */}
      <Box x={-0.6} y={-0.6} w={30.6} d={0.6} h={6} s={WALL} />
      <Box x={-0.6} y={0} w={0.6} d={20} h={6} s={WALL} />

      {/* back wall: engine cabinet, wall clock, bookshelf */}
      <Box x={7.5} y={0.3} w={2.2} d={1.2} h={3.2} s={STEEL} />
      <Disc plane="y" at={1.5} c1={8.6} z={2.2} r={0.6} fill="#FFFFFF" />
      <Disc plane="y" at={1.5} c1={8.6} z={2.2} r={0.08} fill="#5200E3" />
      <polyline points={poly([px(8.6, 1.5, 2.2), px(8.95, 1.5, 2.6)])} stroke="#5200E3" strokeWidth={2} fill="none" />

      <Disc plane="y" at={-0.05} c1={20.5} z={4.3} r={0.9} fill="#FFFFFF" stroke="#5200E3" />
      <polyline points={poly([px(20.5, -0.05, 4.3), px(20.5, -0.05, 4.95)])} stroke="#24233A" strokeWidth={2} fill="none" />
      <polyline points={poly([px(20.5, -0.05, 4.3), px(21.0, -0.05, 4.3)])} stroke="#24233A" strokeWidth={2} fill="none" />

      <Box x={11.5} y={0.2} w={5} d={1.2} h={4.6} s={WHITE} />
      {[1.1, 2.2, 3.3].map((z) => (
        <Panel key={z} plane="y" at={1.45} u0={11.6} u1={16.4} z0={z} z1={z + 0.08} fill="#CBC5EB" />
      ))}
      {[0.1, 1.2, 2.3, 3.4].map((z, row) =>
        books.slice(0, 9).map((c, i) => (
          <Panel key={`${row}-${i}`} plane="y" at={1.45} u0={11.8 + i * 0.5} u1={12.15 + i * 0.5} z0={z} z1={z + 0.85 - ((i + row) % 3) * 0.12} fill={c} />
        ))
      )}
      {/* reading chair */}
      <Shadow x={14.6} y={2.4} w={2} d={2} />
      <Box x={14.6} y={2.4} w={2} d={2} h={0.9} s={VIOLET} />
      <Box x={14.6} y={2.4} w={0.5} d={2} h={2} s={VIOLET} />

      {/* help desk */}
      <Shadow x={22} y={2.6} w={5.5} d={1.8} />
      <Box x={22} y={2.6} w={5.5} d={1.8} h={1.7} s={WHITE} />
      <Panel plane="y" at={4.45} u0={22.3} u1={27.2} z0={0.5} z1={1.3} fill="#5200E3" />
      <Box x={26.2} y={3.2} w={0.7} d={0.7} h={0.12} s={INK} z={1.7} />
      <Disc plane="y" at={3.55} c1={26.55} z={2.1} r={0.32} fill="#F7C948" stroke="#B98E1C" />

      {/* studio table (phase 2) */}
      <Shadow x={24} y={8} w={3.2} d={2.2} />
      <Box x={24} y={8} w={3.2} d={2.2} h={1.4} s={WOOD} />
      <Box x={24.6} y={8.3} w={1.4} d={0.15} h={1.1} s={INK} z={1.4} />
      <Panel plane="y" at={8.45} u0={24.7} u1={25.9} z0={1.55} z1={2.4} fill="#14E9ED" />
      <Box x={26.4} y={9.4} w={0.15} d={0.15} h={2.6} s={WOOD} />

      {/* side wall: vault door, switchboard */}
      <Disc plane="x" at={0.05} c1={5} z={3.2} r={2.2} fill="#D9DCEA" stroke="#9AA0B8" />
      <Disc plane="x" at={0.1} c1={5} z={3.2} r={1.7} fill="#EEF0F7" stroke="#B4B9CC" />
      <Disc plane="x" at={0.15} c1={5} z={3.2} r={0.55} fill="#5200E3" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2
        return <polyline key={i} points={poly([px(0.15, 5 + Math.cos(a) * 0.6, 3.2 + Math.sin(a) * 0.6), px(0.15, 5 + Math.cos(a) * 1.3, 3.2 + Math.sin(a) * 1.3)])} stroke="#5200E3" strokeWidth={3} strokeLinecap="round" fill="none" />
      })}
      <Box x={0} y={8} w={0.25} d={0.9} h={1.2} s={INK} z={2.4} />
      <Panel plane="x" at={0.05} u0={10.5} u1={14.5} z0={1.6} z1={4.2} fill="#24233A" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => (
          <Disc key={`${r}${c}`} plane="x" at={0.02} c1={10.9 + c * 0.6} z={2.0 + r * 0.55} r={0.13} fill={["#14E9ED", "#FF8EA9", "#754EFF", "#F7C948"][(r + c) % 4]} />
        ))
      )}

      {/* workshop bench (phase 2) */}
      <Shadow x={13} y={9.5} w={4} d={2} />
      <Box x={13} y={9.5} w={4} d={2} h={1.3} s={WOOD} />
      <Box x={13.5} y={10} w={1.2} d={0.8} h={0.6} s={{ top: "#FF6BA0", left: "#E0407A", right: "#B62F60" }} z={1.3} />

      {/* the desk */}
      <Shadow x={4} y={12.6} w={6.4} d={3.2} />
      <Box x={4} y={12.8} w={6.4} d={3} h={2.3} s={WHITE} />
      <Box x={4.3} y={13.1} w={0.3} d={2.4} h={2.3} s={LAV} z={-2.3 + 2.3 - 2.3} />
      <Box x={5.4} y={13.7} w={2.4} d={1.6} h={0.14} s={INK} z={2.3} />
      <Box x={5.4} y={13.7} w={2.4} d={0.1} h={1.5} s={INK} z={2.44} />
      <Panel plane="y" at={13.8} u0={5.55} u1={7.65} z0={2.6} z1={3.8} fill="#EFEAFF" />
      <Panel plane="y" at={13.8} u0={5.8} u1={7.2} z0={3.0} z1={3.1} fill="#5200E3" />
      <Panel plane="y" at={13.8} u0={5.8} u1={6.9} z0={2.8} z1={2.9} fill="#C9C3EA" />
      <Box x={8.6} y={13.4} w={0.6} d={0.6} h={0.5} s={{ top: "#F2C1A7", left: "#D97757", right: "#B85E3F" }} z={2.3} />
      <Box x={9.3} y={14.6} w={0.5} d={0.5} h={0.6} s={WOOD} z={2.3} />
      <ellipse {...(() => { const [cx, cy] = px(9.55, 14.85, 3.5); return { cx, cy } })()} rx={16} ry={13} fill="#3CC47C" stroke="rgba(20,10,60,0.12)" />
      <Box x={4.6} y={13.2} w={0.15} d={0.15} h={1.9} s={INK} z={2.3} />
      <Box x={4.3} y={12.9} w={0.9} d={0.7} h={0.35} s={{ top: "#FFE08A", left: "#F7C948", right: "#D9A929" }} z={4.2} />
      {/* chair */}
      <Shadow x={6.2} y={16.4} w={1.7} d={1.7} />
      <Box x={6.2} y={16.4} w={1.7} d={1.7} h={1.1} s={VIOLET} />
      <Box x={6.2} y={17.7} w={1.7} d={0.4} h={2.3} s={VIOLET} />

      {/* writing nook */}
      <Shadow x={15} y={14.4} w={3.2} d={1.8} />
      <Box x={15} y={14.4} w={3.2} d={1.8} h={1.3} s={WOOD} />
      {["#5200E3", "#FF8EA9", "#14E9ED", "#F7C948"].map((c, i) => (
        <Box key={c} x={15.3 + i * 0.7} y={14.7} w={0.5} d={0.7} h={0.35 + (i % 2) * 0.15} s={{ top: c, left: c, right: c }} z={1.3} />
      ))}
      <Box x={15.4} y={15.5} w={1.6} d={0.5} h={0.08} s={INK} z={1.3} />

      {/* the mailroom */}
      <Shadow x={22} y={12} w={6} d={1.2} />
      <Box x={22} y={12} w={6} d={1.2} h={4.4} s={WHITE} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <Panel key={`${r}${c}`} plane="y" at={13.25} u0={22.3 + c * 1.12} u1={23.2 + c * 1.12} z0={0.35 + r * 1.0} z1={1.15 + r * 1.0} fill={(r * 5 + c) % 3 === 0 ? "#EFEAFF" : "#DEDAF3"} />
        ))
      )}
      {[0, 2, 3].map((c) => (
        <Panel key={c} plane="y" at={13.3} u0={22.45 + c * 1.12} u1={23.05 + c * 1.12} z0={0.55 + (c % 2) * 1.0} z1={0.95 + (c % 2) * 1.0} fill="#FFFFFF" />
      ))}
      <Shadow x={23} y={14.6} w={2.6} d={1.6} />
      <Box x={23} y={14.6} w={2.6} d={1.6} h={1.2} s={WOOD} />
      <Box x={23.4} y={14.9} w={1} d={0.7} h={0.18} s={WHITE} z={1.2} />
      <Box x={24.3} y={15.3} w={1} d={0.7} h={0.18} s={{ top: "#FFD6E1", left: "#FF8EA9", right: "#E0407A" }} z={1.2} />
    </svg>
  )
}
