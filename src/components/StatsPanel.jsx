import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getVisitCount } from '../lib/stats'

const easeOut = [0.16, 1, 0.3, 1]

// Private stats popup — only reachable by typing the secret code into the
// score field (see ScoreForm). Shows how many times the page has been
// visited. Not linked from anywhere in the visible UI.
export default function StatsPanel({ open, onClose }) {
  const [count, setCount] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'unavailable'

  useEffect(() => {
    if (!open) return
    setStatus('loading')
    getVisitCount().then((n) => {
      if (n === null) {
        setStatus('unavailable')
      } else {
        setCount(n)
        setStatus('ready')
      }
    })
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.3, ease: easeOut }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 320,
              borderRadius: 18,
              padding: 24,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 10 }}>
              ئامار — تەنها بۆ تۆ
            </div>

            {status === 'loading' && (
              <div style={{ fontSize: 14, color: 'var(--text-dim)', padding: '16px 0' }}>
                چاوەڕێ بکە…
              </div>
            )}

            {status === 'ready' && (
              <>
                <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--gold-soft)', fontVariantNumeric: 'tabular-nums' }}>
                  {count}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6 }}>
                  گشتی سەردانەکان
                </div>
              </>
            )}

            {status === 'unavailable' && (
              <div style={{ fontSize: 13, color: 'var(--text-dim)', padding: '16px 0', lineHeight: 1.6 }}>
                ئامار لێرەدا بەردەست نییە
              </div>
            )}

            <button
              onClick={onClose}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '11px',
                borderRadius: 12,
                fontSize: 13.5,
                fontWeight: 700,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              داخستن
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
