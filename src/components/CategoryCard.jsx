import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { groupByCity } from '../lib/data'

const easeOut = [0.16, 1, 0.3, 1]

export const ICONS = {
  school: '🎓',
  campaign: '📣',
  build: '🛠️',
  local_gas_station: '⛽',
  mosque: '🕌',
  palette: '🎨',
  temple_hindu: '🏛️',
  computer: '💻',
  gavel: '⚖️',
  engineering: '⚙️',
  business_center: '💼',
  agriculture: '🌾',
  eco: '🌿',
  science: '🔬',
  menu_book: '📖',
  local_hospital: '🏥',
}

// group: { category, accepted:[], rejected:[] }
// onOpenCity(group, cityKey) — cityKey is 'all' | city name | '__unspecified__'
export default function CategoryCard({ group, index, expanded, onToggle, onOpenCity }) {
  const cityGroups = useMemo(() => groupByCity(group), [group])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4), ease: easeOut }}
      style={{
        position: 'relative',
        borderRadius: 16,
        // Slightly translucent so the moving background starfield shows
        // through crisply — including the "boom" scatter when the user taps.
        background: 'rgba(26,26,31,0.82)',
        border: `1px solid ${expanded ? group.category.colorHex + '55' : 'var(--border)'}`,
        overflow: 'hidden',
      }}
    >
      <motion.button
        layout
        whileTap={{ scale: 0.99 }}
        onClick={onToggle}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px',
          width: '100%',
          textAlign: 'right',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${group.category.colorHex}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {ICONS[group.category.icon] ?? '📚'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700 }}>{group.category.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 3, display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--green)' }}>{group.accepted.length} وەردەگیریت</span>
            <span style={{ color: 'var(--red)' }}>{group.rejected.length} وەرناگیریت</span>
          </div>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--text-dim)', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {group.accepted.length + group.rejected.length} کۆلێژ
        </span>
        <motion.span
          animate={{ rotate: expanded ? -90 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: 'var(--text-dim)', fontSize: 16 }}
        >
          ‹
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ position: 'relative', zIndex: 1, padding: '4px 14px 14px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CityRow
                rowIndex={0}
                label="هەموو شارەکان"
                accepted={group.accepted.length}
                rejected={group.rejected.length}
                onClick={() => onOpenCity(group, 'all')}
              />
              {cityGroups.map((cg, i) => {
                const key = cg.city ?? '__unspecified__'
                return (
                  <CityRow
                    key={key}
                    rowIndex={i + 1}
                    label={cg.city ?? 'شارە تر'}
                    accepted={cg.accepted.length}
                    rejected={cg.rejected.length}
                    onClick={() => onOpenCity(group, key)}
                  />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CityRow({ label, accepted, rejected, onClick, rowIndex = 0 }) {
  const total = accepted + rejected
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(rowIndex * 0.035, 0.3), ease: easeOut }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '13px 14px',
        borderRadius: 12,
        // Slightly translucent so the background starfield (and the tap
        // "boom" scatter) shows through.
        background: 'rgba(20,20,23,0.8)',
        border: '1px solid var(--border)',
        textAlign: 'right',
      }}
    >
      <span style={{ fontSize: 11.5, color: 'var(--text-dim)', fontWeight: 700, whiteSpace: 'nowrap' }}>{total} کۆلێژ</span>
      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
        {label}
      </span>
      <span style={{ fontSize: 11.5, color: 'var(--green)', fontWeight: 700, whiteSpace: 'nowrap' }}>{accepted} ✓</span>
      <span style={{ fontSize: 11.5, color: 'var(--red)', fontWeight: 700, whiteSpace: 'nowrap' }}>{rejected} ✕</span>
      <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>‹</span>
    </motion.button>
  )
}
