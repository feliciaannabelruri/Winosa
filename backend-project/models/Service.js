const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  icon: String,
  features: [String],
  price: String,
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
serviceSchema.index({ isActive: 1, order: 1 });
serviceSchema.index({ createdAt: -1 });

// Text search
serviceSchema.index({ 
  title: 'text', 
  description: 'text' 
});

// Virtual for feature count
serviceSchema.virtual('featureCount').get(function() {
  return this.features ? this.features.length : 0;
});

serviceSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Service', serviceSchema);