const express = require('express');
const router = express.Router();
const {
  getPortfolios,
  getPortfolioBySlug,
  getPortfolioRecommendations, 
} = require('../controllers/portfolioController');

router.get('/', getPortfolios);

router.get('/:slug/recommendations', getPortfolioRecommendations);

router.get('/:slug', getPortfolioBySlug);

module.exports = router;