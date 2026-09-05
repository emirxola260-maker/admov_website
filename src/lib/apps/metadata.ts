import type { Metadata } from "next";
import type { Language } from "@/i18n/config";
import { SUPPORTED_LANGS, DEFAULT_LANG } from "@/i18n/config";
import { getPublishedApp } from "@/lib/data/apps";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { SITE_URL } from "@/lib/blog/metadata";
import { localePath } from "@/lib/i18n/paths";

/** Canonical + hreflang for one app, matching how blog posts are handled. */
export async function appMetadata(slug: string, lang: Language): Promise<Metadata> {
  const app = await getPublishedApp(slug);
  if (!app) return { title: "Not found", robots: { index: false } };

  const path = `${localePath(lang, "/apps")}/${slug}`;
  const languages = Object.fromEntries(
    SUPPORTED_LANGS.map((l) => [l, `${SITE_URL}${localePath(l, "/apps")}/${slug}`]),
  );
  const image = sanitizeHttpUrl(app.image_url ?? "");

  return {
    title: app.name,
    description: pickLang(app.tagline, lang) ?? undefined,
    alternates: {
      canonical: path,
      languages: { ...languages, "x-default": `${SITE_URL}${localePath(DEFAULT_LANG, "/apps")}/${slug}` },
    },
    ...(image ? { openGraph: { images: [image] }, twitter: { images: [image] } } : {}),
  };
}
