import { AnimatePresence, motion } from 'framer-motion'
import * as LottieModule from 'lottie-react'

const Lottie = LottieModule.default?.default ?? LottieModule.default ?? LottieModule

import brain from '../assets/score_reactions/brain.json'
import cryingCat from '../assets/score_reactions/crying_cat.json'
import saladCat from '../assets/score_reactions/salad_cat.json'
import twoGuys from '../assets/score_reactions/two_guys.png'
import micGuy from '../assets/score_reactions/mic_guy.png'

const easeOut = [0.16, 1, 0.3, 1]

// Score-tier reactions shown beside the score label as the user types.
// Each tier pairs Omar's chosen animation/image with his exact text.
// Checked highest to lowest; nothing shows below 50 or when the field
// is empty/invalid.
const TIERS = [
  { min: 90, text: 'تۆ چیت چی عەبقەری', asset: brain, type: 'lottie' },
  { min: 80, text: 'لێره بەدواوە ئەلەندە', asset: twoGuys, type: 'image' },
  { min: 70, text: 'مااامووووووستااااااا', asset: cryingCat, type: 'lottie' },
  { min: 60, text: 'میاااو بە قۆپیە ناجح بویتە', asset: saladCat, type: 'lottie' },
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
          style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: 'var(--text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}
          >
            {tier.text}
          </span>
          <div style={{ width: 56, height: 56, flexShrink: 0 }}>
            {tier.type === 'lottie' ? (
              <Lottie animationData={tier.asset} loop autoplay style={{ width: '100%', height: '100%' }} />
            ) : (
              <img src={tier.asset} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
