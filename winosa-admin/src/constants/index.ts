/**
 * constants/index.ts
 * Single source of truth untuk konstanta yang dipakai lintas halaman.
 * Sebelumnya CATEGORIES didefinisikan dua kali secara berbeda di
 * PortfolioPage.tsx dan PortfolioFormPage.tsx → rawan tidak sinkron.
 */

export const PORTFOLIO_CATEGORIES = [
  'Web Application',
  'Mobile App',
  'UI/UX Design',
  'Branding',
] as const;

export type PortfolioCategory = typeof PORTFOLIO_CATEGORIES[number];