const Portfolio = require('../models/Portfolio');
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const Newsletter = require('../models/Newsletter');
const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  // Execute all queries in parallel
  const [
    portfolioCount,
    blogCount,
    serviceCount,
    newsletterCount,
    contactCount,
    recentBlogs,
    popularBlogs
  ] = await Promise.all([
    Portfolio.countDocuments({ isActive: true }),
    Blog.countDocuments({ isPublished: true }),
    Service.countDocuments({ isActive: true }),
    Newsletter.countDocuments({ isActive: true }),
    Contact.countDocuments(),
    Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug createdAt')
      .lean(),
    Blog.find({ isPublished: true })
      .sort({ views: -1 })
      .limit(5)
      .select('title slug views')
      .lean()
  ]);

  res.json({
    success: true,
    data: {
      counts: {
        portfolios: portfolioCount,
        blogs: blogCount,
        services: serviceCount,
        subscribers: newsletterCount,
        contacts: contactCount
      },
      recentBlogs,
      popularBlogs
    }
  });
});