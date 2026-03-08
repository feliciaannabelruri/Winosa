const Blog = require('../../models/Blog');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { uploadSingle, uploadToImageKit, deleteFromImageKit } = require('../../config/imagekit');
const { cache } = require('../../utils/cache');

const CACHE_PREFIX = 'blog';

// @desc    Create new blog with image
// @route   POST /api/admin/blog
// @access  Private/Admin
exports.createBlog = asyncHandler(async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) return next(new ErrorResponse(err.message, 400));

    try {
      const { title, slug, content, excerpt, author, tags, isPublished } = req.body;

      const existingBlog = await Blog.findOne({ slug }).lean();
      if (existingBlog) {
        return next(new ErrorResponse('Blog with this slug already exists', 400));
      }

      let imageUrl = null;
      let imageId = null;

      if (req.file) {
        const uploadResult = await uploadToImageKit(req.file, 'blog');
        imageUrl = uploadResult.url;
        imageId = uploadResult.fileId;
      }

      const blog = await Blog.create({
        title, slug, content, excerpt,
        image: imageUrl,
        imageId,
        author,
        tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
        isPublished: isPublished !== undefined ? isPublished : true,
      });

      cache.invalidatePrefix(CACHE_PREFIX);

      res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: blog,
      });
    } catch (error) {
      return next(new ErrorResponse(error.message, 500));
    }
  });
});

// @desc    Update blog
// @route   PUT /api/admin/blog/:id
// @access  Private/Admin
exports.updateBlog = asyncHandler(async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) return next(new ErrorResponse(err.message, 400));

    try {
      const lang = req.language || 'en';

      let blog = await Blog.findById(req.params.id);
      if (!blog) {
        return next(new ErrorResponse(getTranslation(lang, 'blogNotFound'), 404));
      }

      if (req.body.slug && req.body.slug !== blog.slug) {
        const existing = await Blog.findOne({ slug: req.body.slug }).lean();
        if (existing) {
          return next(new ErrorResponse('Blog with this slug already exists', 400));
        }
      }

      if (req.file) {
        if (blog.imageId) {
          try { await deleteFromImageKit(blog.imageId); } catch (e) {
            console.log('Error deleting old image:', e.message);
          }
        }
        const uploadResult = await uploadToImageKit(req.file, 'blog');
        req.body.image = uploadResult.url;
        req.body.imageId = uploadResult.fileId;
      }

      if (req.body.tags && typeof req.body.tags === 'string') {
        req.body.tags = JSON.parse(req.body.tags);
      }

      blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      cache.invalidatePrefix(CACHE_PREFIX);

      res.json({
        success: true,
        message: 'Blog updated successfully',
        data: blog,
      });
    } catch (error) {
      return next(new ErrorResponse(error.message, 500));
    }
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

  if (blog.imageId) {
    try { await deleteFromImageKit(blog.imageId); } catch (e) {
      console.log('Error deleting image:', e.message);
    }
  }

  await Blog.findByIdAndDelete(req.params.id);

  cache.invalidatePrefix(CACHE_PREFIX);

  res.json({ success: true, message: 'Blog deleted successfully' });
});

// @desc    Get all blogs (admin - includes unpublished)
// @route   GET /api/admin/blog
// @access  Private/Admin
exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  let filter = {};
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
    Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
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