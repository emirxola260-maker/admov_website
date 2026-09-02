import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/data/posts";
import { buildPostMetadata } from "@/lib/blog/metadata";
import { PostPage } from "@/components/blog/PostPage";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post", robots: { index: false, follow: false } };
  return buildPostMetadata(post, "en");
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  return <PostPage slug={slug} lang="en" previewToken={preview} />;
}
