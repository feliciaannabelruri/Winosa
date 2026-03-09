const express = require('express');
const router = express.Router();
const { uploadImage } = require('../../controllers/admin/adminUploadController');
const { protect, admin } = require('../../middleware/auth');

// POST /api/admin/upload
router.post('/upload', protect, admin, uploadImage);

module.exports = router;