"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { languages, translations } from "./translations";
import { DEFAULT_LANG, LANG_COOKIE, isLanguage, type Language } from "./config";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLang = DEFAULT_LANG,
}: {
  children: React.ReactNode;
  initialLang?: Language;
}) {
  const router = useRouter();
  const [lang, setLangState] = React.useState<Language>(isLanguage(initialLang) ? initialLang : DEFAULT_LANG);

  // The server decides the language (cookie or URL prefix); follow it when it changes.
  React.useEffect(() => {
    if (isLanguage(initialLang)) setLangState(initialLang);
  }, [initialLang]);

  const meta = languages.find((l) => l.code === lang)!;
  const t = translations[lang];

  const setLang = React.useCallback(
    (next: Language) => {
      if (!isLanguage(next)) return;
      setLangState(next);
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      try {
        localStorage.setItem(LANG_COOKIE, next);
      } catch {
        /* private mode */
      }
      // Re-render server components (html lang/dir, server-rendered content) with the new cookie.
      router.refresh();
    },
    [router],
  );

  React.useEffect(() => {
    const root = document.documentElement;
    root.dir = meta.dir;
    root.lang = lang;
    // Toggle classes instead of overwriting className — next/font classes live on <html>.
    for (const l of languages) {
      root.classList.remove(l.code);
      document.body.classList.remove(`lang-${l.code}`);
    }
    root.classList.add(lang);
    document.body.classList.add(`lang-${lang}`);
  }, [lang, meta.dir]);

  const value = React.useMemo(
    () => ({ lang, setLang, t, dir: meta.dir, isRTL: meta.dir === "rtl" }),
    [lang, setLang, t, meta.dir],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
