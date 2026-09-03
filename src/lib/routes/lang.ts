import { notFound } from "next/navigation";
import { DEFAULT_LANG, isLanguage, type Language } from "@/i18n/config";

/**
 * English lives at the bare path, so only `ar` and `tr` are valid inside the
 * `[lang]` segment. Anything else (including "en" and stray paths like /foo)
 * is a 404 — this keeps one canonical URL per page and per language.
 */
export function resolveLang(lang: string): Language {
  if (!isLanguage(lang) || lang === DEFAULT_LANG) notFound();
  return lang;
}

export type LangParams = { params: Promise<{ lang: string }> };
