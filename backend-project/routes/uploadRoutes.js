const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, uploadToImageKit } = require('../config/imagekit');
const { protect, admin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Test upload single image
router.post('/test-single', protect, admin, (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    try {
      // Upload to ImageKit
      const result = await uploadToImageKit(req.file, 'test');

      res.json({
        success: true,
        message: 'Image uploaded successfully to ImageKit',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
});

// Test upload multiple images
router.post('/test-multiple', protect, admin, (req, res, next) => {
  const upload = uploadMultiple(5);
  
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    try {
      // Upload all files to ImageKit
      const uploadPromises = req.files.map(file => 
        uploadToImageKit(file, 'test')
      );
      
      const results = await Promise.all(uploadPromises);

      res.json({
        success: true,
        message: `${req.files.length} images uploaded successfully to ImageKit`,
        data: results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
});

module.exports = router;