import * as React from "react";
import { type Language, languages, translations } from "./translations";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Language>(() => {
    if (typeof window !== "undefined") {
      // 1. Use previously saved preference
      const saved = localStorage.getItem("admov-lang") as Language | null;
      if (saved && translations[saved]) return saved;

      // 2. Auto-detect from browser/OS language setting
      const browserLangs = navigator.languages ?? [navigator.language];
      for (const bl of browserLangs) {
        const code = bl.split("-")[0].toLowerCase(); // "ar-SA" → "ar"
        if (translations[code as Language]) return code as Language;
      }
    }
    return "en";
  });

  const meta = languages.find((l) => l.code === lang)!;
  const t = translations[lang];

  React.useEffect(() => {
    localStorage.setItem("admov-lang", lang);
    document.documentElement.dir = meta.dir;
    document.documentElement.lang = lang;
    document.documentElement.className = lang;
    document.body.className = `bg-zinc-950 text-zinc-50 antialiased lang-${lang}`;
  }, [lang, meta.dir]);

  const value = React.useMemo(
    () => ({ lang, setLang, t, dir: meta.dir, isRTL: meta.dir === "rtl" }),
    [lang, t, meta.dir]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
