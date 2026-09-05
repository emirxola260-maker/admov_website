import type { MetadataRoute } from "next";
import { SUPPORTED_LANGS } from "@/i18n/config";
import { getAllPublishedSlugs } from "@/lib/data/posts";
import { getPublishedApps } from "@/lib/data/apps";
import { blogHref } from "@/lib/blog/utils";
import { LOCALIZED_PATHS, localePath } from "@/lib/i18n/paths";
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
  // Every marketing page now exists in all three languages, each with its own
  // URL and hreflang set, so Google can index the Arabic and Turkish versions.
  const staticRoutes: MetadataRoute.Sitemap = LOCALIZED_PATHS.flatMap((path) =>
    SUPPORTED_LANGS.map((lang) => ({
      url: `${SITE_URL}${localePath(lang, path)}`,
      lastModified: now,
      changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE_URL}${localePath(l, path)}`])),
      },
    })),
  );

  const blogIndexes: MetadataRoute.Sitemap = SUPPORTED_LANGS.map((lang) => ({
    url: `${SITE_URL}${blogHref(lang)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
    alternates: { languages: languagesFor() },
  }));

  const apps = await getPublishedApps();
  const appRoutes: MetadataRoute.Sitemap = apps.flatMap((app) =>
    SUPPORTED_LANGS.map((lang) => ({
      url: `${SITE_URL}${localePath(lang, "/apps")}/${app.slug}`,
      lastModified: new Date(app.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LANGS.map((l) => [l, `${SITE_URL}${localePath(l, "/apps")}/${app.slug}`]),
        ),
      },
    })),
  );

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

  return [...staticRoutes, ...appRoutes, ...blogIndexes, ...postRoutes];
}
