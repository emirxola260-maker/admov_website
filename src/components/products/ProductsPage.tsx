"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Product, ProductCategory } from "@/lib/products/types";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { isComingSoonBadge } from "@/lib/products/badges";
import { VioletButton } from "@/components/ui/VioletButton";
import { GlassCard } from "@/components/ui/GlassCard";

export function ProductsPage({ products }: { products: Product[] }) {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = React.useState<"all" | ProductCategory>("all");
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const visible = products.filter((p) => filter === "all" || p.category === filter);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <header className="pt-32 md:pt-40 pb-12 md:pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="section-label">{t.products.label}</span>
          <h1 className="text-5xl md:text-7xl leading-[0.95] mb-6">{t.products.pageTitle}</h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">{t.products.pageIntro}</p>
          {categories.length > 1 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {(["all", ...categories] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-xl border ${
                    filter === c ? "text-white border-violet/60" : "text-zinc-300 border-white/10 hover:border-violet/30 hover:text-white"
                  }`}
                  style={
                    filter === c
                      ? {
                          backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 15px rgba(139, 125, 240, 0.3)",
                        }
                      : { backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)" }
                  }
                >
                  {c === "all" ? t.products.all : t.products.categories[c]}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-8">
          {visible.length === 0 && <p className="text-zinc-500">{t.products.empty}</p>}
          {visible.map((product, i) => {
            const image = sanitizeHttpUrl(product.image_url ?? "");
            const logo = sanitizeHttpUrl(product.logo_url ?? "");
            const url = sanitizeHttpUrl(product.url ?? "");
            const flip = i % 2 === 1;
            return (
              <motion.div
                key={product.id}
                id={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="scroll-mt-28"
              >
                <GlassCard className="overflow-hidden">
                  <div className={`grid lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
                    <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[360px] bg-zinc-900 relative">
                      {image ? (
                        <img src={image} alt={product.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet/20 to-zinc-900">
                          {logo ? <img src={logo} alt="" className="w-24 h-24 object-contain" /> : <span className="font-syne font-extrabold text-6xl text-violet/60">{product.name.charAt(0)}</span>}
                        </div>
                      )}
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center gap-5">
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-bold">
                        <span className="px-3 py-1 rounded-full bg-violet/20 text-violet-light">{t.products.categories[product.category]}</span>
                        {product.badges.map((b) =>
                          isComingSoonBadge(b) ? (
                            <span key={b} className="px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300">{t.products.comingSoon}</span>
                          ) : (
                            <span key={b} className="px-3 py-1 rounded-full border border-white/10 text-zinc-400">{b}</span>
                          ),
                        )}
                      </div>
                      <h2 className="text-3xl md:text-4xl">{product.name}</h2>
                      {pickLang(product.tagline, lang) && <p className="text-xl text-zinc-200 font-medium leading-snug">{pickLang(product.tagline, lang)}</p>}
                      {pickLang(product.description, lang) && <p className="text-zinc-400 leading-relaxed">{pickLang(product.description, lang)}</p>}
                      {url && (
                        <div className="pt-2">
                          <VioletButton href={url}>
                            {t.products.visit}
                            <ExternalLink size={16} />
                          </VioletButton>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
