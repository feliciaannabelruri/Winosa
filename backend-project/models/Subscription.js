const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    index: true,
  },
  duration: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly'],
    index: true,
  },
  features: [String],
  isPopular: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
subscriptionSchema.index({ isActive: 1, price: 1 });    // active plans sorted by price
subscriptionSchema.index({ duration: 1, isActive: 1 }); // filter monthly/yearly active

module.exports = mongoose.model('Subscription', subscriptionSchema);