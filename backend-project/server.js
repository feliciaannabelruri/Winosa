require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { setLanguage } = require('./middleware/language');
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const { cacheStats } = require('./middleware/cache');
const logger = require('./middleware/logger');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger);
app.use(setLanguage);
app.use(generalLimiter); // BUG FIX: apply general rate limiter to all routes

// ─── Database ─────────────────────────────────────────────────────────────────
connectDB();

// ─── Import Routes ────────────────────────────────────────────────────────────
const portfolioRoutes      = require('./routes/portfolioRoutes');
const blogRoutes           = require('./routes/blogRoutes');
const contactRoutes        = require('./routes/contactRoutes');
const newsletterRoutes     = require('./routes/newsletterRoutes');
const serviceRoutes        = require('./routes/serviceRoutes');
const subscriptionRoutes   = require('./routes/subscriptionRoutes');
const authRoutes           = require('./routes/authRoutes');
const uploadRoutes         = require('./routes/uploadRoutes');
const emailTestRoutes      = require('./routes/emailTestRoutes');
const searchRoutes         = require('./routes/searchRoutes');

// Admin Routes
const adminServiceRoutes      = require('./routes/admin/adminServiceRoutes');
const adminPortfolioRoutes    = require('./routes/admin/adminPortfolioRoutes');
const adminBlogRoutes         = require('./routes/admin/adminBlogRoutes');
const adminAnalyticsRoutes    = require('./routes/admin/adminAnalyticsRoutes');
const adminSubscriptionRoutes = require('./routes/admin/adminSubscriptionRoutes');
const adminSettingsRoutes     = require('./routes/admin/adminSettingsRoutes'); // NEW

// ─── Root ─────────────────────────────────────────────────────────────────────
// BUG FIX: was defined twice in original server.js
app.get('/', (req, res) => {
  res.json({
    message: 'Winosa Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Public Routes ────────────────────────────────────────────────────────────
app.use('/api/portfolio',     portfolioRoutes);
app.use('/api/blog',          blogRoutes);
app.use('/api/contact',       contactRoutes);
app.use('/api/newsletter',    newsletterRoutes);
app.use('/api/services',      serviceRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/auth',          authRoutes);
app.use('/api/search',        searchRoutes);

// ─── Upload & Email Test ──────────────────────────────────────────────────────
app.use('/api/upload', uploadRoutes);
app.use('/api/email',  emailTestRoutes);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
app.use('/api/admin/services',      adminServiceRoutes);
app.use('/api/admin/portfolio',     adminPortfolioRoutes);
app.use('/api/admin/blog',          adminBlogRoutes);
app.use('/api/admin/analytics',     adminAnalyticsRoutes);
app.use('/api/admin/subscriptions', adminSubscriptionRoutes);
app.use('/api/admin/settings',      adminSettingsRoutes); // NEW

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    status: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'development',
    database: 'disconnected',
    email: 'unknown',
    cache: cacheStats(), // NEW: show cache stats
  };

  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) health.database = 'connected';

    const transporter = require('./config/email');
    await transporter.verify();
    health.email = 'ready';
  } catch (error) {
    health.status = 'DEGRADED';
    health.error = error.message;
    return res.status(503).json(health);
  }

  res.json(health);
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});