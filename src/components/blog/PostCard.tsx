import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { translations } from "@/i18n/translations";
import type { Language } from "@/i18n/config";
import type { PostSummary } from "@/lib/blog/types";
import { blogHref, formatPostDate, pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { cn } from "@/lib/utils";

export function PostCard({ post, lang, large = false }: { post: PostSummary; lang: Language; large?: boolean }) {
  const t = translations[lang].blog;
  const title = pickLang(post.title, lang) ?? "";
  const excerpt = pickLang(post.excerpt, lang) ?? "";
  const href = blogHref(lang, post.slug);
  const cover = sanitizeHttpUrl(post.cover_image_url ?? "") || `${href}/opengraph-image`;
  const pillarLabel = post.pillar ? (t.pillars as Record<string, string>)[post.pillar] : undefined;

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-violet/40 transition-colors",
        large && "lg:col-span-2 lg:flex-row",
      )}
    >
      <div className={cn("relative overflow-hidden bg-zinc-900 aspect-[16/10] shrink-0", large && "lg:w-1/2 lg:aspect-auto")}>
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
        {pillarLabel && (
          <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/10 backdrop-blur-xl px-3 py-1 rounded-full text-[10px] font-syne font-bold text-white uppercase tracking-wider border border-white/10">
            {pillarLabel}
          </span>
        )}
      </div>
      <div className="p-6 md:p-7 flex flex-col gap-3 flex-1">
        <time dateTime={post.published_at ?? undefined} className="text-xs text-zinc-500">
          {formatPostDate(post.published_at, lang)}
        </time>
        <h3 className={cn("font-syne font-extrabold text-zinc-50 group-hover:text-violet-light transition-colors", large ? "text-2xl md:text-3xl" : "text-xl")}>
          {title}
        </h3>
        <p className={cn("text-sm text-zinc-400 leading-relaxed", large ? "line-clamp-4" : "line-clamp-3")}>{excerpt}</p>
        <span className="mt-auto pt-2 inline-flex items-center gap-1 text-sm font-syne font-bold text-violet">
          {t.readMore}
          <ArrowUpRight size={16} className="rtl:-scale-x-100" />
        </span>
      </div>
    </Link>
  );
}
