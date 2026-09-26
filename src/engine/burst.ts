/* Confetti, hand rolled, tiny, off when the OS asks for reduced motion. */
export function burst(el?: HTMLElement | null) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const host = el ?? document.body
  const c = document.createElement("canvas")
  const r = host.getBoundingClientRect()
  c.width = r.width
  c.height = r.height
  c.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:5"
  host.style.position ||= "relative"
  host.appendChild(c)
  const ctx = c.getContext("2d")!
  const colors = ["#5200E3", "#754EFF", "#14E9ED", "#FF8EA9", "#9B00FF"]
  const parts = Array.from({ length: 70 }, () => ({
    x: r.width / 2 + (Math.random() - 0.5) * 80,
    y: r.height / 2,
    vx: (Math.random() - 0.5) * 9,
    vy: -Math.random() * 9 - 3,
    s: 4 + Math.random() * 5,
    c: colors[(Math.random() * colors.length) | 0],
    a: Math.random() * Math.PI,
  }))
  let t = 0
  const tick = () => {
    ctx.clearRect(0, 0, c.width, c.height)
    for (const p of parts) {
      p.x += p.vx
      p.vy += 0.25
      p.y += p.vy
      p.a += 0.1
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.a)
      ctx.fillStyle = p.c
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6)
      ctx.restore()
    }
    if (++t < 80) requestAnimationFrame(tick)
    else c.remove()
  }
  requestAnimationFrame(tick)
}
