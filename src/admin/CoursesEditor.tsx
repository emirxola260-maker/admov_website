"use client";

import * as React from "react";
import { Plus, Trash2, Loader2, ExternalLink } from "lucide-react";
import { Field, Input, Textarea, Button, Pill, Card, Notice, Toggle } from "./ui";
import { listAppsAdmin, saveApp, deleteApp } from "@/lib/apps/client";
import { revalidateTags } from "@/lib/admin/api";
import { courseLangs, EMPTY_APP, formatPrice, isCourse, type AppInput, type AppItemAdmin } from "@/lib/apps/types";

type Lang = "en" | "ar" | "tr";

/** A course is an apps row with kind 'course' — this is what a new one starts as. */
const NEW_COURSE: AppInput = {
  ...EMPTY_APP,
  kind: "course",
  fulfilment: "enrolment",
  platforms: ["web"],
  billing: "one_time",
  tagline: {},
  description: {},
  features: {},
  curriculum_md: {},
};

const LANG_NAME: Record<Lang, string> = { en: "English", ar: "Arabic", tr: "Turkish" };

/**
 * Courses share the apps table and its Stripe checkout. Saving a course with
 * a curriculum in a language is what makes it — and the Courses nav link —
 * appear on that language's site.
 */
export function CoursesEditor({ lang }: { lang: Lang }) {
  const [courses, setCourses] = React.useState<AppItemAdmin[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [draft, setDraft] = React.useState<(AppInput & { id?: string }) | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      setCourses((await listAppsAdmin()).filter(isCourse));
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not load courses";
      setError(
        /apps/.test(message) && /schema cache|does not exist/.test(message)
          ? "The store tables don't exist yet. Run docs/security/supabase-apps-store.sql in the Supabase SQL editor — it also creates both courses as drafts."
          : message,
      );
    }
    setLoading(false);
  }, []);
  React.useEffect(() => void load(), [load]);

  const commit = async () => {
    if (!draft) return;
    if (!draft.name.trim() || !draft.slug.trim()) return setError("Name and slug are required.");
    if (draft.status === "published" && !draft.price_cents) {
      return setError("Set a price before publishing — or keep it as a draft.");
    }
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

  const remove = async (course: AppItemAdmin) => {
    if (!confirm(`Delete “${course.name}”? This cannot be undone.`)) return;
    try {
      await deleteApp(course.id);
      await revalidateTags(["apps"]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete");
    }
  };

  const set = <K extends keyof AppInput>(key: K, value: AppInput[K]) => setDraft((d) => (d ? { ...d, [key]: value } : d));
  const setLocalized = (key: "tagline" | "description" | "curriculum_md" | "duration" | "level" | "format" | "project", value: string) =>
    setDraft((d) => (d ? { ...d, [key]: { ...(d[key] ?? {}), [lang]: value } } : d));
  const setOutcomes = (value: string) =>
    setDraft((d) =>
      d ? { ...d, features: { ...d.features, [lang]: value.split("\n").map((l) => l.trim()).filter(Boolean) } } : d,
    );

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#5749C2]" size={32} /></div>;
  }

  const draftLangs = draft ? courseLangs(draft) : [];

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {error && <Notice tone="error">{error}</Notice>}

      {!draft && (
        <div className="flex justify-between items-center flex-wrap gap-3">
          <p className="text-sm text-stone-500">{courses.length} course{courses.length === 1 ? "" : "s"}</p>
          <Button onClick={() => setDraft({ ...NEW_COURSE, sort_order: (courses.at(-1)?.sort_order ?? 0) + 10 })}>
            <Plus size={16} /> New course
          </Button>
        </div>
      )}

      {draft && (
        <Card>
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Name"><Input value={draft.name} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Slug" hint="Used in the URL: /courses/your-slug">
                <Input value={draft.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} dir="ltr" />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Price" hint="In cents — 29900 means $299.00.">
                <Input
                  type="number" min={0} dir="ltr"
                  value={draft.price_cents ?? ""}
                  onChange={(e) => set("price_cents", e.target.value ? Number(e.target.value) : null)}
                />
              </Field>
              <Field label="Currency"><Input value={draft.currency} onChange={(e) => set("currency", e.target.value.toLowerCase())} dir="ltr" placeholder="usd" /></Field>
              <Field label="Stripe price ID" hint="Optional.">
                <Input value={draft.stripe_price_id ?? ""} onChange={(e) => set("stripe_price_id", e.target.value)} dir="ltr" placeholder="price_..." />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Field label={`Duration — ${LANG_NAME[lang]}`} hint="Shown as written, e.g. ٦ أسابيع."><Input value={draft.duration?.[lang] ?? ""} onChange={(e) => setLocalized("duration", e.target.value)} /></Field>
              <Field label={`Level — ${LANG_NAME[lang]}`} hint="e.g. مبتدئ"><Input value={draft.level?.[lang] ?? ""} onChange={(e) => setLocalized("level", e.target.value)} /></Field>
              <Field label="Image URL" hint="Optional cover image."><Input value={draft.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} dir="ltr" /></Field>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-3">Content — {LANG_NAME[lang]}</p>
              <div className="space-y-4">
                <Field label="One-line summary"><Input value={draft.tagline[lang] ?? ""} onChange={(e) => setLocalized("tagline", e.target.value)} /></Field>
                <Field label="Short description"><Textarea rows={3} value={draft.description[lang] ?? ""} onChange={(e) => setLocalized("description", e.target.value)} /></Field>
                <Field label="What students will be able to do" hint="One per line.">
                  <Textarea rows={5} value={(draft.features[lang] ?? []).join("\n")} onChange={(e) => setOutcomes(e.target.value)} />
                </Field>
                <Field label="Curriculum" hint="Markdown: ## for sections, ### for modules, - for bullets. A course appears on a language's site only once this is filled in for that language.">
                  <Textarea
                    rows={18}
                    value={draft.curriculum_md?.[lang] ?? ""}
                    onChange={(e) => setLocalized("curriculum_md", e.target.value)}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    className="font-mono text-sm"
                  />
                </Field>
              </div>
            </div>

            {draft.status === "published" && draftLangs.length === 0 && (
              <Notice tone="error">This course has no curriculum in any language, so it won't appear anywhere on the site.</Notice>
            )}
            {draftLangs.length > 0 && (
              <Notice tone="info">Appears on the site in: {draftLangs.map((l) => LANG_NAME[l as Lang]).join(", ")}.</Notice>
            )}

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
          {courses.length === 0 && !error && <Notice tone="info">No courses yet. Add one — it stays a draft until you publish it.</Notice>}
          {courses.map((course) => {
            const langs = courseLangs(course);
            return (
              <Card key={course.id}>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-stone-800">{course.name}</span>
                      <Pill tone={course.status === "published" ? "green" : "amber"}>{course.status}</Pill>
                      {course.price_cents ? (
                        <Pill tone="neutral">{formatPrice(course.price_cents, course.currency, "en")}</Pill>
                      ) : (
                        <Pill tone="red">no price yet</Pill>
                      )}
                    </div>
                    <p className="text-sm text-stone-500 mt-1">
                      {langs.length ? `Curriculum in ${langs.map((l) => LANG_NAME[l as Lang]).join(", ")}` : "No curriculum yet"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {course.status === "published" && langs[0] && (
                      <a
                        href={`${langs[0] === "en" ? "" : `/${langs[0]}`}/courses/${course.slug}`}
                        target="_blank" rel="noopener noreferrer"
                        className="p-2 text-stone-400 hover:text-[#5749C2]" aria-label="Open"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <Button variant="ghost" onClick={() => setDraft({ ...NEW_COURSE, ...course })}>Edit</Button>
                    <button onClick={() => remove(course)} className="p-2 text-stone-400 hover:text-red-500" aria-label="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
