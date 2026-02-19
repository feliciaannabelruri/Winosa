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
    index: true // Add index for faster queries
  },
  description: String,
  image: String,
  imageId: String,
  category: {
    type: String,
    index: true // Add index for category filter
  },
  client: String,
  projectUrl: String,
  isActive: {
    type: Boolean,
    default: true,
    index: true // Add index for filtering active/inactive
  }
}, {
  timestamps: true
});

// Compound index for common queries
portfolioSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);