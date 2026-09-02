"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { dirFor, type Language } from "@/i18n/config";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://admov.io";

// Raw HTML is dropped by react-markdown (no rehype-raw) and the default URL
// transform blocks javascript:/data: links, so model output is safe to render.
const components: Components = {
  a: ({ href, children }) => {
    const h = href ?? "";
    const external = /^https?:\/\//i.test(h) && !h.startsWith(SITE);
    return (
      <a href={h} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  pre: ({ children }) => <pre dir="ltr">{children}</pre>,
  img: () => null,
};

export function PostArticle({ markdown, lang, className }: { markdown: string; lang: Language; className?: string }) {
  const rtl = dirFor(lang) === "rtl";
  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={cn(
        "prose prose-invert prose-lg max-w-none",
        "prose-headings:font-syne prose-headings:tracking-tight prose-headings:text-zinc-50",
        "prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-zinc-100",
        "prose-a:text-violet prose-a:no-underline hover:prose-a:text-violet-light hover:prose-a:underline",
        "prose-code:text-violet-light prose-pre:bg-zinc-900 prose-blockquote:border-violet/40 prose-blockquote:text-zinc-300 prose-hr:border-zinc-800",
        rtl && "font-changa prose-headings:leading-snug",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
