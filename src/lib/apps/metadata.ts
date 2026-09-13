import type { Metadata } from "next";
import type { Language } from "@/i18n/config";
import { SUPPORTED_LANGS, DEFAULT_LANG } from "@/i18n/config";
import { getCourseLangs, getPublishedCourse, getPublishedStoreApp } from "@/lib/data/apps";
import { translations } from "@/i18n/translations";
import { courseLangs, galleryOf } from "@/lib/apps/types";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { SITE_URL } from "@/lib/blog/metadata";
import { localePath } from "@/lib/i18n/paths";

const NOT_FOUND: Metadata = { title: "Not found", robots: { index: false } };

/** Canonical + hreflang for one app, matching how blog posts are handled. */
export async function appMetadata(slug: string, lang: Language): Promise<Metadata> {
  const app = await getPublishedStoreApp(slug);
  if (!app) return NOT_FOUND;

  const path = `${localePath(lang, "/apps")}/${slug}`;
  const languages = Object.fromEntries(
    SUPPORTED_LANGS.map((l) => [l, `${SITE_URL}${localePath(l, "/apps")}/${slug}`]),
  );
  // The cover is shaped for sharing; a first screenshot is the fallback.
  const image = sanitizeHttpUrl(app.image_url || galleryOf(app)[0]?.url || "");

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

/**
 * The /courses index in one language. A language with no courses still gets a
 * working page (it points at the language that has them) but is noindexed and
 * left out of hreflang, so Google is never sent to an empty listing.
 */
export async function coursesIndexMetadata(lang: Language): Promise<Metadata> {
  const langs = await getCourseLangs();
  const t = translations[lang].courses;
  const url = (l: Language) => `${SITE_URL}${localePath(l, "/courses")}`;
  const hasContent = langs.includes(lang);
  return {
    title: t.pageTitle,
    description: t.subtext,
    alternates: {
      canonical: localePath(lang, "/courses"),
      ...(langs.length
        ? { languages: { ...Object.fromEntries(langs.map((l) => [l, url(l)])), "x-default": url(langs.includes(DEFAULT_LANG) ? DEFAULT_LANG : langs[0]) } }
        : {}),
    },
    ...(hasContent ? {} : { robots: { index: false, follow: true } }),
  };
}

/**
 * Canonical + hreflang for one course.
 *
 * Unlike apps, alternates list only the languages the course actually has a
 * curriculum in — advertising an empty English page to Google would be a
 * dishonest hreflang, and the page itself 404s in those languages anyway.
 */
export async function courseMetadata(slug: string, lang: Language): Promise<Metadata> {
  const course = await getPublishedCourse(slug);
  if (!course) return NOT_FOUND;
  const langs = courseLangs(course);
  if (!langs.includes(lang)) return NOT_FOUND;

  const url = (l: Language) => `${SITE_URL}${localePath(l, "/courses")}/${slug}`;
  const image = sanitizeHttpUrl(course.image_url || galleryOf(course)[0]?.url || "");

  return {
    title: course.name,
    description: pickLang(course.tagline, lang) ?? undefined,
    alternates: {
      canonical: `${localePath(lang, "/courses")}/${slug}`,
      languages: {
        ...Object.fromEntries(langs.map((l) => [l, url(l)])),
        "x-default": url(langs.includes(DEFAULT_LANG) ? DEFAULT_LANG : langs[0]),
      },
    },
    ...(image ? { openGraph: { images: [image] }, twitter: { images: [image] } } : {}),
  };
}
