import type { Metadata } from "next";
import { translations } from "@/i18n/translations";
import { localePath, pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { resolveLang, type LangParams } from "@/lib/routes/lang";
import { PrivacyPolicy } from "@/views/PrivacyPolicy";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  return {
    title: translations[lang].footer.privacy,
    alternates: { canonical: localePath(lang, "/privacy"), languages: pathAlternates(SITE_URL, "/privacy") },
  };
}

export default async function Page({ params }: LangParams) {
  resolveLang((await params).lang);
  return <PrivacyPolicy />;
}
