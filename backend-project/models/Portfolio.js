const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  slug:       { type: String, required: true, unique: true },

  // Deskripsi
  shortDesc:  { type: String, default: '' },  // tampil di card
  longDesc:   { type: String, default: '' },  // tampil di detail page

  category:   { type: String, default: '' },
  isActive:   { type: Boolean, default: true },

  // Images — thumbnail (card) & heroImage (detail fullscreen)
  thumbnail:  { type: String, default: '' },
  heroImage:  { type: String, default: '' },

  // Project Info section
  client:     { type: String, default: '' },
  year:       { type: String, default: '' },
  duration:   { type: String, default: '' },
  role:       { type: String, default: '' },
  techStack:  [{ type: String }],

  // Case Study section
  challenge:  { type: String, default: '' },
  solution:   { type: String, default: '' },
  result:     { type: String, default: '' },

  // Key Metrics
  metrics:    [metricSchema],

  // Gallery (optional)
  gallery:    [{ type: String }],

  // Project URL (optional)
  projectUrl: { type: String, default: '' },

}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);