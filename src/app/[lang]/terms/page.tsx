import type { Metadata } from "next";
import { translations } from "@/i18n/translations";
import { localePath, pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { resolveLang, type LangParams } from "@/lib/routes/lang";
import { TermsOfService } from "@/views/TermsOfService";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  return {
    title: translations[lang].footer.terms,
    alternates: { canonical: localePath(lang, "/terms"), languages: pathAlternates(SITE_URL, "/terms") },
  };
}

export default async function Page({ params }: LangParams) {
  resolveLang((await params).lang);
  return <TermsOfService />;
}
