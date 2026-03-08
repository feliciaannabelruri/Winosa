const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    icon:        { type: String },
    features:    { type: [String], default: [] },
    price:       { type: String },
    isActive:    { type: Boolean, default: true, index: true },
    order:       { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// Compound indexes
serviceSchema.index({ isActive: 1, order: 1 });
serviceSchema.index({ isActive: 1, createdAt: -1 });

// Full-text search
serviceSchema.index({ title: 'text', description: 'text' });

serviceSchema.virtual('featureCount').get(function () {
  return this.features ? this.features.length : 0;
});

serviceSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Service', serviceSchema);