const express = require('express');
const router = express.Router();
const { subscribeNewsletter, getSubscribers } = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/auth');

router.post('/', subscribeNewsletter); // Public
router.get('/', protect, admin, getSubscribers); // Protected

module.exports = router;