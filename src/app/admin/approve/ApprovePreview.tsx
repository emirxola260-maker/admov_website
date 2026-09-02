"use client";

import * as React from "react";
import { SUPPORTED_LANGS, type Language } from "@/i18n/config";
import type { Post } from "@/lib/blog/types";
import { wordCount } from "@/lib/blog/utils";
import { PostArticle } from "@/components/blog/PostArticle";

export function ApprovePreview({ post }: { post: Post }) {
  const [lang, setLang] = React.useState<Language>("en");
  const meta = post.meta?.[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex gap-1 bg-white/5 rounded-full p-1">
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${lang === l ? "bg-violet text-white" : "text-zinc-400 hover:text-white"}`}
            >
              {l} · {wordCount(post.body_md?.[l])}w
            </button>
          ))}
        </div>
        {post.pillar && <span className="text-xs uppercase tracking-wider text-violet font-bold">{post.pillar}</span>}
        {post.tags.length > 0 && <span className="text-xs text-zinc-500">{post.tags.map((t) => `#${t}`).join(" ")}</span>}
      </div>

      <div dir={dir} className={lang === "ar" ? "font-changa" : undefined}>
        <h1 className="text-4xl md:text-5xl leading-[1.05] mb-4">{post.title?.[lang] ?? "—"}</h1>
        <p className="text-lg text-zinc-400 mb-6">{post.excerpt?.[lang]}</p>
        {meta && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm space-y-1.5">
            <div><span className="text-zinc-500">SEO title:</span> <span className="text-zinc-200">{meta.seoTitle}</span></div>
            <div><span className="text-zinc-500">Description:</span> <span className="text-zinc-200">{meta.seoDescription}</span></div>
            <div><span className="text-zinc-500">Keywords:</span> <span className="text-zinc-200">{(meta.keywords ?? []).join(", ")}</span></div>
          </div>
        )}
        <PostArticle markdown={post.body_md?.[lang] ?? "_No content for this language._"} lang={lang} />
      </div>
    </div>
  );
}
