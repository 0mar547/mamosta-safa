import { useEffect, useRef, useState } from 'react'
import mascotSheet from '../assets/mascot_sheet.png'

// The mascot sprite sheet is 8 frames laid out in a single horizontal strip,
// each 328x599px (matches the raw grid cells cut from the source artwork).
const FRAME_COUNT = 8
const FRAME_W = 328
const FRAME_H = 599

// How long each frame stays on screen during the idle loop, in ms. Slow and
// calm — he's just sitting there sipping tea, not doing anything urgent.
const FRAME_INTERVAL_MS = 450

// Display size on screen — scaled down from the raw pixel-art resolution so
// he reads as a small companion perched at the corner of the score card,
// not a huge character competing with the form.
const DISPLAY_WIDTH = 64
const DISPLAY_HEIGHT = Math.round((DISPLAY_WIDTH / FRAME_W) * FRAME_H)

export default function Mascot({ style }) {
  const [frame, setFrame] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setFrame((f) => (f + 1) % FRAME_COUNT)
    }, FRAME_INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [])

  const scale = DISPLAY_WIDTH / FRAME_W

  return (
    <div
      aria-hidden="true"
      style={{
        direction: 'ltr',
        width: DISPLAY_WIDTH,
        height: DISPLAY_HEIGHT,
        overflow: 'hidden',
        position: 'relative',
        imageRendering: 'pixelated',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: FRAME_W,
          height: FRAME_H,
          backgroundImage: `url(${mascotSheet})`,
          backgroundPosition: `-${frame * FRAME_W}px 0`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  )
}
