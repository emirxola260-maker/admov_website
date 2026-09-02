import type { MetadataRoute } from "next";
import { SUPPORTED_LANGS } from "@/i18n/config";
import { getAllPublishedSlugs } from "@/lib/data/posts";
import { blogHref } from "@/lib/blog/utils";
import { SITE_URL } from "@/lib/blog/metadata";

// Rendered per request: the post list is cached in the data layer under the
// "posts" tag, which is purged the moment a post is published. A route-level
// cache here would outlive that purge and hide new posts from crawlers.
export const dynamic = "force-dynamic";

function languagesFor(slug?: string) {
  return Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE_URL}${blogHref(l, slug)}`]));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = ["", "/work", "/products", "/support", "/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const blogIndexes: MetadataRoute.Sitemap = SUPPORTED_LANGS.map((lang) => ({
    url: `${SITE_URL}${blogHref(lang)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
    alternates: { languages: languagesFor() },
  }));

  const posts = await getAllPublishedSlugs();
  const postRoutes: MetadataRoute.Sitemap = posts.flatMap((p) =>
    SUPPORTED_LANGS.map((lang) => ({
      url: `${SITE_URL}${blogHref(lang, p.slug)}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: languagesFor(p.slug) },
    })),
  );

  return [...staticRoutes, ...blogIndexes, ...postRoutes];
}
