const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  // Hero
  heroLabel:      { type: String, default: '' },
  heroTitle:      { type: String, default: '' },
  heroDesc:       { type: String, default: '' },
  scenario1Title: { type: String, default: '' },
  scenario1Desc:  { type: String, default: '' },
  scenario2Title: { type: String, default: '' },
  scenario2Desc:  { type: String, default: '' },

  // Stats
  stats: { type: mongoose.Schema.Types.Mixed, default: [] },

  // Story
  ourStoryLabel: { type: String, default: '' },
  storyTitle:    { type: String, default: '' },
  storyP1:       { type: String, default: '' },
  storyP2:       { type: String, default: '' },
  storyP3:       { type: String, default: '' },
  serviceTags:   { type: [String], default: [] },
  clientFocus:   { type: String, default: '' },

  // Values
  whatDrivesUs:   { type: String, default: '' },
  ourCoreValues:  { type: String, default: '' },
  coreValuesDesc: { type: String, default: '' },
  values:         { type: mongoose.Schema.Types.Mixed, default: [] },

  // Direction
  directionLabel: { type: String, default: '' },
  missionTitle:   { type: String, default: '' },
  missionDesc:    { type: String, default: '' },
  visionTitle:    { type: String, default: '' },
  visionDesc:     { type: String, default: '' },
  whyUs:          { type: mongoose.Schema.Types.Mixed, default: [] },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);