import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import Intro from './components/Intro'
import ScoreForm from './components/ScoreForm'
import CategoryGrid from './components/CategoryGrid'
import AmbientGlow, { pulseGlow, pulseGlowBack } from './components/AmbientGlow'
import { matchColleges, groupByCategory } from './lib/data'
import { logVisit } from './lib/stats'

const easeOut = [0.16, 1, 0.3, 1]

function App() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    logVisit()
  }, [])
  const [student, setStudent] = useState(null) // { scorePercent, branch, gender } | null
  // Kept even after going back to the form, so an accidental back-navigation
  // doesn't force retyping the score. Branch/gender/etc still reset — only
  // the score itself is remembered.
  const [lastScore, setLastScore] = useState('')

  const groupsIraq = useMemo(() => {
    if (!student) return []
    return groupByCategory(matchColleges(student, 'iraq'))
  }, [student])

  const groupsKurdistan = useMemo(() => {
    if (!student) return []
    return groupByCategory(matchColleges(student, 'kurdistan'))
  }, [student])

  return (
    <>
      <Analytics />
      <AmbientGlow />
      <AnimatePresence>{showIntro && <Intro onDone={() => setShowIntro(false)} />}</AnimatePresence>

      {!showIntro && (
        <AnimatePresence mode="wait">
          {!student ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.4, ease: easeOut }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <ScoreForm
                initialScore={lastScore}
                onScoreChange={setLastScore}
                onSubmit={(s) => { pulseGlow(); setStudent(s) }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <CategoryGrid
                groupsIraq={groupsIraq}
                groupsKurdistan={groupsKurdistan}
                onBack={() => { pulseGlowBack(); setStudent(null) }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}

export default App
