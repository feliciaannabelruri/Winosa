const Portfolio = require('../models/Portfolio');

// @desc    Get all portfolios
// @route   GET /api/portfolio
// @access  Public
exports.getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: portfolios.length,
      data: portfolios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single portfolio by slug
// @route   GET /api/portfolio/:slug
// @access  Public
exports.getPortfolioBySlug = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};