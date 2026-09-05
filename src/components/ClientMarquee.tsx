"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { sanitizeHttpUrl } from "@/lib/security";
import content from "@/data/content.json";

/**
 * Scrolling band of past clients.
 *
 * Renders a real logo whenever one is registered for that client in
 * `content.json → clientLogos` (name → image URL), and falls back to a text
 * wordmark otherwise. We have no logo files yet, so today every entry is a
 * wordmark; dropping a URL into that map upgrades one client at a time without
 * touching this component.
 */
const logos = (content as { clientLogos?: Record<string, string> }).clientLogos ?? {};

export function ClientMarquee() {
  const { t } = useLanguage();
  const items = t.clients.items;

  return (
    <section className="py-10 border-y border-zinc-900 bg-zinc-950" aria-label={t.clients.label}>
      <p className="text-center text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-7 px-6">{t.clients.label}</p>
      <div
        className="marquee-wrapper overflow-hidden"
        dir="ltr"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="marquee-track items-center gap-14 md:gap-20 px-8">
          {[...items, ...items].map((name, i) => {
            const logo = sanitizeHttpUrl(logos[name] ?? "");
            return (
              <span
                key={`${name}-${i}`}
                // The duplicated half is decorative; hide it from screen readers
                // and from the accessible name of the band.
                aria-hidden={i >= items.length}
                className="shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                {logo ? (
                  <img src={logo} alt={name} loading="lazy" className="h-8 md:h-10 w-auto object-contain" />
                ) : (
                  <span className="font-syne font-extrabold text-2xl md:text-3xl text-zinc-400 whitespace-nowrap">{name}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
