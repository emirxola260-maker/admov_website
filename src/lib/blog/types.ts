import type { Language } from "@/i18n/config";

export type PostStatus = "generating" | "draft" | "published" | "rejected" | "failed" | "archived";
export type LocalizedText = Partial<Record<Language, string>>;

export interface PostMeta {
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface Post {
  id: string;
  slug: string;
  status: PostStatus;
  pillar: string | null;
  topic: string | null;
  tags: string[];
  title: LocalizedText;
  excerpt: LocalizedText;
  body_md: LocalizedText;
  meta: Partial<Record<Language, PostMeta>>;
  cover_image_url: string | null;
  model: string | null;
  prompt_version: string | null;
  usage: Record<string, unknown> | null;
  approval_token_hash?: string | null;
  generated_at: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PostSummary = Pick<
  Post,
  "id" | "slug" | "status" | "pillar" | "tags" | "title" | "excerpt" | "cover_image_url" | "published_at" | "generated_at" | "updated_at"
>;

export const POST_SUMMARY_COLUMNS =
  "id,slug,status,pillar,tags,title,excerpt,cover_image_url,published_at,generated_at,updated_at";

export const POST_STATUSES: PostStatus[] = ["generating", "draft", "published", "rejected", "failed", "archived"];
