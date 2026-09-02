"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { SectionHeader } from "./ui/SectionHeader";

export function FAQ() {
  const { t } = useLanguage();
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          <SectionHeader align="start" label={t.faq.label} heading={t.faq.heading} highlight={t.faq.headingHighlight} />
          <div className="divide-y divide-white/10 border-y border-white/10">
            {t.faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-5 text-start"
                    aria-expanded={isOpen}
                  >
                    <span className="font-syne font-bold text-lg text-zinc-50">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="shrink-0 w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-violet"
                    >
                      <Plus size={16} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pe-12 text-zinc-400 leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
