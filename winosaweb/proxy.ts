import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "nl", "id"];
const DEFAULT_LOCALE = "en";

/**
 * Locale Proxy
 * Handles redirection and ensures the site starts at the 'about' page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and internal next paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const locale = LOCALES.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  // 1. If it's the root "/", redirect to /about in detected or default locale
  if (pathname === "/") {
    const detected = LOCALES.find(l => request.cookies.get("locale")?.value === l) || DEFAULT_LOCALE;
    return NextResponse.redirect(new URL(`/${detected}/about`, request.url));
  }

  // 2. If it's just a locale (e.g., /en), redirect to /en/about
  if (locale && (pathname === `/${locale}` || pathname === `/${locale}/`)) {
    return NextResponse.redirect(new URL(`/${locale}/about`, request.url));
  }

  // 3. If it already has a locale and a path (e.g., /en/Services), let it through
  if (locale) {
    return NextResponse.next();
  }

  // 4. If no locale (e.g., /Contact), redirect to /en/Contact
  return NextResponse.redirect(new URL(`/en${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
}
