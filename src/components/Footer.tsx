"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getAdminContact, useAdminContent } from "@/admin/useAdminContent";
import { blogHref } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { Logo } from "./ui/Logo";
import { TikTokIcon, WhatsAppIcon } from "./ui/SocialIcons";
import { Newsletter } from "./Newsletter";

export function Footer() {
  const { t, lang } = useLanguage();
  const { content } = useAdminContent();
  const contact = getAdminContact(content);
  const socials = [
    { name: "Instagram", href: sanitizeHttpUrl(contact?.instagram, "https://www.instagram.com/admov.io"), icon: <Instagram size={18} /> },
    { name: "TikTok", href: sanitizeHttpUrl(contact?.tiktok, "https://www.tiktok.com/@admov.io"), icon: <TikTokIcon size={18} /> },
    { name: "WhatsApp", href: sanitizeHttpUrl(contact?.whatsapp, "https://wa.me/905375755445"), icon: <WhatsAppIcon size={18} /> },
  ];

  const columns = [
    {
      title: t.footer.company,
      links: [
        { label: t.footer.home, href: "/" },
        { label: t.footer.services, href: "/#services" },
        { label: t.footer.work, href: "/work" },
        { label: t.footer.contact, href: "/#contact" },
      ],
    },
    {
      title: t.footer.resources,
      links: [
        { label: t.footer.products, href: "/products" },
        { label: t.footer.blog, href: blogHref(lang) },
        { label: t.footer.support, href: "/support" },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { label: t.footer.privacy, href: "/privacy" },
        { label: t.footer.terms, href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.6fr]">
          <div className="md:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-zinc-400 max-w-xs leading-relaxed">{t.footer.tagline}</p>
            <div className="flex gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-300 hover:bg-violet/20 hover:text-violet-light transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-syne font-bold text-xs text-zinc-50 uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-zinc-400 hover:text-violet transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="font-syne font-bold text-xs text-zinc-50 uppercase tracking-wider mb-3">{t.footer.newsletterTitle}</h4>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{t.footer.newsletterSub}</p>
            <Newsletter />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} ADMOV. {t.footer.rights}
          </p>
          <a href="mailto:info@admov.io" dir="ltr" className="hover:text-violet transition-colors">
            info@admov.io
          </a>
        </div>
      </div>
    </footer>
  );
}
