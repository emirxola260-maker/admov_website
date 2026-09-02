"use client";

import * as React from "react";
import { Check, Link2 } from "lucide-react";
import { translations } from "@/i18n/translations";
import type { Language } from "@/i18n/config";

export function ShareBar({ url, title, lang }: { url: string; title: string; lang: Language }) {
  const t = translations[lang].blog;
  const [copied, setCopied] = React.useState(false);
  const enc = encodeURIComponent;
  const links = [
    { name: "X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { name: "Telegram", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const pill = "px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-zinc-300 hover:border-violet/50 hover:text-white transition-colors";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs uppercase tracking-wider text-zinc-500 me-1">{t.share}</span>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className={pill}>
          {l.name}
        </a>
      ))}
      <button type="button" onClick={copy} className={`${pill} inline-flex items-center gap-1.5`}>
        {copied ? <Check size={12} /> : <Link2 size={12} />}
        {copied ? t.copied : t.copyLink}
      </button>
    </div>
  );
}
