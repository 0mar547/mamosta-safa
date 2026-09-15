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
            // Normal flex child of the label row: icon first (far left),
            // then the text, with the score label pinned to the right by
            // the parent. minWidth:0 lets the text actually wrap instead
            // of forcing the row wider and shoving the label around.
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            gap: 8,
            minWidth: 0,
            flex: 1,
          }}
        >
          <div style={{ width: 52, height: 52, flexShrink: 0 }}>
            {tier.type === 'lottie' ? (
              <Lottie animationData={tier.asset} loop autoplay style={{ width: '100%', height: '100%' }} />
            ) : (
              <img src={tier.asset} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
          </div>
          <span
            dir="rtl"
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: 'var(--text)',
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              // right-aligned so wrapped lines stack flush under each
              // other next to the label, instead of staircasing
              textAlign: 'right',
              lineHeight: 1.3,
              paddingBottom: 6,
              minWidth: 0,
              // shrink-to-fit (not flex:1) so the text stays tucked up
              // against the icon instead of stretching across and
              // crowding the "0-100" label
              flex: '0 1 auto',
            }}
          >
            {tier.text}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
