"use client";

import { useLanguage } from "@/i18n/LanguageContext";

/** Text wordmarks of past clients scrolling in a loop (no logo assets needed). */
export function ClientMarquee() {
  const { t } = useLanguage();
  const items = t.clients.items;
  return (
    <section className="py-10 border-y border-zinc-900 bg-zinc-950" aria-label={t.clients.label}>
      <p className="text-center text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-6 px-6">{t.clients.label}</p>
      <div
        className="marquee-wrapper overflow-hidden"
        dir="ltr"
        style={{ maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)" }}
      >
        <div className="marquee-track gap-16 px-8">
          {[...items, ...items].map((name, i) => (
            <span key={`${name}-${i}`} className="font-syne font-extrabold text-2xl md:text-3xl text-zinc-600 whitespace-nowrap hover:text-zinc-300 transition-colors">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
