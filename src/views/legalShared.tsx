"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export type Lang = "en" | "ar" | "tr";

export type Block = { p: string } | { list: string[] };

export interface LegalSection {
  heading: string;
  blocks: Block[];
}

export interface LegalDoc {
  eyebrow: string;
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
  contact: {
    heading: string;
    intro: string;
    emailLabel: string;
    websiteLabel: string;
  };
}

const BACK: Record<Lang, string> = {
  en: "Back to Home",
  ar: "العودة إلى الصفحة الرئيسية",
  tr: "Ana Sayfaya Dön",
};

// Contact tokens that should be auto-linked wherever they appear in body text.
// The token strings themselves are never translated (emails / URLs).
const LINK_TOKENS: { token: string; href: string; external: boolean }[] = [
  { token: "info@admov.io", href: "mailto:info@admov.io", external: false },
  { token: "reportaproblem.apple.com", href: "https://reportaproblem.apple.com", external: true },
];

function linkify(text: string, keyPrefix: string): React.ReactNode[] {
  let nodes: React.ReactNode[] = [text];
  LINK_TOKENS.forEach(({ token, href, external }, ti) => {
    const next: React.ReactNode[] = [];
    nodes.forEach((node, ni) => {
      if (typeof node !== "string") {
        next.push(node);
        return;
      }
      const parts = node.split(token);
      parts.forEach((part, pi) => {
        if (part) next.push(part);
        if (pi < parts.length - 1) {
          next.push(
            <a
              key={`${keyPrefix}-${ti}-${ni}-${pi}`}
              href={href}
              dir="ltr"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-violet hover:text-violet-light transition-colors break-all"
            >
              {token}
            </a>
          );
        }
      });
    });
    nodes = next;
  });
  return nodes;
}

// Renders a string with **bold** segments and auto-linked contact tokens.
export function renderRich(text: string): React.ReactNode {
  return text.split("**").map((seg, i) =>
    i % 2 === 1 ? (
      <strong key={`b${i}`} className="text-zinc-200">{linkify(seg, `b${i}`)}</strong>
    ) : (
      <React.Fragment key={`n${i}`}>{linkify(seg, `n${i}`)}</React.Fragment>
    )
  );
}

// Shared navbar + RTL-aware content wrapper + footer for all legal/support pages.
export function PageChrome({ children }: { children: React.ReactNode }) {
  const { lang, isRTL, t } = useLanguage();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-violet/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <polygon points="50,0 100,100 0,100" fill="#A49BFF" />
                <polygon points="50,50 75,100 25,100" fill="#7367F0" />
              </svg>
            </div>
            <span className="logo-text font-extrabold text-2xl tracking-tighter text-zinc-50">ADMOV</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-violet transition-colors text-sm font-syne font-bold"
          >
            <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
            {BACK[(lang as Lang)] ?? BACK.en}
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-24" dir={isRTL ? "rtl" : "ltr"}>
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} ADMOV. {t.footer.rights}</p>
          <div className="flex gap-6">
            <Link href="/support" className="text-sm text-zinc-400 hover:text-violet transition-colors">{t.footer.support}</Link>
            <Link href="/privacy" className="text-sm text-zinc-400 hover:text-violet transition-colors">{t.footer.privacy}</Link>
            <Link href="/terms" className="text-sm text-zinc-400 hover:text-violet transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Renders a Privacy/Terms style legal document from per-language content.
export function LegalDocPage({ content }: { content: Record<Lang, LegalDoc> }) {
  const { lang } = useLanguage();
  const doc = content[(lang as Lang)] ?? content.en;

  return (
    <PageChrome>
      <div className="mb-12">
        <span className="font-syne font-bold text-[11px] text-violet tracking-[0.10em] uppercase mb-3 block">{doc.eyebrow}</span>
        <h1 className="text-5xl md:text-6xl font-syne font-extrabold tracking-tight text-zinc-50 mb-4">{doc.title}</h1>
        <p className="text-zinc-400">{doc.updated}</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-10 text-zinc-300 leading-relaxed">
        {doc.intro && <p>{renderRich(doc.intro)}</p>}

        {doc.sections.map((s, si) => (
          <section key={si}>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">{s.heading}</h2>
            {s.blocks.map((b, bi) =>
              "p" in b ? (
                <p key={bi} className={bi > 0 ? "mt-3" : ""}>{renderRich(b.p)}</p>
              ) : (
                <ul key={bi} className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
                  {b.list.map((it, ii) => (
                    <li key={ii}>{renderRich(it)}</li>
                  ))}
                </ul>
              )
            )}
          </section>
        ))}

        <section>
          <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">{doc.contact.heading}</h2>
          <p>{doc.contact.intro}</p>
          <div className="mt-4 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
            <p><strong className="text-zinc-300">Admov</strong></p>
            <p>
              <strong className="text-zinc-300">{doc.contact.emailLabel}:</strong>{" "}
              <a href="mailto:info@admov.io" dir="ltr" className="text-violet hover:text-violet-light transition-colors break-all">info@admov.io</a>
            </p>
            <p>
              <strong className="text-zinc-300">{doc.contact.websiteLabel}:</strong>{" "}
              <a href="https://admov.io" dir="ltr" target="_blank" rel="noopener noreferrer" className="text-violet hover:text-violet-light transition-colors break-all">https://admov.io</a>
            </p>
          </div>
        </section>
      </div>
    </PageChrome>
  );
}
