/**
 * SiteSettings — shared type for winosaweb (user side).
 *
 * Must stay in sync with:
 *   winosa-admin → src/services/settingsService.ts
 *   backend      → models/Settings
 */
export interface SiteSettings {
  _id?:       string;
  updatedAt?: string;
  // General
  siteName:    string;
  siteTagline: string;
  logo?:       string;
  // SEO
  metaTitle:         string;
  metaDescription:   string;
  metaKeywords:      string;
  googleAnalyticsId: string;
  // Social
  socialInstagram: string;
  socialFacebook:  string;
  socialLinkedin:  string;
  socialYoutube:   string;
  socialWhatsapp:  string;   // digits only, e.g. "6281234567890"
  // Contact
  siteEmail:   string;
  sitePhone:   string;
  siteAddress: string;
}