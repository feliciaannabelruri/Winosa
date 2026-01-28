const Subscription = require('../models/Subscription');

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Public
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ isActive: true }).sort({ price: 1 });
    
    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single subscription by id
// @route   GET /api/subscriptions/:id
// @access  Public
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};