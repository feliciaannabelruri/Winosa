const express = require('express');
const router = express.Router();
const {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getAllPortfolios
} = require('../../controllers/admin/adminPortfolioController');
const { protect, admin } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createPortfolioSchema, updatePortfolioSchema } = require('../../validators/portfolioValidator');

// All routes are protected and admin only
router.use(protect);
router.use(admin);

// GET tidak perlu validation
router.get('/', getAllPortfolios);

// POST dan PUT pakai validation
router.post('/', validate(createPortfolioSchema), createPortfolio);

router.route('/:id')
  .put(validate(updatePortfolioSchema), updatePortfolio)
  .delete(deletePortfolio); 
module.exports = router;