const Subscription = require('../../models/Subscription');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');

// @desc    Get all subscriptions (admin - includes inactive)
// @route   GET /api/admin/subscriptions
// @access  Private/Admin
exports.getAllSubscriptions = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }
  if (req.query.duration) {
    filter.duration = req.query.duration;
  }

  const subscriptions = await Subscription.find(filter).sort({ price: 1 });

  res.json({
    success: true,
    count: subscriptions.length,
    data: subscriptions
  });
});

// @desc    Get single subscription by ID
// @route   GET /api/admin/subscriptions/:id
// @access  Private/Admin
exports.getSubscriptionById = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(new ErrorResponse('Subscription not found', 404));
  }

  res.json({
    success: true,
    data: subscription
  });
});

// @desc    Create new subscription
// @route   POST /api/admin/subscriptions
// @access  Private/Admin
exports.createSubscription = asyncHandler(async (req, res, next) => {
  const { name, price, duration, features, isPopular, isActive } = req.body;

  const subscription = await Subscription.create({
    name,
    price,
    duration,
    features: features || [],
    isPopular: isPopular || false,
    isActive: isActive !== undefined ? isActive : true
  });

  res.status(201).json({
    success: true,
    message: 'Subscription created successfully',
    data: subscription
  });
});

// @desc    Update subscription
// @route   PUT /api/admin/subscriptions/:id
// @access  Private/Admin
exports.updateSubscription = asyncHandler(async (req, res, next) => {
  let subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(new ErrorResponse('Subscription not found', 404));
  }

  subscription = await Subscription.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Subscription updated successfully',
    data: subscription
  });
});

// @desc    Delete subscription
// @route   DELETE /api/admin/subscriptions/:id
// @access  Private/Admin
exports.deleteSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(new ErrorResponse('Subscription not found', 404));
  }

  await Subscription.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Subscription deleted successfully'
  });
});