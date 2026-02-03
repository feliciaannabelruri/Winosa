const Service = require('../../models/Service');
const { getTranslation } = require('../../middleware/language');

// @desc    Create new service
// @route   POST /api/admin/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const lang = req.language || 'en';
    const { title, slug, description, icon, features, price, isActive } = req.body;

    // Check if slug already exists
    const existingService = await Service.findOne({ slug });
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Service with this slug already exists'
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const lang = req.language || 'en';

    // Check if service exists
    let service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: getTranslation(lang, 'serviceNotFound')
      });
    }

    // If updating slug, check if new slug already exists
    if (req.body.slug && req.body.slug !== service.slug) {
      const existingService = await Service.findOne({ slug: req.body.slug });
      if (existingService) {
        return res.status(400).json({
          success: false,
          message: 'Service with this slug already exists'
        });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const lang = req.language || 'en';

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: getTranslation(lang, 'serviceNotFound')
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Get all services (for admin - includes inactive)
// @route   GET /api/admin/services
// @access  Private/Admin
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};