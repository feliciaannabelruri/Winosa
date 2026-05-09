const express = require('express');
const router = express.Router();
const { sendNewsletterEmail } = require('../../controllers/admin/adminSubscriptionController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);

router.post('/:id/send-email', sendNewsletterEmail);

module.exports = router;