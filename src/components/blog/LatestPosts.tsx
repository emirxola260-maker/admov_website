"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { PostSummary } from "@/lib/blog/types";
import { blogHref } from "@/lib/blog/utils";
import ShinyText from "@/components/ShinyText";
import { PostCard } from "./PostCard";

export function LatestPosts({ posts }: { posts: PostSummary[] }) {
  const { t, lang } = useLanguage();
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-16 md:py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="section-label">{t.blog.label}</span>
            <h2 className="text-3xl md:text-5xl text-zinc-50">
              {t.blog.heading}
              <ShinyText text={t.blog.headingHighlight} className="text-violet" color="#8B7DF0" shineColor="#ffffff" speed={3} />
            </h2>
            <p className="mt-4 text-lg text-zinc-400">{t.blog.subtext}</p>
          </div>
          <Link href={blogHref(lang)} className="font-syne font-bold text-zinc-50 hover:text-violet transition-colors flex items-center gap-2 group shrink-0">
            {t.blog.viewAll}
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rtl:-scale-x-100" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
