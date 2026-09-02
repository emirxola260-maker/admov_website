import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LANG, isLanguage, type Language } from "@/i18n/config";
import { getPostBySlug } from "@/lib/data/posts";
import { buildPostMetadata } from "@/lib/blog/metadata";
import { PostPage } from "@/components/blog/PostPage";

type Props = { params: Promise<{ lang: string; slug: string }>; searchParams: Promise<{ preview?: string }> };

function resolveLang(lang: string): Language {
  if (!isLanguage(lang) || lang === DEFAULT_LANG) notFound();
  return lang;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLang(rawLang);
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post", robots: { index: false, follow: false } };
  return buildPostMetadata(post, lang);
}

export default async function Page({ params, searchParams }: Props) {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLang(rawLang);
  const { preview } = await searchParams;
  return <PostPage slug={slug} lang={lang} previewToken={preview} />;
}
