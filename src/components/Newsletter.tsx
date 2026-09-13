"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { VioletButton } from "./ui/VioletButton";

export function Newsletter({ source = "footer" }: { source?: string }) {
  const { t, lang } = useLanguage();
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState(""); // honeypot
  const [status, setStatus] = React.useState<"idle" | "loading" | "ok" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, source, company }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden", clipPath: "inset(50%)", pointerEvents: "none" }}
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.footer.newsletterPlaceholder}
          aria-label={t.footer.newsletterTitle}
          className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-violet/60 transition-colors"
          dir="ltr"
        />
        <VioletButton type="submit" size="sm" disabled={status === "loading"} className="shrink-0">
          {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : t.footer.newsletterButton}
        </VioletButton>
      </div>
      {status === "ok" && <p className="text-xs text-green-400">{t.footer.newsletterSuccess}</p>}
      {status === "error" && <p className="text-xs text-red-400">{t.footer.newsletterError}</p>}
    </form>
  );
}
