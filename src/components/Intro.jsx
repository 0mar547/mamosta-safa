import { motion } from 'framer-motion'
import safaLogo from '../assets/safa-logo-transparent.png'

export default function Intro({ onDone }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onAnimationComplete={() => {}}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        zIndex: 50,
      }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={() => setTimeout(onDone, 700)}
        style={{
          width: 128,
          height: 128,
          filter: 'drop-shadow(0 8px 30px rgba(212,175,55,0.4))',
        }}
      >
        <img src={safaLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{ marginTop: 18, color: 'var(--text-dim)', fontSize: 15, fontWeight: 500 }}
      >
        مامۆستا سەفا
      </motion.p>
    </motion.div>
  )
}
