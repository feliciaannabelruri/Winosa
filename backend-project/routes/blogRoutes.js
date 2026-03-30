const express = require('express');
const router  = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  getBlogRecommendations,
} = require('../controllers/blogController');
const { trackBlogView } = require('../middleware/mlTrigger');

router.get('/', getBlogs);

router.get('/:slug/recommendations', getBlogRecommendations);

router.get('/:slug', trackBlogView, getBlogBySlug);

module.exports = router;