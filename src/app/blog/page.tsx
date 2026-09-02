import type { Metadata } from "next";
import { translations } from "@/i18n/translations";
import { getPublishedPosts } from "@/lib/data/posts";
import { hreflangAlternates } from "@/lib/blog/utils";
import { SITE_URL } from "@/lib/blog/metadata";
import { BlogIndex } from "@/components/blog/BlogIndex";

const t = translations.en.blog;

export const metadata: Metadata = {
  title: t.pageTitle,
  description: t.pageIntro,
  alternates: { canonical: "/blog", languages: hreflangAlternates(SITE_URL) },
};

export default async function Page() {
  const posts = await getPublishedPosts(60);
  return <BlogIndex posts={posts} lang="en" />;
}
