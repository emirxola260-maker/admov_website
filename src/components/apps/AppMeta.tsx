"use client";

import { Globe, Monitor, Smartphone } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatPrice, isPaid, type AppItem, type Platform } from "@/lib/apps/types";

const ICONS: Record<Platform, typeof Globe> = {
  ios: Smartphone,
  android: Smartphone,
  macos: Monitor,
  windows: Monitor,
  web: Globe,
};

export function PlatformBadges({ platforms }: { platforms: Platform[] }) {
  const { t } = useLanguage();
  if (!platforms?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {platforms.map((p) => {
        const Icon = ICONS[p] ?? Globe;
        return (
          <span
            key={p}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300"
          >
            <Icon size={12} aria-hidden />
            {t.apps.platforms[p] ?? p}
          </span>
        );
      })}
    </div>
  );
}

/** Price, or the store note for listings we cannot charge for. */
export function AppPrice({ app, large = false }: { app: AppItem; large?: boolean }) {
  const { t, lang } = useLanguage();
  if (!isPaid(app.fulfilment)) {
    return <span className="text-sm text-zinc-500">{t.apps.storeNote}</span>;
  }
  const suffix = app.billing === "one_time" ? "" : t.apps.billing[app.billing];
  return (
    <span className="flex items-baseline gap-1 flex-wrap">
      <span
        className={`font-syne font-extrabold text-zinc-50 ${large ? "text-4xl" : "text-2xl"}`}
        style={{ fontVariantNumeric: "tabular-nums" }}
        dir="ltr"
      >
        {formatPrice(app.price_cents, app.currency, lang)}
      </span>
      {suffix && <span className="text-sm text-zinc-400">{suffix}</span>}
    </span>
  );
}
