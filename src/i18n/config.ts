// Language configuration shared by the proxy (edge of the request), the root
// layout (server) and the LanguageContext (client). Keep it dependency-free.
export const SUPPORTED_LANGS = ["en", "ar", "tr"] as const;
export type Language = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Language = "en";
/** Cookie that stores the visitor's language; read by src/proxy.ts on every request. */
export const LANG_COOKIE = "admov-lang";
const RTL_LANGS: readonly Language[] = ["ar"];

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export function dirFor(lang: Language): "ltr" | "rtl" {
  return RTL_LANGS.includes(lang) ? "rtl" : "ltr";
}
