const rateLimit = require('express-rate-limit');

// ─── Generic factory ─────────────────────────────────────────────────────────
const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests from count (optional – comment out if not desired)
    skipSuccessfulRequests: false,
  });

// ─── Contact form ─────────────────────────────────────────────────────────────
exports.contactLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  3,
  'Too many contact form submissions. Please try again in 15 minutes.'
);

// ─── Newsletter ───────────────────────────────────────────────────────────────
exports.newsletterLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  5,
  'Too many newsletter subscription attempts. Please try again in an hour.'
);

// ─── Auth endpoints ───────────────────────────────────────────────────────────
exports.authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  10,
  'Too many authentication attempts. Please try again in 15 minutes.'
);

// ─── Admin endpoints (more lenient) ──────────────────────────────────────────
exports.adminLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many admin requests. Please slow down.'
);

// ─── API global limiter ───────────────────────────────────────────────────────
exports.globalLimiter = createLimiter(
  15 * 60 * 1000,
  500,
  'Too many requests from this IP. Please try again later.'
);

// ─── Upload limiter ───────────────────────────────────────────────────────────
exports.uploadLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  30,
  'Too many upload requests. Please try again in an hour.'
);