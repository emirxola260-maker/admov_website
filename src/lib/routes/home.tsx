import type { Metadata } from "next";
import { headers } from "next/headers";
import { DEFAULT_LANG, isLanguage, type Language } from "@/i18n/config";
import { translations } from "@/i18n/translations";
import { getAdminContent } from "@/lib/data/admin-content";
import { getPublishedProducts } from "@/lib/data/products";
import { getPublishedPosts } from "@/lib/data/posts";
import { sanitizeHttpUrl } from "@/lib/security";
import { localePath, pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { HomePage } from "@/components/HomePage";

/**
 * The homepage is rendered at `/`, `/ar` and `/tr`. Shared here so the three
 * routes cannot drift apart. The admin "SEO & Meta" tab overrides the title,
 * description and OG image.
 */
export async function homeMetadata(lang: Language): Promise<Metadata> {
  const adminContent = await getAdminContent();
  const seo = (adminContent?.seo ?? {}) as { title?: string; description?: string; ogImage?: string };
  const title = seo.title?.trim();
  const description = seo.description?.trim();
  const ogImage = sanitizeHttpUrl(seo.ogImage ?? "");
  return {
    ...(title ? { title: { absolute: title } } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: localePath(lang, "/"), languages: pathAlternates(SITE_URL, "/") },
    ...(ogImage ? { openGraph: { images: [ogImage] }, twitter: { images: [ogImage] } } : {}),
  };
}

export async function HomeRoute() {
  const requestHeaders = await headers();
  const headerLang = requestHeaders.get("x-lang");
  const lang: Language = isLanguage(headerLang) ? headerLang : DEFAULT_LANG;
  const nonce = requestHeaders.get("x-nonce") ?? undefined;

  const [products, posts] = await Promise.all([getPublishedProducts(), getPublishedPosts(3)]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: translations[lang].faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomePage products={products} posts={posts} />
    </>
  );
}
