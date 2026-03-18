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
const { mediumLimit, mediumUrlEncoded } = require('../middleware/requestLimit');

router.post('/', mediumLimit, mediumUrlEncoded, contactLimiter, createContact);

router.get('/',           protect, admin, getContacts);
router.get('/:id',        protect, admin, getContactById);
router.patch('/:id',      protect, admin, updateContact);
router.post('/:id/reply', protect, admin, replyContact);
router.delete('/:id',     protect, admin, deleteContact);

module.exports = router;