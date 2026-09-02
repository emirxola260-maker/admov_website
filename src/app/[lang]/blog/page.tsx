import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LANG, isLanguage, type Language } from "@/i18n/config";
import { translations } from "@/i18n/translations";
import { getPublishedPosts } from "@/lib/data/posts";
import { blogHref, hreflangAlternates } from "@/lib/blog/utils";
import { SITE_URL } from "@/lib/blog/metadata";
import { BlogIndex } from "@/components/blog/BlogIndex";

type Props = { params: Promise<{ lang: string }> };

function resolveLang(lang: string): Language {
  // English lives at /blog (no prefix); only ar/tr are valid here.
  if (!isLanguage(lang) || lang === DEFAULT_LANG) notFound();
  return lang;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  const t = translations[lang].blog;
  return {
    title: t.pageTitle,
    description: t.pageIntro,
    alternates: { canonical: blogHref(lang), languages: hreflangAlternates(SITE_URL) },
  };
}

export default async function Page({ params }: Props) {
  const lang = resolveLang((await params).lang);
  const posts = await getPublishedPosts(60);
  return <BlogIndex posts={posts} lang={lang} />;
}
