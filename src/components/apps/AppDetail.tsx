"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localePath } from "@/lib/i18n/paths";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { isPaid, type AppItem } from "@/lib/apps/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AppPrice, PlatformBadges } from "./AppMeta";
import { AppAction } from "./AppAction";

export function AppDetail({ app }: { app: AppItem }) {
  const { t, lang } = useLanguage();
  const a = t.apps;
  const image = sanitizeHttpUrl(app.image_url ?? "");
  const logo = sanitizeHttpUrl(app.logo_url ?? "");
  const demo = sanitizeHttpUrl(app.demo_url ?? "");
  const tagline = pickLang(app.tagline, lang) ?? "";
  const description = pickLang(app.description, lang) ?? "";
  const features = (app.features?.[lang] ?? app.features?.en ?? []) as string[];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <main className="pt-32 md:pt-40 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            href={localePath(lang, "/apps")}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-violet transition-colors mb-10"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" aria-hidden />
            {a.back}
          </Link>

          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 aspect-[4/3]">
              {image ? (
                <img src={image} alt={app.name} className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center font-syne font-extrabold text-7xl text-violet/40">
                  {app.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                {logo && (
                  <img src={logo} alt="" className="w-14 h-14 rounded-2xl object-contain bg-white/5 border border-white/10 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-violet font-bold">{a.kinds[app.kind]}</p>
                  <h1 className="text-3xl md:text-4xl text-zinc-50">{app.name}</h1>
                </div>
              </div>

              <PlatformBadges platforms={app.platforms ?? []} />
              {tagline && <p className="text-xl text-zinc-200 font-medium leading-snug">{tagline}</p>}
              {description && <p className="text-zinc-400 leading-relaxed whitespace-pre-line">{description}</p>}

              <div className="pt-2"><AppPrice app={app} large /></div>

              <div className="flex flex-wrap items-center gap-3">
                <AppAction app={app} large />
                {demo && (
                  <a
                    href={demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-syne font-bold text-zinc-50 hover:border-violet/60 transition-colors"
                  >
                    {a.actions.demo}
                    <ExternalLink size={15} aria-hidden />
                  </a>
                )}
              </div>

              {isPaid(app.fulfilment) && <p className="text-sm text-zinc-500">{a.checkoutNote}</p>}
            </div>
          </div>

          {features.length > 0 && (
            <section className="mt-16 md:mt-20">
              <h2 className="text-2xl md:text-3xl mb-6">{a.features}</h2>
              <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-zinc-300">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-violet shrink-0" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
