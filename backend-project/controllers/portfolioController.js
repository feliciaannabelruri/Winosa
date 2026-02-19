const Portfolio = require('../models/Portfolio');
const asyncHandler = require('../middleware/asyncHandler');
const { paginate } = require('../utils/pagination');

// @desc    Get all portfolios with optional category filter and pagination
// @route   GET /api/portfolio?category=web&page=1&limit=10
// @access  Public
exports.getPortfolios = asyncHandler(async (req, res, next) => {
  const { category, page, limit } = req.query;
  
  // Build filter
  let filter = { isActive: true };
  if (category) {
    filter.category = category;
  }

  // Use pagination helper
  const result = await paginate(Portfolio, filter, {
    page,
    limit,
    sort: { createdAt: -1 },
    select: 'title slug description image category client projectUrl createdAt'
  });

  res.json({
    success: true,
    count: result.data.length,
    ...result.pagination,
    data: result.data
  });
});

// @desc    Get single portfolio by slug
// @route   GET /api/portfolio/:slug
// @access  Public
exports.getPortfolioBySlug = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio
    .findOne({ 
      slug: req.params.slug,
      isActive: true 
    })
    .lean(); // Use lean for better performance

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found'
    });
  }

  res.json({
    success: true,
    data: portfolio
  });
});