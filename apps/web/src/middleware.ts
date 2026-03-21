import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isValidLang } from "@/lib/i18n";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Skip static assets and API routes ──
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

  const lang = isValidLang(potentialLang) ? potentialLang : defaultLocale;

  // ── Supabase auth session refresh (graceful — skip if env vars missing) ──
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // No Supabase config — allow all requests through
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ── Protect dashboard and settings routes ──
    const protectedPaths = [`/${lang}/dashboard`, `/${lang}/settings`];
    const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

    if (isProtected && !user) {
      return NextResponse.redirect(new URL(`/${lang}/auth`, request.url));
    }

    // ── Redirect authenticated users away from auth page ──
    if (pathname === `/${lang}/auth` && user) {
      return NextResponse.redirect(
        new URL(`/${lang}/dashboard`, request.url)
      );
    }
  } catch {
    // Supabase error — fail open, let the page render
    return NextResponse.next();
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
