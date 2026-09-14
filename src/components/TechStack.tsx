"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./tech-stack.module.css";

const TOOLS = [
  { name: "Claude", icon: "claude" },
  { name: "GPT", icon: "openai" },
  { name: "Gemini", icon: "gemini" },
  { name: "n8n", icon: "n8n" },
  { name: "Make", icon: "make" },
  { name: "Flutter", icon: "flutter" },
  { name: "Next.js", icon: "nextjs" },
  { name: "Supabase", icon: "supabase" },
  { name: "Shopify", icon: "shopify" },
  { name: "Meta Ads", icon: "meta" },
  { name: "TikTok Ads", icon: "tiktok" },
  { name: "Google Ads", icon: "google-ads" },
];

const headings = { ar: "أدوات نعمل بها", en: "Tools we work with", tr: "Kullandığımız araçlar" };

export function TechStack() {
  const { lang } = useLanguage();
  return (
    <section id="tools" className={styles.section} aria-labelledby="tools-title">
      <div className={styles.container}>
        <h2 id="tools-title" className={styles.heading}>{headings[lang]}</h2>
        <ul className={styles.tools} role="list">
          {TOOLS.map((tool) => (
            <li key={tool.icon} className={styles.tool}>
              <img src={`/logos/tools/${tool.icon}.svg`} width="36" height="36" alt="" loading="lazy" decoding="async" />
              <span dir="ltr">{tool.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
