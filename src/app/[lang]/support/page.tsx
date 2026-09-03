import type { Metadata } from "next";
import { translations } from "@/i18n/translations";
import { localePath, pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { resolveLang, type LangParams } from "@/lib/routes/lang";
import { SupportPage } from "@/views/SupportPage";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  return {
    title: translations[lang].footer.support,
    alternates: { canonical: localePath(lang, "/support"), languages: pathAlternates(SITE_URL, "/support") },
  };
}

export default async function Page({ params }: LangParams) {
  resolveLang((await params).lang);
  return <SupportPage />;
}
