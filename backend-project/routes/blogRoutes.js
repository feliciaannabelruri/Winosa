const express = require('express');
const router = express.Router();
const { getBlogs, getBlogBySlug } = require('../controllers/blogController');
const { cache } = require('../middleware/cache');

router.get('/', cache(60, 'blog'), getBlogs);
// Single blog NOT cached — it increments view count on each request
router.get('/:slug', getBlogBySlug);

module.exports = router;