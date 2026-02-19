const Blog = require('../models/Blog');
const asyncHandler = require('../middleware/asyncHandler');
const { paginate } = require('../utils/pagination');

// @desc    Get all blogs with pagination
// @route   GET /api/blog?page=1&limit=10
// @access  Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;

  const result = await paginate(Blog, { isPublished: true }, {
    page,
    limit,
    sort: { createdAt: -1 },
    select: 'title slug excerpt image author tags readTime createdAt'
  });

  res.json({
    success: true,
    count: result.data.length,
    ...result.pagination,
    data: result.data
  });
});

// @desc    Get single blog by slug
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlogBySlug = asyncHandler(async (req, res, next) => {
  const blog = await Blog
    .findOneAndUpdate(
      { 
        slug: req.params.slug,
        isPublished: true 
      },
      { $inc: { views: 1 } }, // Increment view count
      { new: true }
    )
    .lean();

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  res.json({
    success: true,
    data: blog
  });
});