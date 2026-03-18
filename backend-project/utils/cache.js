class MemoryCache {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  set(key, value, ttlSeconds = 300) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });

    const timer = setTimeout(() => {
      this.store.delete(key);
      this.timers.delete(key);
    }, ttlSeconds * 1000);

    this.timers.set(key, timer);
    return value;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.del(key);
      return null;
    }
    return entry.value;
  }

  del(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return this.store.delete(key);
  }

  invalidatePrefix(prefix) {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.del(key);
        count++;
      }
    }
    return count;
  }

  flush() {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.store.clear();
    this.timers.clear();
  }

  size() {
    return this.store.size;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.del(key);
    }
  }

  stats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

const cache = new MemoryCache();

/**
 * 
 * @param {string} prefix
 * @param {number} ttl 
 */
const cacheMiddleware = (prefix, ttl = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = `${prefix}:${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200 && data && data.success !== false) {
        cache.set(key, data, ttl);
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
};

module.exports = { cache, cacheMiddleware };