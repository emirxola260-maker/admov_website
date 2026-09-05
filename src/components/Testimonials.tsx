"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import ShinyText from "./ShinyText";
import { useAdminContent, getAdminTestimonials } from "@/admin/useAdminContent";
import { sanitizeHttpUrl } from "@/lib/security";

/** Real headshot when the admin dashboard has one; otherwise the initial is used. */
function avatarFor(item: { avatarUrl?: string }): string {
  return sanitizeHttpUrl(item.avatarUrl ?? "");
}

export function Testimonials() {
  const { t, lang } = useLanguage();
  const { content: adminContent } = useAdminContent();
  const testimonials = getAdminTestimonials(adminContent, lang, t.testimonials);

  return (
    <section className="py-16 md:py-24 bg-zinc-950 overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-syne font-bold text-[11px] text-zinc-400 tracking-[0.10em] uppercase mb-3 block">
            {testimonials.label}
          </span>
          <h2 className="text-4xl md:text-6xl text-zinc-50">
            {testimonials.heading}<ShinyText text={testimonials.headingHighlight} className="text-violet" color="#8B7DF0" shineColor="#ffffff" speed={3} />
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.items.map((item, index) => (
            <motion.figure
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col p-10 m-0 rounded-[2.5rem] relative backdrop-blur-xl border border-white/15 hover:border-violet/40 transition-colors"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0, 0, 0, 0.25)',
              }}
            >
              <Quote size={40} className="text-violet/20 absolute top-8 right-8 rtl:right-auto rtl:left-8" aria-hidden />
              <div className="flex gap-1 mb-6" role="img" aria-label="5 out of 5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#8B7DF0" className="text-violet" aria-hidden />
                ))}
              </div>
              <blockquote className="text-xl font-dm font-medium text-zinc-50 mb-8 leading-relaxed flex-1">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              {/* Attribution sits on a rule with an avatar, so the person reads as a
                  person rather than a caption. A real photo is used when one is
                  supplied; otherwise the initial stands in. */}
              <figcaption className="flex items-center gap-4 pt-6 border-t border-white/10">
                {avatarFor(item) ? (
                  <img
                    src={avatarFor(item)}
                    alt={item.author}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-syne font-extrabold text-lg text-violet-light border border-violet/30 bg-violet/15"
                  >
                    {item.author.trim().charAt(0)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block font-syne font-bold text-zinc-50 truncate">{item.author}</span>
                  <span className="block text-sm text-zinc-400 truncate">{item.title}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
