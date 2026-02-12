const Blog = require('../../models/Blog');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { uploadSingle, uploadToImageKit, deleteFromImageKit } = require('../../config/imagekit');

// @desc    Create new blog with image
// @route   POST /api/admin/blog
// @access  Private/Admin
exports.createBlog = asyncHandler(async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }

    try {
      const { title, slug, content, excerpt, author, tags, isPublished } = req.body;

      // Check if slug already exists
      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog) {
        return next(new ErrorResponse('Blog with this slug already exists', 400));
      }

      let imageUrl = null;
      let imageId = null;

      // Upload image to ImageKit if file exists
      if (req.file) {
        const uploadResult = await uploadToImageKit(req.file, 'blog');
        imageUrl = uploadResult.url;
        imageId = uploadResult.fileId;
      }

      const blog = await Blog.create({
        title,
        slug,
        content,
        excerpt,
        image: imageUrl,
        imageId: imageId,
        author,
        tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
        isPublished: isPublished !== undefined ? isPublished : true
      });

      res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: blog
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
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }

    try {
      const lang = req.language || 'en';

      // Check if blog exists
      let blog = await Blog.findById(req.params.id);
      
      if (!blog) {
        return next(new ErrorResponse(getTranslation(lang, 'blogNotFound'), 404));
      }

      // If updating slug, check if new slug already exists
      if (req.body.slug && req.body.slug !== blog.slug) {
        const existingBlog = await Blog.findOne({ slug: req.body.slug });
        if (existingBlog) {
          return next(new ErrorResponse('Blog with this slug already exists', 400));
        }
      }

      // Handle new image upload
      if (req.file) {
        // Delete old image from ImageKit if exists
        if (blog.imageId) {
          try {
            await deleteFromImageKit(blog.imageId);
          } catch (error) {
            console.log('Error deleting old image:', error.message);
          }
        }

        // Upload new image
        const uploadResult = await uploadToImageKit(req.file, 'blog');
        req.body.image = uploadResult.url;
        req.body.imageId = uploadResult.fileId;
      }

      // Handle tags if it's a string (from form-data)
      if (req.body.tags && typeof req.body.tags === 'string') {
        req.body.tags = JSON.parse(req.body.tags);
      }

      // Update blog
      blog = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      res.json({
        success: true,
        message: 'Blog updated successfully',
        data: blog
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

  // Delete image from ImageKit if exists
  if (blog.imageId) {
    try {
      await deleteFromImageKit(blog.imageId);
    } catch (error) {
      console.log('Error deleting image:', error.message);
    }
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Blog deleted successfully'
  });
});

// @desc    Get all blogs (for admin - includes unpublished)
// @route   GET /api/admin/blog
// @access  Private/Admin
exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filter
  let filter = {};
  if (req.query.isPublished !== undefined) {
    filter.isPublished = req.query.isPublished === 'true';
  }
  if (req.query.author) {
    filter.author = new RegExp(req.query.author, 'i');
  }

  // Get total count
  const total = await Blog.countDocuments(filter);

  // Get blogs
  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    count: blogs.length,
    total: total,
    page: page,
    pages: Math.ceil(total / limit),
    data: blogs
  });
});

// @desc    Get single blog by ID (for admin)
// @route   GET /api/admin/blog/:id
// @access  Private/Admin
exports.getBlogById = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse(getTranslation(lang, 'blogNotFound'), 404));
  }

  res.json({
    success: true,
    data: blog
  });
});