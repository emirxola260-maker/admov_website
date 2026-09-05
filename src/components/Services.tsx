"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Video, Camera, Settings, BrainCircuit, Code, Smartphone, Megaphone, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import ShinyText from "./ShinyText";
import { useAdminContent, getAdminServices } from "@/admin/useAdminContent";

const icons: React.ElementType[] = [
  Video, Camera, Settings, BrainCircuit, Code, Smartphone, Megaphone, ShoppingBag,
];

/**
 * Bento spans on the 4-column desktop grid, index-aligned with `icons`.
 * Row 1: [0 spans 2x2][1 spans 2] · Row 2: [0 cont.][2][3] · Rows 3-4: pairs.
 * Anything beyond this list falls back to a single cell.
 */
const SPANS = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "",
  "",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

export function Services() {
  const { t, lang } = useLanguage();
  const { content: adminContent } = useAdminContent();
  const services = getAdminServices(adminContent, lang, t.services);

  return (
    <section id="services" className="py-16 md:py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="section-label mx-auto">{services.label}</span>
          <h2 className="text-4xl md:text-6xl mb-6 text-zinc-50">
            {services.heading}<ShinyText text={services.headingHighlight} className="text-violet" color="#8B7DF0" shineColor="#ffffff" speed={3} />
          </h2>
          <p className="text-lg text-zinc-400">
            {services.subtext}
          </p>
        </div>

        {/* Bento layout: the lead service takes a double tile so the section has
            a focal point. Previously all eight cards were the same size and the
            same violet, which flattened the hierarchy — nothing read as primary. */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(0,1fr)] gap-5">
          {services.items.map((service, index) => {
            const Icon = icons[index] || Settings;
            const featured = index === 0;
            const wide = SPANS[index] ?? "";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(index * 0.05, 0.2), duration: 0.4 }}
                className={`${wide} flex flex-col rounded-3xl border transition-colors group ${
                  featured
                    ? "p-8 md:p-10 border-violet/40 hover:border-violet/70 lg:justify-between"
                    : "p-7 border-white/10 hover:border-violet/50"
                }`}
                style={
                  featured
                    ? {
                        backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.55) 0%, rgba(115, 103, 240, 0.35) 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 20px rgba(139, 125, 240, 0.2)",
                      }
                    : {
                        backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      }
                }
              >
                <div
                  className={`mb-5 inline-block origin-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
                    featured ? "text-white" : "text-violet"
                  }`}
                >
                  {React.createElement(Icon, { size: featured ? 40 : 28, strokeWidth: 1.5 })}
                </div>
                <div>
                  <h3 className={`mb-3 ${featured ? "text-2xl md:text-3xl text-white" : "text-lg text-zinc-50"}`}>
                    {service.title}
                  </h3>
                  <p className={`leading-relaxed ${featured ? "text-white/85 text-base max-w-md" : "text-zinc-400 text-sm"}`}>
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
