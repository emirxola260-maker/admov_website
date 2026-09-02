import "server-only";
import { revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/admin";
import { generateApprovalToken, hashToken, verifyToken } from "./approval";
import { BlogGenerationError, generateDailyPost, regenerateLocalization, toPostColumns } from "./generate";
import { notifyDraft, notifyFailure, notifyPublished, notifyRejected } from "./notify";
import { PILLARS, findPillar, type ProductBrief } from "./prompts";
import { slugify, uniqueSlug } from "./slug";
import type { EnPost } from "./schema";
import type { Post } from "./types";
import { blogHref } from "./utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://admov.io";

export interface RunOptions {
  /** Skip the once-per-day guard (admin "Generate now"). */
  force?: boolean;
  topic?: string | null;
  pillar?: string | null;
}

export type RunResult =
  | { ok: true; skipped: true; postId: string; slug: string }
  | { ok: true; skipped?: false; postId: string; slug: string }
  | { ok: false; error: string; postId?: string };

async function loadContext(sb: ReturnType<typeof createServiceClient>) {
  const [{ data: recent }, { data: products }] = await Promise.all([
    sb.from("posts").select("title,pillar").in("status", ["draft", "published"]).order("generated_at", { ascending: false }).limit(30),
    sb.from("products").select("name,url,tagline").eq("status", "published").order("sort_order"),
  ]);
  const recentRows = (recent ?? []) as { title: { en?: string } | null; pillar: string | null }[];
  return {
    recentTitles: recentRows.map((r) => r.title?.en).filter((t): t is string => Boolean(t)),
    recentPillars: recentRows.map((r) => r.pillar).filter((p): p is string => Boolean(p)),
    products: ((products ?? []) as { name: string; url: string | null; tagline: { en?: string } | null }[]).map<ProductBrief>((p) => ({
      name: p.name,
      url: p.url,
      tagline: p.tagline?.en ?? null,
    })),
  };
}

/** Generate today's draft: topic queue → Claude (EN, then AR+TR) → posts row → Telegram. */
export async function runDailyGeneration(opts: RunOptions = {}): Promise<RunResult> {
  const sb = createServiceClient();

  if (!opts.force) {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const { data: existing } = await sb
      .from("posts")
      .select("id,slug")
      .gte("generated_at", start.toISOString())
      .in("status", ["generating", "draft", "published"])
      .limit(1);
    if (existing && existing.length > 0) {
      return { ok: true, skipped: true, postId: existing[0].id as string, slug: existing[0].slug as string };
    }
  }

  // Topic: explicit > queued > let the model choose within the pillar.
  let topic = opts.topic?.trim() || null;
  let topicRowId: string | null = null;
  if (!topic) {
    const { data: queued } = await sb
      .from("post_topics")
      .select("id,topic,notes")
      .eq("status", "queued")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (queued) {
      topic = queued.notes ? `${queued.topic} — ${queued.notes}` : (queued.topic as string);
      topicRowId = queued.id as string;
    }
  }

  const ctx = await loadContext(sb);

  const { data: row, error: insertError } = await sb
    .from("posts")
    .insert({ slug: `generating-${Date.now().toString(36)}`, status: "generating", topic, pillar: opts.pillar ?? null } as never)
    .select("id")
    .single();
  if (insertError || !row) return { ok: false, error: insertError?.message ?? "Could not create post row" };
  const postId = row.id as string;

  try {
    let generated;
    try {
      generated = await generateDailyPost({ ...ctx, topic, pillar: opts.pillar });
    } catch (err) {
      // A refusal on the chosen angle: try once more on the next pillar without the topic.
      if (err instanceof BlogGenerationError && err.kind === "refusal") {
        const current = findPillar(opts.pillar) ?? PILLARS[0];
        const next = PILLARS[(PILLARS.findIndex((p) => p.id === current.id) + 1) % PILLARS.length];
        generated = await generateDailyPost({ ...ctx, topic: null, pillar: next.id });
      } else {
        throw err;
      }
    }

    const base = slugify(generated.en.title);
    const { data: taken } = await sb.from("posts").select("slug").like("slug", `${base}%`);
    const slug = uniqueSlug(base, new Set(((taken ?? []) as { slug: string }[]).map((t) => t.slug)));
    const token = generateApprovalToken();

    const { error: updateError } = await sb
      .from("posts")
      .update({
        ...toPostColumns(generated, slug),
        status: "draft",
        approval_token_hash: hashToken(token),
        generated_at: new Date().toISOString(),
      } as never)
      .eq("id", postId);
    if (updateError) throw new Error(updateError.message);

    if (topicRowId) {
      await sb.from("post_topics").update({ status: "used", used_at: new Date().toISOString() } as never).eq("id", topicRowId);
    }

    await notifyDraft({
      id: postId,
      token,
      title: generated.en.title,
      excerpt: generated.en.excerpt,
      pillar: generated.pillar,
      topic: generated.topic,
      bodies: { en: generated.en.body_md, ar: generated.ar.body_md, tr: generated.tr.body_md },
    });

    return { ok: true, postId, slug };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("Blog generation failed:", message);
    await sb.from("posts").update({ status: "failed", usage: { error: message } } as never).eq("id", postId);
    await notifyFailure(message);
    return { ok: false, error: message, postId };
  }
}

/** Admin "Regenerate": one localization, or the whole post on the same topic (slug kept). */
export async function regeneratePost(id: string, lang?: "ar" | "tr"): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = createServiceClient();
  const { data } = await sb.from("posts").select("*").eq("id", id).maybeSingle();
  const post = data as unknown as Post | null;
  if (!post) return { ok: false, error: "Post not found" };
  const ctx = await loadContext(sb);

  try {
    if (lang) {
      const en: EnPost = {
        topic: post.topic ?? "",
        title: post.title.en ?? "",
        excerpt: post.excerpt.en ?? "",
        body_md: post.body_md.en ?? "",
        seoTitle: post.meta?.en?.seoTitle ?? "",
        seoDescription: post.meta?.en?.seoDescription ?? "",
        keywords: post.meta?.en?.keywords ?? [],
        tags: post.tags,
      };
      if (!en.body_md) return { ok: false, error: "The English version is empty; write it first." };
      const result = await regenerateLocalization({ lang, en, products: ctx.products });
      const { error } = await sb
        .from("posts")
        .update({
          title: { ...post.title, [lang]: result.post.title },
          excerpt: { ...post.excerpt, [lang]: result.post.excerpt },
          body_md: { ...post.body_md, [lang]: result.post.body_md },
          meta: { ...post.meta, [lang]: { seoTitle: result.post.seoTitle, seoDescription: result.post.seoDescription, keywords: result.post.keywords } },
          usage: { ...(post.usage ?? {}), [`regen_${lang}`]: result.usage },
        } as never)
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const generated = await generateDailyPost({ ...ctx, topic: post.topic, pillar: post.pillar });
      const { slug: _slug, ...columns } = toPostColumns(generated, post.slug);
      const { error } = await sb.from("posts").update(columns as never).eq("id", id);
      if (error) return { ok: false, error: error.message };
    }
    revalidateTag("posts", "max");
    revalidateTag(`post:${post.slug}`, "max");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Regeneration failed" };
  }
}

