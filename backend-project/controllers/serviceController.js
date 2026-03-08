const Service = require('../models/Service');
const { cache } = require('../utils/cache');

const CACHE_TTL = 600; // 10 minutes — services rarely change

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const cacheKey = 'service:all:active';
    const cached = cache.get(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const response = { success: true, count: services.length, data: services };
    cache.set(cacheKey, response, CACHE_TTL);
    res.setHeader('X-Cache', 'MISS');
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single service by slug
// @route   GET /api/services/:slug
// @access  Public
exports.getServiceBySlug = async (req, res) => {
  try {
    const cacheKey = `service:slug:${req.params.slug}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const service = await Service.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const response = { success: true, data: service };
    cache.set(cacheKey, response, CACHE_TTL);
    res.setHeader('X-Cache', 'MISS');
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};