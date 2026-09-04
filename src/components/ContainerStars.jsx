import { useEffect, useRef } from 'react'

// A faint field of slow-moving stars confined INSIDE one container — used for
// the category/city selector cards (density 0.3) and the individual college
// rows (density 0.1), so the background starfield feels like it "continues"
// into these containers without being distracting on top of dense text.
//
// Absolutely positioned to fill its parent (parent must be position:relative),
// sits above the card background but below the card's real content via zIndex.
export default function ContainerStars({ density = 0.2, seed = 0 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let W = 0
    let H = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let stars = []
    let ro

    function makeStars() {
      const rect = parent.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = Math.max(1, W * dpr)
      canvas.height = Math.max(1, H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // density -> how many stars per 1000px^2 of area, kept gentle so text stays readable
      const area = W * H
      const count = Math.max(2, Math.round((area / 3200) * density * 10))
      let rnd = seed * 7919 + 13
      function rand() {
        rnd = (rnd * 1103515245 + 12345) & 0x7fffffff
        return (rnd % 10000) / 10000
      }
      stars = Array.from({ length: count }, () => ({
        x: rand() * W,
        y: rand() * H,
        r: rand() * 1.1 + 0.3,
        s: rand() * 0.035 + 0.012, // noticeably slower than the open background field
        a: rand() * 0.35 + 0.15,
      }))
    }

    makeStars()
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => makeStars())
      ro.observe(parent)
    }

    let raf
    function loop() {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(255,255,255,1)'
      for (const s of stars) {
        if (!reduceMotion) {
          s.y -= s.s
          if (s.y < -2) s.y = H + 2
        }
        ctx.globalAlpha = s.a
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      if (ro) ro.disconnect()
    }
  }, [density, seed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
