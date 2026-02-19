const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true // Add index
  },
  content: {
    type: String,
    required: true
  },
  excerpt: String,
  image: String,
  imageId: String,
  author: {
    type: String,
    index: true // Add index for author filter
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true,
    index: true // Add index
  }
}, {
  timestamps: true
});

// Compound index
blogSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);