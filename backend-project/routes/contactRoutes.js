const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.post('/', createContact); // Public
router.get('/', protect, admin, getContacts); // Protected

module.exports = router;