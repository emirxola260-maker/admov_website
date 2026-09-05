import type { Metadata } from "next";
import { translations } from "@/i18n/translations";
import { getPublishedApps } from "@/lib/data/apps";
import { localePath, pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { resolveLang, type LangParams } from "@/lib/routes/lang";
import { AppsPage } from "@/components/apps/AppsPage";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  const t = translations[lang].apps;
  return {
    title: t.pageTitle,
    description: t.subtext,
    alternates: { canonical: localePath(lang, "/apps"), languages: pathAlternates(SITE_URL, "/apps") },
  };
}

export default async function Page({ params }: LangParams) {
  resolveLang((await params).lang);
  return <AppsPage apps={await getPublishedApps()} />;
}
