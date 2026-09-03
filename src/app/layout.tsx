import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ADMOV",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      email: "info@admov.io",
      description: DEFAULT_DESCRIPTION,
      address: { "@type": "PostalAddress", addressLocality: "Istanbul", addressCountry: "TR" },
      sameAs: ["https://www.instagram.com/admov.io", "https://www.tiktok.com/@admov.io"],
      // The three languages the site is published in — a strong entity signal
      // for AI engines deciding whether we serve a given market.
      knowsLanguage: ["en", "ar", "tr"],
      areaServed: [
        { "@type": "Country", name: "Türkiye" },
        { "@type": "Country", name: "Kuwait" },
        { "@type": "Place", name: "Middle East" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI services",
        itemListElement: [
          "AI Generated Videos",
          "AI Generated Photos",
          "AI Automation Systems",
          "LLM Setup & Integration",
          "Website Development",
          "App Development",
          "Meta, Google & TikTok Ads",
          "Shopify & E-Commerce",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name, provider: { "@id": `${SITE_URL}/#organization` } },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "ADMOV",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["en", "ar", "tr"],
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Set by src/proxy.ts: URL prefix > cookie > Accept-Language.
  const requestHeaders = await headers();
  const headerLang = requestHeaders.get("x-lang");
  const lang: Language = isLanguage(headerLang) ? headerLang : DEFAULT_LANG;
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  const adminContent = await getAdminContent();

  return (
    <html
      lang={lang}
      dir={dirFor(lang)}
      className={`${syne.variable} ${dmSans.variable} ${changa.variable} ${lang}`}
      suppressHydrationWarning
    >
      <head>
        <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body className={`bg-zinc-950 text-zinc-50 antialiased lang-${lang}`} suppressHydrationWarning>
        <Providers initialLang={lang} adminContent={adminContent}>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
