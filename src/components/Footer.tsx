import * as React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,0 100,100 0,100" fill="#A49BFF" />
                <polygon points="50,50 75,100 25,100" fill="#7367F0" />
              </svg>
            </div>
            <span className="logo-text font-extrabold text-2xl tracking-tighter text-zinc-50">
              ADMOV
            </span>
          </div>

          <div className="flex gap-8">
            <Link to="/support" className="text-sm text-zinc-400 hover:text-violet transition-colors">{t.footer.support}</Link>
            <Link to="/privacy" className="text-sm text-zinc-400 hover:text-violet transition-colors">{t.footer.privacy}</Link>
            <Link to="/terms" className="text-sm text-zinc-400 hover:text-violet transition-colors">{t.footer.terms}</Link>
          </div>

          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} ADMOV. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
