import { motion } from 'framer-motion'
import omdevsLogo from '../assets/omdevs-logo.png'
import { InstagramIcon } from './BrandIcons'

const INSTAGRAM_URL = 'https://www.instagram.com/omdevs_official/'

export default function OMDevsBand() {
  return (
    <motion.a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 16px',
        borderRadius: 14,
        background: 'linear-gradient(90deg, rgba(38,166,154,0.14), rgba(38,166,154,0.05))',
        border: '1px solid rgba(38,166,154,0.3)',
        textDecoration: 'none',
        color: 'var(--text)',
        marginTop: 4,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0,
          background: '#000',
        }}
      >
        <img src={omdevsLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>دروستکراوە لەلایەن OMDevs</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2 }}>
          بۆ زانیاری زیاتر و پڕۆژەکانی تر کلیک بکە
        </div>
      </div>
      <InstagramIcon size={26} />
    </motion.a>
  )
}
