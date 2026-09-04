// Private visit counter for the secret stats panel (see StatsPanel /
// ScoreForm's SECRET_STATS_CODE). Two independent backends, tried in order:
//
// 1. Vercel Web Analytics, via our own /api/stats serverless function —
//    this is the real traffic source when the app runs on
//    mamosta-safa.vercel.app, and reports both page views and unique
//    visitors.
// 2. The Claude artifact's own `db` capability — only present when the app
//    is opened as a Claude Artifact (window.claude.use), not on Vercel.
//    Kept as a fallback so the panel still shows something there.
//
// If neither is available (e.g. local dev preview), the panel reports
// itself unavailable rather than erroring.

let loggedThisSession = false

async function getDb() {
  if (typeof window === 'undefined' || !window.claude?.use) return null
  try {
    return await window.claude.use('db')
  } catch {
    return null
  }
}

// Call once, early, on app load. Only relevant to the artifact `db` path —
// Vercel Web Analytics counts page loads on its own via @vercel/analytics,
// nothing to log manually here. Fails silently if db isn't available.
export async function logVisit() {
  if (loggedThisSession) return
  loggedThisSession = true
  const db = await getDb()
  if (!db) return
  try {
    await db.collection('stats/visits/log').add({ at: new Date().toISOString() })
  } catch {
    // best-effort only
  }
}

// Returns { pageviews, visitors } from Vercel Web Analytics, or null if
// that endpoint isn't reachable (e.g. running as a Claude Artifact, or
// locally without the serverless function).
async function getVercelStats() {
  if (typeof fetch === 'undefined') return null
  try {
    const res = await fetch('/api/stats')
    if (!res.ok) return null
    const body = await res.json()
    if (typeof body?.visitors !== 'number' && typeof body?.pageviews !== 'number') return null
    return { pageviews: body.pageviews ?? null, visitors: body.visitors ?? null }
  } catch {
    return null
  }
}

// Returns { pageviews: null, visitors: n } from the artifact db fallback,
// or null if unavailable.
async function getArtifactStats() {
  const db = await getDb()
  if (!db) return null
  try {
    // This is a personal stats panel, not a high-traffic dashboard — a
    // single capped read is enough. If visits ever exceed 1000 this will
    // undercount rather than error, which is an acceptable tradeoff here.
    const snap = await db.collection('stats/visits/log').limit(1000).get()
    return { pageviews: null, visitors: snap.size }
  } catch {
    return null
  }
}

// Returns { pageviews, visitors } (either may be null if that metric isn't
// available from the active backend), or null if no backend is available
// at all.
export async function getVisitCount() {
  const vercel = await getVercelStats()
  if (vercel) return vercel
  const artifact = await getArtifactStats()
  if (artifact) return artifact
  return null
}
