const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  replyContact,
  deleteContact,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public
router.post('/', contactLimiter, createContact);

// Admin only
router.get('/',    protect, admin, getContacts);
router.get('/:id', protect, admin, getContactById);      // ← baru
router.patch('/:id', protect, admin, updateContact);
router.post('/:id/reply', protect, admin, replyContact);
router.delete('/:id', protect, admin, deleteContact);    // ← baru

module.exports = router;