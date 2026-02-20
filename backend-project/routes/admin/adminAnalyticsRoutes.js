const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../../controllers/analyticsController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);
router.get('/', getAnalytics);

module.exports = router;