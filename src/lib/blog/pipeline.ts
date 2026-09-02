import "server-only";
import { createServiceClient } from "@/lib/supabase/admin";
import { purgeTags } from "@/lib/cache";
import { generateApprovalToken, hashToken, verifyToken } from "./approval";
import { Deadline, GENERATION_BUDGET_MS } from "./deadline";
import { BlogGenerationError, generateDailyPost, regenerateLocalization, toPostColumns } from "./generate";
import { notifyDraft, notifyFailure, notifyPublished, notifyRejected } from "./notify";
import { PILLARS, dayOfYear, findPillar, pickPillar, type ProductBrief } from "./prompts";
import { slugify, uniqueSlug } from "./slug";
import type { EnPost } from "./schema";
import type { Post } from "./types";
import { blogHref } from "./utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://admov.io";
/** A run that has been "generating" longer than this was killed mid-flight. */
const STALE_GENERATING_MS = 10 * 60 * 1000;

type ServiceClient = ReturnType<typeof createServiceClient>;

export interface RunOptions {
  /** Skip the once-per-day guard (admin "Generate now"). */
  force?: boolean;
  topic?: string | null;
  pillar?: string | null;
}

export type RunResult =
  | { ok: true; skipped: true; postId: string; slug: string }
  | { ok: true; skipped?: false; postId: string; slug: string; notified: boolean }
  | { ok: false; error: string; postId?: string };

async function loadContext(sb: ServiceClient) {
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

/**
 * Fail rows abandoned by a killed invocation. Without this a timed-out run
 * leaves `status = 'generating'` forever, which the once-per-day guard would
 * read as "today is done" and silently skip every later cron.
 */
async function expireStuckRuns(sb: ServiceClient): Promise<void> {
  const cutoff = new Date(Date.now() - STALE_GENERATING_MS).toISOString();
  const { error } = await sb
    .from("posts")
    .update({ status: "failed", usage: { error: "Generation timed out or the function was stopped" } } as never)
    .eq("status", "generating")
    .lt("generated_at", cutoff);
  if (error) console.error("Could not expire stuck generations:", error.message);
}

/** Take the oldest queued topic, claiming it atomically so two runs cannot share it. */
async function claimTopic(sb: ServiceClient): Promise<{ id: string; topic: string } | null> {
  const { data: queued } = await sb
    .from("post_topics")
    .select("id,topic,notes")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!queued) return null;

  const row = queued as { id: string; topic: string; notes: string | null };
  const { data: claimed, error } = await sb
    .from("post_topics")
    .update({ status: "used", used_at: new Date().toISOString() } as never)
    .eq("id", row.id)
    .eq("status", "queued")
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("Could not claim topic:", error.message);
    return null;
  }
  if (!claimed) return null; // another run took it first
  return { id: row.id, topic: row.notes ? `${row.topic} — ${row.notes}` : row.topic };
}

async function releaseTopic(sb: ServiceClient, id: string | null): Promise<void> {
  if (!id) return;
  const { error } = await sb.from("post_topics").update({ status: "queued", used_at: null } as never).eq("id", id);
  if (error) console.error("Could not release topic back to the queue:", error.message);
}

/** Write the finished post, retrying on a slug collision with a concurrent run. */
async function writeGeneratedPost(
  sb: ServiceClient,
  postId: string,
  generated: Awaited<ReturnType<typeof generateDailyPost>>,
  tokenHash: string,
): Promise<string> {
  const base = slugify(generated.en.title);
  const { data: taken } = await sb.from("posts").select("slug").like("slug", `${base}%`);
  const used = new Set(((taken ?? []) as { slug: string }[]).map((t) => t.slug));

  for (let attempt = 0; attempt < 4; attempt++) {
    const slug = uniqueSlug(base, used);
    const { error } = await sb
      .from("posts")
      .update({
        ...toPostColumns(generated, slug),
        status: "draft",
        approval_token_hash: tokenHash,
        generated_at: new Date().toISOString(),
      } as never)
      .eq("id", postId);
    if (!error) return slug;
    // 23505 = unique_violation: another run claimed this slug between the read and the write.
    if (error.code !== "23505") throw new Error(error.message);
    used.add(slug);
  }
  throw new Error("Could not find a free slug for this post");
}

