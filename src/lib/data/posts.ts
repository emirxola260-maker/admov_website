import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { verifyToken } from "@/lib/blog/approval";
import { POST_SUMMARY_COLUMNS, type Post, type PostSummary } from "@/lib/blog/types";

export const POSTS_TAG = "posts";
export const postTag = (slug: string) => `post:${slug}`;

async function fetchPublishedPosts(limit: number): Promise<PostSummary[]> {
  const supabase = createAnonServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("posts fetch failed:", error.message);
    return [];
  }
  return (data ?? []) as unknown as PostSummary[];
}

/** Published posts, newest first. Cached for 60 s and purged on publish. */
export function getPublishedPosts(limit = 50): Promise<PostSummary[]> {
  return unstable_cache(() => fetchPublishedPosts(limit), ["posts-published", String(limit)], {
    tags: [POSTS_TAG],
    revalidate: 60,
  })();
}

async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createAnonServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("posts")
    .select("id,slug,status,pillar,topic,tags,title,excerpt,body_md,meta,cover_image_url,generated_at,published_at,created_at,updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("post fetch failed:", error.message);
    return null;
  }
  return (data as unknown as Post | null) ?? null;
}

/** One published post. React `cache()` dedupes the metadata + page calls in a request. */
export const getPostBySlug = cache((slug: string): Promise<Post | null> =>
  unstable_cache(() => fetchPostBySlug(slug), ["post", slug], {
    tags: [POSTS_TAG, postTag(slug)],
    revalidate: 60,
  })(),
);

/** Draft preview for the Telegram link: any status, validated against the one-time token. Never cached. */
export async function getPostForPreview(slug: string, token: string): Promise<Post | null> {
  if (!token) return null;
  let supabase;
  try {
    supabase = createServiceClient();
  } catch {
    return null;
  }
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
  const post = data as unknown as Post | null;
  if (!post || !verifyToken(token, post.approval_token_hash)) return null;
  return post;
}

type SlugRow = { slug: string; updated_at: string; published_at: string | null };

async function fetchPublishedSlugs(): Promise<SlugRow[]> {
  const supabase = createAnonServerClient();
  if (!supabase) return [];
  // PostgREST caps a single response at 1000 rows, so page through them.
  const PAGE = 1000;
  const all: SlugRow[] = [];
  for (let page = 0; page < 20; page++) {
    const { data, error } = await supabase
      .from("posts")
      .select("slug,updated_at,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(page * PAGE, page * PAGE + PAGE - 1);
    if (error) {
      console.error("sitemap slugs fetch failed:", error.message);
      break;
    }
    const rows = (data ?? []) as SlugRow[];
    all.push(...rows);
    if (rows.length < PAGE) break;
  }
  return all;
}

export const getAllPublishedSlugs = unstable_cache(fetchPublishedSlugs, ["posts-slugs"], {
  tags: [POSTS_TAG],
  revalidate: 3600,
});
