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

exports.getPortfolioRecommendations = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const limit = parseInt(req.query.limit) || 3;

  const current = await Portfolio.findOne({ slug, isActive: true }).lean();
  if (!current) {
    return res.status(404).json({ success: false, message: 'Portfolio not found' });
  }

  const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

  try {
    const response = await fetch(
      `${ML_SERVICE_URL}/recommendations/portfolio/${slug}?limit=${limit}`,
      { signal: AbortSignal.timeout(3000) }
    );

    if (response.ok) {
      const data = await response.json();
      const slugs = (data.data || []).map(p => p.slug);

      if (slugs.length > 0) {
        const verified = await Portfolio.find({
          slug: { $in: slugs },
          isActive: true,
        }).select('title slug description image category client createdAt').lean();

        const verifiedMap = Object.fromEntries(verified.map(p => [p.slug, p]));
        const ordered = slugs.map(s => verifiedMap[s]).filter(Boolean);

        return res.json({
          success: true,
          algorithm: data.algorithm || 'ml_content_based',
          count: ordered.length,
          data: ordered,
        });
      }
    }
    throw new Error('ML returned empty or error');
  } catch (err) {
    console.warn('ML portfolio recommendations unavailable, using fallback:', err.message);
  }

  const fallback = await Portfolio.find({
    _id: { $ne: current._id },
    category: current.category,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title slug description image category client createdAt')
    .lean();

  if (fallback.length < limit) {
    const extra = await Portfolio.find({
      _id: { $ne: current._id, $nin: fallback.map(p => p._id) },
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit - fallback.length)
      .select('title slug description image category client createdAt')
      .lean();

    fallback.push(...extra);
  }

  return res.json({
    success: true,
    algorithm: 'fallback_same_category',
    count: fallback.length,
    data: fallback,
  });
});