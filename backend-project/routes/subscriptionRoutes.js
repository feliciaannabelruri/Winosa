const express = require('express');
const router = express.Router();
const { getSubscriptions, getSubscriptionById } = require('../controllers/subscriptionController');
const { cache } = require('../middleware/cache');

router.get('/',    cache(300, 'subscriptions'), getSubscriptions);
router.get('/:id', cache(300, 'subscriptions'), getSubscriptionById);

module.exports = router;