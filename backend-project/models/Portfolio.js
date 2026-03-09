const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },

    // Description
    description:{ type: String, trim: true }, 
    shortDesc:  { type: String, trim: true },
    longDesc:   { type: String, trim: true },

    // Images
    image:      { type: String }, 
    imageId:    { type: String },
    thumbnail:  { type: String },
    heroImage:  { type: String },

    // Project Info
    category:   { type: String, index: true, trim: true },
    client:     { type: String, trim: true },
    year:       { type: String, trim: true },
    duration:   { type: String, trim: true },
    role:       { type: String, trim: true },
    projectUrl: { type: String },

    // Tech Stack
    techStack:  { type: [String], default: [] },

    // Case Study
    challenge:  { type: String, trim: true },
    solution:   { type: String, trim: true },
    result:     { type: String, trim: true },

    // Metrics
    metrics: [{
      value: { type: String },
      label: { type: String },
    }],

    // Gallery
    gallery:    { type: [String], default: [] },

    isActive:   { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Compound indexes
portfolioSchema.index({ category: 1, isActive: 1 });
portfolioSchema.index({ isActive: 1, createdAt: -1 });

// Full-text search
portfolioSchema.index({ title: 'text', shortDesc: 'text', description: 'text', client: 'text' });

portfolioSchema.virtual('hasImage').get(function () {
  return !!(this.thumbnail || this.image);
});

portfolioSchema.set('toJSON', { virtuals: true });
portfolioSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);