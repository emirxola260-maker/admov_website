"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import type { Language } from "@/i18n/config";
import { EMPTY_PRODUCT, PRODUCT_CATEGORIES, type Product, type ProductInput } from "@/lib/products/types";
import { deleteProduct, listProductsAdmin, saveProduct, setProductOrder, uploadMedia } from "@/lib/products/client";
import { MAX_UPLOAD_BYTES } from "@/lib/server/cdn-policy";
import { revalidateTags } from "@/lib/admin/api";
import { slugify } from "@/lib/blog/slug";
import { Button, Card, Field, Input, Notice, Pill, Select, Textarea, Toggle } from "./ui";

type Draft = ProductInput & { id?: string };

export function ProductsEditor({ lang }: { lang: Language }) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState<"logo_url" | "image_url" | null>(null);

  const reload = React.useCallback(async () => {
    try {
      setProducts(await listProductsAdmin());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  };

  const startNew = () => setDraft({ ...EMPTY_PRODUCT, sort_order: (products.at(-1)?.sort_order ?? 0) + 10 });
  const startEdit = (p: Product) =>
    setDraft({
      id: p.id,
      slug: p.slug,
      name: p.name,
      status: p.status,
      featured: p.featured,
      sort_order: p.sort_order,
      category: p.category,
      badges: p.badges ?? [],
      url: p.url ?? "",
      logo_url: p.logo_url ?? "",
      image_url: p.image_url ?? "",
      video_url: p.video_url ?? "",
      tagline: { ...p.tagline },
      description: { ...p.description },
    });

  const save = async () => {
    if (!draft) return;
    if (!draft.name.trim()) return setError("Name is required");
    setSaving(true);
    setError(null);
    try {
      const slug = draft.slug.trim() || slugify(draft.name);
      await saveProduct({ ...draft, slug });
      await revalidateTags(["products"]);
      await reload();
      setDraft(null);
      flash("Product saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (p: Product) => {
    try {
      await saveProduct({ ...p, status: p.status === "published" ? "draft" : "published" });
      await revalidateTags(["products"]);
      await reload();
      flash(p.status === "published" ? "Unpublished" : "Published");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(p.id);
      await revalidateTags(["products"]);
      await reload();
      flash("Deleted");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= products.length) return;
    const a = products[index];
    const b = products[target];
    const next = [...products];
    next[index] = b;
    next[target] = a;
    setProducts(next);
    try {
      await setProductOrder(next.map((p, i) => ({ id: p.id, sort_order: (i + 1) * 10 })));
      await revalidateTags(["products"]);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reorder failed");
    }
  };

  const upload = async (field: "logo_url" | "image_url", file: File | undefined) => {
    if (!file || !draft) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Please use one under ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`);
      return;
    }
    // Remember which product was open: the upload spans a network round trip and
    // the admin may edit other fields, switch products, or close the drawer.
    const startedFor = draft.id;
    setUploading(field);
    setError(null);
    try {
      const url = await uploadMedia(file, "products");
      setDraft((current) => (current && current.id === startedFor ? { ...current, [field]: url } : current));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const setLocalized = (key: "tagline" | "description", value: string) => {
    if (!draft) return;
    setDraft({ ...draft, [key]: { ...draft[key], [lang]: value } });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-stone-500 text-sm">
        <Loader2 size={18} className="animate-spin" /> Loading products…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      {draft ? (
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold" style={{ fontFamily: "var(--next-font-syne), sans-serif" }}>
              {draft.id ? "Edit product" : "New product"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>
              <X size={14} /> Close
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Name">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })} placeholder="i8chat" />
            </Field>
            <Field label="Slug" hint="Used in links, e.g. /products#i8chat">
              <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })} />
            </Field>
            <Field label="Website URL">
              <Input value={draft.url ?? ""} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://" />
            </Field>
            <Field label="Category">
              <Select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Product["category"] })}>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Badges" hint="Comma separated, e.g. Live, iOS, Web">
              <Input value={draft.badges.join(", ")} onChange={(e) => setDraft({ ...draft, badges: e.target.value.split(",").map((b) => b.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Video URL (optional, plays on hover)">
              <Input value={draft.video_url ?? ""} onChange={(e) => setDraft({ ...draft, video_url: e.target.value })} placeholder="https://…/demo.mp4" />
            </Field>
            {(["logo_url", "image_url"] as const).map((field) => (
              <Field key={field} label={field === "logo_url" ? "Logo URL" : "Screenshot / cover image URL"}>
                <div className="flex gap-2">
                  <Input value={draft[field] ?? ""} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} placeholder="https://" />
                  <label className="shrink-0 inline-flex items-center gap-2 px-3 rounded-xl border-2 border-[#5749C2]/20 text-[#5749C2] text-xs font-semibold cursor-pointer hover:bg-[#5749C2]/5">
                    {uploading === field ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Upload
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" className="hidden" onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      e.currentTarget.value = ""; // let the same file be picked again after a failure
                      upload(field, file);
                    }} />
                  </label>
                </div>
                {draft[field] && <img src={draft[field] as string} alt="" className="mt-2 h-16 rounded-lg object-contain bg-stone-100" />}
              </Field>
            ))}
          </div>

          <div className="rounded-xl bg-[#F6F3F2] p-4 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
              Copy — {lang.toUpperCase()} {lang !== "en" && <span className="normal-case tracking-normal font-medium">(falls back to English when empty)</span>}
            </div>
            <Field label="Tagline">
              <Input value={draft.tagline[lang] ?? ""} onChange={(e) => setLocalized("tagline", e.target.value)} dir={lang === "ar" ? "rtl" : "ltr"} />
            </Field>
            <Field label="Description">
              <Textarea rows={4} value={draft.description[lang] ?? ""} onChange={(e) => setLocalized("description", e.target.value)} dir={lang === "ar" ? "rtl" : "ltr"} />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Toggle checked={draft.status === "published"} onChange={(v) => setDraft({ ...draft, status: v ? "published" : "draft" })} label="Published" />
            <Toggle checked={draft.featured} onChange={(v) => setDraft({ ...draft, featured: v })} label="Featured on homepage" />
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" onClick={() => setDraft(null)}>Cancel</Button>
              <Button onClick={save} disabled={saving}>
                {saving && <Loader2 size={14} className="animate-spin" />} Save product
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button onClick={startNew}>
            <Plus size={16} /> Add product
          </Button>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-10 text-center text-stone-500 text-sm">No products yet. Add your first one above.</div>
        ) : (
          <ul className="divide-y divide-[#eae7e7]">
            {products.map((p, i) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-stone-400 hover:text-[#5749C2] disabled:opacity-30" aria-label="Move up"><ArrowUp size={14} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === products.length - 1} className="text-stone-400 hover:text-[#5749C2] disabled:opacity-30" aria-label="Move down"><ArrowDown size={14} /></button>
                </div>
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                  {p.logo_url ? <img src={p.logo_url} alt="" className="w-full h-full object-contain" /> : <span className="text-lg font-bold text-stone-400">{p.name.charAt(0)}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#1B1C1C]">{p.name}</span>
                    <Pill tone={p.status === "published" ? "green" : "amber"}>{p.status}</Pill>
                    <Pill tone="violet">{p.category}</Pill>
                    {p.featured && <Pill tone="blue">featured</Pill>}
                  </div>
                  <div className="text-xs text-stone-500 truncate mt-0.5">{p.tagline?.[lang] || p.tagline?.en || "—"}</div>
                </div>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-[#5749C2]" aria-label="Open">
                    <ExternalLink size={16} />
                  </a>
                )}
                <Button variant="secondary" size="sm" onClick={() => togglePublish(p)}>{p.status === "published" ? "Unpublish" : "Publish"}</Button>
                <Button variant="ghost" size="sm" onClick={() => startEdit(p)}>Edit</Button>
                <button onClick={() => remove(p)} className="text-stone-400 hover:text-red-600" aria-label="Delete"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
