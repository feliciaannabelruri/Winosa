const express = require('express');
const router = express.Router();
const {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getAllPortfolios,
  getPortfolioById,
} = require('../../controllers/admin/adminPortfolioController');
const { protect, admin } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createPortfolioSchema, updatePortfolioSchema } = require('../../validators/portfolioValidator');

router.use(protect);
router.use(admin);

router.get('/', getAllPortfolios);
router.get('/:id', getPortfolioById);
router.post('/', validate(createPortfolioSchema), createPortfolio);

router.route('/:id')
  .put(validate(updatePortfolioSchema), updatePortfolio)
  .delete(deletePortfolio);

module.exports = router;