import type { Metadata } from "next";
import { translations } from "@/i18n/translations";
import { localePath, pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { resolveLang, type LangParams } from "@/lib/routes/lang";
import { WorkPage } from "@/views/WorkPage";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  const t = translations[lang].work;
  return {
    title: t.label,
    description: `${t.heading}${t.headingHighlight}`,
    alternates: { canonical: localePath(lang, "/work"), languages: pathAlternates(SITE_URL, "/work") },
  };
}

export default async function Page({ params }: LangParams) {
  resolveLang((await params).lang);
  return <WorkPage />;
}
