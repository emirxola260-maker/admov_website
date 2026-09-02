"use client";

import * as React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const COPY = {
  en: { title: "Something went wrong", retry: "Try again" },
  ar: { title: "حدث خطأ ما", retry: "حاول مرة أخرى" },
  tr: { title: "Bir şeyler ters gitti", retry: "Tekrar dene" },
} as const;

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = useLanguage();
  const c = COPY[lang] ?? COPY.en;

  React.useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <span className="section-label mx-auto">Error</span>
        <h1 className="text-4xl md:text-5xl text-zinc-50 mb-6">{c.title}</h1>
        {error.digest && <p className="text-xs text-zinc-600 mb-8 font-mono">{error.digest}</p>}
        <button
          onClick={reset}
          className="text-white px-8 py-4 rounded-full font-syne font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-xl border border-violet/30"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 20px rgba(139, 125, 240, 0.3)",
          }}
        >
          {c.retry}
        </button>
      </div>
    </main>
  );
}
