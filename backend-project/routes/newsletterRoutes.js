const express = require('express');
const router = express.Router();
const { subscribeNewsletter, getSubscribers } = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/auth');
const { newsletterLimiter } = require('../middleware/rateLimiter');

router.post('/', newsletterLimiter, subscribeNewsletter); // Apply rate limit
router.get('/', protect, admin, getSubscribers);

module.exports = router;