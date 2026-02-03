const Blog = require('../../models/Blog');
const { getTranslation } = require('../../middleware/language');

// @desc    Create new blog
// @route   POST /api/admin/blog
// @access  Private/Admin
exports.createBlog = async (req, res) => {
  try {
    const lang = req.language || 'en';
    const { title, slug, content, excerpt, image, author, tags, isPublished } = req.body;

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'Blog with this slug already exists'
      });
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      image,
      author,
      tags,
      isPublished
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Update blog
// @route   PUT /api/admin/blog/:id
// @access  Private/Admin
exports.updateBlog = async (req, res) => {
  try {
    const lang = req.language || 'en';

    // Check if blog exists
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: getTranslation(lang, 'blogNotFound')
      });
    }

    // If updating slug, check if new slug already exists
    if (req.body.slug && req.body.slug !== blog.slug) {
      const existingBlog = await Blog.findOne({ slug: req.body.slug });
      if (existingBlog) {
        return res.status(400).json({
          success: false,
          message: 'Blog with this slug already exists'
        });
      }
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
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/admin/blog/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res) => {
  try {
    const lang = req.language || 'en';

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: getTranslation(lang, 'blogNotFound')
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Get all blogs (for admin - includes unpublished)
// @route   GET /api/admin/blog
// @access  Private/Admin
exports.getAllBlogs = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Get single blog by ID (for admin)
// @route   GET /api/admin/blog/:id
// @access  Private/Admin
exports.getBlogById = async (req, res) => {
  try {
    const lang = req.language || 'en';

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: getTranslation(lang, 'blogNotFound')
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};