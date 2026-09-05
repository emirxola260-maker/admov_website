import type { Metadata } from "next";
import { translations } from "@/i18n/translations";
import { getPublishedApps } from "@/lib/data/apps";
import { pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { AppsPage } from "@/components/apps/AppsPage";

export const metadata: Metadata = {
  title: translations.en.apps.pageTitle,
  description: translations.en.apps.subtext,
  alternates: { canonical: "/apps", languages: pathAlternates(SITE_URL, "/apps") },
};

export default async function Page() {
  return <AppsPage apps={await getPublishedApps()} />;
}
