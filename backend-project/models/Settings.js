const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // General
  siteName:    { type: String, default: '' },
  siteTagline: { type: String, default: '' },
  siteEmail:   { type: String, default: '' },
  sitePhone:   { type: String, default: '' },
  siteAddress: { type: String, default: '' },
  logo:        { type: String, default: '' },
  logoId:      { type: String, default: '' },

  // Social Media
  socialInstagram: { type: String, default: '' },
  socialFacebook:  { type: String, default: '' },
  socialTwitter:   { type: String, default: '' },
  socialLinkedin:  { type: String, default: '' },
  socialYoutube:   { type: String, default: '' },
  socialWhatsapp:  { type: String, default: '' },

  // SEO
  metaTitle:          { type: String, default: '' },
  metaDescription:    { type: String, default: '' },
  metaKeywords:       { type: String, default: '' },
  googleAnalyticsId:  { type: String, default: '' },
 
  // Blog Page Hero
  blogHero: {
    badge:       { type: String, default: 'Our Blog' },
    title:       { type: String, default: 'Insights & Digital Ideas' },
    description: { type: String, default: 'Explore articles, insights, and updates from our team.' },
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);