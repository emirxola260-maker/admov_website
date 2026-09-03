"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { localePath } from "@/lib/i18n/paths";
import { useLanguage } from "@/i18n/LanguageContext";
import ShinyText from "./ShinyText";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAdminContent, getAdminHero } from "@/admin/useAdminContent";
import RotatingText from "./RotatingText";

// WebGL (ogl) touches `window` at import time — load it on the client only.
const LightRays = dynamic(() => import("./LightRays"), { ssr: false });

export function Hero() {
  const { t, isRTL, lang } = useLanguage();
  const { content: adminContent } = useAdminContent();
  const hero = getAdminHero(adminContent, lang, t.hero);

  // Rotating words based on language - second word only
  const rotatingWords = React.useMemo(() => {
    switch (lang) {
      case 'ar':
        return ['صور', 'فيديوهات', 'برمجة', 'حلول'];
      case 'tr':
        return ['İçerik', 'Kodlama', 'Çözümler'];
      default:
        return ['Content', 'Coding', 'Solutions'];
    }
  }, [lang]);

  // Static word based on language (comes first for LTR, last for RTL)
  const staticWord = React.useMemo(() => {
    switch (lang) {
      case 'ar':
        return 'إبداعية'; // Comes after for RTL: "برمجة إبداعية"
      case 'tr':
        return 'Yaratıcı';
      default:
        return 'Creative';
    }
  }, [lang]);

  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden bg-zinc-950">
      {/* Light Rays Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#8a7df0"
          raysSpeed={0.8}
          lightSpread={1.7}
          rayLength={3}
          followMouse={false}
          mouseInfluence={0.4}
          noiseAmount={0}
          distortion={0.2}
          className="custom-rays"
          pulsating={true}
          fadeDistance={1.5}
          saturation={1.6}
        />
      </div>

      <div className="absolute top-0 right-0 z-0 w-[600px] h-[600px] bg-violet/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 z-0 w-[400px] h-[400px] bg-violet/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pr-0 lg:pr-8 rtl:pr-0 rtl:lg:pl-8"
          >
            <span className="section-label">{hero.label}</span>
            <h1 className="text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 md:mb-8 text-zinc-50">
              {hero.headline1} <br />
              <ShinyText text={hero.headline2} className="text-violet" color="#8B7DF0" shineColor="#ffffff" speed={3} />
            </h1>
            <p className="text-base md:text-xl text-zinc-400 max-w-xl mb-8 md:mb-10 leading-relaxed">
              {hero.subtext}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <a
                href="#contact"
                className="text-white px-8 py-4 rounded-full font-syne font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 backdrop-blur-xl border border-violet/30 w-full sm:w-auto"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 20px rgba(139, 125, 240, 0.3)',
                }}
              >
                {hero.cta1}
                <ArrowRight size={20} className="rtl:rotate-180" />
              </a>
              <Link
                href={localePath(lang, "/work")}
                className="text-zinc-50 px-8 py-4 rounded-full font-syne font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 backdrop-blur-xl border border-white/20 w-full sm:w-auto"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Play size={18} fill="currentColor" />
                {hero.cta2}
              </Link>
            </div>

            <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-6 md:gap-8 border-t border-zinc-800 pt-6 md:pt-8">
              {hero.stats.map((stat, i) => {
                // Extract numbers and + from the stat
                const match = stat.match(/^([\d+]+)(.+)$/);
                if (match) {
                  const [, numbers, rest] = match;
                  return (
                    <div key={i} className="flex flex-col">
                      <span className="text-lg md:text-xl">
                        <span className="font-syne font-bold text-violet" style={{ color: '#8b7df0' }}>{numbers}</span>
                        <span className="font-syne font-bold text-zinc-50">{rest}</span>
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={i} className="flex flex-col">
                    <span className="font-syne font-bold text-lg md:text-xl text-zinc-50">{stat}</span>
                  </div>
                );
              })}
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-syne font-bold text-zinc-50 inline-flex items-center gap-2">
                  {isRTL ? (
                    <>
                      <span className="bg-violet text-white px-3 py-1 rounded-lg inline-flex items-center">
                        <RotatingText
                          texts={rotatingWords}
                          rotationInterval={2500}
                          mainClassName="text-white"
                          elementLevelClassName="text-white"
                          splitBy="words"
                        />
                      </span>
                      {staticWord}
                    </>
                  ) : (
                    <>
                      {staticWord}
                      <span className="bg-violet text-white px-3 py-1 rounded-lg inline-flex items-center">
                        <RotatingText
                          texts={rotatingWords}
                          rotationInterval={2500}
                          mainClassName="text-white"
                          elementLevelClassName="text-white"
                          splitBy="words"
                        />
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl relative group">
              <video
                src="/hero-video-1280.mp4"
                poster="/hero-poster.jpg"
                preload="metadata"
                autoPlay
                loop
                muted
                playsInline
                aria-label="ADMOV showreel"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />

              {/* Floating Badge */}
              <motion.a
                href="https://drive.google.com/drive/folders/14l2XpmDN7b5D8w56keSTmFLUQ0QrBq99?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl cursor-pointer hover:border-violet/50 hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet rounded-full flex items-center justify-center text-white">
                    <Play size={20} fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-syne font-bold text-zinc-50 leading-none mb-1">{hero.videoBadge}</p>
                    <p className="text-xs text-zinc-400">{hero.videoSub}</p>
                  </div>
                </div>
              </motion.a>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 rtl:-right-auto rtl:-left-6 w-24 h-24 bg-violet-tint rounded-full -z-10" />
            <div className="absolute -bottom-10 -left-10 rtl:-left-auto rtl:-right-10 w-40 h-40 border border-violet/20 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>

    </section>
  );
}
