"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import ShinyText from "./ShinyText";
import { useAdminContent, getAdminTestimonials } from "@/admin/useAdminContent";

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
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 rounded-[2.5rem] relative backdrop-blur-xl border border-white/15"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0, 0, 0, 0.25)',
              }}
            >
              <Quote size={40} className="text-violet/20 absolute top-8 right-8 rtl:right-auto rtl:left-8" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#8B7DF0" className="text-violet" />
                ))}
              </div>
              <p className="text-xl font-dm font-medium text-zinc-50 mb-8 leading-relaxed">
                "{item.quote}"
              </p>
              <div>
                <p className="font-syne font-bold text-zinc-50">{item.author}</p>
                <p className="text-sm text-zinc-400">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
