// Private visit counter, backed by the artifact's own `db` capability.
// Each visit writes its own small document under stats/visits/log/<id> —
// counting documents avoids the read-modify-write race a single shared
// counter would have under last-writer-wins semantics.

let loggedThisSession = false

async function getDb() {
  if (typeof window === 'undefined' || !window.claude?.use) return null
  try {
    return await window.claude.use('db')
  } catch {
    return null
  }
}

// Call once, early, on app load. Fails silently if db isn't available
// (e.g. previewed outside the artifact runtime) — visits just aren't
// counted in that case, nothing else in the app depends on it.
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

// Returns the total visit count, or null if unavailable.
export async function getVisitCount() {
  const db = await getDb()
  if (!db) return null
  try {
    // This is a personal stats panel, not a high-traffic dashboard — a
    // single capped read is enough. If visits ever exceed 1000 this will
    // undercount rather than error, which is an acceptable tradeoff here.
    const snap = await db.collection('stats/visits/log').limit(1000).get()
    return snap.size
  } catch {
    return null
  }
}
