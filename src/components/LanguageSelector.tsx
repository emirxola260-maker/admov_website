"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languages, type Language } from "@/i18n/translations";

export function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === lang)!;

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-xl border border-white/20 cursor-pointer bg-white/10"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 15px rgba(0,0,0,0.2)',
        }}
      >
        <img src={`/flags/${current.code}.svg`} alt={current.name} className="w-5 h-5 rounded-full object-cover" />
        <span className="text-xs font-syne font-bold text-zinc-300 uppercase tracking-wider hidden sm:inline">
          {current.code}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className="text-zinc-500"
        >
          <path d="M2 4 L5 7 L8 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 min-w-[180px] backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-[9999] bg-white/10"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            {languages.map((l, i) => {
              const isActive = l.code === lang;
              return (
                <motion.button
                  key={l.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setLang(l.code as Language);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all cursor-pointer ${
                    isActive
                      ? "bg-violet/20 text-violet"
                      : "text-zinc-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <img src={`/flags/${l.code}.svg`} alt={l.name} className="w-5 h-5 rounded-full object-cover" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-syne font-bold">
                      {l.nativeName}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      {l.name}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="lang-active"
                      className="ml-auto w-2 h-2 rounded-full bg-violet"
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
