export type ProcessStep = {
  highlight: string;
  title: string;
  desc: string;
};

export type TechGroup = {
  category: string;
  tech: string[];
};

export type MobileFeature = {
  title: string;
  desc: string;
};

export type MobileTechItem = {
  title: string;
  desc: string;
  items: string[];
};

export type PricingPlan = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  type: 'normal' | 'custom';
  ctaLink?: string;
};

export type ServiceFormState = {
  // ── Base ────────────────────────────────────────────
  title:            string;
  slug:             string;
  description:      string;
  icon:             string;
  price:            string;
  features:         string[];
  isActive:         boolean;
  whatsappNumber:   string;   // shared WA number for all CTA buttons

  // ── Web Development ─────────────────────────────────
  heroImage:        string;
  subtitle:         string;
  ctaText:          string;
  ctaLink:          string;
  processTitle:     string;
  processSubtitle:  string;
  process:          ProcessStep[];
  techTitle:        string;
  techSubtitle:     string;
  techStack:        TechGroup[];
  webPricingPlans:  PricingPlan[];

  // ── Mobile App ───────────────────────────────────────
  heroLabel:              string;
  heroImagePrimary:       string;
  heroImageSecondary:     string;
  mobileFeatureTitle:     string;
  mobileFeatureSubtitle:  string;
  mobileFeatures:         MobileFeature[];
  mobileTechTitle:        string;
  mobileTechSubtitle:     string;
  mobileTech:             MobileTechItem[];
  mobilePricingPlans:     PricingPlan[];

  // ── UI/UX ────────────────────────────────────────────
  heroLeftImage:    string;
  heroRightImage:   string;
  techDescription:  string;
  tools:            string[];
  uiuxPricingPlans: PricingPlan[];
};

export const DETAIL_SLUGS = [
  'web-development',
  'mobile-app-development',
  'ui-ux-design',
] as const;

export type DetailSlug = typeof DETAIL_SLUGS[number];

