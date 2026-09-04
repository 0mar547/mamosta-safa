import { AnimatePresence, motion } from 'framer-motion'
import twemoji from 'twemoji'

// Score-tier reaction lines shown next to the score label as the user types.
// Each line contains "--" where the student's own typed score gets spliced
// in. Tiers are checked from highest to lowest; nothing shows below 50.
const TIERS = [
  { min: 90, template: 'تۆ چیت -- دكتۆر 👏' },
  { min: 80, template: 'پیرۆزە -- هەر سەرکەوتووبی 🤍🤍' },
  { min: 70, template: 'بە هیوای -- دۆزینەوەی بواری دڵخوازت 🤍' },
  { min: 60, template: 'بە -- قۆپیە ناجح بووى 🦦' },
  { min: 50, template: 'بەتەمای -- طب عامى 🦦' },
]

function reactionFor(scoreNum) {
  if (!Number.isFinite(scoreNum)) return null
  const tier = TIERS.find((t) => scoreNum >= t.min)
  if (!tier) return null
  return tier.template.replace('--', String(scoreNum))
}

// Every viewer's OS renders emoji with its own built-in font (Segoe UI Emoji
// on Windows, Apple Color Emoji on iPhone/Mac, Noto on Android/Linux) — that
// choice isn't something a website can override, since it's baked into the
// OS, not the page. Twemoji sidesteps that by swapping each emoji glyph for
// a small colorful image, so every visitor — iPhone or not — sees the exact
// same modern, colorful emoji artwork rather than whatever their OS ships.
const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/svg/'

function renderWithEmoji(text) {
  return twemoji.parse(text, {
    className: 'emoji-img',
    callback: (icon) => `${TWEMOJI_BASE}${icon}.svg`,
  })
}

export default function ScoreReaction({ scoreNum }) {
  const text = reactionFor(scoreNum)
  const words = text ? text.split(' ') : []

  return (
    <div style={{ minHeight: 20, display: 'flex', alignItems: 'center' }}>
      <AnimatePresence mode="wait">
        {text && (
          <motion.div
            key={text}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0 5px' }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.09, duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--gold-soft)',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                }}
                dangerouslySetInnerHTML={{ __html: renderWithEmoji(word) }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
