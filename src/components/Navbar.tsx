"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const { t } = useLanguage();

  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(9, 9, 11, 0)", "rgba(9, 9, 11, 0.9)"]);
  const borderBottom = useTransform(
    scrollY,
    [0, 100],
    ["1px solid rgba(139, 125, 240, 0)", "1px solid rgba(139, 125, 240, 0.1)"],
  );

  // Hash links are prefixed with "/" so they also work from /work, /blog, etc.
  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.services, href: "/#services" },
    { name: t.nav.work, href: "/work" },
  ];

  return (
    <motion.nav
      style={{ backgroundColor, borderBottom }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,0 100,100 0,100" fill="#A49BFF" />
              <polygon points="50,50 75,100 25,100" fill="#7367F0" />
            </svg>
          </div>
          <span className="logo-text font-extrabold text-2xl tracking-tighter text-zinc-50">ADMOV</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-dm font-medium text-sm text-zinc-400 hover:text-violet transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <LanguageSelector />
          <Link
            href="/#contact"
            className="px-6 py-2.5 rounded-full font-syne font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 backdrop-blur-xl border border-violet/30"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 15px rgba(139, 125, 240, 0.3)",
            }}
          >
            {t.nav.bookCall}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageSelector />
          <button className="text-zinc-50" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-zinc-950 border-b border-violet/10 px-6 py-8 flex flex-col gap-6 shadow-xl"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-syne font-bold text-xl text-zinc-50"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="bg-violet text-white px-6 py-4 rounded-xl font-syne font-bold text-center text-lg"
          >
            {t.nav.bookCall}
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
