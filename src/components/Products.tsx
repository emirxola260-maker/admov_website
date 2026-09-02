"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/config";
import type { Product } from "@/lib/products/types";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { translations } from "@/i18n/translations";
import ShinyText from "./ShinyText";
import { GlassCard } from "./ui/GlassCard";

export function ProductCard({ product, lang, index = 0 }: { product: Product; lang: Language; index?: number }) {
  const t = translations[lang].products;
  const tagline = pickLang(product.tagline, lang);
  const description = pickLang(product.description, lang);
  const image = sanitizeHttpUrl(product.image_url ?? "");
  const logo = sanitizeHttpUrl(product.logo_url ?? "");
  const url = sanitizeHttpUrl(product.url ?? "");
  const video = sanitizeHttpUrl(product.video_url ?? "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.08, 0.3), duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="h-full"
    >
      <GlassCard className="h-full flex flex-col overflow-hidden group hover:border-violet/40 transition-colors">
        {(image || video) && (
          <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
            {video ? (
              <video
                src={video}
                muted
                loop
                playsInline
                preload="metadata"
                poster={image || undefined}
                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            )}
          </div>
        )}
        <div className="p-6 md:p-7 flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <img src={logo} alt="" className="w-full h-full object-contain p-1.5" />
              ) : (
                <span className="font-syne font-extrabold text-violet-light">{product.name.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-syne font-extrabold text-xl text-zinc-50 truncate">{product.name}</h3>
              <div className="flex flex-wrap gap-x-2 mt-0.5 text-[10px] uppercase tracking-wider font-bold">
                <span className="text-violet">{t.categories[product.category]}</span>
                {product.badges.map((b) => (
                  <span key={b} className="text-zinc-500">{b}</span>
                ))}
              </div>
            </div>
          </div>
          {tagline && <p className="text-zinc-200 font-medium leading-snug">{tagline}</p>}
          {description && <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{description}</p>}
          <div className="mt-auto pt-2 flex items-center gap-5">
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-syne font-bold text-sm text-violet hover:text-violet-light transition-colors">
                {t.visit}
                <ExternalLink size={14} />
              </a>
            )}
            <Link href={`/products#${product.slug}`} className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
              {t.learnMore}
            </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function Products({ products }: { products: Product[] }) {
  const { t, lang } = useLanguage();
  if (products.length === 0) return null;

  return (
    <section id="products" className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-[700px] h-[700px] bg-violet/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="section-label">{t.products.label}</span>
            <h2 className="text-3xl md:text-5xl text-zinc-50">
              {t.products.heading}
              <ShinyText text={t.products.headingHighlight} className="text-violet" color="#8B7DF0" shineColor="#ffffff" speed={3} />
            </h2>
            <p className="mt-4 text-lg text-zinc-400">{t.products.subtext}</p>
          </div>
          <Link href="/products" className="font-syne font-bold text-zinc-50 hover:text-violet transition-colors flex items-center gap-2 group shrink-0">
            {t.products.viewAll}
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rtl:-scale-x-100" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((p, i) => (
            <ProductCard key={p.id} product={p} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
