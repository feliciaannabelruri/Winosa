const Portfolio = require('../../models/Portfolio');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { uploadSingle, uploadToImageKit, deleteFromImageKit } = require('../../config/imagekit');
const { cache } = require('../../utils/cache');

// Helper: bungkus callback multer jadi Promise (wajib untuk Express 5)
const runUpload = (req, res) =>
  new Promise((resolve, reject) => {
    uploadSingle(req, res, (err) => {
      if (err) return reject(new ErrorResponse(err.message, 400));
      resolve();
    });
  });

// Helper: parse JSON string array fields dari FormData
const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return []; }
};

const CACHE_PREFIX = 'portfolio';

// @desc    Create new portfolio
// @route   POST /api/admin/portfolio
// @access  Private/Admin
exports.createPortfolio = asyncHandler(async (req, res, next) => {
  await runUpload(req, res);

  const {
    title, slug,
    description, shortDesc, longDesc,
    category, client, year, duration, role, projectUrl,
    challenge, solution, result,
    heroImage, thumbnail,
    isActive,
  } = req.body;

  const existingPortfolio = await Portfolio.findOne({ slug }).lean();
  if (existingPortfolio) {
    return next(new ErrorResponse('Portfolio with this slug already exists', 400));
  }

  // Image: prioritas req.file → thumbnail field → image field (backward compat)
  let imageUrl = thumbnail || req.body.image || null;
  let imageId  = null;

  if (req.file) {
    const uploadResult = await uploadToImageKit(req.file, 'portfolio');
    imageUrl = uploadResult.url;
    imageId  = uploadResult.fileId;
  }

  const portfolio = await Portfolio.create({
    title,
    slug,
    description: shortDesc || description || '',
    shortDesc:   shortDesc || description || '',
    longDesc:    longDesc  || '',
    image:       imageUrl,
    imageId,
    thumbnail:   thumbnail || imageUrl,
    heroImage:   heroImage || '',
    category,
    client:      client     || '',
    year:        year       || new Date().getFullYear().toString(),
    duration:    duration   || '',
    role:        role       || '',
    projectUrl:  projectUrl || '',
    challenge:   challenge  || '',
    solution:    solution   || '',
    result:      result     || '',
    techStack:   parseArrayField(req.body.techStack),
    metrics:     parseArrayField(req.body.metrics),
    gallery:     parseArrayField(req.body.gallery),
    isActive:    isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
  });

  cache.invalidatePrefix(CACHE_PREFIX);

  res.status(201).json({
    success: true,
    message: 'Portfolio created successfully',
    data: portfolio,
  });
});

// @desc    Update portfolio
// @route   PUT /api/admin/portfolio/:id
// @access  Private/Admin
exports.updatePortfolio = asyncHandler(async (req, res, next) => {
  // Gunakan runUpload (Promise) — wajib untuk Express 5, callback style tidak kompatibel
  await runUpload(req, res);

  const lang = req.language || 'en';

  let portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) {
    return next(new ErrorResponse(getTranslation(lang, 'portfolioNotFound'), 404));
  }

  // Cek slug duplicate kalau diubah
  if (req.body.slug && req.body.slug !== portfolio.slug) {
    const existing = await Portfolio.findOne({ slug: req.body.slug }).lean();
    if (existing) {
      return next(new ErrorResponse('Portfolio with this slug already exists', 400));
    }
  }

  // Parse JSON string array fields
  if (req.body.techStack) req.body.techStack = parseArrayField(req.body.techStack);
  if (req.body.metrics)   req.body.metrics   = parseArrayField(req.body.metrics);
  if (req.body.gallery)   req.body.gallery   = parseArrayField(req.body.gallery);

  // Sinkronisasi shortDesc ↔ description (backward compat)
  if (req.body.shortDesc && !req.body.description) {
    req.body.description = req.body.shortDesc;
  } else if (req.body.description && !req.body.shortDesc) {
    req.body.shortDesc = req.body.description;
  }

  // Handle image:
  // 1. File baru di request → upload ke ImageKit, hapus yang lama
  // 2. req.body.thumbnail ada → pakai itu (URL dari ImageUpload)
  // 3. Tidak ada keduanya → jangan ubah image existing
  if (req.file) {
    if (portfolio.imageId) {
      try { await deleteFromImageKit(portfolio.imageId); } catch (e) {
        console.log('Error deleting old image:', e.message);
      }
    }
    const uploadResult = await uploadToImageKit(req.file, 'portfolio');
    req.body.image     = uploadResult.url;
    req.body.thumbnail = uploadResult.url;
    req.body.imageId   = uploadResult.fileId;
  } else if (req.body.thumbnail) {
    // URL dari ImageUpload component
    req.body.image = req.body.thumbnail;
  } else if (!req.body.image) {
    // Tidak ada perubahan → hapus dari body agar tidak overwrite
    delete req.body.image;
    delete req.body.thumbnail;
    delete req.body.imageId;
  }

  // Normalize isActive string → boolean
  if (typeof req.body.isActive === 'string') {
    req.body.isActive = req.body.isActive === 'true';
  }

  portfolio = await Portfolio.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  cache.invalidatePrefix(CACHE_PREFIX);

  res.json({
    success: true,
    message: 'Portfolio updated successfully',
    data: portfolio,
  });
});

// @desc    Delete portfolio
// @route   DELETE /api/admin/portfolio/:id
// @access  Private/Admin
exports.deletePortfolio = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) {
    return next(new ErrorResponse(getTranslation(lang, 'portfolioNotFound'), 404));
  }

  if (portfolio.imageId) {
    try { await deleteFromImageKit(portfolio.imageId); } catch (e) {
      console.log('Error deleting image:', e.message);
    }
  }

  await Portfolio.findByIdAndDelete(req.params.id);
  cache.invalidatePrefix(CACHE_PREFIX);

  res.json({ success: true, message: 'Portfolio deleted successfully' });
});

// @desc    Get all portfolios (admin - includes inactive)
// @route   GET /api/admin/portfolio
// @access  Private/Admin
exports.getAllPortfolios = asyncHandler(async (req, res, next) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip  = (page - 1) * limit;

  let filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const sortField = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.order  === 'asc' ? 1 : -1;

  const [total, portfolios] = await Promise.all([
    Portfolio.countDocuments(filter),
    Portfolio.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip).limit(limit).lean(),
  ]);

  res.json({
    success: true,
    count: portfolios.length,
    total, page,
    pages:       Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
    data: portfolios,
  });
});

// @desc    Get single portfolio by ID (admin)
// @route   GET /api/admin/portfolio/:id
// @access  Private/Admin
exports.getPortfolioById = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findById(req.params.id).lean();

  if (!portfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  res.json({ success: true, data: portfolio });
});