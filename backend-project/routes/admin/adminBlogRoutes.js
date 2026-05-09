const express = require('express');
const router = express.Router();
const {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogPageContent,
  updateBlogPageContent
} = require('../../controllers/admin/adminBlogController');
const { protect, admin } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createBlogSchema, updateBlogSchema } = require('../../validators/blogValidator');

router.use(protect);
router.use(admin);

router.get('/', getAllBlogs);
router.get('/page-content', getBlogPageContent);

router.put('/page-content', updateBlogPageContent);
router.get('/:id', getBlogById);

router.post('/', validate(createBlogSchema), createBlog);

router.route('/:id')
  .put(validate(updateBlogSchema), updateBlog)
  .delete(deleteBlog);

module.exports = router;