export type ApprovalResult = { ok: true; redirectTo: string } | { ok: false; status: number; error: string };

/** Approve or reject a draft using the one-time token from the Telegram link. */
export async function applyApproval(input: { id: string; token: string; action: string }): Promise<ApprovalResult> {
  const sb = createServiceClient();
  const { data } = await sb.from("posts").select("id,slug,status,title,approval_token_hash").eq("id", input.id).maybeSingle();
  const post = data as { id: string; slug: string; status: string; title: { en?: string }; approval_token_hash: string | null } | null;
  if (!post) return { ok: false, status: 404, error: "Post not found." };
  if (!verifyToken(input.token, post.approval_token_hash)) {
    return { ok: false, status: 410, error: "This approval link is invalid or has already been used." };
  }
  if (post.status !== "draft") return { ok: false, status: 409, error: `This post is already ${post.status}.` };

  const title = post.title?.en ?? post.slug;
  if (input.action === "reject") {
    await sb.from("posts").update({ status: "rejected", approval_token_hash: null } as never).eq("id", post.id);
    await notifyRejected(title);
    return { ok: true, redirectTo: "/admin#blog" };
  }

  const { error } = await sb
    .from("posts")
    .update({ status: "published", published_at: new Date().toISOString(), approval_token_hash: null } as never)
    .eq("id", post.id);
  if (error) return { ok: false, status: 500, error: error.message };

  revalidateTag("posts", "max");
  revalidateTag(`post:${post.slug}`, "max");
  const path = blogHref("en", post.slug);
  await notifyPublished(title, `${SITE_URL}${path}`);
  return { ok: true, redirectTo: path };
}

/** Post + validity check for the approval page (any status). */
export async function getPostForApproval(id: string, token: string): Promise<{ post: Post; valid: boolean } | null> {
  if (!id) return null;
  const sb = createServiceClient();
  const { data } = await sb.from("posts").select("*").eq("id", id).maybeSingle();
  const post = data as unknown as Post | null;
  if (!post) return null;
  // Without a valid token the page reveals nothing.
  if (!verifyToken(token, post.approval_token_hash)) return null;
  return { post, valid: post.status === "draft" };
}
