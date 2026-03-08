const express = require('express');
const router = express.Router();
const asyncHandler = require('../../middleware/asyncHandler');
const { protect, admin } = require('../../middleware/auth');
const { cache } = require('../../utils/cache');
const { getAnalytics } = require('../../controllers/analyticsController');

router.use(protect);
router.use(admin);

// Analytics
router.get('/', getAnalytics);

// Cache management
router.get('/cache/stats', asyncHandler(async (req, res) => {
  res.json({ success: true, data: cache.stats() });
}));

router.delete('/cache/flush', asyncHandler(async (req, res) => {
  cache.flush();
  res.json({ success: true, message: 'Cache flushed successfully' });
}));

router.delete('/cache/:prefix', asyncHandler(async (req, res) => {
  const count = cache.invalidatePrefix(req.params.prefix);
  res.json({
    success: true,
    message: `Invalidated ${count} cache entries with prefix "${req.params.prefix}"`,
  });
}));

module.exports = router;