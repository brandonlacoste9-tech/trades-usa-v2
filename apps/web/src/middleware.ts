import { NextResponse, type NextRequest } from "next/server";

const defaultLocale = "en";
const locales = ["en"];

function isValidLang(lang: string): boolean {
  return locales.includes(lang);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Skip static assets, API routes, and Next.js internals ──
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ── i18n redirect: / → /en ──
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // ── Validate locale prefix ──
  const segments = pathname.split("/");
  const potentialLang = segments[1] ?? "";

  if (potentialLang && !isValidLang(potentialLang)) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
