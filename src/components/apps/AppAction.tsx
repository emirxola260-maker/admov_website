"use client";

import * as React from "react";
import { ExternalLink, Loader2, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { sanitizeHttpUrl } from "@/lib/security";
import type { AppItem } from "@/lib/apps/types";

/**
 * The call to action for one app.
 *
 * Store listings link out — Apple and Google do not permit selling their apps
 * anywhere else — while the paid kinds open a Stripe Checkout session.
 */
export function AppAction({ app, large = false }: { app: AppItem; large?: boolean }) {
  const { t, lang } = useLanguage();
  const a = t.apps;
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const size = large ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
  const base = `inline-flex items-center justify-center gap-2 rounded-full font-syne font-bold transition-all hover:scale-[1.02] active:scale-[0.99] ${size}`;
  const solid = `${base} bg-violet text-zinc-950 hover:bg-violet-light`;

  if (app.fulfilment === "store_link") {
    const url = sanitizeHttpUrl(app.store_url ?? "");
    if (!url) return null;
    const label = app.platforms.includes("ios")
      ? a.actions.appStore
      : app.platforms.includes("android")
        ? a.actions.playStore
        : a.actions.visit;
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={solid}>
        {label}
        <ExternalLink size={16} aria-hidden />
      </a>
    );
  }

  const checkout = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: app.slug, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout is unavailable right now.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout is unavailable right now.");
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={checkout} disabled={busy} className={`${solid} disabled:opacity-60`}>
        {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <ShoppingCart size={16} aria-hidden />}
        {app.fulfilment === "subscription" ? a.actions.subscribe : a.actions.buy}
      </button>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
