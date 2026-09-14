import { AnimatePresence, motion } from 'framer-motion'
import * as LottieModule from 'lottie-react'

const Lottie = LottieModule.default?.default ?? LottieModule.default ?? LottieModule

import brain from '../assets/score_reactions/brain.json'
import cryingCat from '../assets/score_reactions/crying_cat.json'
import saladCat from '../assets/score_reactions/salad_cat.json'
import hijabCat from '../assets/score_reactions/hijab_cat.png'
import micGuy from '../assets/score_reactions/mic_guy.png'

const easeOut = [0.16, 1, 0.3, 1]

// Score-tier reactions shown beside the score label as the user types.
// Each tier pairs Omar's chosen animation/image with his exact text.
// Checked highest to lowest; nothing shows below 50 or when the field
// is empty/invalid.
const TIERS = [
  { min: 90, text: 'تۆ چیت چی عەبقەری', asset: brain, type: 'lottie' },
  { min: 80, text: 'ئاييييم ديفررريينط', asset: hijabCat, type: 'image' },
  { min: 70, text: 'مااامووووووستااااااا', asset: cryingCat, type: 'lottie' },
  { min: 60, text: 'ئەبێت قەرزت بۆ بکەین', asset: saladCat, type: 'lottie' },
  { min: 50, text: 'برسی نەبم کێشەی ترم نییە', asset: micGuy, type: 'image' },
]

function tierFor(scoreNum) {
  if (!Number.isFinite(scoreNum)) return null
  // Anything above 100 behaves like the top tier.
  const clamped = Math.min(scoreNum, 100)
  return TIERS.find((t) => clamped >= t.min) ?? null
}

export default function ScoreReaction({ scoreNum }) {
  const tier = tierFor(scoreNum)

  return (
    <AnimatePresence mode="wait">
      {tier && (
        <motion.div
          key={tier.text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.28, ease: easeOut }}
          style={{
            // Absolutely positioned over the score-label row, anchored to
            // its left side (opposite the label text) — this overlay never
            // affects the label's own layout, so if the text is long it
            // simply wraps onto extra lines below itself instead of
            // pushing the "0-100" label or the input beneath it down.
            position: 'absolute',
            top: 0,
            left: 0,
            width: 220,
            maxWidth: '65vw',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: 8,
            zIndex: 2,
          }}
        >
          <div style={{ width: 40, height: 40, flexShrink: 0 }}>
            {tier.type === 'lottie' ? (
              <Lottie animationData={tier.asset} loop autoplay style={{ width: '100%', height: '100%' }} />
            ) : (
              <img src={tier.asset} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: 'var(--text)',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              textAlign: 'right',
              lineHeight: 1.3,
              paddingTop: 4,
              minWidth: 0,
              flex: 1,
            }}
          >
            {tier.text}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
