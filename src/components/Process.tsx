"use client";

import * as React from "react";
import { motion } from "motion/react";
import { PhoneCall, PenTool, TrendingUp } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import ShinyText from "./ShinyText";
import DataGridHero from "@/components/ui/data-grid-hero";

const stepIcons = [PhoneCall, PenTool, TrendingUp];
const stepMargins = ["md:mt-0", "md:mt-32", "md:mt-16"];

export function Process() {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-40 bg-zinc-950 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 z-0">
        <DataGridHero
          rows={20}
          cols={30}
          spacing={3}
          duration={4}
          color="#8B7DF0"
          animationType="wave"
          pulseEffect={true}
          mouseGlow={true}
          opacityMin={0.03}
          opacityMax={0.25}
          background="transparent"
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-32">
          <span className="section-label mx-auto">{t.process.label}</span>
          <h2 className="text-[6vw] sm:text-[5vw] md:text-[4rem] lg:text-[5rem] xl:text-[6rem] leading-[0.9] tracking-tighter uppercase mt-8 md:mt-12 font-syne font-extrabold w-full break-words text-zinc-50">
            {t.process.heading1} <br />
            {t.process.heading2} <br />
            <ShinyText text={t.process.heading3} className="text-violet block mt-2 md:mt-4" color="#8B7DF0" shineColor="#ffffff" speed={3} />
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Decorative squiggly line behind cards */}
          <div className="absolute top-1/2 left-0 w-full h-[200px] -translate-y-1/2 hidden md:block z-0 pointer-events-none">
             <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none" className="stroke-violet/20" fill="none" strokeWidth="2">
                <path d="M50,50 C250,-50 350,250 500,150 C650,50 800,100 950,100" />
             </svg>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {t.process.steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`p-10 rounded-[2rem] backdrop-blur-xl border border-white/15 ${stepMargins[index]}`}
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-violet-tint flex items-center justify-center text-violet mb-8">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="text-3xl font-syne font-extrabold mb-4 tracking-tight text-zinc-50">{step.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

