const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, createContact); // Apply rate limit
router.get('/', protect, admin, getContacts);

module.exports = router;