const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
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
newsletterSchema.index({ isActive: 1, createdAt: -1 }); // active list sorted by newest

module.exports = mongoose.model('Newsletter', newsletterSchema);