"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/i18n/LanguageContext";
import { GlassCard } from "./ui/GlassCard";
import { CountUp } from "./ui/CountUp";

export function Stats() {
  const { t } = useLanguage();
  return (
    <section className="py-12 md:py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <span className="section-label text-center mx-auto">{t.stats.label}</span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {t.stats.items.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <GlassCard className="p-6 md:p-8 text-center h-full">
                <CountUp value={stat.value} className="block font-syne font-extrabold text-4xl md:text-5xl text-violet mb-2" />
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
