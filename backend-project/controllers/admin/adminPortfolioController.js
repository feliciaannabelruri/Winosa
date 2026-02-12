const Portfolio = require('../../models/Portfolio');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { uploadSingle, uploadToImageKit, deleteFromImageKit } = require('../../config/imagekit');

// @desc    Create new portfolio with image
// @route   POST /api/admin/portfolio
// @access  Private/Admin
exports.createPortfolio = asyncHandler(async (req, res, next) => {
  // Handle file upload first
  uploadSingle(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }

    try {
      const { title, slug, description, category, client, projectUrl, isActive } = req.body;

      // Check if slug already exists
      const existingPortfolio = await Portfolio.findOne({ slug });
      if (existingPortfolio) {
        return next(new ErrorResponse('Portfolio with this slug already exists', 400));
      }

      let imageUrl = null;
      let imageId = null;

      // Upload image to ImageKit if file exists
      if (req.file) {
        const uploadResult = await uploadToImageKit(req.file, 'portfolio');
        imageUrl = uploadResult.url;
        imageId = uploadResult.fileId;
      }

      const portfolio = await Portfolio.create({
        title,
        slug,
        description,
        image: imageUrl,
        imageId: imageId,
        category,
        client,
        projectUrl,
        isActive: isActive !== undefined ? isActive : true
      });

      res.status(201).json({
        success: true,
        message: 'Portfolio created successfully',
        data: portfolio
      });
    } catch (error) {
      return next(new ErrorResponse(error.message, 500));
    }
  });
});

// @desc    Update portfolio
// @route   PUT /api/admin/portfolio/:id
// @access  Private/Admin
exports.updatePortfolio = asyncHandler(async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }

    try {
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

      // Handle new image upload
      if (req.file) {
        // Delete old image from ImageKit if exists
        if (portfolio.imageId) {
          try {
            await deleteFromImageKit(portfolio.imageId);
          } catch (error) {
            console.log('Error deleting old image:', error.message);
          }
        }

        // Upload new image
        const uploadResult = await uploadToImageKit(req.file, 'portfolio');
        req.body.image = uploadResult.url;
        req.body.imageId = uploadResult.fileId;
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

  // Delete image from ImageKit if exists
  if (portfolio.imageId) {
    try {
      await deleteFromImageKit(portfolio.imageId);
    } catch (error) {
      console.log('Error deleting image:', error.message);
    }
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