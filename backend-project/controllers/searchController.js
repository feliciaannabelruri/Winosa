const Portfolio = require('../models/Portfolio');
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Search across all content
// @route   GET /api/search?q=keyword&type=all|portfolio|blog|service
// @access  Public
exports.searchAll = asyncHandler(async (req, res, next) => {
  const { q, type = 'all' } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a search query'
    });
  }

  const searchQuery = q.trim();
  const results = {};

  // Search Portfolio
  if (type === 'all' || type === 'portfolio') {
    results.portfolio = await Portfolio
      .find({ 
        $text: { $search: searchQuery },
        isActive: true
      })
      .select('title slug description image category client')
      .limit(10);
  }

  // Search Blog
  if (type === 'all' || type === 'blog') {
    results.blog = await Blog
      .find({ 
        $text: { $search: searchQuery },
        isPublished: true
      })
      .select('title slug excerpt image author tags readTime createdAt')
      .limit(10);
  }

  // Search Service
  if (type === 'all' || type === 'service') {
    results.service = await Service
      .find({ 
        $text: { $search: searchQuery },
        isActive: true
      })
      .select('title slug description icon price')
      .limit(10);
  }

  // Calculate total results
  const totalResults = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);

  res.json({
    success: true,
    query: searchQuery,
    totalResults,
    results
  });
});