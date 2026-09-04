import { motion } from 'framer-motion'
import safaLogo from '../assets/safa-logo-transparent.png'
import { TelegramIcon } from './BrandIcons'

const TELEGRAM_URL = 'https://t.me/MamostaSafa'

export default function TelegramBand() {
  return (
    <motion.a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 16px',
        borderRadius: 14,
        background: 'linear-gradient(90deg, rgba(41,151,255,0.14), rgba(41,151,255,0.05))',
        textDecoration: 'none',
        color: 'var(--text)',
        overflow: 'hidden',
      }}
    >
      {/* LED running-light border: two soft glowing SEGMENTS that hug the
          button's rounded-rect edge and travel it from opposite directions,
          slowly. Each is an elongated capsule (long and thin, not a round
          blob) whose long axis is kept tangent to the border at every
          point via offset-rotate: auto — so it reads as a strip of light
          running along the edge, not a floating dot. Faint static border
          gives the ring shape definition between passes. */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 14,
          border: '1.5px solid rgba(111,208,255,0.22)',
          pointerEvents: 'none',
        }}
      />
      <span className="led-glow led-glow-a" />
      <span className="led-glow led-glow-b" />
      <style>{`
        .led-glow {
          position: absolute;
          width: 46px;
          height: 5px;
          margin-top: -2.5px;
          margin-left: -23px;
          border-radius: 999px;
          background: linear-gradient(90deg,
            rgba(111,208,255,0) 0%,
            rgba(111,208,255,0.5) 20%,
            #bfe6ff 50%,
            rgba(111,208,255,0.5) 80%,
            rgba(111,208,255,0) 100%);
          box-shadow: 0 0 8px 1px rgba(111,208,255,0.65), 0 0 16px 3px rgba(42,171,238,0.4);
          offset-path: inset(0px round 14px);
          offset-rotate: auto;
          pointer-events: none;
        }
        .led-glow-a {
          offset-distance: 0%;
          animation: led-travel-fwd 9s linear infinite;
        }
        .led-glow-b {
          offset-distance: 100%;
          animation: led-travel-rev 9s linear infinite;
        }
        @keyframes led-travel-fwd {
          to { offset-distance: 100%; }
        }
        @keyframes led-travel-rev {
          to { offset-distance: 0%; }
        }
        @supports not (offset-path: inset(0px round 0px)) {
          .led-glow-a { top: 0; left: 0; animation: led-travel-fallback-fwd 9s linear infinite; }
          .led-glow-b { top: 0; left: 0; animation: led-travel-fallback-rev 9s linear infinite; }
          @keyframes led-travel-fallback-fwd {
            0%   { top: 0%;   left: 0%; }
            25%  { top: 0%;   left: 100%; }
            50%  { top: 100%; left: 100%; }
            75%  { top: 100%; left: 0%; }
            100% { top: 0%;   left: 0%; }
          }
          @keyframes led-travel-fallback-rev {
            0%   { top: 0%;   left: 0%; }
            25%  { top: 100%; left: 0%; }
            50%  { top: 100%; left: 100%; }
            75%  { top: 0%;   left: 100%; }
            100% { top: 0%;   left: 0%; }
          }
        }
      `}</style>

      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
        }}
      >
        <img src={safaLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>بەشداری کەناڵی تێلێگرام بکە</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2 }}>
          هەواڵ و زانیاری زیاتر لەسەر فۆرم و پۆلی ١٢
        </div>
      </div>
      <TelegramIcon size={26} />
    </motion.a>
  )
}
