import type { Metadata } from "next";
import type { Language } from "@/i18n/config";
import type { Post } from "./types";
import { blogHref, hreflangAlternates, pickLang } from "./utils";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://admov.io";

const OG_LOCALE: Record<Language, string> = { en: "en_US", ar: "ar_AR", tr: "tr_TR" };

export function buildPostMetadata(post: Post, lang: Language, isPreview = false): Metadata {
  const meta = post.meta?.[lang] ?? post.meta?.en;
  const title = meta?.seoTitle || pickLang(post.title, lang) || "ADMOV Blog";
  const description = meta?.seoDescription || pickLang(post.excerpt, lang) || "";
  const path = blogHref(lang, post.slug);
  return {
    title: { absolute: `${title} | ADMOV` },
    description,
    keywords: meta?.keywords,
    alternates: { canonical: path, languages: hreflangAlternates(SITE_URL, post.slug) },
    openGraph: {
      type: "article",
      url: path,
      title,
      description,
      siteName: "ADMOV",
      locale: OG_LOCALE[lang],
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description },
    ...(isPreview ? { robots: { index: false, follow: false } } : {}),
  };
}
