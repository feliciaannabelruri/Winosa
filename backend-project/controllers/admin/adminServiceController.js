const Service = require('../../models/Service');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { cache } = require('../../utils/cache');

const CACHE_PREFIX = 'service';

// @desc    Create new service
// @route   POST /api/admin/services
// @access  Private/Admin
exports.createService = asyncHandler(async (req, res, next) => {
  const { slug } = req.body;

  const existingService = await Service.findOne({ slug }).lean();
  if (existingService) {
    return next(new ErrorResponse('Service with this slug already exists', 400));
  }

  // Langsung pakai req.body — semua field dari form diteruskan ke model
  // Model yang handle field apa saja yang valid
  const service = await Service.create(req.body);

  cache.invalidatePrefix(CACHE_PREFIX);

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service,
  });
});

// @desc    Get service by ID
// @route   GET /api/admin/services/:id
// @access  Private/Admin
exports.getServiceById = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id).lean();

  if (!service) {
    return next(new ErrorResponse('Service not found', 404));
  }

  res.json({ success: true, data: service });
});

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
exports.updateService = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  let service = await Service.findById(req.params.id);
  if (!service) {
    return next(new ErrorResponse(getTranslation(lang, 'serviceNotFound'), 404));
  }

  // Cek slug duplicate kalau diubah
  if (req.body.slug && req.body.slug !== service.slug) {
    const existing = await Service.findOne({ slug: req.body.slug }).lean();
    if (existing) {
      return next(new ErrorResponse('Service with this slug already exists', 400));
    }
  }

  // Langsung update dengan semua field dari req.body
  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  cache.invalidatePrefix(CACHE_PREFIX);

  res.json({
    success: true,
    message: 'Service updated successfully',
    data: service,
  });
});

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
exports.deleteService = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  const service = await Service.findById(req.params.id);
  if (!service) {
    return next(new ErrorResponse(getTranslation(lang, 'serviceNotFound'), 404));
  }

  await Service.findByIdAndDelete(req.params.id);

  cache.invalidatePrefix(CACHE_PREFIX);

  res.json({ success: true, message: 'Service deleted successfully' });
});

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private/Admin
exports.getAllServices = asyncHandler(async (req, res, next) => {
  const filter = {};
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const services = await Service.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .lean();

  res.json({
    success: true,
    count: services.length,
    data: services,
  });
});