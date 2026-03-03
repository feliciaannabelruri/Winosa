const express = require('express');
const router = express.Router();
const { getPortfolios, getPortfolioBySlug } = require('../controllers/portfolioController');
const { cache } = require('../middleware/cache');

router.get('/',      cache(120, 'portfolio'), getPortfolios);
router.get('/:slug', cache(120, 'portfolio'), getPortfolioBySlug);

module.exports = router;