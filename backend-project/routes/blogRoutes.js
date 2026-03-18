const express = require('express');
const router = express.Router();
const { 
  getBlogs, 
  getBlogBySlug,
  getBlogRecommendations,
} = require('../controllers/blogController');

router.get('/', getBlogs);
router.get('/:slug/recommendations', getBlogRecommendations);
router.get('/:slug', getBlogBySlug);

module.exports = router;