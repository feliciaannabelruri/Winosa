import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "nl", "id"];
const DEFAULT_LOCALE = "en";

/**
 * Locale Middleware
 * Handles redirection and ensures the site starts at the 'about' page.
 */
export function middleware(request: NextRequest) {
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

  // Split path into segments to analyze the locale
  const segments = pathname.split("/");
  const firstSegment = segments[1];
  const isTwoLetter = /^[a-z]{2}$/i.test(firstSegment);

  // 1. If it's the root "/", redirect to /about in detected or default locale
  if (pathname === "/") {
    const detected = LOCALES.find(l => request.cookies.get("locale")?.value === l) || DEFAULT_LOCALE;
    return NextResponse.redirect(new URL(`/${detected}/about`, request.url));
  }

  // 2. If it already has a 2-letter locale prefix
  if (isTwoLetter) {
    // If it's id or nl, or the default en, let it through
    if (firstSegment === "id" || firstSegment === "nl" || firstSegment === "en") {
      // If it's just the locale (e.g., /en or /nl), redirect to /about
      if (segments.length === 2 || (segments.length === 3 && segments[2] === "")) {
        return NextResponse.redirect(new URL(`/${firstSegment}/about`, request.url));
      }
      return NextResponse.next();
    } else {
      // For any other 2-letter locale (e.g. /fr/about), redirect to /en/about
      const remaining = segments.slice(2).join("/");
      return NextResponse.redirect(new URL(`/en/${remaining}`, request.url));
    }
  }

  // 3. If there is no locale prefix at all (e.g., /Contact), redirect to /en/Contact
  return NextResponse.redirect(new URL(`/en${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
}
