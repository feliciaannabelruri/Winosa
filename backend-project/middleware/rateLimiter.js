const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  });

exports.contactLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many contact form submissions. Please try again in 15 minutes.'
);

exports.newsletterLimiter = createLimiter(
  60 * 60 * 1000, 
  20,
  'Too many newsletter subscription attempts. Please try again in an hour.'
);

exports.authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  10,
  'Too many authentication attempts. Please try again in 15 minutes.'
);

exports.adminLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many admin requests. Please slow down.'
);

exports.globalLimiter = createLimiter(
  15 * 60 * 1000,
  1000,
  'Too many requests from this IP. Please try again later.'
);

exports.uploadLimiter = createLimiter(
  60 * 60 * 1000,
  30,
  'Too many upload requests. Please try again in an hour.'
);