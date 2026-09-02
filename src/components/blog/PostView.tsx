import Link from "next/link";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { translations } from "@/i18n/translations";
import type { Language } from "@/i18n/config";
import type { Post, PostSummary } from "@/lib/blog/types";
import { blogHref, formatPostDate, pickLang, readingMinutes } from "@/lib/blog/utils";
import { SITE_URL } from "@/lib/blog/metadata";
import { sanitizeHttpUrl } from "@/lib/security";
import { PostArticle } from "./PostArticle";
import { PostCard } from "./PostCard";
import { PostCta } from "./PostCta";
import { ShareBar } from "./ShareBar";

export async function PostView({ post, lang, more, isPreview = false }: { post: Post; lang: Language; more: PostSummary[]; isPreview?: boolean }) {
  const t = translations[lang].blog;
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const title = pickLang(post.title, lang) ?? "";
  const excerpt = pickLang(post.excerpt, lang) ?? "";
  const body = pickLang(post.body_md, lang) ?? "";
  const url = `${SITE_URL}${blogHref(lang, post.slug)}`;
  const cover = sanitizeHttpUrl(post.cover_image_url ?? "");
  const pillarLabel = post.pillar ? (t.pillars as Record<string, string>)[post.pillar] : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    inLanguage: lang,
    datePublished: post.published_at ?? post.generated_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: "ADMOV", url: SITE_URL },
    publisher: { "@type": "Organization", name: "ADMOV", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` } },
    image: cover || `${url}/opengraph-image`,
    mainEntityOfPage: url,
    keywords: (post.meta?.[lang]?.keywords ?? post.tags).join(", "),
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {!isPreview && (
        <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <Navbar />
      <main className="pt-32 md:pt-40 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          {isPreview && (
            <div className="mb-8 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              Draft preview — this post is not published yet.
            </div>
          )}
          <Link href={blogHref(lang)} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-violet transition-colors mb-8">
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t.backToBlog}
          </Link>
          {pillarLabel && <span className="section-label">{pillarLabel}</span>}
          <h1 className="text-4xl md:text-6xl leading-[1.05] mb-6">{title}</h1>
          {excerpt && <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-8">{excerpt}</p>}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-zinc-800 py-4 mb-10 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <time dateTime={post.published_at ?? undefined}>{formatPostDate(post.published_at ?? post.generated_at, lang)}</time>
              <span>·</span>
              <span>
                {readingMinutes(body)} {t.minRead}
              </span>
            </div>
            <ShareBar url={url} title={title} lang={lang} />
          </div>
          {cover && <img src={cover} alt="" className="w-full rounded-3xl mb-10 border border-white/10" />}
          <PostArticle markdown={body} lang={lang} />
          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs text-zinc-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <PostCta pillar={post.pillar} lang={lang} />
        </article>

        {more.length > 0 && (
          <section className="max-w-7xl mx-auto mt-24">
            <h2 className="text-3xl md:text-4xl mb-8">{t.more}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {more.map((p) => (
                <PostCard key={p.id} post={p} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
