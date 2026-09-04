import { useEffect, useRef } from 'react'

// Ambient background: a soft glow that follows the finger/cursor, plus a
// field of drifting stars, sitting behind the whole app.
//
// - pulseGlow() — called on any real interaction (branch/gender pick, submit,
//   category tap, region switch). Shifts the glow's color/size, and
//   permanently (capped) ramps the stars' speed, count, and a faint
//   white -> light-blue-gray color drift, so the longer someone uses the
//   app in one sitting the more alive the background feels.
// - A global pointerdown/touchstart listener scatters nearby stars away
//   from the tap like a water-drop splash; they ease back into the flow.
//
// Plain 2D canvas, no WebGL/Three.js: stays light on low-end phones.
// Sessions here are short (people fill the form and leave in well under a
// minute), so everything is tuned to read as lively from frame one rather
// than slowly building up.

const PALETTE = [43, 43, 43, 270, 150] // gold appears most often, purple/green as occasional accents
let paletteIdx = 0
let pulseFn = null

export function pulseGlow() {
  if (pulseFn) pulseFn()
}

let pulseBackFn = null
// Navigating back (closing a category, going back to the form) eases the
// pace down a little instead of ramping it up — forward progress speeds
// things up, backing out lets it breathe.
export function pulseGlowBack() {
  if (pulseBackFn) pulseBackFn()
}

const BASE_STAR_COUNT = 110
const MAX_EXTRA_STARS = 70 // escalation cap: up to 180 stars total
const MAX_SPEED_MUL = 3.2
const SPEED_STEP = 0.22
const COLOR_STEP = 0.09
const START_SPEED_MUL = 1.6 // already fast at baseline, not a slow ramp-up from 1x

export default function AmbientGlow() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let W = 0
    let H = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let stars = []

    function makeStar() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.35,
        s: Math.random() * 0.32 + 0.12,
        a: Math.random() * 0.4 + 0.2,
        ox: 0, oy: 0, vx: 0, vy: 0, // scatter offset + velocity (spring back to 0)
      }
    }

    function resize() {
      const newW = window.innerWidth
      const newH = window.innerHeight
      // Resizing the canvas backing store clears it, so skip the work
      // entirely when the size hasn't actually changed — otherwise a
      // ResizeObserver firing on unrelated layout shifts (e.g. an
      // AnimatePresence height animation during page navigation) blanks
      // the canvas for a frame on every such shift, reading as a flicker.
      if (newW === W && newH === H) return
      const prevW = W
      const prevH = H
      W = newW
      H = newH
      canvas.width = Math.max(1, W * dpr)
      canvas.height = Math.max(1, H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!stars.length) {
        stars = Array.from({ length: BASE_STAR_COUNT }, makeStar)
        return
      }
      // The viewport (or the artifact's embedding frame) can resize after
      // first paint. Re-scatter existing stars proportionally to the new
      // size instead of leaving them clustered in the old, narrower bounds
      // — otherwise one whole side of a newly-widened view stays empty.
      if (prevW > 0 && prevH > 0) {
        const sx = W / prevW
        const sy = H / prevH
        for (const s of stars) {
          s.x *= sx
          s.y *= sy
        }
      }
    }
    resize()
    window.addEventListener('resize', resize)
    // Belt-and-suspenders: some embedding contexts (e.g. an artifact preview
    // pane) resize their frame without firing a window 'resize' event.
    // Debounced, and resize() itself no-ops when the size didn't change, so
    // ordinary in-page layout shifts (route transitions, expanding cards)
    // never touch the canvas.
    let ro
    let roTimer = null
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => {
        clearTimeout(roTimer)
        roTimer = setTimeout(resize, 120)
      })
      ro.observe(document.documentElement)
    }

    const glow = { x: W / 2, y: H * 0.3, tx: W / 2, ty: H * 0.3, hue: 43, r: 220, tr: 220 }

    // escalating, capped session state — starts already brisk
    let speedMul = START_SPEED_MUL
    let colorDrift = 0 // 0 = pure white, 1 = light blue-gray

    function setTarget(x, y) {
      glow.tx = x
      glow.ty = y
    }
    function onPointerMove(e) {
      setTarget(e.clientX, e.clientY)
    }
    function onTouchMove(e) {
      const t = e.touches[0]
      if (t) setTarget(t.clientX, t.clientY)
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    pulseFn = () => {
      paletteIdx = (paletteIdx + 1) % PALETTE.length
      glow.hue = PALETTE[paletteIdx]
      glow.tr = 300

      speedMul = Math.min(speedMul + SPEED_STEP, MAX_SPEED_MUL)
      colorDrift = Math.min(colorDrift + COLOR_STEP, 1)
      if (stars.length < BASE_STAR_COUNT + MAX_EXTRA_STARS) {
        stars.push(makeStar())
        if (stars.length < BASE_STAR_COUNT + MAX_EXTRA_STARS) stars.push(makeStar())
        if (Math.random() < 0.5 && stars.length < BASE_STAR_COUNT + MAX_EXTRA_STARS) stars.push(makeStar())
      }
    }

    pulseBackFn = () => {
      speedMul = Math.max(START_SPEED_MUL, speedMul - SPEED_STEP * 1.4)
    }

    // water-drop scatter wherever the user taps/clicks anywhere on the page —
    // a big "boom" outward burst that eases back to the flow quickly after.
    function scatterAt(cx, cy) {
      const RADIUS = 280
      for (const s of stars) {
        const dx = s.x - cx
        const dy = s.y - cy
        const dist = Math.hypot(dx, dy) || 1
        if (dist < RADIUS) {
          const force = (1 - dist / RADIUS) * 165
          s.vx += (dx / dist) * force
          s.vy += (dy / dist) * force
        }
      }
    }
    function onPointerDown(e) {
      scatterAt(e.clientX, e.clientY)
    }
    function onTouchStart(e) {
      const t = e.touches[0]
      if (t) scatterAt(t.clientX, t.clientY)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })

    let raf
    function loop() {
      ctx.clearRect(0, 0, W, H)

      // star fill color: white -> soft light blue-gray as colorDrift grows
      const r = Math.round(255 - colorDrift * 25)
      const g = Math.round(255 - colorDrift * 15)
      const b = 255
      ctx.fillStyle = `rgb(${r},${g},${b})`

      for (const s of stars) {
        if (!reduceMotion) {
          s.y -= s.s * speedMul
          if (s.y < -2) s.y = H + 2
          // spring the scatter offset back toward 0 — snappy settle even
          // after a big burst, so it reads as "away, then quickly back"
          s.vx *= 0.85
          s.vy *= 0.85
          s.ox += s.vx * 0.16
          s.oy += s.vy * 0.16
          s.ox *= 0.85
          s.oy *= 0.85
        }
        ctx.globalAlpha = s.a
        ctx.beginPath()
        ctx.arc(s.x + s.ox, s.y + s.oy, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // glow
      glow.x += (glow.tx - glow.x) * 0.05
      glow.y += (glow.ty - glow.y) * 0.05
      glow.r += (glow.tr - glow.r) * 0.04
      glow.tr += (220 - glow.tr) * 0.01

      const grad = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.r)
      grad.addColorStop(0, `hsla(${glow.hue}, 70%, 60%, 0.14)`)
      grad.addColorStop(0.5, `hsla(${glow.hue}, 70%, 55%, 0.05)`)
      grad.addColorStop(1, 'hsla(0,0%,0%,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(roTimer)
      window.removeEventListener('resize', resize)
      if (ro) ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('touchstart', onTouchStart)
      pulseFn = null
      pulseBackFn = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
