const Blog = require('../models/Blog');
const asyncHandler = require('../middleware/asyncHandler');
const { paginate } = require('../utils/pagination');
const { cache, cacheMiddleware } = require('../utils/cache');
const mlModel = require('../services/mlRecommendation');

async function ensureModelTrained() {
  if (mlModel.isTrained) return true;

  try {
    const BACKEND_API_URL = process.env.ML_BACKEND_API_URL
      || `http://localhost:${process.env.PORT || 5000}/api`;

    const res = await fetch(`${BACKEND_API_URL}/blog?limit=100`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const blogs = json.data || [];

    if (!blogs.length) return false;
    const result = await mlModel.train(blogs);
    return result.success;
  } catch (e) {
    console.warn('ensureModelTrained failed:', e.message);
    return false;
  }
}

// @desc    Get all blogs with pagination
// @route   GET /api/blog?page=1&limit=10
// @access  Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;

  const result = await paginate(Blog, { isPublished: true }, {
    page,
    limit,
    sort: { createdAt: -1 },
    select: 'title slug excerpt image author tags readTime createdAt views',
  });

  res.json({
    success: true,
    count: result.data.length,
    ...result.pagination,
    data: result.data,
  });
});

// @desc    Get single blog by slug
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlogBySlug = asyncHandler(async (req, res, next) => {
  const cacheKey = `blog:slug:${req.params.slug}`;

  // Try cache first (without incrementing view — we do that separately)
  const cached = cache.get(cacheKey);
  if (cached) {
    // Still increment view in background (fire and forget)
    Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } }
    ).exec();
    res.setHeader('X-Cache', 'HIT');
    return res.json({ success: true, data: cached });
  }

  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  cache.set(cacheKey, blog, 120); // 2 min cache for individual posts
  res.setHeader('X-Cache', 'MISS');
  res.json({ success: true, data: blog });
});

// @desc    Get blog recommendations from ML service
// @route   GET /api/blog/:slug/recommendations
// @access  Public
exports.getBlogRecommendations = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const limit = parseInt(req.query.limit) || 3;

  try {
      const trained = await ensureModelTrained();
      if (!trained) throw new Error('Model not trained');

      const recs = mlModel.getRecommendations(slug, limit);

      const slugs = recs.map(b => b.slug);

      const verified = await Blog.find({
        slug: { $in: slugs },
        isPublished: true
      }).select('title slug excerpt image author tags views readTime createdAt').lean();

      const verifiedMap = Object.fromEntries(verified.map(b => [b.slug, b]));
      const ordered = slugs.map(s => verifiedMap[s]).filter(Boolean);

      return res.json({
        success          : true,
        algorithm        : 'Hybrid: TF-IDF + Semantic + Hot Score',
        semantic_enabled : mlModel.semanticAvailable,
        mae              : mlModel.mae,
        count            : ordered.length,
        data             : ordered,
      });

    } catch (error) {
    // Fallback jika ML service mati → tampilkan most viewed
    console.warn('ML service unavailable, using fallback:', error.message);

    const currentBlog = await Blog.findOne({ 
      slug, 
      isPublished: true 
    }).lean();
    
    if (!currentBlog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }

    const fallback = await Blog.find({
      _id: { $ne: currentBlog._id },
      isPublished: true,
    })
      .sort({ views: -1 })
      .limit(limit)
      .select('title slug excerpt image author tags views readTime createdAt')
      .lean();

    return res.json({
      success: true,
      algorithm: 'fallback_most_viewed',
      mae: null,
      count: fallback.length,
      data: fallback,
    });
  }
});

// @desc    Get trending blogs
    // @route   GET /api/blog/trending
    // @access  Public
    exports.getTrendingBlogs = asyncHandler(async (req, res, next) => {
      const limit = parseInt(req.query.limit) || 5;

      const trending = await Blog.find({ isPublished: true })
        .sort({ views: -1, createdAt: -1 }) // paling banyak dilihat + terbaru
        .limit(limit)
        .select('title slug excerpt image author tags views readTime createdAt')
        .lean();

      res.json({
        success: true,
        count: trending.length,
        data: trending,
      });
    });