import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { syne, dmSans, changa } from "@/lib/fonts";
import { DEFAULT_LANG, dirFor, isLanguage, type Language } from "@/i18n/config";
import { getAdminContent } from "@/lib/data/admin-content";
import { Providers } from "./providers";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://admov.io";
const DEFAULT_TITLE = "ADMOV — Let AI do the Work";
const DEFAULT_DESCRIPTION =
  "AI-powered video production, photography, automation & e-commerce solutions for modern brands.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s | ADMOV" },
  description:
    "We combine cutting-edge AI technology with creative strategy to help your business scale faster and smarter.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ADMOV",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Set by src/proxy.ts: URL prefix > cookie > Accept-Language.
  const requestHeaders = await headers();
  const headerLang = requestHeaders.get("x-lang");
  const lang: Language = isLanguage(headerLang) ? headerLang : DEFAULT_LANG;
  const adminContent = await getAdminContent();

  return (
    <html
      lang={lang}
      dir={dirFor(lang)}
      className={`${syne.variable} ${dmSans.variable} ${changa.variable} ${lang}`}
      suppressHydrationWarning
    >
      <body className={`bg-zinc-950 text-zinc-50 antialiased lang-${lang}`} suppressHydrationWarning>
        <Providers initialLang={lang} adminContent={adminContent}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
