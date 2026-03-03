const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  subject: String,
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
contactSchema.index({ createdAt: -1 });            // default sort
contactSchema.index({ isRead: 1, createdAt: -1 }); // unread filter + sort

module.exports = mongoose.model('Contact', contactSchema);