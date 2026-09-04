import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MARTYR_RULES,
  IRAQ_PARALLEL_DISCOUNT,
  KURDISTAN_PARALLEL,
  IRAQ_MAX_TUITION,
} from '../data/infoCards'

const easeOut = [0.16, 1, 0.3, 1]

const CARDS = [
  { id: 'martyr_rules', icon: '🕊️', data: MARTYR_RULES, kind: 'martyr', accent: 'var(--purple)' },
  { id: 'iraq_discount', icon: '💳', data: IRAQ_PARALLEL_DISCOUNT, kind: 'rows' },
  { id: 'kurdistan_parallel', icon: '🏛️', data: KURDISTAN_PARALLEL, kind: 'sections' },
  { id: 'iraq_max', icon: '🌙', data: IRAQ_MAX_TUITION, kind: 'rows' },
]

export default function InfoBand() {
  const [openId, setOpenId] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {CARDS.map((card, i) => (
        <InfoCard
          key={card.id}
          card={card}
          index={i}
          expanded={openId === card.id}
          onToggle={() => setOpenId((cur) => (cur === card.id ? null : card.id))}
        />
      ))}
    </motion.div>
  )
}

function InfoCard({ card, expanded, onToggle }) {
  const { data } = card
  const accent = card.accent ?? 'var(--gold)'
  return (
    <div
      style={{
        borderRadius: 14,
        background: 'var(--bg-card)',
        border: `1px solid ${expanded ? `${colorMix(accent)}` : 'var(--border)'}`,
        overflow: 'hidden',
      }}
    >
      <motion.button
        layout
        whileTap={{ scale: 0.99 }}
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '13px 14px',
          width: '100%',
          textAlign: 'right',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: card.accent ? 'rgba(163,116,224,0.14)' : 'rgba(212,175,55,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          {card.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{data.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{data.subtitle}</div>
        </div>
        <motion.span
          animate={{ rotate: expanded ? -90 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: 'var(--text-dim)', fontSize: 15 }}
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
            transition={{ duration: 0.32, ease: easeOut }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '2px 14px 14px', borderTop: '1px solid var(--border)' }}>
              {card.kind === 'rows' && <PriceRows rows={data.rows} />}
              {card.kind === 'sections' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                  {data.sections.map((s) => (
                    <div key={s.heading}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-soft)', marginBottom: 6 }}>
                        {s.heading}
                      </div>
                      <PriceRows rows={s.rows} />
                    </div>
                  ))}
                </div>
              )}
              {card.kind === 'martyr' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
                  {data.paragraphs.map((p) => (
                    <div key={p.heading}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--purple)', marginBottom: 5 }}>
                        {p.heading}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {p.lines.map((line, i) => (
                          <p key={i} style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.8, margin: 0 }}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                  {data.note && (
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'rgba(163,116,224,0.1)',
                        border: '1px solid rgba(163,116,224,0.3)',
                      }}
                    >
                      <p style={{ fontSize: 11.5, color: 'var(--text-dim)', lineHeight: 1.8, margin: 0 }}>
                        {data.note}
                      </p>
                    </div>
                  )}
                  {data.disclaimer && (
                    <p style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.8, margin: 0, opacity: 0.8 }}>
                      {data.disclaimer}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function colorMix(accent) {
  // accent is a CSS var() reference; return a translucent border approximation
  // by falling back to a fixed rgba matching the purple/gold palette used here.
  return accent === 'var(--purple)' ? 'rgba(163,116,224,0.35)' : 'rgba(212,175,55,0.35)'
}

function PriceRows({ rows }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
            padding: '8px 10px',
            borderRadius: 9,
            background: 'var(--bg-elevated)',
            fontSize: 12,
          }}
        >
          <span style={{ color: 'var(--text)' }}>{r.label}</span>
          <span style={{ color: 'var(--gold-soft)', fontWeight: 700, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  )
}
