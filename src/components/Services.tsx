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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.items.map((service, index) => {
            const Icon = icons[index] || Settings;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(index * 0.05, 0.2), duration: 0.4 }}
                className="p-8 rounded-3xl border border-violet/30 transition-colors group hover:border-violet/60"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(139, 125, 240, 0.55) 0%, rgba(115, 103, 240, 0.35) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 20px rgba(139, 125, 240, 0.2)',
                }}
              >
                <div className="mb-6 inline-block origin-center text-white transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  {React.createElement(Icon, { size: 32, strokeWidth: 1.5 })}
                </div>
                <h3 className="text-xl mb-3 text-white">
                  {service.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
