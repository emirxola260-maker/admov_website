"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { blogHref } from "@/lib/blog/utils";
import { useAdminContent, getAdminPricing } from "@/admin/useAdminContent";
import { localePath } from "@/lib/i18n/paths";
import { LanguageSelector } from "./LanguageSelector";
import { Logo } from "./ui/Logo";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const { t, lang } = useLanguage();

  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(9, 9, 11, 0)", "rgba(9, 9, 11, 0.9)"]);
  const borderBottom = useTransform(
    scrollY,
    [0, 100],
    ["1px solid rgba(139, 125, 240, 0)", "1px solid rgba(139, 125, 240, 0.1)"],
  );

  const { content: adminContent } = useAdminContent();

  // Hash links are prefixed with "/" so they also work from /work, /blog, etc.
  const home = localePath(lang, "/");
  // Pricing is admin-controlled, so the link comes and goes with the section.
  const pricingLive = !!getAdminPricing(adminContent, lang, t.pricing);
  const navLinks = [
    { name: t.nav.home, href: home },
    { name: t.nav.services, href: `${home}#services` },
    { name: t.nav.products, href: localePath(lang, "/products") },
    { name: t.nav.apps, href: localePath(lang, "/apps") },
    { name: t.nav.work, href: localePath(lang, "/work") },

    ...(pricingLive ? [{ name: t.nav.pricing, href: `${home}#pricing` }] : []),
    { name: t.nav.blog, href: blogHref(lang) },
  ];

  const cta = (
    <Link
      href={`${home}#contact`}
      onClick={() => setIsOpen(false)}
      className="px-6 py-2.5 rounded-full font-syne font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 backdrop-blur-xl border border-violet/30 text-center"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 15px rgba(139, 125, 240, 0.3)",
      }}
    >
      {t.nav.bookCall}
    </Link>
  );

  return (
    <motion.nav style={{ backgroundColor, borderBottom, top: "var(--announce-h, 0px)" }} className="fixed left-0 right-0 z-50 backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href={home} aria-label="ADMOV home">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-dm font-medium text-sm text-zinc-400 hover:text-violet transition-colors">
              {link.name}
            </Link>
          ))}
          <LanguageSelector />
          {cta}
        </div>

        {/* Mobile / tablet toggle */}
        <div className="lg:hidden flex items-center gap-3">
          <LanguageSelector />
          <button className="text-zinc-50" onClick={() => setIsOpen(!isOpen)} aria-label="Menu" aria-expanded={isOpen}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-20 left-0 right-0 bg-zinc-950 border-b border-violet/10 px-6 py-8 flex flex-col gap-6 shadow-xl"
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="font-syne font-bold text-xl text-zinc-50">
              {link.name}
            </Link>
          ))}
          {cta}
        </motion.div>
      )}
    </motion.nav>
  );
}