/** Generate today's draft: topic queue → GPT (EN, then AR+TR) → posts row → Telegram. */
export async function runDailyGeneration(opts: RunOptions = {}): Promise<RunResult> {
  const sb = createServiceClient();
  const deadline = new Deadline(GENERATION_BUDGET_MS);

  await expireStuckRuns(sb);

  if (!opts.force) {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const { data: existing } = await sb
      .from("posts")
      .select("id,slug")
      .eq("source", "ai") // hand-written drafts must not satisfy the daily quota
      .gte("generated_at", start.toISOString())
      .in("status", ["generating", "draft", "published"])
      .limit(1);
    if (existing && existing.length > 0) {
      return { ok: true, skipped: true, postId: existing[0].id as string, slug: existing[0].slug as string };
    }
  }

  const ctx = await loadContext(sb);

  // Topic: explicit > queued > let the model choose an angle inside the pillar.
  let topicRowId: string | null = null;
  let topic = opts.topic?.trim() || null;
  if (!topic) {
    const claimed = await claimTopic(sb);
    if (claimed) {
      topic = claimed.topic;
      topicRowId = claimed.id;
    }
  }

  // Resolved here (not inside the generator) so a refusal retry knows what was refused.
  let pillar = findPillar(opts.pillar) ?? pickPillar(dayOfYear(new Date()), ctx.recentPillars);

  const { data: row, error: insertError } = await sb
    .from("posts")
    .insert({ slug: `generating-${Date.now().toString(36)}`, status: "generating", source: "ai", topic, pillar: pillar.id } as never)
    .select("id")
    .single();
  if (insertError || !row) {
    await releaseTopic(sb, topicRowId);
    return { ok: false, error: insertError?.message ?? "Could not create post row" };
  }
  const postId = row.id as string;

  try {
    let generated;
    let topicDropped = false;
    try {
      generated = await generateDailyPost({ ...ctx, topic, pillar: pillar.id, deadline });
    } catch (err) {
      // A refusal will repeat on the same angle: move to the next pillar and drop
      // the topic — but only if a full second pass still fits in the budget.
      const isRefusal = err instanceof BlogGenerationError && err.kind === "refusal";
      if (!isRefusal || !deadline.allows(170_000)) throw err;
      const idx = PILLARS.findIndex((p) => p.id === pillar.id);
      pillar = PILLARS[(idx + 1) % PILLARS.length];
      topicDropped = topic !== null;
      generated = await generateDailyPost({ ...ctx, topic: null, pillar: pillar.id, deadline });
    }

    const token = generateApprovalToken();
    const slug = await writeGeneratedPost(sb, postId, generated, hashToken(token));

    // The refused topic was never written about, so put it back in the queue.
    if (topicDropped) await releaseTopic(sb, topicRowId);

    const notified = await notifyDraft({
      id: postId,
      token,
      title: generated.en.title,
      excerpt: generated.en.excerpt,
      pillar: generated.pillar,
      topic: generated.topic,
      bodies: { en: generated.en.body_md, ar: generated.ar.body_md, tr: generated.tr.body_md },
    });
    if (!notified.ok) {
      // The plaintext token only ever existed in that message. Record the failure
      // so it is visible; the draft can still be published from /admin → Blog.
      console.error("Draft created but the Telegram notification failed");
      await sb
        .from("posts")
        .update({ usage: { ...generated.usage, notify_error: `telegram HTTP ${notified.status}` } } as never)
        .eq("id", postId);
    }

    return { ok: true, postId, slug, notified: notified.ok };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("Blog generation failed:", message);
    await sb.from("posts").update({ status: "failed", usage: { error: message } } as never).eq("id", postId);
    await releaseTopic(sb, topicRowId);
    await notifyFailure(message);
    return { ok: false, error: message, postId };
  }
}

/** Admin "Regenerate": one localization, or the whole post on the same topic (slug kept). */
export async function regeneratePost(id: string, lang?: "ar" | "tr"): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = createServiceClient();
  const deadline = new Deadline(GENERATION_BUDGET_MS);
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
      const result = await regenerateLocalization({ lang, en, products: ctx.products, deadline });
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
      const pillar = findPillar(post.pillar) ?? pickPillar(dayOfYear(new Date()), ctx.recentPillars);
      const generated = await generateDailyPost({ ...ctx, topic: post.topic, pillar: pillar.id, deadline });
      const { slug: _slug, ...columns } = toPostColumns(generated, post.slug);
      const { error } = await sb.from("posts").update(columns as never).eq("id", id);
      if (error) return { ok: false, error: error.message };
    }
    purgeTags("posts", `post:${post.slug}`);
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
    // Conditional on the row still being a draft, so a double submit cannot
    // reject twice or race with an approval.
    const { data: rejected, error } = await sb
      .from("posts")
      .update({ status: "rejected", approval_token_hash: null } as never)
      .eq("id", post.id)
      .eq("status", "draft")
      .select("id")
      .maybeSingle();
    if (error) return { ok: false, status: 500, error: error.message };
    if (!rejected) return { ok: false, status: 409, error: "This post was already handled." };
    await notifyRejected(title);
    return { ok: true, redirectTo: "/admin#blog" };
  }

  const { data: published, error } = await sb
    .from("posts")
    .update({ status: "published", published_at: new Date().toISOString(), approval_token_hash: null } as never)
    .eq("id", post.id)
    .eq("status", "draft")
    .select("id")
    .maybeSingle();
  if (error) return { ok: false, status: 500, error: error.message };
  if (!published) return { ok: false, status: 409, error: "This post was already handled." };

  // Expire immediately: the browser follows the redirect to this post's URL next.
  purgeTags("posts", `post:${post.slug}`);
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
