export const PORTFOLIO_CATEGORIES = [
  'Company Web',
  'Web Application',
  'Product/Platform',
  'UI/UX Design',
  'Enterprise Software',
] as const;

export type PortfolioCategory = typeof PORTFOLIO_CATEGORIES[number];