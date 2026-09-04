import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { branches, genders } from '../lib/data'
import TelegramBand from './TelegramBand'
import OMDevsBand from './OMDevsBand'
import InfoBand from './InfoBand'
import safaLogo from '../assets/safa-logo-transparent.png'
import { pulseGlow } from './AmbientGlow'
import StatsPanel from './StatsPanel'

const easeOut = [0.16, 1, 0.3, 1]

// Private trigger — typing this into the score field opens a visits-only
// stats popup instead of being treated as a real score. Not shown or
// hinted at anywhere in the UI.
const SECRET_STATS_CODE = '993217'

export default function ScoreForm({ onSubmit, initialScore = '', onScoreChange }) {
  const [score, setScore] = useState(initialScore)
  const [branch, setBranch] = useState(null)
  const [gender, setGender] = useState(null)
  const [hasMartyr, setHasMartyr] = useState(null) // null | true | false
  const [statsOpen, setStatsOpen] = useState(false)

  const isSecretCode = score === SECRET_STATS_CODE
  const scoreNum = Number(score)
  const scoreValid = !isSecretCode && score !== '' && scoreNum >= 0 && scoreNum <= 100.4
  const showBranch = scoreValid
  const showGender = showBranch && branch
  const showMartyr = showGender && gender
  const canSubmit = scoreValid && branch && gender && hasMartyr !== null

  // Each answered step makes the header logo glow and grow a little more —
  // a small, cumulative "coming alive" cue as the form fills in.
  const filledSteps =
    (scoreValid ? 1 : 0) +
    (branch ? 1 : 0) +
    (gender ? 1 : 0) +
    (hasMartyr !== null ? 1 : 0)
  const totalSteps = 4
  const logoProgress = filledSteps / totalSteps // 0..1
  const logoScale = 1 + logoProgress * 0.16
  const logoGlow = 10 + logoProgress * 34
  const logoGlowOpacity = 0.35 + logoProgress * 0.45

  return (
    <div style={{ padding: '28px 20px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: easeOut }}
        style={{ textAlign: 'center', marginBottom: 4 }}
      >
        <motion.div
          animate={{
            scale: logoScale,
            filter: `drop-shadow(0 8px ${logoGlow}px rgba(212,175,55,${logoGlowOpacity}))`,
          }}
          transition={{ duration: 0.6, ease: easeOut }}
          style={{ width: 96, height: 96, margin: '0 auto 14px' }}
        >
          <img src={safaLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </motion.div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>مامۆستا سەفا</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 6 }}>
          ستافی مامۆستا صفا
        </p>
      </motion.div>

      {/* Score input */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: easeOut }}
      >
        <label style={labelStyle}>نمرەی گشتی (0-100)</label>
        <input
          inputMode="decimal"
          type="number"
          min={0}
          max={100.4}
          step="0.01"
          placeholder="0"
          value={score}
          onChange={(e) => {
            const val = e.target.value
            if (val === SECRET_STATS_CODE) {
              setStatsOpen(true)
              setScore('')
              onScoreChange?.('')
              setBranch(null)
              setGender(null)
              return
            }
            setScore(val)
            onScoreChange?.(val)
            setBranch(null)
            setGender(null)
          }}
          style={inputStyle}
        />
      </motion.div>

      <StatsPanel open={statsOpen} onClose={() => setStatsOpen(false)} />

      {/* Branch */}
      <AnimatePresence>
        {showBranch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            style={{ overflow: 'hidden' }}
          >
            <label style={labelStyle}>لق</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {branches.map((b) => (
                <PillButton
                  key={b.value}
                  active={branch === b.value}
                  onClick={() => {
                    setBranch(b.value)
                    setGender(null)
                  }}
                >
                  {b.label}
                </PillButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gender */}
      <AnimatePresence>
        {showGender && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            style={{ overflow: 'hidden' }}
          >
            <label style={labelStyle}>ڕەگەز</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {genders.map((g) => (
                <PillButton
                  key={g.value}
                  active={gender === g.value}
                  onClick={() => {
                    setGender(g.value)
                  }}
                >
                  {g.label}
                </PillButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Martyr / family-loss question */}
      <AnimatePresence>
        {showMartyr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            style={{ overflow: 'hidden' }}
          >
            <label style={labelStyle}>شەهیدت هەیە؟</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <PillButton
                active={hasMartyr === true}
                onClick={() => setHasMartyr(true)}
              >
                بەڵێ
              </PillButton>
              <PillButton
                active={hasMartyr === false}
                onClick={() => setHasMartyr(false)}
              >
                نەخێر
              </PillButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        disabled={!canSubmit}
        onClick={() =>
          canSubmit &&
          onSubmit({
            scorePercent: scoreNum,
            branch,
            gender,
            hasMartyr,
          })
        }
        whileTap={canSubmit ? { scale: 0.97 } : {}}
        animate={{ opacity: canSubmit ? 1 : 0.4 }}
        transition={{ duration: 0.25 }}
        style={{
          marginTop: 6,
          padding: '15px',
          borderRadius: 14,
          fontWeight: 700,
          fontSize: 16,
          background: canSubmit ? 'linear-gradient(135deg, var(--gold-soft), var(--gold))' : 'var(--bg-card)',
          color: canSubmit ? '#151208' : 'var(--text-dim)',
        }}
      >
        بینینی ئەنجام
      </motion.button>

      <TelegramBand />
      <OMDevsBand />
      <InfoBand />
    </div>
  )
}

function PillButton({ active, children, onClick }) {
  return (
    <motion.button
      onClick={() => {
        pulseGlow()
        onClick()
      }}
      whileTap={{ scale: 0.96 }}
      animate={{
        backgroundColor: active ? 'rgba(212,175,55,0.15)' : 'var(--bg-card)',
        borderColor: active ? 'var(--gold)' : 'var(--border)',
        color: active ? 'var(--gold-soft)' : 'var(--text)',
      }}
      transition={{ duration: 0.2 }}
      style={{
        flex: 1,
        padding: '12px 8px',
        borderRadius: 12,
        border: '1.5px solid var(--border)',
        fontSize: 14,
        fontWeight: 600,
        textAlign: 'center',
      }}
    >
      {children}
    </motion.button>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  color: 'var(--text-dim)',
  marginBottom: 8,
  fontWeight: 500,
}

const inputStyle = {
  width: '100%',
  padding: '16px',
  borderRadius: 14,
  border: '1.5px solid var(--border)',
  background: 'var(--bg-card)',
  color: 'var(--text)',
  fontSize: 22,
  fontWeight: 700,
  textAlign: 'center',
  outline: 'none',
}
