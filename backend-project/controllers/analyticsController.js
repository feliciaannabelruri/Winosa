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
  const [
    portfolioCount,
    blogCount,
    serviceCount,
    newsletterCount,
    contactCount,
    recentBlogs,
    popularBlogs,
    recentBlogsActivity,
    recentServices,
    recentSubscribers,
    recentContacts,
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
      .lean(),
    Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title isPublished createdAt')
      .lean(),
    Service.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title isActive createdAt')
      .lean(),
    Newsletter.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('email isActive createdAt')
      .lean(),
    Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name subject email isRead createdAt')
      .lean(),
  ]);

  const activities = [
    ...recentBlogsActivity.map(b => ({
      type: 'Blog',
      title: b.title,
      status: b.isPublished ? 'Published' : 'Draft',
      createdAt: b.createdAt,
    })),
    ...recentServices.map(s => ({
      type: 'Service',
      title: s.title,
      status: s.isActive ? 'Published' : 'Draft',
      createdAt: s.createdAt,
    })),
    ...recentSubscribers.map(s => ({
      type: 'Subscriber',
      title: s.email,
      status: s.isActive ? 'Active' : 'Unsubscribed',
      createdAt: s.createdAt,
    })),
    ...recentContacts.map(c => ({
      type: 'Contact',
      title: c.name,
      subtitle: c.subject || c.email,
      status: c.isRead ? 'Read' : 'Unread',
      createdAt: c.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  res.json({
    success: true,
    data: {
      counts: {
        portfolios: portfolioCount,
        blogs: blogCount,
        services: serviceCount,
        subscribers: newsletterCount,
        contacts: contactCount,
      },
      recentBlogs,
      popularBlogs,
      recentActivities: activities,
    },
  });
});