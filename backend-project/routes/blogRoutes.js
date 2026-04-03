const express = require('express');
const router  = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  getBlogRecommendations,
} = require('../controllers/blogController');
const { trackBlogView } = require('../middleware/mlTrigger');

router.get('/', getBlogs);

router.get('/trending', async (req, res) => {
  const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
  const limit = req.query.limit || 5;

  try {
    const response = await fetch(`${ML_SERVICE_URL}/trending?limit=${limit}`);
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    const Blog = require('../models/Blog');
    const fallback = await Blog.find({ isPublished: true })
      .sort({ views: -1 })
      .limit(Number(limit))
      .select('title slug excerpt image author tags views readTime createdAt')
      .lean();

    return res.json({
      success: true,
      algorithm: 'fallback_most_viewed',
      count: fallback.length,
      data: fallback,
    });
  }
});

router.get('/:slug/recommendations', getBlogRecommendations);
router.get('/:slug', trackBlogView, getBlogBySlug);

module.exports = router;