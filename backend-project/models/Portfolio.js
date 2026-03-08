const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    description:{ type: String, trim: true },
    image:      { type: String },
    imageId:    { type: String },
    category:   { type: String, index: true, trim: true },
    client:     { type: String, trim: true },
    projectUrl: { type: String },
    isActive:   { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Compound indexes
portfolioSchema.index({ category: 1, isActive: 1 });
portfolioSchema.index({ isActive: 1, createdAt: -1 });

// Full-text search
portfolioSchema.index({ title: 'text', description: 'text', client: 'text' });

portfolioSchema.virtual('hasImage').get(function () {
  return !!this.image;
});

portfolioSchema.set('toJSON', { virtuals: true });
portfolioSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);