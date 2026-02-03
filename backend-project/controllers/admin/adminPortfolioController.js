const Portfolio = require('../../models/Portfolio');
const { getTranslation } = require('../../middleware/language');

// @desc    Create new portfolio
// @route   POST /api/admin/portfolio
// @access  Private/Admin
exports.createPortfolio = async (req, res) => {
  try {
    const lang = req.language || 'en';
    const { title, slug, description, image, category, client, projectUrl, isActive } = req.body;

    // Check if slug already exists
    const existingPortfolio = await Portfolio.findOne({ slug });
    if (existingPortfolio) {
      return res.status(400).json({
        success: false,
        message: 'Portfolio with this slug already exists'
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Update portfolio
// @route   PUT /api/admin/portfolio/:id
// @access  Private/Admin
exports.updatePortfolio = async (req, res) => {
  try {
    const lang = req.language || 'en';

    // Check if portfolio exists
    let portfolio = await Portfolio.findById(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: getTranslation(lang, 'portfolioNotFound')
      });
    }

    // If updating slug, check if new slug already exists
    if (req.body.slug && req.body.slug !== portfolio.slug) {
      const existingPortfolio = await Portfolio.findOne({ slug: req.body.slug });
      if (existingPortfolio) {
        return res.status(400).json({
          success: false,
          message: 'Portfolio with this slug already exists'
        });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Delete portfolio
// @route   DELETE /api/admin/portfolio/:id
// @access  Private/Admin
exports.deletePortfolio = async (req, res) => {
  try {
    const lang = req.language || 'en';

    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: getTranslation(lang, 'portfolioNotFound')
      });
    }

    await Portfolio.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Get all portfolios (for admin - includes inactive)
// @route   GET /api/admin/portfolio
// @access  Private/Admin
exports.getAllPortfolios = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};