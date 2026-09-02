"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/i18n/LanguageContext";
import { SectionHeader } from "./ui/SectionHeader";

const TOOLS = [
  { name: "Claude", tag: "Anthropic" },
  { name: "GPT", tag: "OpenAI" },
  { name: "Gemini", tag: "Google" },
  { name: "n8n", tag: "Automation" },
  { name: "Make", tag: "Automation" },
  { name: "Flutter", tag: "Mobile" },
  { name: "Next.js", tag: "Web" },
  { name: "Supabase", tag: "Backend" },
  { name: "Shopify", tag: "E-commerce" },
  { name: "Meta Ads", tag: "Ads" },
  { name: "TikTok Ads", tag: "Ads" },
  { name: "Google Ads", tag: "Ads" },
];

export function TechStack() {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.techStack.label} heading={t.techStack.heading} highlight={t.techStack.headingHighlight} className="mb-12" />
        <div className="flex flex-wrap justify-center gap-3">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
              className="flex items-center gap-3 px-5 py-3 rounded-full border border-white/10 backdrop-blur-xl hover:border-violet/40 transition-colors"
              style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)" }}
            >
              <span className="w-2 h-2 rounded-full bg-violet" />
              <span className="font-syne font-bold text-zinc-50">{tool.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">{tool.tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
