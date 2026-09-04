import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const easeOut = [0.16, 1, 0.3, 1]

// TODO: swap in the real Instagram handle/link when ready
const INSTAGRAM_URL = 'https://instagram.com/REPLACE_WITH_HANDLE'
const OMDEVS_URL = 'https://omdevs.example' // TODO: real OMDevs site/link

export default function AboutDrawer({ open, onClose }) {
  const [view, setView] = useState('menu') // 'menu' | 'omdevs'

  // reset to menu each time the drawer closes
  useEffect(() => {
    if (!open) setView('menu')
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 70 }}
          />
          <motion.div
            key="panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: easeOut }}
            style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              width: 'min(86vw, 380px)',
              zIndex: 71,
              background: 'var(--bg-elevated)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '10px 0 40px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <button
                onClick={() => (view === 'menu' ? onClose() : setView('menu'))}
                aria-label="گەڕانەوە"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: 19,
                  flexShrink: 0,
                }}
              >
                ←
              </button>
              <h2 style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, marginInlineEnd: 42 }}>
                {view === 'menu' ? 'مینیو' : 'دەربارەی ئێمە'}
              </h2>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
              <AnimatePresence mode="wait" initial={false}>
                {view === 'menu' ? (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    style={{ padding: '20px' }}
                  >
                    <button
                      onClick={() => setView('omdevs')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px',
                        borderRadius: 14,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        textAlign: 'right',
                      }}
                    >
                      <span
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: 'rgba(212,175,55,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 17,
                          flexShrink: 0,
                        }}
                      >
                        ℹ️
                      </span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>دەربارەی ئێمە</span>
                      <span style={{ color: 'var(--text-dim)', fontSize: 15 }}>‹</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="omdevs"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', gap: 20 }}
                  >
                    <motion.div
                      initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: 22,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 34,
                      }}
                    >
                      🦉
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                      style={{ textAlign: 'center' }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.5 }}>OMDevs</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
                        BUILDING APPS POWERED IDEAS
                      </div>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32, duration: 0.4 }}
                      style={{ fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.9 }}
                    >
                      ئەم ئەپە یەکێکە لە چەندین بەرنامە و کۆتاییان بۆ قوتابیان و زانکۆ بۆیان دەکرێتەوە بۆ بینینی پرۆژەکانی دواتر
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.38, duration: 0.4 }}
                      style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}
                    >
                      <DrawerButton href={OMDEVS_URL}>OMDevs</DrawerButton>
                      <DrawerButton href={INSTAGRAM_URL} accent>
                        <InstagramIcon /> ئینستاگرام
                      </DrawerButton>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function DrawerButton({ href, children, accent }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '13px',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 700,
        textDecoration: 'none',
        border: `1.5px solid ${accent ? 'transparent' : 'var(--gold)'}`,
        background: accent
          ? 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)'
          : 'transparent',
        color: accent ? '#fff' : 'var(--gold-soft)',
      }}
    >
      {children}
    </motion.a>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="white" />
    </svg>
  )
}
