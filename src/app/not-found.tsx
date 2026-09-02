"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const COPY = {
  en: { title: "Page not found", body: "The page you're looking for doesn't exist or has moved.", back: "Back to Home" },
  ar: { title: "الصفحة غير موجودة", body: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.", back: "العودة إلى الصفحة الرئيسية" },
  tr: { title: "Sayfa bulunamadı", body: "Aradığınız sayfa mevcut değil veya taşınmış.", back: "Ana Sayfaya Dön" },
} as const;

export default function NotFound() {
  const { lang } = useLanguage();
  const c = COPY[lang] ?? COPY.en;
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <span className="section-label mx-auto">404</span>
        <h1 className="text-4xl md:text-6xl text-zinc-50 mb-6">{c.title}</h1>
        <p className="text-lg text-zinc-400 mb-10">{c.body}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full font-syne font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-xl border border-violet/30"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 20px rgba(139, 125, 240, 0.3)",
          }}
        >
          <ArrowLeft size={18} className="rtl:rotate-180" />
          {c.back}
        </Link>
      </div>
    </main>
  );
}
