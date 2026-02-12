const rateLimit = require('express-rate-limit');

// Contact form rate limiter
exports.contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Newsletter rate limiter
exports.newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 subscriptions per hour per IP
  message: {
    success: false,
    message: 'Too many newsletter subscription attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});