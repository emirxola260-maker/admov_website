"use client";

import * as React from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localePath } from "@/lib/i18n/paths";
import { clearGaCookies, readConsent, writeConsent, type ConsentChoice } from "@/lib/consent";

type ConsentApi = { enabled: boolean; openSettings: () => void };
const ConsentContext = React.createContext<ConsentApi>({ enabled: false, openSettings: () => {} });

/** Lets the footer reopen the banner so consent can be withdrawn as easily as given. */
export const useConsent = () => React.useContext(ConsentContext);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Cookie consent for Google Analytics, using Google Consent Mode v2.
 *
 * The GA tag in the root layout starts with every storage type denied, so
 * nothing is written until someone accepts here. Accept and Reject are the
 * same size and the same distance away: refusing has to be as easy as agreeing.
 */
export function ConsentProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (enabled && readConsent() === null) setOpen(true);
  }, [enabled]);

  const decide = React.useCallback((choice: ConsentChoice) => {
    writeConsent(choice);
    window.gtag?.("consent", "update", { analytics_storage: choice });
    if (choice === "denied") clearGaCookies();
    setOpen(false);
  }, []);

  const api = React.useMemo<ConsentApi>(() => ({ enabled, openSettings: () => setOpen(true) }), [enabled]);

  return (
    <ConsentContext.Provider value={api}>
      {children}
      {enabled && open && <ConsentBanner onDecide={decide} />}
    </ConsentContext.Provider>
  );
}

function ConsentBanner({ onDecide }: { onDecide: (choice: ConsentChoice) => void }) {
  const { t, lang } = useLanguage();
  const c = t.consent;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={c.settings}
      className="fixed bottom-4 inset-x-4 md:inset-x-auto md:start-6 md:max-w-md z-[60] rounded-2xl border border-white/15 bg-zinc-900/95 backdrop-blur-xl p-5 shadow-2xl shadow-black/50"
    >
      <div className="flex items-start gap-3">
        <Cookie size={20} className="text-violet shrink-0 mt-0.5" aria-hidden />
        <p className="text-sm text-zinc-300 leading-relaxed">
          {c.text}{" "}
          <Link href={localePath(lang, "/privacy")} className="text-violet hover:text-violet-light underline underline-offset-2">
            {c.policy}
          </Link>
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onDecide("denied")}
          className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-syne font-bold text-zinc-100 hover:border-violet/60 transition-colors"
        >
          {c.reject}
        </button>
        <button
          type="button"
          onClick={() => onDecide("granted")}
          className="rounded-full bg-violet px-4 py-2.5 text-sm font-syne font-bold text-zinc-950 hover:bg-violet-light transition-colors"
        >
          {c.accept}
        </button>
      </div>
    </div>
  );
}

/** Footer control for changing the choice later. Hidden where analytics is off. */
export function ConsentSettingsButton({ className }: { className?: string }) {
  const { enabled, openSettings } = useConsent();
  const { t } = useLanguage();
  if (!enabled) return null;
  return (
    <button type="button" onClick={openSettings} className={className}>
      {t.consent.settings}
    </button>
  );
}
