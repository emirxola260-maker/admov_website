"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/i18n/LanguageContext";
import ShinyText from "./ShinyText";
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/ui/image-comparison";

const comparisons = [
  {
    label: { en: "Fashion & Beauty", ar: "الموضة والجمال", tr: "Moda & Güzellik" },
    before: "/fashion-before.webp",
    after: "/fashion-after.webp",
    beforeLabel: { en: "Before", ar: "قبل", tr: "Önce" },
    afterLabel: { en: "After", ar: "بعد", tr: "Sonra" },
    noFilter: true,
  },
  {
    label: { en: "Product Photography", ar: "تصوير المنتجات", tr: "Ürün Fotoğrafçılığı" },
    before: "/product-before.webp",
    after: "/work-jaeje.webp",
    beforeLabel: { en: "Before", ar: "قبل", tr: "Önce" },
    afterLabel: { en: "After", ar: "بعد", tr: "Sonra" },
    noFilter: true,
  },
  {
    label: { en: "Professional Studio Photography", ar: "تصوير ستوديو احترافي", tr: "Profesyonel Stüdyo Fotoğrafçılığı" },
    before: "/ecommerce-before.webp",
    after: "/ecommerce-after.webp",
    beforeLabel: { en: "Before", ar: "قبل", tr: "Önce" },
    afterLabel: { en: "After", ar: "بعد", tr: "Sonra" },
    noFilter: true,
  },
];

const copy = {
  en: {
    label: "Our Transformations",
    heading: "See the",
    headingHighlight: " ADMOV Difference",
    subtext:
      "Drag the slider to reveal how we transform ordinary content into scroll-stopping, brand-defining visuals.",
  },
  ar: {
    label: "تحولاتنا",
    heading: "شاهد الفرق مع\n",
    headingHighlight: "ADMOV",
    subtext:
      "اسحب الشريط لترى كيف نحوّل المحتوى العادي إلى مواد بصرية مبهرة تعكس هوية علامتك التجارية.",
  },
  tr: {
    label: "Dönüşümlerimiz",
    heading: "ADMOV",
    headingHighlight: " Farkını Görün",
    subtext:
      "Sıradan içerikleri markanızı tanımlayan, göz alıcı görsellere nasıl dönüştürdüğümüzü keşfetmek için kaydırın.",
  },
};

export function Showcase() {
  const { lang } = useLanguage();
  const t = copy[lang as keyof typeof copy] ?? copy.en;

  return (
    <section className="py-20 md:py-32 bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-label mx-auto"
          >
            {t.label}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl mb-6 text-zinc-50"
          >
            {t.heading.split("\n").map((line, i) =>
              line ? <span key={i}>{line}<br /></span> : null
            )}
            <ShinyText
              text={t.headingHighlight}
              className="text-violet logo-text"
              color="#8B7DF0"
              shineColor="#ffffff"
              speed={3}
            />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-zinc-400"
          >
            {t.subtext}
          </motion.p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {comparisons.map((item, i) => {
            const lbl = item.label[lang as keyof typeof item.label] ?? item.label.en;
            const beforeLbl = item.beforeLabel[lang as keyof typeof item.beforeLabel] ?? "Before";
            const afterLbl = item.afterLabel[lang as keyof typeof item.afterLabel] ?? "After";

            const noFilter = (item as { noFilter?: boolean }).noFilter ?? false;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group"
              >
                {/* Card wrapper */}
                <div
                  className="rounded-2xl overflow-hidden border border-violet/20 hover:border-violet/50 transition-colors duration-300"
                  style={{
                    boxShadow:
                      "0 4px 32px rgba(139, 125, 240, 0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Image comparison */}
                  <div className="relative">
                    <ImageComparison
                      className="aspect-[3/4] w-full"
                      enableHover
                      springOptions={{ bounce: 0, duration: 0.15 }}
                    >
                      {/* BEFORE — shown on left side of slider */}
                      <ImageComparisonImage
                        src={item.before}
                        alt={`${lbl} before`}
                        position="right"
                        className={noFilter ? "brightness-90" : "grayscale brightness-75"}
                      />
                      {/* AFTER — shown on right side of slider */}
                      <ImageComparisonImage
                        src={item.after}
                        alt={`${lbl} after`}
                        position="left"
                        className={noFilter ? "brightness-105 saturate-105" : "brightness-105 saturate-110"}
                      />

                      {/* Slider handle */}
                      <ImageComparisonSlider className="bg-white/40 backdrop-blur-sm">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M4 7H1M4 7L2.5 5M4 7L2.5 9M10 7H13M10 7L11.5 5M10 7L11.5 9"
                              stroke="#8B7DF0"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </ImageComparisonSlider>

                      {/* Before / After labels */}
                      <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <span className="text-[10px] font-syne font-bold tracking-widest uppercase bg-black/50 backdrop-blur-sm text-zinc-300 px-2 py-1 rounded-md">
                          {beforeLbl}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 z-10 pointer-events-none">
                        <span className="text-[10px] font-syne font-bold tracking-widest uppercase bg-violet/80 backdrop-blur-sm text-white px-2 py-1 rounded-md">
                          {afterLbl}
                        </span>
                      </div>
                    </ImageComparison>
                  </div>

                  {/* Label bar */}
                  <div
                    className="px-5 py-4 flex items-center gap-3"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139,125,240,0.12) 0%, rgba(139,125,240,0.04) 100%)",
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-violet flex-shrink-0" />
                    <span className="font-syne font-bold text-sm text-zinc-200 tracking-tight">
                      {lbl}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="text-zinc-500 text-sm">
            {lang === "ar"
              ? "كل مشروع مصنوع بعناية — نتائج حقيقية لعلامات تجارية حقيقية."
              : lang === "tr"
              ? "Her proje özenle hazırlanır — gerçek markalar için gerçek sonuçlar."
              : "Every project crafted with intention — real results for real brands."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
