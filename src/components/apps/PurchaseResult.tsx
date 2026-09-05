"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Download, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type Result = { status: string; licenseKey?: string | null; downloadUrl?: string | null; email?: string };

/**
 * Shown after Stripe redirects back.
 *
 * The webhook that records the order can land a moment after the buyer does,
 * so this polls briefly rather than telling someone who has just paid that
 * nothing happened.
 */
export function PurchaseResult() {
  const { t } = useLanguage();
  const p = t.apps.purchase;
  const params = useSearchParams();
  const state = params.get("checkout");
  const sessionId = params.get("session_id");
  const [result, setResult] = React.useState<Result | null>(null);
  const [gaveUp, setGaveUp] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (state !== "success" || !sessionId) return;
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`);
        const data = (await res.json()) as Result;
        if (cancelled) return;
        if (data.status === "paid") return setResult(data);
      } catch {
        /* keep trying */
      }
      if (cancelled) return;
      if (attempts >= 10) return setGaveUp(true);
      setTimeout(poll, 1500);
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [state, sessionId]);

  if (state === "cancelled") {
    return <Banner tone="muted">{p.cancelled}</Banner>;
  }
  if (state !== "success") return null;

  if (!result) {
    return (
      <Banner tone="ok">
        <span className="inline-flex items-center gap-2">
          {!gaveUp && <Loader2 size={16} className="animate-spin" aria-hidden />}
          {gaveUp ? p.failed : p.pending}
        </span>
      </Banner>
    );
  }

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the value is on screen to copy by hand */
    }
  };

  return (
    <Banner tone="ok">
      <p className="font-syne font-bold text-emerald-200">{p.thanks}</p>

      {result.licenseKey && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wider text-emerald-300/70 mb-2">{p.licenseLabel}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <code dir="ltr" className="rounded-lg bg-black/30 px-4 py-2.5 font-mono text-lg text-emerald-100 select-all">
              {result.licenseKey}
            </code>
            <button
              type="button"
              onClick={() => copy(result.licenseKey!)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-400/10 transition-colors"
            >
              {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
              {copied ? p.copied : "Copy"}
            </button>
          </div>
        </div>
      )}

      {result.downloadUrl && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wider text-emerald-300/70 mb-2">{p.downloadLabel}</p>
          <a
            href={result.downloadUrl}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-syne font-bold text-emerald-950 hover:bg-emerald-300 transition-colors"
          >
            <Download size={16} aria-hidden />
            {p.downloadCta}
          </a>
        </div>
      )}

      {(result.licenseKey || result.downloadUrl) && <p className="mt-4 text-sm text-emerald-200/70">{p.keepSafe}</p>}
    </Banner>
  );
}

function Banner({ tone, children }: { tone: "ok" | "muted"; children: React.ReactNode }) {
  const styles =
    tone === "ok"
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
      : "border-white/15 bg-white/[0.04] text-zinc-300";
  return <div className={`mb-10 rounded-2xl border px-6 py-5 ${styles}`}>{children}</div>;
}
