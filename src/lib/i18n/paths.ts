import { DEFAULT_LANG, SUPPORTED_LANGS, isLanguage, type Language } from "@/i18n/config";
import { blogHref, localizeBlogPath } from "@/lib/blog/utils";

/**
 * Marketing pages that exist in all three languages.
 *
 * English lives at the bare path (`/work`) and the other languages under a
 * prefix (`/ar/work`), matching how the blog already works. Every language
 * therefore has its own URL, which is what search engines need in order to
 * index and rank the Arabic and Turkish versions at all.
 */
export const LOCALIZED_PATHS = ["/", "/work", "/products", "/support", "/privacy", "/terms"] as const;

/** `/work` for English, `/ar/work` and `/tr/work` otherwise. */
export function localePath(lang: Language, path: string): string {
  const clean = path === "/" ? "" : path;
  if (lang === DEFAULT_LANG) return clean || "/";
  return `/${lang}${clean}`;
}

/** Drop a leading language segment: `/ar/work` → `/work`, `/work` → `/work`. */
export function stripLangPrefix(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (isLanguage(first) && first !== DEFAULT_LANG) return (`/${rest.join("/")}`).replace(/\/$/, "") || "/";
  return pathname.replace(/(.)\/$/, "$1") || "/";
}

/**
 * Same page, different language. Handles blog URLs and the marketing pages;
 * returns null for anything else so the caller can leave the URL alone.
 */
export function localizePath(pathname: string, lang: Language): string | null {
  const blog = localizeBlogPath(pathname, lang);
  if (blog) return blog;
  const base = stripLangPrefix(pathname.split(/[?#]/)[0]);
  return (LOCALIZED_PATHS as readonly string[]).includes(base) ? localePath(lang, base) : null;
}

/** hreflang map for a marketing path, including x-default. */
export function pathAlternates(siteUrl: string, path: string): Record<string, string> {
  const languages = Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${siteUrl}${localePath(l, path)}`]));
  return { ...languages, "x-default": `${siteUrl}${localePath(DEFAULT_LANG, path)}` };
}

export { blogHref };
