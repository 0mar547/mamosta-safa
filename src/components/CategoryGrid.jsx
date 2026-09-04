import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryCard from './CategoryCard'
import CityResultsView from './CityResultsView'
import { pulseGlow, pulseGlowBack } from './AmbientGlow'

export default function CategoryGrid({ groupsIraq, groupsKurdistan, onBack }) {
  const [region, setRegion] = useState('iraq') // 'iraq' | 'kurdistan'
  const [expandedId, setExpandedId] = useState(null)
  const [citySelection, setCitySelection] = useState(null) // { group, cityKey } | null

  // collapse the open category whenever the region tab changes
  useEffect(() => {
    setExpandedId(null)
  }, [region])

  const groups = region === 'iraq' ? groupsIraq : groupsKurdistan
  const totalAccepted = groups.reduce((s, g) => s + g.accepted.length, 0)
  const totalRejected = groups.reduce((s, g) => s + g.rejected.length, 0)

  return (
    <div style={{ padding: '20px 16px 40px' }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}
      >
        <button
          onClick={onBack}
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
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700 }}>ئەنجامەکان</h1>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>{totalAccepted}</span> وەردەگیریت ·{' '}
            <span style={{ color: 'var(--red)', fontWeight: 700 }}>{totalRejected}</span> وەرناگیریت
          </p>
        </div>
      </motion.div>

      {/* Iraq / Kurdistan region switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <RegionTab active={region === 'iraq'} onClick={() => { pulseGlow(); setRegion('iraq') }}>
          ئەنجامەکان عێراق
        </RegionTab>
        <RegionTab active={region === 'kurdistan'} onClick={() => { pulseGlow(); setRegion('kurdistan') }}>
          ئەنجامەکان هەرێم
        </RegionTab>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={region}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {groups.map((g, i) => (
            <CategoryCard
              key={g.category.id}
              group={g}
              index={i}
              expanded={expandedId === g.category.id}
              onToggle={() => setExpandedId((cur) => (cur === g.category.id ? null : g.category.id))}
              onOpenCity={(group, cityKey) => { pulseGlow(); setCitySelection({ group, cityKey }) }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <CityResultsView
        selection={citySelection}
        onClose={() => {
          pulseGlowBack()
          setCitySelection(null)
          // collapse the category drawer too, so returning to the list shows
          // a clean set of categories instead of leaving one stuck open
          setExpandedId(null)
        }}
      />
    </div>
  )
}

function RegionTab({ active, children, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px',
        borderRadius: 12,
        fontSize: 13.5,
        fontWeight: 700,
        background: active ? 'rgba(212,175,55,0.14)' : 'var(--bg-card)',
        color: active ? 'var(--gold-soft)' : 'var(--text-dim)',
        border: `1.5px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
      }}
    >
      {children}
    </motion.button>
  )
}
