"use client";

import * as React from "react";
import { Plus, Trash2, Loader2, ExternalLink } from "lucide-react";
import { Field, Input, Textarea, Select, Button, Pill, Card, Notice, Toggle } from "./ui";
import { listAppsAdmin, saveApp, deleteApp } from "@/lib/apps/client";
import { revalidateTags } from "@/lib/admin/api";
import {
  BILLINGS, EMPTY_APP, PLATFORMS, STORE_FULFILMENTS, STORE_KINDS, formatPrice, isCourse, isPaid,
  type AppInput, type AppItemAdmin, type Fulfilment, type Platform,
} from "@/lib/apps/types";

type Lang = "en" | "ar" | "tr";

const FULFILMENT_HELP: Record<Fulfilment, string> = {
  store_link: "Links to the App Store, Google Play or a website. No payment — Apple and Google don't allow selling their apps elsewhere.",
  download: "Paid once, then the buyer gets a private download link that expires.",
  subscription: "Recurring payment through Stripe for access to a hosted app.",
  license: "Paid once, then the buyer gets a licence key your app checks.",
  enrolment: "A course seat — courses are managed in the Courses tab.",
};

export function AppsEditor({ lang }: { lang: Lang }) {
  const [apps, setApps] = React.useState<AppItemAdmin[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [draft, setDraft] = React.useState<(AppInput & { id?: string }) | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      setApps((await listAppsAdmin()).filter((a) => !isCourse(a)));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load apps");
    }
    setLoading(false);
  }, []);
  React.useEffect(() => void load(), [load]);

  const commit = async () => {
    if (!draft) return;
    if (!draft.slug.trim() || !draft.name.trim()) return setError("Name and slug are required.");
    if (draft.status === "published" && isPaid(draft.fulfilment) && !draft.price_cents)
      return setError("Set a price before publishing a paid app — or save it as a draft.");
    if (draft.fulfilment === "store_link" && !draft.store_url?.trim()) return setError("A store listing needs a link.");
    setBusy(true);
    try {
      await saveApp(draft);
      await revalidateTags(["apps"]);
      setDraft(null);
      setError(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    }
    setBusy(false);
  };

  const remove = async (app: AppItemAdmin) => {
    if (!confirm(`Delete “${app.name}”? This cannot be undone.`)) return;
    try {
      await deleteApp(app.id);
      await revalidateTags(["apps"]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete");
    }
  };

  const set = <K extends keyof AppInput>(key: K, value: AppInput[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const setLocalized = (key: "tagline" | "description", value: string) =>
    setDraft((d) => (d ? { ...d, [key]: { ...d[key], [lang]: value } } : d));

  const setFeatures = (value: string) =>
    setDraft((d) =>
      d ? { ...d, features: { ...d.features, [lang]: value.split("\n").map((f) => f.trim()).filter(Boolean) } } : d,
    );

  const togglePlatform = (p: Platform) =>
    setDraft((d) =>
      d ? { ...d, platforms: d.platforms.includes(p) ? d.platforms.filter((x) => x !== p) : [...d.platforms, p] } : d,
    );

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#5749C2]" size={32} /></div>;
  }

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {error && <Notice tone="error">{error}</Notice>}

      {!draft && (
        <div className="flex justify-between items-center flex-wrap gap-3">
          <p className="text-sm text-stone-500">{apps.length} app{apps.length === 1 ? "" : "s"}</p>
          <Button onClick={() => setDraft({ ...EMPTY_APP, sort_order: (apps.at(-1)?.sort_order ?? 0) + 10 })}>
            <Plus size={16} /> New app
          </Button>
        </div>
      )}

      {draft && (
        <Card>
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Name"><Input value={draft.name} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Slug" hint="Used in the URL: /apps/your-slug">
                <Input value={draft.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} dir="ltr" />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Type">
                <Select value={draft.kind} onChange={(e) => set("kind", e.target.value as AppInput["kind"])}>
                  {STORE_KINDS.map((k) => <option key={k} value={k}>{k.replace("_", " ")}</option>)}
                </Select>
              </Field>
              <Field label="Platforms">
                <div className="flex flex-wrap gap-2 pt-1">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                        draft.platforms.includes(p) ? "bg-[#5749C2] text-white border-[#5749C2]" : "border-stone-300 text-stone-500"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="How it's delivered" hint={FULFILMENT_HELP[draft.fulfilment]}>
              <Select value={draft.fulfilment} onChange={(e) => set("fulfilment", e.target.value as Fulfilment)}>
                {STORE_FULFILMENTS.map((f) => <option key={f} value={f}>{f.replace("_", " ")}</option>)}
              </Select>
            </Field>

            {draft.fulfilment === "store_link" ? (
              <Field label="Store link" hint="App Store, Google Play or the app's own site.">
                <Input value={draft.store_url ?? ""} onChange={(e) => set("store_url", e.target.value)} dir="ltr" placeholder="https://apps.apple.com/..." />
              </Field>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Price" hint="In cents — 4900 means $49.00.">
                  <Input
                    type="number" min={0} dir="ltr"
                    value={draft.price_cents ?? ""}
                    onChange={(e) => set("price_cents", e.target.value ? Number(e.target.value) : null)}
                  />
                </Field>
                <Field label="Currency">
                  <Input value={draft.currency} onChange={(e) => set("currency", e.target.value.toLowerCase())} dir="ltr" placeholder="usd" />
                </Field>
                <Field label="Billing">
                  <Select value={draft.billing} onChange={(e) => set("billing", e.target.value as AppInput["billing"])}>
                    {BILLINGS.map((b) => <option key={b} value={b}>{b.replace("_", " ")}</option>)}
                  </Select>
                </Field>
              </div>
            )}

            {draft.fulfilment === "download" && (
              <Field
                label="File location"
                hint="Object key in the private R2 bucket, e.g. downloads/myapp-1.2.dmg. Upload large files straight to R2 — they exceed what this form can post."
              >
                <Input value={draft.download_key ?? ""} onChange={(e) => set("download_key", e.target.value)} dir="ltr" />
              </Field>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Demo link" hint="Optional."><Input value={draft.demo_url ?? ""} onChange={(e) => set("demo_url", e.target.value)} dir="ltr" /></Field>
              <Field label="Stripe price ID" hint="Optional. Leave empty and we build the price from the figures above.">
                <Input value={draft.stripe_price_id ?? ""} onChange={(e) => set("stripe_price_id", e.target.value)} dir="ltr" placeholder="price_..." />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Logo URL"><Input value={draft.logo_url ?? ""} onChange={(e) => set("logo_url", e.target.value)} dir="ltr" /></Field>
              <Field label="Screenshot URL"><Input value={draft.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} dir="ltr" /></Field>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-3">Copy — {lang.toUpperCase()}</p>
              <div className="space-y-4">
                <Field label="One-line summary"><Input value={draft.tagline[lang] ?? ""} onChange={(e) => setLocalized("tagline", e.target.value)} /></Field>
                <Field label="Description"><Textarea rows={4} value={draft.description[lang] ?? ""} onChange={(e) => setLocalized("description", e.target.value)} /></Field>
                <Field label="What you get" hint="One per line.">
                  <Textarea rows={5} value={(draft.features[lang] ?? []).join("\n")} onChange={(e) => setFeatures(e.target.value)} />
                </Field>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-stone-200">
              <div className="flex items-center gap-4">
                <Toggle checked={draft.status === "published"} onChange={(v) => set("status", v ? "published" : "draft")} label={draft.status === "published" ? "Published" : "Draft"} />
                <Toggle checked={draft.featured} onChange={(v) => set("featured", v)} label="Featured" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => { setDraft(null); setError(null); }}>Cancel</Button>
                <Button onClick={commit} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {!draft && (
        <div className="space-y-3">
          {apps.length === 0 && <Notice tone="info">No apps yet. Add your first one — it stays a draft until you publish it.</Notice>}
          {apps.map((app) => (
            <Card key={app.id}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-stone-800">{app.name}</span>
                    <Pill tone={app.status === "published" ? "green" : "amber"}>{app.status}</Pill>
                    {app.featured && <Pill tone="violet">featured</Pill>}
                    <Pill tone="neutral">{app.fulfilment.replace("_", " ")}</Pill>
                  </div>
                  <p className="text-sm text-stone-500 mt-1">
                    {(app.platforms ?? []).join(" · ") || "no platform"}
                    {isPaid(app.fulfilment) && ` — ${formatPrice(app.price_cents, app.currency, "en")}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a href={`/apps/${app.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-stone-400 hover:text-[#5749C2]" aria-label="Open">
                    <ExternalLink size={16} />
                  </a>
                  <Button variant="ghost" onClick={() => setDraft({ ...EMPTY_APP, ...app })}>Edit</Button>
                  <button onClick={() => remove(app)} className="p-2 text-stone-400 hover:text-red-500" aria-label="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
