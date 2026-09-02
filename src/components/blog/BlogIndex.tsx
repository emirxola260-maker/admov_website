import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { translations } from "@/i18n/translations";
import type { Language } from "@/i18n/config";
import type { PostSummary } from "@/lib/blog/types";
import { PostCard } from "./PostCard";

export function BlogIndex({ posts, lang }: { posts: PostSummary[]; lang: Language }) {
  const t = translations[lang].blog;
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <main className="pt-32 md:pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <header className="max-w-3xl mb-12 md:mb-16">
            <span className="section-label">{t.label}</span>
            <h1 className="text-5xl md:text-7xl leading-[0.95] mb-6">{t.pageTitle}</h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed">{t.pageIntro}</p>
          </header>
          {posts.length === 0 ? (
            <p className="text-zinc-500">{t.empty}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} lang={lang} large={i === 0} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
