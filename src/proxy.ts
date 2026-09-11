import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, LANG_COOKIE, isLanguage, type Language } from "@/i18n/config";
import { LOCALIZED_PATHS, localePath } from "@/lib/i18n/paths";

// Runs on every page request (not /api, not static assets). Two jobs:
//  1. Generate a per-request CSP nonce (strict CSP without 'unsafe-inline' scripts).
//  2. Resolve the visitor's language (URL prefix > cookie > Accept-Language) and
//     forward it as `x-lang` so the root layout can server-render the right
//     language and text direction on first paint.

function detectFromAcceptLanguage(header: string | null): Language {
  if (!header) return DEFAULT_LANG;
  for (const part of header.split(",")) {
    const code = part.trim().split(";")[0].split("-")[0].toLowerCase();
    if (isLanguage(code)) return code;
  }
  return DEFAULT_LANG;
}

/** `/ar/...` and `/tr/...` (blog) are URL-driven; the URL wins over the cookie. */
function langFromPath(pathname: string): Language | null {
  const seg = pathname.split("/")[1];
  return seg && seg !== DEFAULT_LANG && isLanguage(seg) ? seg : null;
}

export function proxy(request: NextRequest) {
  // One hostname for the site. www serves the same pages, so without this the
  // content would exist at two addresses and any link to www would build
  // authority for a hostname we don't rank.
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const apex = request.nextUrl.clone();
    apex.host = host.slice(4);
    return NextResponse.redirect(apex, 308);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://*.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https:",
    "font-src 'self' data:",
    // Google Analytics 4 sends its hits to these hosts.
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const cookieLang = request.cookies.get(LANG_COOKIE)?.value;
  const preferred: Language = isLanguage(cookieLang)
    ? cookieLang
    : detectFromAcceptLanguage(request.headers.get("accept-language"));
  const pathLang = langFromPath(request.nextUrl.pathname);
  const lang = pathLang ?? preferred;

  // Each language now has its own URL. When a visitor whose language is not
  // English lands on a bare marketing path, send them to that page's own URL
  // instead of quietly serving different content at the same address — which
  // left "/" looking like three different pages to a crawler, and gave the
  // Arabic and Turkish versions no address to be indexed under.
  // Crawlers (no Accept-Language, or English) are never redirected, so "/" is
  // unambiguously the English page.
  if (!pathLang && preferred !== DEFAULT_LANG) {
    const path = request.nextUrl.pathname.replace(/(.)\/$/, "$1");
    if ((LOCALIZED_PATHS as readonly string[]).includes(path || "/")) {
      const url = request.nextUrl.clone();
      url.pathname = localePath(preferred, path || "/");
      const redirect = NextResponse.redirect(url, 307);
      redirect.headers.set("Vary", "Accept-Language, Cookie");
      if (!isLanguage(cookieLang)) {
        redirect.cookies.set(LANG_COOKIE, preferred, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
      }
      return redirect;
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-lang", lang);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  // The bare paths can redirect by language, so caches must key on that.
  if (!pathLang) response.headers.set("Vary", "Accept-Language, Cookie");
  if (!isLanguage(cookieLang)) {
    response.cookies.set(LANG_COOKIE, preferred, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: [
    // Everything except API routes, Next internals and static files with an extension.
    "/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|woff2|ttf|ico|txt|xml)$).*)",
  ],
};
