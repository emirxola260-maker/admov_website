"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminContent, getAdminPricing } from "@/admin/useAdminContent";
import { localePath } from "@/lib/i18n/paths";
import ShinyText from "./ShinyText";

/**
 * Indicative package pricing.
 *
 * The point is lead qualification rather than checkout: every tier ends at the
 * same free call, and the copy says plainly that the final quote depends on
 * scope. A tier with an empty `price` is quoted rather than listed.
 */
export function Pricing() {
  const { t, lang } = useLanguage();
  const { content: adminContent } = useAdminContent();
  const p = getAdminPricing(adminContent, lang, t.pricing);
  const contactHref = `${localePath(lang, "/")}#contact`;

  // Nothing until prices are set and published from /admin.
  if (!p) return null;

  return (
    <section id="pricing" className="py-16 md:py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <span className="section-label mx-auto">{p.label}</span>
          <h2 className="text-4xl md:text-6xl mb-6 text-zinc-50">
            {p.heading}
            <ShinyText text={p.headingHighlight} className="text-violet" color="#8B7DF0" shineColor="#ffffff" speed={3} />
          </h2>
          <p className="text-lg text-zinc-400">{p.subtext}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {p.tiers.map((tier, index) => {
            const featured = index === 1;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className={`relative flex flex-col rounded-3xl border p-8 md:p-9 h-full ${
                  featured ? "border-violet/60 md:-mt-4 md:pb-12" : "border-white/10"
                }`}
                style={
                  featured
                    ? {
                        backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.28) 0%, rgba(115, 103, 240, 0.12) 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 40px rgba(139, 125, 240, 0.25)",
                      }
                    : {
                        backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      }
                }
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet px-4 py-1 text-[11px] font-syne font-bold uppercase tracking-wider text-zinc-950 whitespace-nowrap">
                    {p.popular}
                  </span>
                )}

                <h3 className="text-2xl text-zinc-50">{tier.name}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{tier.tagline}</p>

                <div className="mt-6 mb-7 flex items-baseline gap-2 flex-wrap">
                  {tier.price ? (
                    <>
                      <span className="text-xs uppercase tracking-wider text-zinc-500">{p.from}</span>
                      <span className="font-syne font-extrabold text-4xl text-zinc-50" style={{ fontVariantNumeric: "tabular-nums" }} dir="ltr">
                        {tier.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-syne font-extrabold text-4xl text-violet">{p.custom}</span>
                  )}
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check size={17} className="mt-0.5 shrink-0 text-violet" aria-hidden />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={contactHref}
                  className={`mt-auto block rounded-full px-6 py-3.5 text-center font-syne font-bold transition-all hover:scale-[1.02] active:scale-[0.99] ${
                    featured ? "bg-violet text-zinc-950 hover:bg-violet-light" : "border border-white/20 text-zinc-50 hover:border-violet/60"
                  }`}
                >
                  {p.cta}
                </a>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500 max-w-2xl mx-auto">{p.note}</p>
      </div>
    </section>
  );
}
