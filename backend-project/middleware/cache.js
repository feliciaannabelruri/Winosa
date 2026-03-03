/**
 * Simple in-memory TTL cache.
 * No Redis dependency required — works out of the box.
 *
 * Usage:
 *   router.get('/', cache(60), getServices);   // cache 60 seconds
 *
 * Cache is automatically busted by tag when admin mutates data.
 * Use: invalidateCache('services') after create/update/delete.
 */

const store = new Map(); // key → { data, expiresAt }

// ─── Core cache get/set ───────────────────────────────────────────────────────

function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key, data, ttlSeconds) {
  store.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
    tag: key.split(':')[0], // e.g. "services" from "services:/api/services"
  });
}

// ─── Invalidate all cache entries that match a tag ───────────────────────────
function invalidateCache(tag) {
  let count = 0;
  for (const [key, entry] of store.entries()) {
    if (entry.tag === tag) {
      store.delete(key);
      count++;
    }
  }
  if (count > 0) {
    console.log(`🗑️  Cache invalidated [${tag}]: ${count} entries removed`);
  }
}

// ─── Express middleware factory ───────────────────────────────────────────────
/**
 * @param {number} ttlSeconds  - How long to cache the response
 * @param {string} [tag]       - Cache group tag for bulk invalidation
 */
function cache(ttlSeconds = 60, tag = null) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next();

    const cacheTag = tag || req.baseUrl.replace('/api/', '').split('/')[0];
    const key = `${cacheTag}:${req.originalUrl}`;

    const cached = cacheGet(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}`);
      return res.json(cached);
    }

    // Intercept res.json to store response in cache
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200 && body?.success) {
        cacheSet(key, body, ttlSeconds);
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
}

// ─── Cache stats (for health endpoint) ───────────────────────────────────────
function cacheStats() {
  const now = Date.now();
  let active = 0;
  let expired = 0;
  for (const entry of store.values()) {
    if (now > entry.expiresAt) expired++;
    else active++;
  }
  return { active, expired, total: store.size };
}

module.exports = { cache, invalidateCache, cacheStats };