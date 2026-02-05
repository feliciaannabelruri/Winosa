const Service = require('../../models/Service');
const { getTranslation } = require('../../middleware/language');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');

// @desc    Create new service
// @route   POST /api/admin/services
// @access  Private/Admin
exports.createService = asyncHandler(async (req, res, next) => {
  const { title, slug, description, icon, features, price, isActive } = req.body;

  const existingService = await Service.findOne({ slug });
  if (existingService) {
    return next(new ErrorResponse('Service with this slug already exists', 400));
  }

  const service = await Service.create({
    title,
    slug,
    description,
    icon,
    features,
    price,
    isActive
  });

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
exports.updateService = asyncHandler(async (req, res, next) => {
  const lang = req.language || 'en';

  // Check if service exists
  let service = await Service.findById(req.params.id);
  
  if (!service) {
    return next(new ErrorResponse(getTranslation(lang, 'serviceNotFound'), 404));
  }

  // If updating slug, check if new slug already exists
  if (req.body.slug && req.body.slug !== service.slug) {
    const existingService = await Service.findOne({ slug: req.body.slug });
    if (existingService) {
      return next(new ErrorResponse('Service with this slug already exists', 400));
    }
  }

  // Update service
  service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    message: 'Service updated successfully',
    data: service
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

  res.json({
    success: true,
    message: 'Service deleted successfully'
  });
});

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private/Admin
exports.getAllServices = asyncHandler(async (req, res, next) => {
  const services = await Service.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    count: services.length,
    data: services
  });
});