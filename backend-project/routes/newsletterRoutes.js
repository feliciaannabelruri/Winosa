const express = require('express');
const router = express.Router();
const { subscribeNewsletter, getSubscribers, deleteSubscriber } = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/auth');
const { newsletterLimiter } = require('../middleware/rateLimiter');

router.post('/', newsletterLimiter, subscribeNewsletter);
router.get('/', protect, admin, getSubscribers);

// DELETE /api/newsletter/:id — needed by frontend NewsletterPage.tsx
router.delete('/:id', protect, admin, deleteSubscriber);

module.exports = router;