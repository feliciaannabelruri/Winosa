require('dotenv').config();

// ── Sentry HARUS diinit paling awal ──────────────────────────────────────────
const { initSentry, sentryRequestHandler, sentryErrorHandler } = require('./config/sentry');
initSentry();

const express      = require('express');
const cors         = require('cors');
const sanitizeHtml = require('sanitize-html');
const connectDB    = require('./config/db');
const { setLanguage }  = require('./middleware/language');
const { errorHandler } = require('./middleware/errorHandler');
const logger           = require('./middleware/logger');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const devOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.124.1:3001',
];
const allowedOrigins = [...new Set([...ALLOWED_ORIGINS, ...devOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Request-ID', 'X-Cache'],
  })
);

// ── Security headers ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ── Sentry request handler (sebelum routes) ───────────────────────────────────
app.use(sentryRequestHandler());

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Sanitize input ────────────────────────────────────────────────────────────
const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    val = sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
    val = val.replace(/\$|/g, '');
    return val;
  }
  if (typeof val === 'object' && val !== null) {
    return sanitizeObject(val);
  }
  return val;
};

const sanitizeObject = (obj) => {
  if (Array.isArray(obj)) return obj.map(sanitizeValue);
  const result = {};
  for (const key in obj) {
    const cleanKey = key.replace(/\$|\./g, '');
    result[cleanKey] = sanitizeValue(obj[key]);
  }
  return result;
};

app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
});

app.use(logger);
app.use(setLanguage);
app.use('/api/', globalLimiter);

// ── DB ────────────────────────────────────────────────────────────────────────
connectDB();

// ── Public Routes ─────────────────────────────────────────────────────────────
app.use('/api/portfolio',     require('./routes/portfolioRoutes'));
app.use('/api/blog',          require('./routes/blogRoutes'));
app.use('/api/contact',       require('./routes/contactRoutes'));
app.use('/api/newsletter',    require('./routes/newsletterRoutes'));
app.use('/api/services',      require('./routes/serviceRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/content',       require('./routes/contentRoutes'));
app.use('/api/settings',      require('./routes/settingsRoutes'));
app.use('/api/auth',          authLimiter, require('./routes/authRoutes'));
app.use('/api/search',        require('./routes/searchRoutes'));

app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/email',  require('./routes/emailTestRoutes'));

// ── Admin Routes ──────────────────────────────────────────────────────────────
app.use('/api/admin/services',      require('./routes/admin/adminServiceRoutes'));
app.use('/api/admin/portfolio',     require('./routes/admin/adminPortfolioRoutes'));
app.use('/api/admin/blog',          require('./routes/admin/adminBlogRoutes'));
app.use('/api/admin/analytics',     require('./routes/admin/adminAnalyticsRoutes'));
app.use('/api/admin/subscriptions', require('./routes/admin/adminSubscriptionRoutes'));
app.use('/api/admin/settings',      require('./routes/admin/adminSettingsRoutes'));
app.use('/api/admin/content',       require('./routes/admin/adminContentRoutes'));
app.use('/api/admin/upload',        require('./routes/uploadRoutes'));

// ── Root & Health ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Winosa Backend API is running! 🚀',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    docs: '/api/docs',
  });
});

app.get('/health', async (req, res) => {
  const health = {
    uptime:      process.uptime(),
    status:      'OK',
    timestamp:   new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database:    'disconnected',
    email:       'unknown',
    cache:       'ok',
  };

  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) health.database = 'connected';

    const { cache } = require('./utils/cache');
    health.cacheSize = cache.size();

    try {
      const transporter = require('./config/email');
      await transporter.verify();
      health.email = 'ready';
    } catch {
      health.email = 'unavailable';
    }

    res.json(health);
  } catch (error) {
    health.status = 'ERROR';
    health.error  = error.message;
    res.status(503).json(health);
  }
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Sentry error handler (sebelum custom error handler) ───────────────────────
app.use(sentryErrorHandler());

// ── Custom Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Server running on port ${PORT}`);
  console.log(` API: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/health`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;