const Portfolio = require('../../models/Portfolio');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { uploadSingle, uploadToImageKit, deleteFromImageKit } = require('../../config/imagekit');
const { cache } = require('../../utils/cache');

const CACHE_PREFIX = 'portfolio';
const CACHE_TTL = 300; // 5 minutes

// @desc    Create new portfolio with image
// @route   POST /api/admin/portfolio
// @access  Private/Admin
exports.createPortfolio = asyncHandler(async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) return next(new ErrorResponse(err.message, 400));

    try {
      const { title, slug, description, category, client, projectUrl, isActive } = req.body;

      const existingPortfolio = await Portfolio.findOne({ slug }).lean();
      if (existingPortfolio) {
        return next(new ErrorResponse('Portfolio with this slug already exists', 400));
      }

      let imageUrl = null;
      let imageId = null;

      if (req.file) {
        const uploadResult = await uploadToImageKit(req.file, 'portfolio');
        imageUrl = uploadResult.url;
        imageId = uploadResult.fileId;
      }

      const portfolio = await Portfolio.create({
        title, slug, description,
        image: imageUrl,
        imageId,
        category, client, projectUrl,
        isActive: isActive !== undefined ? isActive : true,
      });

      // Invalidate cache
      cache.invalidatePrefix(CACHE_PREFIX);

      res.status(201).json({
        success: true,
        message: 'Portfolio created successfully',
        data: portfolio,
      });
    } catch (error) {
      return next(new ErrorResponse(error.message, 500));
    }
  });
});

// @desc    Get single portfolio by ID (admin)
// @route   GET /api/admin/portfolio/:id
// @access  Private/Admin
exports.getPortfolioById = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findById(req.params.id).lean();

  if (!portfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  res.json({ success: true, data: portfolio });
});

// @desc    Update portfolio
// @route   PUT /api/admin/portfolio/:id
// @access  Private/Admin
exports.updatePortfolio = asyncHandler(async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) return next(new ErrorResponse(err.message, 400));

    try {
      const lang = req.language || 'en';

      let portfolio = await Portfolio.findById(req.params.id);
      if (!portfolio) {
        return next(new ErrorResponse(getTranslation(lang, 'portfolioNotFound'), 404));
      }

      if (req.body.slug && req.body.slug !== portfolio.slug) {
        const existing = await Portfolio.findOne({ slug: req.body.slug }).lean();
        if (existing) {
          return next(new ErrorResponse('Portfolio with this slug already exists', 400));
        }
      }

      if (req.file) {
        if (portfolio.imageId) {
          try { await deleteFromImageKit(portfolio.imageId); } catch (e) {
            console.log('Error deleting old image:', e.message);
          }
        }
        const uploadResult = await uploadToImageKit(req.file, 'portfolio');
        req.body.image = uploadResult.url;
        req.body.imageId = uploadResult.fileId;
      }

      portfolio = await Portfolio.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      // Invalidate cache
      cache.invalidatePrefix(CACHE_PREFIX);

      res.json({
        success: true,
        message: 'Portfolio updated successfully',
        data: portfolio,
      });
    } catch (error) {
      return next(new ErrorResponse(error.message, 500));
    }
  });
});

// @desc    Delete portfolio
// @route   DELETE /api/admin/portfolio/:id
// @access  Private/Admin
exports.deletePortfolio = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) {
    return next(new ErrorResponse(getTranslation(lang, 'portfolioNotFound'), 404));
  }

  if (portfolio.imageId) {
    try { await deleteFromImageKit(portfolio.imageId); } catch (e) {
      console.log('Error deleting image:', e.message);
    }
  }

  await Portfolio.findByIdAndDelete(req.params.id);

  // Invalidate cache
  cache.invalidatePrefix(CACHE_PREFIX);

  res.json({ success: true, message: 'Portfolio deleted successfully' });
});

// @desc    Get all portfolios (admin - includes inactive)
// @route   GET /api/admin/portfolio
// @access  Private/Admin
exports.getAllPortfolios = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100); // cap at 100
  const skip = (page - 1) * limit;

  let filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  // Sort options
  const sortField = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  const [total, portfolios] = await Promise.all([
    Portfolio.countDocuments(filter),
    Portfolio.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  res.json({
    success: true,
    count: portfolios.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
    data: portfolios,
  });
});