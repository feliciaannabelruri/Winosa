const mongoose = require('mongoose');

/**
 * SiteSettings — singleton document (only one record per app).
 * Frontend SettingsPage.tsx expects GET/PUT /api/admin/settings.
 */
const siteSettingsSchema = new mongoose.Schema({
  siteTitle:          { type: String, default: '' },
  siteDescription:    { type: String, default: '' },
  logo:               { type: String, default: null },   // ImageKit URL
  logoId:             { type: String, default: null },   // ImageKit fileId

  // SEO
  metaTitle:          { type: String, default: '' },
  metaDescription:    { type: String, default: '' },
  metaKeywords:       { type: String, default: '' },

  // Social
  instagram:          { type: String, default: '' },
  linkedin:           { type: String, default: '' },
  facebook:           { type: String, default: '' },
  twitter:            { type: String, default: '' },
  youtube:            { type: String, default: '' },

  // Contact
  email:              { type: String, default: '' },
  phone:              { type: String, default: '' },
  whatsapp:           { type: String, default: '' },
  address:            { type: String, default: '' },

  // Analytics
  googleAnalyticsId:  { type: String, default: '' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);