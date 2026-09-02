import type { NextConfig } from "next";

// Static security headers. The Content-Security-Policy is generated per request
// (with a nonce) in src/proxy.ts, so it is deliberately not listed here.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray package-lock.json in the home directory otherwise confuses Turbopack's root detection.
  turbopack: { root: process.cwd() },
  // The blog OG images read this font at runtime (see src/lib/blog/og.tsx).
  outputFileTracingIncludes: {
    "/blog/[slug]/opengraph-image": ["./public/fonts/changa-800.ttf"],
    "/[lang]/blog/[slug]/opengraph-image": ["./public/fonts/changa-800.ttf"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
