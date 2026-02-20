require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { setLanguage } = require('./middleware/language');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const searchRoutes = require('./routes/searchRoutes')

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());
app.use(logger); // Add request logger
app.use(setLanguage);

// Connect Database
connectDB();

// Import Routes
const portfolioRoutes = require('./routes/portfolioRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const emailTestRoutes = require('./routes/emailTestRoutes');

// Admin Routes
const adminServiceRoutes = require('./routes/admin/adminServiceRoutes');
const adminPortfolioRoutes = require('./routes/admin/adminPortfolioRoutes');
const adminBlogRoutes = require('./routes/admin/adminBlogRoutes');
const adminAnalyticsRoutes = require('./routes/admin/adminAnalyticsRoutes');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Public Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

// Upload & Email Test Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/email', emailTestRoutes);

// Admin Routes
app.use('/api/admin/services', adminServiceRoutes);
app.use('/api/admin/portfolio', adminPortfolioRoutes);
app.use('/api/admin/blog', adminBlogRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});
// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    status: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    database: 'disconnected',
    email: 'unknown'
  };

  try {
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      healthCheck.database = 'connected';
    }

    // Check email service
    const transporter = require('./config/email');
    await transporter.verify();
    healthCheck.email = 'ready';
  } catch (error) {
    healthCheck.status = 'ERROR';
    healthCheck.error = error.message;
    return res.status(503).json(healthCheck);
  }

  res.json(healthCheck);
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});