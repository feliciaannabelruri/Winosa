const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContact,
  replyContact,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public
router.post('/', contactLimiter, createContact);

// Admin only
router.get('/', protect, admin, getContacts);
router.patch('/:id', protect, admin, updateContact);
router.post('/:id/reply', protect, admin, replyContact);

module.exports = router;