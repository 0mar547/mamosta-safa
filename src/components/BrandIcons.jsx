export function TelegramIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="120" fill="url(#tg-grad)" />
      <path
        d="M53 122.5l102-39.3c4.7-1.9 8.8 1.1 7.3 8.1l-17.4 82c-1.3 5.9-4.8 7.3-9.7 4.6l-26.8-19.8-12.9 12.5c-1.4 1.4-2.6 2.6-5.4 2.6l1.9-27.4 49.9-45.1c2.2-1.9-.5-3-3.3-1.1l-61.7 38.9-26.6-8.3c-5.8-1.8-5.9-5.8 1.7-8.7z"
        fill="#fff"
      />
      <defs>
        <linearGradient id="tg-grad" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#37AEE2" />
          <stop offset="1" stopColor="#1E96C8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function InstagramIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
      <rect width="240" height="240" rx="60" fill="url(#ig-grad)" />
      <rect x="62" y="62" width="116" height="116" rx="32" stroke="#fff" strokeWidth="12" />
      <circle cx="120" cy="120" r="30" stroke="#fff" strokeWidth="12" />
      <circle cx="163" cy="77" r="9" fill="#fff" />
      <defs>
        <radialGradient id="ig-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(70 240) rotate(-55) scale(260)">
          <stop stopColor="#FED576" />
          <stop offset="0.26" stopColor="#F47133" />
          <stop offset="0.61" stopColor="#BC3081" />
          <stop offset="1" stopColor="#4C63D2" />
        </radialGradient>
      </defs>
    </svg>
  )
}
