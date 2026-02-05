const Portfolio = require('../../models/Portfolio');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');

// @desc    Create new portfolio
// @route   POST /api/admin/portfolio
// @access  Private/Admin
exports.createPortfolio = asyncHandler(async (req, res, next) => {
  const { title, slug, description, image, category, client, projectUrl, isActive } = req.body;

  // Check if slug already exists
  const existingPortfolio = await Portfolio.findOne({ slug });
  if (existingPortfolio) {
    return next(new ErrorResponse('Portfolio with this slug already exists', 400));
  }

  const portfolio = await Portfolio.create({
    title,
    slug,
    description,
    image,
    category,
    client,
    projectUrl,
    isActive
  });

  res.status(201).json({
    success: true,
    message: 'Portfolio created successfully',
    data: portfolio
  });
});

// @desc    Update portfolio
// @route   PUT /api/admin/portfolio/:id
// @access  Private/Admin
exports.updatePortfolio = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  // Check if portfolio exists
  let portfolio = await Portfolio.findById(req.params.id);
  
  if (!portfolio) {
    return next(new ErrorResponse(getTranslation(lang, 'portfolioNotFound'), 404));
  }

  // If updating slug, check if new slug already exists
  if (req.body.slug && req.body.slug !== portfolio.slug) {
    const existingPortfolio = await Portfolio.findOne({ slug: req.body.slug });
    if (existingPortfolio) {
      return next(new ErrorResponse('Portfolio with this slug already exists', 400));
    }
  }

  // Update portfolio
  portfolio = await Portfolio.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    message: 'Portfolio updated successfully',
    data: portfolio
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

  await Portfolio.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Portfolio deleted successfully'
  });
});

// @desc    Get all portfolios (for admin - includes inactive)
// @route   GET /api/admin/portfolio
// @access  Private/Admin
exports.getAllPortfolios = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filter
  let filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Get total count
  const total = await Portfolio.countDocuments(filter);

  // Get portfolios
  const portfolios = await Portfolio.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    count: portfolios.length,
    total: total,
    page: page,
    pages: Math.ceil(total / limit),
    data: portfolios
  });
});