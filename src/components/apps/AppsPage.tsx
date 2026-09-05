"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localePath } from "@/lib/i18n/paths";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { PLATFORMS, type AppItem, type Platform } from "@/lib/apps/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ShinyText from "@/components/ShinyText";
import { AppPrice, PlatformBadges } from "./AppMeta";
import { AppAction } from "./AppAction";

export function AppsPage({ apps }: { apps: AppItem[] }) {
  const { t, lang } = useLanguage();
  const a = t.apps;
  const [platform, setPlatform] = React.useState<Platform | "all">("all");

  // Only offer filters that actually match something, so the row never shows a
  // tab that leads to an empty grid.
  const available = PLATFORMS.filter((p) => apps.some((app) => app.platforms?.includes(p)));
  const shown = platform === "all" ? apps : apps.filter((app) => app.platforms?.includes(platform));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <main className="pt-32 md:pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="section-label">{a.label}</span>
          <h1 className="text-4xl md:text-6xl mb-6 max-w-3xl">
            {a.heading}
            <ShinyText text={a.headingHighlight} className="text-violet" color="#8B7DF0" shineColor="#ffffff" speed={3} />
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mb-10">{a.subtext}</p>

          {available.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {(["all", ...available] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p as Platform | "all")}
                  aria-pressed={platform === p}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                    platform === p
                      ? "border-violet/60 bg-violet/20 text-white"
                      : "border-white/10 text-zinc-300 hover:border-violet/40 hover:text-white"
                  }`}
                >
                  {p === "all" ? a.all : a.platforms[p as Platform]}
                </button>
              ))}
            </div>
          )}

          {shown.length === 0 ? (
            <p className="text-zinc-500 py-20 text-center">{a.empty}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map((app, i) => (
                <AppCard key={app.id} app={app} index={i} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AppCard({ app, index, lang }: { app: AppItem; index: number; lang: string }) {
  const { t } = useLanguage();
  const image = sanitizeHttpUrl(app.image_url ?? "");
  const logo = sanitizeHttpUrl(app.logo_url ?? "");
  const tagline = pickLang(app.tagline, lang as "en") ?? "";
  const href = `${localePath(lang as "en", "/apps")}/${app.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-violet/40 transition-colors"
    >
      <Link href={href} className="block aspect-[16/10] bg-zinc-900 overflow-hidden">
        {image ? (
          <img src={image} alt={app.name} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center font-syne font-extrabold text-5xl text-violet/40">
            {app.name.charAt(0)}
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-4 p-6 flex-1">
        <div className="flex items-start gap-3">
          {logo && (
            <img src={logo} alt="" loading="lazy" className="w-10 h-10 rounded-xl object-contain bg-white/5 border border-white/10 shrink-0" />
          )}
          <div className="min-w-0">
            <Link href={href} className="block">
              <h2 className="text-xl text-zinc-50 truncate hover:text-violet transition-colors">{app.name}</h2>
            </Link>
            <p className="text-[11px] uppercase tracking-wider text-violet font-bold mt-0.5">{t.apps.kinds[app.kind]}</p>
          </div>
        </div>

        <PlatformBadges platforms={app.platforms ?? []} />
        {tagline && <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{tagline}</p>}

        <div className="mt-auto pt-3 flex items-center justify-between gap-3 flex-wrap">
          <AppPrice app={app} />
          <AppAction app={app} />
        </div>
      </div>
    </motion.article>
  );
}