export const DETAIL_SLUG_META: Record<DetailSlug, { label: string; color: string }> = {
  'web-development':        { label: 'Web Dev', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'mobile-app-development': { label: 'Mobile',  color: 'bg-green-100 text-green-700 border-green-200' },
  'ui-ux-design':           { label: 'UI/UX',   color: 'bg-purple-100 text-purple-700 border-purple-200' },
};

// ── Default pricing plans per slug ─────────────────────────────────────────────
export const DEFAULT_WEB_PLANS: PricingPlan[] = [
  {
    name: 'Starter', price: '$999', type: 'normal',
    desc: 'Professional service package.',
    features: ['Responsive Website', 'Modern UI Design', 'Basic SEO Setup', 'Contact Form Integration'],
  },
  {
    name: 'Business', price: '$1,499', type: 'normal',
    desc: 'Extended features for growing companies.',
    features: ['Advanced SEO', 'Performance Optimization', 'Analytics Integration', 'Priority Support'],
  },
  {
    name: 'Enterprise', price: 'Custom', type: 'custom',
    desc: 'Fully customized solution tailored to your needs.',
    features: ['Custom Architecture', 'Dedicated Support', 'Scalable Infrastructure', 'Advanced Security'],
    ctaLink: '/Services/customWeb',
  },
];

export const DEFAULT_MOBILE_PLANS: PricingPlan[] = [
  {
    name: 'Starter App', price: '$499', type: 'normal',
    desc: 'Best for MVP, startup ideas, and simple mobile apps.',
    features: ['Single platform (Android or iOS)', 'Modern UI design', 'Basic navigation flow', 'API integration', 'Basic testing & deployment'],
  },
  {
    name: 'Business App', price: '$1,299', type: 'normal',
    desc: 'Perfect for growing businesses and production-ready apps.',
    features: ['Android & iOS app', 'Custom UI/UX design', 'User authentication system', 'Backend & database integration', 'Performance optimization'],
  },
  {
    name: 'Enterprise App', price: 'Custom', type: 'custom',
    desc: 'For complex systems, high traffic, and scalable platforms.',
    features: ['Advanced app architecture', 'Custom backend & API', 'Payment / booking system', 'Security & scalability setup', 'Dedicated development team'],
    ctaLink: '/Services/customMobile',
  },
];

export const DEFAULT_UIUX_PLANS: PricingPlan[] = [
  {
    name: 'UI Basic', price: '$199', type: 'normal',
    desc: 'Perfect for landing page or small project.',
    features: ['1-3 Pages Design', 'Wireframe + High Fidelity', 'Responsive Layout', 'Design System Basic', '3 Days Delivery'],
  },
  {
    name: 'UI/UX Pro', price: '$599', type: 'normal',
    desc: 'Best for startup and growing business.',
    features: ['Up to 10 Pages', 'User Flow & Wireframe', 'Full Design System', 'Interactive Prototype', 'Free Revision 2x'],
  },
  {
    name: 'Enterprise UX', price: 'Custom', type: 'custom',
    desc: 'For complex system & mobile apps.',
    features: ['App / Dashboard Design', 'User Research', 'UX Strategy', 'Full Prototype', 'Developer Handoff'],
    ctaLink: '/Services/customUi',
  },
];

export const DEFAULT_FORM: ServiceFormState = {
  title: '', slug: '', description: '', icon: '', price: '',
  features: [], isActive: true, whatsappNumber: '',
  heroImage: '', subtitle: '', ctaText: '', ctaLink: '',
  processTitle: '', processSubtitle: '', process: [],
  techTitle: '', techSubtitle: '', techStack: [],
  webPricingPlans: DEFAULT_WEB_PLANS,
  heroLabel: '', heroImagePrimary: '', heroImageSecondary: '',
  mobileFeatureTitle: '', mobileFeatureSubtitle: '', mobileFeatures: [],
  mobileTechTitle: '', mobileTechSubtitle: '', mobileTech: [],
  mobilePricingPlans: DEFAULT_MOBILE_PLANS,
  heroLeftImage: '', heroRightImage: '', techDescription: '', tools: [],
  uiuxPricingPlans: DEFAULT_UIUX_PLANS,
};

// Safely merge API response
export const mergeApiData = (s: any): ServiceFormState => ({
  title:           s.title           ?? '',
  slug:            s.slug            ?? '',
  description:     s.description     ?? '',
  icon:            s.icon            ?? '',
  price:           s.price           ?? '',
  features:        Array.isArray(s.features)         ? s.features         : [],
  isActive:        s.isActive        ?? true,
  whatsappNumber:  s.whatsappNumber  ?? '',
  heroImage:       s.heroImage       ?? '',
  subtitle:        s.subtitle        ?? '',
  ctaText:         s.ctaText         ?? '',
  ctaLink:         s.ctaLink         ?? '',
  processTitle:    s.processTitle    ?? '',
  processSubtitle: s.processSubtitle ?? '',
  process:         Array.isArray(s.process)           ? s.process          : [],
  techTitle:       s.techTitle       ?? '',
  techSubtitle:    s.techSubtitle    ?? '',
  techStack:       Array.isArray(s.techStack)         ? s.techStack        : [],
  webPricingPlans: Array.isArray(s.webPricingPlans)   ? s.webPricingPlans  : DEFAULT_WEB_PLANS,
  heroLabel:           s.heroLabel           ?? '',
  heroImagePrimary:    s.heroImagePrimary    ?? '',
  heroImageSecondary:  s.heroImageSecondary  ?? '',
  mobileFeatureTitle:    s.mobileFeatureTitle    ?? '',
  mobileFeatureSubtitle: s.mobileFeatureSubtitle ?? '',
  mobileFeatures:        Array.isArray(s.mobileFeatures)    ? s.mobileFeatures   : [],
  mobileTechTitle:       s.mobileTechTitle       ?? '',
  mobileTechSubtitle:    s.mobileTechSubtitle    ?? '',
  mobileTech:            Array.isArray(s.mobileTech)        ? s.mobileTech       : [],
  mobilePricingPlans:    Array.isArray(s.mobilePricingPlans)? s.mobilePricingPlans: DEFAULT_MOBILE_PLANS,
  heroLeftImage:   s.heroLeftImage   ?? '',
  heroRightImage:  s.heroRightImage  ?? '',
  techDescription: s.techDescription ?? '',
  tools:           Array.isArray(s.tools)            ? s.tools            : [],
  uiuxPricingPlans:Array.isArray(s.uiuxPricingPlans) ? s.uiuxPricingPlans : DEFAULT_UIUX_PLANS,
});