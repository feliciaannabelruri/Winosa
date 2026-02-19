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
    index: true
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
    index: true
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number, // in minutes
    default: 0
  }
}, {
  timestamps: true
});

// Compound indexes
blogSchema.index({ isPublished: 1, createdAt: -1 });
blogSchema.index({ author: 1, isPublished: 1 });
blogSchema.index({ tags: 1 });

// Text search index
blogSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text',
  author: 'text'
});

// Calculate read time before saving
blogSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Virtual for excerpt if not provided
blogSchema.virtual('autoExcerpt').get(function() {
  if (this.excerpt) return this.excerpt;
  return this.content.substring(0, 150) + '...';
});

blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Blog', blogSchema);