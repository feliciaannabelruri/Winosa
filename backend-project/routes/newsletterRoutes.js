const express = require('express');
const router = express.Router();
const { subscribeNewsletter, getSubscribers } = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/auth');
const { newsletterLimiter } = require('../middleware/rateLimiter');
const { strictLimit, strictUrlEncoded } = require('../middleware/requestLimit');

router.post('/', strictLimit, strictUrlEncoded, newsletterLimiter, subscribeNewsletter);

router.get('/', protect, admin, getSubscribers);

module.exports = router;