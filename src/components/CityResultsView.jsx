import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { groupByCity } from '../lib/data'
import { ICONS } from './CategoryCard'

const easeOut = [0.16, 1, 0.3, 1]

// selection: { group, cityKey } | null
// cityKey is 'all' | city name | '__unspecified__'
export default function CityResultsView({ selection, onClose }) {
  const [tab, setTab] = useState('accepted') // 'accepted' | 'rejected'

  // reset to accepted tab whenever a new selection opens
  useEffect(() => {
    if (selection) setTab('accepted')
  }, [selection?.group?.category?.id, selection?.cityKey])

  return (
    <AnimatePresence>
      {selection && (
        <motion.div
          key="city-view"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{ duration: 0.35, ease: easeOut }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 55,
            // Slightly translucent so the background starfield (and the tap
            // "boom" scatter) is visible behind the whole screen, not just
            // hidden behind an opaque panel.
            background: 'rgba(11,11,13,0.92)',
            maxWidth: 560,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Content selection={selection} tab={tab} setTab={setTab} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Content({ selection, tab, setTab, onClose }) {
  const { group, cityKey } = selection
  const cityGroups = groupByCity(group)

  let accepted, rejected, label
  if (cityKey === 'all') {
    accepted = group.accepted
    rejected = group.rejected
    label = 'هەموو شارەکان'
  } else {
    const cg = cityGroups.find((c) => (c.city ?? '__unspecified__') === cityKey)
    accepted = cg?.accepted ?? []
    rejected = cg?.rejected ?? []
    label = cg?.city ?? 'شارە تر'
  }

  // Highest required score first — applies to every list, in every city/category view.
  const list = [...(tab === 'accepted' ? accepted : rejected)].sort(
    (a, b) => b.scorePercent - a.scorePercent
  )

  return (
    <>
      {/* header */}
      <div
        style={{
          padding: '14px 14px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          aria-label="گەڕانەوە"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          ›
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${group.category.colorHex}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {ICONS[group.category.icon] ?? '📚'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{group.category.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>{label}</div>
        </div>
      </div>

      {/* accepted / rejected tab switcher */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 14px', flexShrink: 0 }}>
        <TabButton active={tab === 'accepted'} color="var(--green)" onClick={() => setTab('accepted')}>
          وەردەگیریت ({accepted.length})
        </TabButton>
        <TabButton active={tab === 'rejected'} color="var(--red)" onClick={() => setTab('rejected')}>
          وەرناگیریت ({rejected.length})
        </TabButton>
      </div>

      {/* single scrollable list — normal vertical swipe scroll */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 28px', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {list.length === 0 && (
              <p style={{ color: 'var(--text-dim)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
                هیچ کۆلێژێک نییە
              </p>
            )}
            {list.map((c, i) => {
              const color = tab === 'accepted' ? 'var(--green)' : 'var(--red)'
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5), ease: easeOut }}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '13px 14px',
                    borderRadius: 13,
                    // Slightly translucent so the background starfield (and
                    // the tap "boom" scatter) shows through.
                    background: 'rgba(26,26,31,0.82)',
                    border: `1px solid ${tab === 'accepted' ? 'rgba(46,204,113,0.25)' : 'var(--border)'}`,
                    marginBottom: 9,
                  }}
                >
                  {/* required score(s) — visual left, big, colored */}
                  <div style={{ flexShrink: 0, display: 'flex', gap: 6 }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 52,
                        padding: '6px 4px',
                        borderRadius: 10,
                        background: `${color}14`,
                      }}
                    >
                      <span style={{ fontSize: 19, fontWeight: 800, color, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                        {c.region === 'kurdistan' && c.scoreNormal != null ? c.scoreNormal : c.scorePercent}
                      </span>
                      <span style={{ fontSize: 9.5, color: 'var(--text-dim)', marginTop: 2 }}>
                        {c.region === 'kurdistan' ? 'زانکۆلاین' : 'پێویست'}
                      </span>
                    </div>
                    {c.region === 'kurdistan' && c.scoreParallel != null && c.scoreParallel !== c.scoreNormal && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 52,
                          padding: '6px 4px',
                          borderRadius: 10,
                          background: 'rgba(163,116,224,0.14)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: 'var(--purple)',
                            lineHeight: 1.1,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {c.scoreParallel}
                        </span>
                        <span style={{ fontSize: 9.5, color: 'var(--text-dim)', marginTop: 2 }}>پارالێل</span>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}>{c.name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 5, fontSize: 11.5, color: 'var(--text-dim)' }}>
                      {c.city && <span>{c.city}</span>}
                      <span>{c.shift === 'بەیانی' ? 'بەیانی' : 'ئێوارە'}</span>
                      {c.bonus > 0 && (
                        <span style={{ color: 'var(--purple)', fontWeight: 700 }}>+{c.bonus} شەهید</span>
                      )}
                      <span style={{ color, fontWeight: 700 }}>
                        {tab === 'accepted' ? '✓ وەردەگیریت' : '✕ وەرناگیریت'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

function TabButton({ active, color, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px',
        borderRadius: 12,
        fontSize: 13.5,
        fontWeight: 700,
        background: active ? `${color}1f` : 'var(--bg-card)',
        color: active ? color : 'var(--text-dim)',
        border: `1.5px solid ${active ? color : 'var(--border)'}`,
      }}
    >
      {children}
    </button>
  )
}
