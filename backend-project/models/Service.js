const mongoose = require('mongoose');

// ── Sub-schemas ────────────────────────────────────────────────────────────────

const ProcessStepSchema = new mongoose.Schema({
  highlight: { type: String, default: '' },
  title:     { type: String, default: '' },
  desc:      { type: String, default: '' },
}, { _id: false });

const TechGroupSchema = new mongoose.Schema({
  category: { type: String, default: '' },
  tech:     { type: [String], default: [] },
}, { _id: false });

const MobileFeatureSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  desc:  { type: String, default: '' },
}, { _id: false });

const MobileTechItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  desc:  { type: String, default: '' },
  items: { type: [String], default: [] },
}, { _id: false });

const PricingPlanSchema = new mongoose.Schema({
  name:     { type: String, default: '' },
  price:    { type: String, default: '' },
  desc:     { type: String, default: '' },
  features: { type: [String], default: [] },
  type:     { type: String, enum: ['normal', 'custom'], default: 'normal' },
  ctaLink:  { type: String, default: '' },
}, { _id: false });

// ── Main Schema ────────────────────────────────────────────────────────────────

const serviceSchema = new mongoose.Schema(
  {
    // ── Base ──────────────────────────────────────────────────────────────────
    title:          { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    description:    { type: String, required: true, trim: true },
    icon:           { type: String, default: '' },
    features:       { type: [String], default: [] },
    price:          { type: String, default: '' },
    isActive:       { type: Boolean, default: true, index: true },
    order:          { type: Number, default: 0, index: true },
    whatsappNumber: { type: String, default: '' },

    // ── Web Development ───────────────────────────────────────────────────────
    heroImage:        { type: String, default: '' },
    subtitle:         { type: String, default: '' },
    ctaText:          { type: String, default: '' },
    ctaLink:          { type: String, default: '' },
    processTitle:     { type: String, default: '' },
    processSubtitle:  { type: String, default: '' },
    process:          { type: [ProcessStepSchema], default: [] },
    techTitle:        { type: String, default: '' },
    techSubtitle:     { type: String, default: '' },
    techStack:        { type: [TechGroupSchema], default: [] },
    webPricingPlans:  { type: [PricingPlanSchema], default: [] },

    // ── Mobile App ────────────────────────────────────────────────────────────
    heroLabel:              { type: String, default: '' },
    heroImagePrimary:       { type: String, default: '' },
    heroImageSecondary:     { type: String, default: '' },
    mobileFeatureTitle:     { type: String, default: '' },
    mobileFeatureSubtitle:  { type: String, default: '' },
    mobileFeatures:         { type: [MobileFeatureSchema], default: [] },
    mobileTechTitle:        { type: String, default: '' },
    mobileTechSubtitle:     { type: String, default: '' },
    mobileTech:             { type: [MobileTechItemSchema], default: [] },
    mobilePricingPlans:     { type: [PricingPlanSchema], default: [] },

    // ── UI/UX ─────────────────────────────────────────────────────────────────
    heroLeftImage:    { type: String, default: '' },
    heroRightImage:   { type: String, default: '' },
    techDescription:  { type: String, default: '' },
    tools:            { type: [String], default: [] },
    uiuxPricingPlans: { type: [PricingPlanSchema], default: [] },
  },
  { timestamps: true }
);

// Indexes
serviceSchema.index({ isActive: 1, order: 1 });
serviceSchema.index({ isActive: 1, createdAt: -1 });
serviceSchema.index({ title: 'text', description: 'text' });

serviceSchema.virtual('featureCount').get(function () {
  return this.features ? this.features.length : 0;
});

serviceSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Service', serviceSchema);