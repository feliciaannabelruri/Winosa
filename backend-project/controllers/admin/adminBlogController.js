const Blog = require('../../models/Blog');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { deleteFromImageKit } = require('../../config/imagekit');


// Helper: extract ImageKit fileId from URL
const extractFileId = (url) => {
  if (!url || !url.includes('ik.imagekit.io')) return null;
  const parts = url.split('/');
  return parts[parts.length - 1].split('?')[0]; // strip query params
};

// @desc    Create new blog
// @route   POST /api/admin/blog
// @access  Private/Admin
// Body: JSON { title, slug, content, excerpt, author, tags, image, isPublished }
exports.createBlog = asyncHandler(async (req, res, next) => {
  const { title, slug, content, excerpt, author, tags, image, isPublished } = req.body;

  const existingBlog = await Blog.findOne({ slug }).lean();
  if (existingBlog) {
    return next(new ErrorResponse('Blog with this slug already exists', 400));
  }

  const blog = await Blog.create({
    title,
    slug,
    content,
    excerpt,
    image: image || null,
    // imageId is not stored since upload is handled by /api/admin/upload
    author,
    tags: Array.isArray(tags) ? tags : [],
    isPublished: isPublished !== undefined ? isPublished : true,
  });


  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    data: blog,
  });
});

// @desc    Update blog
// @route   PUT /api/admin/blog/:id
// @access  Private/Admin
exports.updateBlog = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  let blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorResponse(getTranslation(lang, 'blogNotFound'), 404));
  }

  // Check slug uniqueness if changed
  if (req.body.slug && req.body.slug !== blog.slug) {
    const existing = await Blog.findOne({ slug: req.body.slug }).lean();
    if (existing) {
      return next(new ErrorResponse('Blog with this slug already exists', 400));
    }
  }

  // Allowed fields whitelist
  const allowedFields = [
    'title', 'slug', 'content', 'excerpt',
    'image', 'author', 'tags', 'isPublished',
  ];

  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );


  res.json({
    success: true,
    message: 'Blog updated successfully',
    data: blog,
  });
});

// @desc    Delete blog
// @route   DELETE /api/admin/blog/:id
// @access  Private/Admin
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorResponse(getTranslation(lang, 'blogNotFound'), 404));
  }

  // Try to delete image from ImageKit if stored
  if (blog.imageId) {
    try {
      await deleteFromImageKit(blog.imageId);
    } catch (e) {
      console.log('Error deleting image from ImageKit:', e.message);
    }
  }

  await Blog.findByIdAndDelete(req.params.id);


  res.json({ success: true, message: 'Blog deleted successfully' });
});

// @desc    Get all blogs (admin — includes unpublished)
// @route   GET /api/admin/blog
// @access  Private/Admin
exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.isPublished !== undefined) {
    filter.isPublished = req.query.isPublished === 'true';
  }
  if (req.query.author) {
    filter.author = new RegExp(req.query.author, 'i');
  }
  if (req.query.tag) {
    filter.tags = { $in: [req.query.tag] };
  }

  const sortField = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  const [total, blogs] = await Promise.all([
    Blog.countDocuments(filter),
    Blog.find(filter).sort(sort).skip(skip).limit(limit).lean(),
  ]);

  res.json({
    success: true,
    count: blogs.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
    data: blogs,
  });
});

// @desc    Get single blog by ID (admin)
// @route   GET /api/admin/blog/:id
// @access  Private/Admin
exports.getBlogById = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  const blog = await Blog.findById(req.params.id).lean();
  if (!blog) {
    return next(new ErrorResponse(getTranslation(lang, 'blogNotFound'), 404));
  }

  res.json({ success: true, data: blog });
});