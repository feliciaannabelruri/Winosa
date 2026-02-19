const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
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
  description: String,
  image: String,
  imageId: String,
  category: {
    type: String,
    index: true
  },
  client: String,
  projectUrl: String,
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes
portfolioSchema.index({ category: 1, isActive: 1 });
portfolioSchema.index({ createdAt: -1 });

// Text search index (untuk search functionality)
portfolioSchema.index({ 
  title: 'text', 
  description: 'text', 
  client: 'text' 
});

// Virtual for image count (jika nanti ada multiple images)
portfolioSchema.virtual('hasImage').get(function() {
  return !!this.image;
});

// Ensure virtuals are included in JSON
portfolioSchema.set('toJSON', { virtuals: true });
portfolioSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);