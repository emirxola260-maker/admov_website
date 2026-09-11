import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ANNOUNCE_COOKIE, getAnnouncement } from "@/lib/announcement";
import { translations } from "@/i18n/translations";
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

/**
 * Google Analytics 4. Loaded only on the production deployment, so local dev
 * and Vercel preview URLs never send hits into the real property.
 *
 * Both tags carry the per-request CSP nonce: the site's policy is
 * nonce-based with 'strict-dynamic', so an un-nonced inline gtag snippet —
 * the form Google's install page hands out — would be blocked silently.
 */
const GA_ID = "G-35B5ZKGN2K";
const LOAD_GA = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Set by src/proxy.ts: URL prefix > cookie > Accept-Language.
  const requestHeaders = await headers();
  const headerLang = requestHeaders.get("x-lang");
  const lang: Language = isLanguage(headerLang) ? headerLang : DEFAULT_LANG;
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  const adminContent = await getAdminContent();

  // Announcement bar: off on /admin, and off for anyone who already closed this
  // exact message. Decided here on the server so a dismissed bar never flashes.
  const pathname = requestHeaders.get("x-pathname") ?? "/";
  const announcement = pathname.startsWith("/admin") ? null : getAnnouncement(adminContent, lang);
  const dismissedVersion = (await cookies()).get(ANNOUNCE_COOKIE)?.value;
  const showAnnouncement = !!announcement && announcement.version !== dismissedVersion;

  return (
    <html
      lang={lang}
      dir={dirFor(lang)}
      className={`${syne.variable} ${dmSans.variable} ${changa.variable} ${lang}`}
      suppressHydrationWarning
      // Every fixed header offsets itself by this, so the bar never covers the navbar.
      style={{ ["--announce-h" as string]: showAnnouncement ? "2.5rem" : "0px" }}
    >
      <head>
        <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body className={`bg-zinc-950 text-zinc-50 antialiased lang-${lang}`} suppressHydrationWarning>
        {showAnnouncement && announcement && (
          <AnnouncementBar announcement={announcement} closeLabel={translations[lang].announce.close} />
        )}
        <Providers initialLang={lang} adminContent={adminContent}>
          <ConsentProvider enabled={LOAD_GA}>{children}</ConsentProvider>
        </Providers>
        <Analytics />
        {LOAD_GA && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" nonce={nonce} />
            <Script id="ga4" strategy="afterInteractive" nonce={nonce}>
              {/* Consent Mode v2: everything denied until the visitor accepts in the
                  banner, so GA writes no cookies before then. A returning visitor who
                  already accepted is restored here, before config, so their first hit
                  is not lost waiting for React to hydrate. */}
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});try{if(localStorage.getItem('admov-consent')==='granted')gtag('consent','update',{analytics_storage:'granted'});}catch(e){}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
