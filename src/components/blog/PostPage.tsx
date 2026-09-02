import { notFound } from "next/navigation";
import type { Language } from "@/i18n/config";
import { getPostBySlug, getPostForPreview, getPublishedPosts } from "@/lib/data/posts";
import { PostView } from "./PostView";

/** Shared by /blog/[slug] and /[lang]/blog/[slug]. `previewToken` unlocks unpublished drafts. */
export async function PostPage({ slug, lang, previewToken }: { slug: string; lang: Language; previewToken?: string }) {
  let post = await getPostBySlug(slug);
  let isPreview = false;
  if (!post && previewToken) {
    post = await getPostForPreview(slug, previewToken);
    isPreview = Boolean(post);
  }
  if (!post) notFound();
  const more = (await getPublishedPosts(4)).filter((p) => p.slug !== slug).slice(0, 3);
  return <PostView post={post} lang={lang} more={more} isPreview={isPreview} />;
}
