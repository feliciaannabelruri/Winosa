const Portfolio = require('../models/Portfolio');
const asyncHandler = require('../middleware/asyncHandler');
const { paginate } = require('../utils/pagination');
const { cache } = require('../utils/cache');

// @desc    Get all portfolios with optional category filter and pagination
// @route   GET /api/portfolio?category=web&page=1&limit=10
// @access  Public
exports.getPortfolios = asyncHandler(async (req, res, next) => {
  const { category, page, limit } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;

  const result = await paginate(Portfolio, filter, {
    page,
    limit,
    sort: { createdAt: -1 },
    select: 'title slug description image category client projectUrl createdAt',
  });

  res.json({
    success: true,
    count: result.data.length,
    ...result.pagination,
    data: result.data,
  });
});

// @desc    Get single portfolio by slug
// @route   GET /api/portfolio/:slug
// @access  Public
exports.getPortfolioBySlug = asyncHandler(async (req, res, next) => {
  const cacheKey = `portfolio:slug:${req.params.slug}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json({ success: true, data: cached });
  }

  const portfolio = await Portfolio.findOne({
    slug: req.params.slug,
    isActive: true,
  }).lean();

  if (!portfolio) {
    return res.status(404).json({ success: false, message: 'Portfolio not found' });
  }

  cache.set(cacheKey, portfolio, 300);
  res.setHeader('X-Cache', 'MISS');
  res.json({ success: true, data: portfolio });
});