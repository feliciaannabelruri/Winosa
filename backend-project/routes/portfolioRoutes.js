const express = require('express');
const router = express.Router();
const { 
  getPortfolios, 
  getPortfolioBySlug 
} = require('../controllers/portfolioController');

router.get('/', getPortfolios);
router.get('/:slug', getPortfolioBySlug);

module.exports = router;