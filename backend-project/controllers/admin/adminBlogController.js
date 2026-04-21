const Blog = require('../../models/Blog');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { uploadSingle, uploadToImageKit, deleteFromImageKit } = require('../../config/imagekit');
const { cache } = require('../../utils/cache');
const { triggerMLRetrain } = require('../../middleware/mlTrigger');

// Helper: bungkus callback multer jadi Promise (wajib untuk Express 5)
const runUpload = (req, res) =>
  new Promise((resolve, reject) => {
    uploadSingle(req, res, (err) => {
      if (err) return reject(new ErrorResponse(err.message, 400));
      resolve();
    });
  });

const CACHE_PREFIX = 'blog';

// @desc    Create new blog
// @route   POST /api/admin/blog
// @access  Private/Admin
exports.createBlog = asyncHandler(async (req, res, next) => {
  await runUpload(req, res);

  const { title, slug, content, excerpt, author, tags, isPublished, metaTitle, metaDescription, metaKeywords } = req.body;

  const existingBlog = await Blog.findOne({ slug }).lean();
  if (existingBlog) {
    return next(new ErrorResponse('Blog with this slug already exists', 400));
  }

  let imageUrl = req.body.image || null;
  let imageId  = null;

  if (req.file) {
    const uploadResult = await uploadToImageKit(req.file, 'blog');
    imageUrl = uploadResult.url;
    imageId  = uploadResult.fileId;
  }

  const blog = await Blog.create({
    title, slug, content, excerpt,
    image: imageUrl,
    imageId,
    author,
    tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
    isPublished: isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : true,
    metaTitle,
    metaDescription,
    metaKeywords,
  });

  cache.invalidatePrefix(CACHE_PREFIX);

  // Trigger ML retrain setelah blog baru dibuat (fire and forget)
  triggerMLRetrain().catch(e => console.warn('ML retrain skipped:', e.message));

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
  await runUpload(req, res);

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

  if (req.body.tags && typeof req.body.tags === 'string') {
    try { req.body.tags = JSON.parse(req.body.tags); } catch { /* biarkan as-is */ }
  }

  if (req.file) {
    if (blog.imageId) {
      try { await deleteFromImageKit(blog.imageId); } catch (e) {
        console.log('Error deleting old image:', e.message);
      }
    }
    const uploadResult = await uploadToImageKit(req.file, 'blog');
    req.body.image   = uploadResult.url;
    req.body.imageId = uploadResult.fileId;
  } else if (!req.body.image) {
    delete req.body.image;
    delete req.body.imageId;
  }

  if (typeof req.body.isPublished === 'string') {
    req.body.isPublished = req.body.isPublished === 'true';
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  cache.invalidatePrefix(CACHE_PREFIX);

  // Trigger ML retrain setelah blog diupdate (fire and forget)
  triggerMLRetrain().catch(e => console.warn('ML retrain skipped:', e.message));

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

  if (blog.imageId) {
    try { await deleteFromImageKit(blog.imageId); } catch (e) {
      console.log('Error deleting image:', e.message);
    }
  }

  await Blog.findByIdAndDelete(req.params.id);
  cache.invalidatePrefix(CACHE_PREFIX);

  // Trigger ML retrain setelah blog dihapus (fire and forget)
  triggerMLRetrain().catch(e => console.warn('ML retrain skipped:', e.message));

  res.json({ success: true, message: 'Blog deleted successfully' });
});

// @desc    Get all blogs (admin - includes unpublished)
// @route   GET /api/admin/blog
// @access  Private/Admin
exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip  = (page - 1) * limit;

  let filter = {};
  if (req.query.isPublished !== undefined) filter.isPublished = req.query.isPublished === 'true';
  if (req.query.author) filter.author = new RegExp(req.query.author, 'i');
  if (req.query.tag)    filter.tags   = { $in: [req.query.tag] };

  const sortField = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.order  === 'asc' ? 1 : -1;

  const [total, blogs] = await Promise.all([
    Blog.countDocuments(filter),
    Blog.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip).limit(limit).lean(),
  ]);

  res.json({
    success: true,
    count: blogs.length,
    total, page,
    pages:       Math.ceil(total / limit),
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