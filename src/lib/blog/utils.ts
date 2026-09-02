import { DEFAULT_LANG, SUPPORTED_LANGS, isLanguage, type Language } from "@/i18n/config";

/** Pick the localized value, falling back to English. */
export function pickLang<T>(obj: Partial<Record<Language, T>> | null | undefined, lang: Language): T | undefined {
  return obj?.[lang] ?? obj?.[DEFAULT_LANG];
}

/** Rough reading time (200 words/min), never below one minute. */
export function readingMinutes(markdown: string | undefined): number {
  const words = (markdown ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** `/blog[/slug]` for English, `/ar/blog[/slug]` and `/tr/blog[/slug]` otherwise. */
export function blogHref(lang: Language, slug?: string): string {
  const base = lang === DEFAULT_LANG ? "/blog" : `/${lang}/blog`;
  return slug ? `${base}/${slug}` : base;
}

/** Map a blog pathname to its equivalent in another language; null when not a blog path. */
export function localizeBlogPath(pathname: string, lang: Language): string | null {
  const m = pathname.match(/^\/(?:(ar|tr)\/)?blog(?:\/([^/?#]+))?\/?$/);
  if (!m) return null;
  return blogHref(lang, m[2]);
}

/** Language encoded in a blog pathname (`/ar/blog/...` → "ar", `/blog` → "en"); null if not a blog path. */
export function blogLangFromPath(pathname: string): Language | null {
  const m = pathname.match(/^\/(?:(ar|tr)\/)?blog(?:\/|$)/);
  if (!m) return null;
  return isLanguage(m[1]) ? m[1] : DEFAULT_LANG;
}

export function formatPostDate(iso: string | null | undefined, lang: Language): string {
  if (!iso) return "";
  const locale = lang === "ar" ? "ar" : lang === "tr" ? "tr-TR" : "en-US";
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(iso));
}

export function hreflangAlternates(siteUrl: string, slug?: string): Record<string, string> {
  const languages = Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${siteUrl}${blogHref(l, slug)}`]));
  return { ...languages, "x-default": `${siteUrl}${blogHref(DEFAULT_LANG, slug)}` };
}

export function wordCount(markdown: string | undefined): number {
  return (markdown ?? "").split(/\s+/).filter(Boolean).length;
}
