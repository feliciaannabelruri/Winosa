require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { setLanguage } = require('./middleware/language');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
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

// Upload & Email Test Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/email', emailTestRoutes);

// Admin Routes
app.use('/api/admin/services', adminServiceRoutes);
app.use('/api/admin/portfolio', adminPortfolioRoutes);
app.use('/api/admin/blog', adminBlogRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});