import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, LANG_COOKIE, isLanguage, type Language } from "@/i18n/config";

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
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
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
  const lang = langFromPath(request.nextUrl.pathname) ?? preferred;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-lang", lang);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
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
