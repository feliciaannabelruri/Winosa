export const PORTFOLIO_CATEGORIES = [
  'Web Application',
  'Mobile App',
  'UI/UX Design',
  'Enterprise Software',
] as const;

export type PortfolioCategory = typeof PORTFOLIO_CATEGORIES[number];