import { supabase } from "@/lib/supabase/client";
import type { Post } from "./types";

function client() {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export async function listPostsAdmin(): Promise<Post[]> {
  const { data, error } = await client()
    .from("posts")
    .select("id,slug,status,pillar,topic,tags,title,excerpt,body_md,meta,cover_image_url,model,prompt_version,usage,generated_at,published_at,created_at,updated_at")
    .order("generated_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Post[];
}

export type PostPatch = Partial<
  Pick<Post, "slug" | "status" | "pillar" | "topic" | "tags" | "title" | "excerpt" | "body_md" | "meta" | "cover_image_url" | "published_at">
> & { approval_token_hash?: null };

export async function updatePost(id: string, patch: PostPatch): Promise<Post> {
  const { data, error } = await client().from("posts").update(patch as never).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data as unknown as Post;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await client().from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createManualPost(): Promise<Post> {
  const stamp = Date.now().toString(36);
  const { data, error } = await client()
    .from("posts")
    .insert({
      slug: `new-post-${stamp}`,
      status: "draft",
      source: "manual",
      title: { en: "New post" },
      excerpt: { en: "" },
      body_md: { en: "" },
      meta: {},
      tags: [],
    } as never)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as Post;
}

export interface PostTopic {
  id: string;
  topic: string;
  notes: string | null;
  status: "queued" | "used" | "skipped";
  created_at: string;
  used_at: string | null;
}

export async function listTopics(): Promise<PostTopic[]> {
  const { data, error } = await client().from("post_topics").select("*").order("created_at", { ascending: true }).limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as PostTopic[];
}

export async function addTopic(topic: string, notes?: string): Promise<PostTopic> {
  const { data, error } = await client()
    .from("post_topics")
    .insert({ topic, notes: notes || null } as never)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as PostTopic;
}

export async function deleteTopic(id: string): Promise<void> {
  const { error } = await client().from("post_topics").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
