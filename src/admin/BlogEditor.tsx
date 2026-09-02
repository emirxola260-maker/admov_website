"use client";

import * as React from "react";
import { Eye, ExternalLink, Loader2, Plus, RefreshCw, Sparkles, Trash2, X } from "lucide-react";
import { SUPPORTED_LANGS, type Language } from "@/i18n/config";
import type { Post, PostStatus } from "@/lib/blog/types";
import {
  addTopic,
  createManualPost,
  deletePost,
  deleteTopic,
  listPostsAdmin,
  listTopics,
  updatePost,
  type PostTopic,
} from "@/lib/blog/client";
import { adminFetch, revalidateTags } from "@/lib/admin/api";
import { blogHref, wordCount } from "@/lib/blog/utils";
import { slugify } from "@/lib/blog/slug";
import { PILLARS } from "@/lib/blog/prompts";
import { PostArticle } from "@/components/blog/PostArticle";
import { Button, Card, Field, Input, Notice, Pill, Select, Textarea } from "./ui";

const STATUS_TONE: Record<PostStatus, "neutral" | "green" | "amber" | "red" | "violet" | "blue"> = {
  generating: "blue",
  draft: "amber",
  published: "green",
  rejected: "red",
  failed: "red",
  archived: "neutral",
};

function fmt(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function BlogEditor({ lang }: { lang: Language }) {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [topics, setTopics] = React.useState<PostTopic[]>([]);
  const [filter, setFilter] = React.useState<"all" | PostStatus>("all");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<Post | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [preview, setPreview] = React.useState<Post | null>(null);
  const [previewLang, setPreviewLang] = React.useState<Language>("en");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [genTopic, setGenTopic] = React.useState("");
  const [newTopic, setNewTopic] = React.useState("");

  const reload = React.useCallback(async () => {
    try {
      const [p, t] = await Promise.all([listPostsAdmin(), listTopics()]);
      setPosts(p);
      setTopics(t);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };
  const fail = (e: unknown, fallback: string) => setError(e instanceof Error ? e.message : fallback);

  const generateNow = async () => {
    setBusy("generate");
    setError(null);
    setNotice("Generating a new draft with GPT — this takes 1–3 minutes. You'll also get a Telegram message when it's ready.");
    try {
      const r = await adminFetch<{ ok: boolean; slug?: string; error?: string; skipped?: boolean }>("/api/admin/posts", {
        action: "generate-now",
        topic: genTopic.trim() || undefined,
      });
      if (!r.ok) throw new Error(r.error || "Generation failed");
      setGenTopic("");
      await reload();
      flash(`Draft ready: ${r.slug}`);
    } catch (e) {
      setNotice(null);
      fail(e, "Generation failed");
    } finally {
      setBusy(null);
    }
  };

  const regenerate = async (post: Post, which: "ar" | "tr" | "all") => {
    setBusy(`regen:${post.id}`);
    setError(null);
    try {
      const r = await adminFetch<{ ok: boolean; error?: string }>("/api/admin/posts", {
        action: "regenerate",
        id: post.id,
        lang: which === "all" ? undefined : which,
      });
      if (!r.ok) throw new Error(r.error || "Regeneration failed");
      await reload();
      flash(which === "all" ? "Post regenerated" : `${which.toUpperCase()} version regenerated`);
    } catch (e) {
      fail(e, "Regeneration failed");
    } finally {
      setBusy(null);
    }
  };

  const setStatus = async (post: Post, status: PostStatus) => {
    setBusy(`status:${post.id}`);
    try {
      await updatePost(post.id, {
        status,
        ...(status === "published" ? { published_at: post.published_at ?? new Date().toISOString(), approval_token_hash: null } : {}),
      });
      await revalidateTags(["posts", `post:${post.slug}`]);
      await reload();
      flash(status === "published" ? "Published" : `Marked as ${status}`);
    } catch (e) {
      fail(e, "Update failed");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (post: Post) => {
    if (!window.confirm(`Delete "${post.title?.en ?? post.slug}"? This cannot be undone.`)) return;
    try {
      await deletePost(post.id);
      await revalidateTags(["posts", `post:${post.slug}`]);
      await reload();
      flash("Deleted");
    } catch (e) {
      fail(e, "Delete failed");
    }
  };

  const newManual = async () => {
    try {
      const p = await createManualPost();
      await reload();
      setEditing(p);
    } catch (e) {
      fail(e, "Could not create post");
    }
  };

  const saveEditing = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const slug = slugify(editing.slug || editing.title?.en || "post");
      await updatePost(editing.id, {
        slug,
        pillar: editing.pillar,
        tags: editing.tags,
        cover_image_url: editing.cover_image_url || null,
        title: editing.title,
        excerpt: editing.excerpt,
        body_md: editing.body_md,
        meta: editing.meta,
      });
      await revalidateTags(["posts", `post:${slug}`, `post:${editing.slug}`]);
      await reload();
      setEditing(null);
      flash("Post saved");
    } catch (e) {
      fail(e, "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeTopic = async (id: string) => {
    try {
      await deleteTopic(id);
      setTopics(await listTopics());
    } catch (e) {
      fail(e, "Could not remove topic");
    }
  };

  const submitTopic = async () => {
    if (!newTopic.trim()) return;
    try {
      await addTopic(newTopic.trim());
      setNewTopic("");
      setTopics(await listTopics());
    } catch (e) {
      fail(e, "Could not add topic");
    }
  };

  const setLocalized = (key: "title" | "excerpt" | "body_md", value: string) => {
    if (!editing) return;
    setEditing({ ...editing, [key]: { ...editing[key], [lang]: value } });
  };
  const setMeta = (key: "seoTitle" | "seoDescription" | "keywords", value: string) => {
    if (!editing) return;
    const current = editing.meta?.[lang] ?? {};
    const next = key === "keywords" ? { ...current, keywords: value.split(",").map((k) => k.trim()).filter(Boolean) } : { ...current, [key]: value };
    setEditing({ ...editing, meta: { ...editing.meta, [lang]: next } });
  };

  const visible = posts.filter((p) => filter === "all" || p.status === filter);
  const queued = topics.filter((t) => t.status === "queued");
  const dir = lang === "ar" ? "rtl" : "ltr";

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-stone-500 text-sm">
        <Loader2 size={18} className="animate-spin" /> Loading posts…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone={busy === "generate" ? "info" : "success"}>{notice}</Notice>}

      {/* AI writer */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#5749C2]" />
          <h3 className="text-lg font-bold" style={{ fontFamily: "var(--next-font-syne), sans-serif" }}>AI writer</h3>
        </div>
        <p className="text-sm text-stone-500">
          A new trilingual draft is generated automatically every day (Vercel Cron) and sent to Telegram for approval. Use this to generate one right now — with a specific topic or let the model pick the next pillar.
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <Input value={genTopic} onChange={(e) => setGenTopic(e.target.value)} placeholder="Optional topic, e.g. “AI product photos for perfume brands”" />
          <Button onClick={generateNow} disabled={busy === "generate"} className="shrink-0">
            {busy === "generate" ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Generate now
          </Button>
        </div>
        <div className="border-t border-[#eae7e7] pt-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-2">Topic queue ({queued.length})</div>
          <p className="text-xs text-stone-400 mb-3">Queued topics are used first by the daily generator, oldest first.</p>
          <div className="flex gap-2 mb-3">
            <Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitTopic()} placeholder="Add a topic for a future post" />
            <Button variant="secondary" onClick={submitTopic} className="shrink-0"><Plus size={14} /> Add</Button>
          </div>
          {queued.length > 0 && (
            <ul className="space-y-1.5">
              {queued.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 text-sm bg-[#F6F3F2] rounded-lg px-3 py-2">
                  <span className="text-[#1B1C1C]">{t.topic}</span>
                  <button onClick={() => removeTopic(t.id)} className="text-stone-400 hover:text-red-600" aria-label="Remove topic"><X size={14} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      {/* Editor */}
      {editing && (
        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold" style={{ fontFamily: "var(--next-font-syne), sans-serif" }}>Edit post</h3>
              <p className="text-xs text-stone-500 mt-1">Editing the <b>{lang.toUpperCase()}</b> version — switch the language tab above to edit the others.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowPreview((v) => !v)}><Eye size={14} /> {showPreview ? "Hide preview" : "Preview"}</Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X size={14} /> Close</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <Field label="Slug (shared by all languages)">
              <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </Field>
            <Field label="Pillar">
              <Select value={editing.pillar ?? ""} onChange={(e) => setEditing({ ...editing, pillar: e.target.value || null })}>
                <option value="">—</option>
                {PILLARS.map((p) => (<option key={p.id} value={p.id}>{p.label}</option>))}
              </Select>
            </Field>
            <Field label="Tags (comma separated)">
              <Input value={editing.tags.join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Cover image URL (optional — a branded card is generated otherwise)" className="md:col-span-3">
              <Input value={editing.cover_image_url ?? ""} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} placeholder="https://" />
            </Field>
          </div>

          <div className="rounded-xl bg-[#F6F3F2] p-4 space-y-4">
            <Field label={`Title (${lang.toUpperCase()})`}>
              <Input dir={dir} value={editing.title?.[lang] ?? ""} onChange={(e) => setLocalized("title", e.target.value)} />
            </Field>
            <Field label="Excerpt">
              <Textarea dir={dir} rows={2} value={editing.excerpt?.[lang] ?? ""} onChange={(e) => setLocalized("excerpt", e.target.value)} />
            </Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="SEO title" hint={`${(editing.meta?.[lang]?.seoTitle ?? "").length}/60`}>
                <Input dir={dir} value={editing.meta?.[lang]?.seoTitle ?? ""} onChange={(e) => setMeta("seoTitle", e.target.value)} />
              </Field>
              <Field label="Keywords (comma separated)">
                <Input dir={dir} value={(editing.meta?.[lang]?.keywords ?? []).join(", ")} onChange={(e) => setMeta("keywords", e.target.value)} />
              </Field>
              <Field label="SEO description" hint={`${(editing.meta?.[lang]?.seoDescription ?? "").length}/155`} className="md:col-span-2">
                <Textarea dir={dir} rows={2} value={editing.meta?.[lang]?.seoDescription ?? ""} onChange={(e) => setMeta("seoDescription", e.target.value)} />
              </Field>
            </div>
            <Field label={`Body — Markdown (${wordCount(editing.body_md?.[lang])} words)`}>
              <Textarea dir={dir} rows={18} value={editing.body_md?.[lang] ?? ""} onChange={(e) => setLocalized("body_md", e.target.value)} className="font-mono text-xs" />
            </Field>
            {showPreview && (
              <div className="rounded-2xl bg-zinc-950 p-6 md:p-8">
                <h2 className="text-3xl font-syne font-extrabold text-zinc-50 mb-6" dir={dir}>{editing.title?.[lang]}</h2>
                <PostArticle markdown={editing.body_md?.[lang] ?? ""} lang={lang} />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEditing} disabled={saving}>{saving && <Loader2 size={14} className="animate-spin" />} Save post</Button>
          </div>
        </Card>
      )}

      {/* List */}
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#eae7e7]">
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "draft", "published", "archived", "rejected", "failed"] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${filter === s ? "bg-[#5749C2] text-white" : "bg-[#F6F3F2] text-stone-500 hover:text-[#1B1C1C]"}`}>
                {s} {s !== "all" && <span className="opacity-60">({posts.filter((p) => p.status === s).length})</span>}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={newManual}><Plus size={14} /> New manual post</Button>
        </div>
        {visible.length === 0 ? (
          <div className="p-10 text-center text-stone-500 text-sm">No posts here yet.</div>
        ) : (
          <ul className="divide-y divide-[#eae7e7]">
            {visible.map((p) => {
              const title = p.title?.[lang] || p.title?.en || p.slug;
              const isBusy = busy?.endsWith(p.id) ?? false;
              return (
                <li key={p.id} className="px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill tone={STATUS_TONE[p.status]}>{p.status}</Pill>
                      {p.pillar && <Pill tone="violet">{p.pillar}</Pill>}
                      <span className="font-bold text-[#1B1C1C] truncate" dir={dir}>{title}</span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1 flex flex-wrap gap-x-3">
                      <span>Generated {fmt(p.generated_at)}</span>
                      {p.published_at && <span>Published {fmt(p.published_at)}</span>}
                      <span>{SUPPORTED_LANGS.map((l) => `${l.toUpperCase()} ${wordCount(p.body_md?.[l])}w`).join(" · ")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Button variant="ghost" size="sm" onClick={() => { setPreview(p); setPreviewLang(lang); }}><Eye size={14} /> Preview</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(p); setShowPreview(false); }}>Edit</Button>
                    {p.status === "published" ? (
                      <Button variant="secondary" size="sm" disabled={isBusy} onClick={() => setStatus(p, "archived")}>Unpublish</Button>
                    ) : (
                      <Button size="sm" disabled={isBusy || p.status === "generating"} onClick={() => setStatus(p, "published")}>Publish</Button>
                    )}
                    <Button variant="ghost" size="sm" disabled={isBusy} onClick={() => regenerate(p, "ar")} title="Re-localize Arabic"><RefreshCw size={12} /> AR</Button>
                    <Button variant="ghost" size="sm" disabled={isBusy} onClick={() => regenerate(p, "tr")} title="Re-localize Turkish"><RefreshCw size={12} /> TR</Button>
                    <Button variant="ghost" size="sm" disabled={isBusy} onClick={() => regenerate(p, "all")} title="Regenerate the whole post on the same topic"><RefreshCw size={12} /> All</Button>
                    {p.status === "published" && (
                      <a href={blogHref("en", p.slug)} target="_blank" rel="noopener noreferrer" className="p-2 text-stone-400 hover:text-[#5749C2]" aria-label="Open post"><ExternalLink size={14} /></a>
                    )}
                    <button onClick={() => remove(p)} className="p-2 text-stone-400 hover:text-red-600" aria-label="Delete"><Trash2 size={14} /></button>
                    {isBusy && <Loader2 size={14} className="animate-spin text-[#5749C2]" />}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center overflow-y-auto p-4 md:p-10" onClick={() => setPreview(null)}>
          <div className="w-full max-w-3xl bg-zinc-950 rounded-3xl p-6 md:p-10 text-zinc-50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex gap-1 bg-white/5 rounded-full p-1">
                {SUPPORTED_LANGS.map((l) => (
                  <button key={l} onClick={() => setPreviewLang(l)} className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${previewLang === l ? "bg-violet text-white" : "text-zinc-400"}`}>{l}</button>
                ))}
              </div>
              <button onClick={() => setPreview(null)} className="text-zinc-400 hover:text-white" aria-label="Close"><X size={20} /></button>
            </div>
            <div dir={previewLang === "ar" ? "rtl" : "ltr"} className={previewLang === "ar" ? "font-changa" : undefined}>
              <h2 className="text-3xl md:text-4xl font-syne font-extrabold mb-3">{preview.title?.[previewLang] ?? "—"}</h2>
              <p className="text-zinc-400 mb-8">{preview.excerpt?.[previewLang]}</p>
              <PostArticle markdown={preview.body_md?.[previewLang] ?? "_No content for this language yet._"} lang={previewLang} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
