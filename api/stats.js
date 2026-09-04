// Serverless function: returns real visitor/pageview counts from Vercel
// Web Analytics. Called by the app's secret stats panel (see
// src/lib/stats.js). Keeps the Vercel access token server-side only —
// it is read from an environment variable, never shipped to the browser.
//
// GET /api/stats  ->  { pageviews: number, visitors: number }

export default async function handler(req, res) {
  const token = process.env.VERCEL_STATS_TOKEN
  const projectId = process.env.VERCEL_STATS_PROJECT_ID

  if (!token || !projectId) {
    res.status(500).json({ error: 'stats not configured' })
    return
  }

  try {
    const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count')
    url.searchParams.set('projectId', projectId)

    const upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!upstream.ok) {
      res.status(502).json({ error: 'upstream error', status: upstream.status })
      return
    }

    const body = await upstream.json()
    const pageviews = body?.data?.pageviews ?? null
    const visitors = body?.data?.visitors ?? null

    // Cache briefly at the edge/CDN so the secret panel doesn't hammer the
    // Vercel API if opened repeatedly.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    res.status(200).json({ pageviews, visitors })
  } catch (err) {
    res.status(500).json({ error: 'internal error' })
  }
}
