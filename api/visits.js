// Visitor counter for the footer. One Redis key holds the total; a short-lived
// per-visitor key keeps a reload or a script loop from inflating it.
//
// GET  /api/visits -> { visits }           read only
// POST /api/visits -> { visits }           count this visitor, then read
//
// Store: Upstash Redis provisioned through the Vercel Marketplace, reached over
// its REST API so this function has no dependencies. Either env var pair works.

const crypto = require('crypto');

const TOTAL_KEY = 'site:visits';
const VISITOR_TTL = 60 * 60 * 6; // one count per visitor per six hours

function store() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(command) {
  const s = store();
  if (!s) throw new Error('visits: store not configured');
  const res = await fetch(s.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${s.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`visits: redis ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`visits: ${data.error}`);
  return data.result;
}

function visitorKey(req) {
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '')
    .split(',')[0].trim();
  const ua = String(req.headers['user-agent'] || '');
  const salt = process.env.VISITS_SALT || TOTAL_KEY;
  // Hashed so no address or user agent is ever stored.
  return 'site:visitor:' + crypto.createHash('sha256').update(`${salt}|${ip}|${ua}`).digest('hex').slice(0, 32);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'POST') {
      // SET ... NX returns null when the visitor key already exists.
      const fresh = await redis(['SET', visitorKey(req), '1', 'EX', String(VISITOR_TTL), 'NX']);
      const visits = fresh ? await redis(['INCR', TOTAL_KEY]) : Number(await redis(['GET', TOTAL_KEY])) || 0;
      return res.status(200).json({ visits });
    }
    if (req.method === 'GET') {
      const visits = Number(await redis(['GET', TOTAL_KEY])) || 0;
      return res.status(200).json({ visits });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  } catch (err) {
    console.error(err.message);
    return res.status(503).json({ error: 'unavailable' });
  }
};
