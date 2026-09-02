import { getPublishedPosts } from "@/lib/data/posts";
import { SITE_URL } from "@/lib/blog/metadata";
import { blogHref } from "@/lib/blog/utils";
import { escapeHtml } from "@/lib/server/telegram";

function cdata(s: string) {
  return `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

/** RSS 2.0 feed of the English posts. */
export async function GET() {
  const posts = await getPublishedPosts(30);
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}${blogHref("en", p.slug)}`;
      return [
        "<item>",
        `<title>${cdata(p.title.en ?? p.slug)}</title>`,
        `<link>${escapeHtml(url)}</link>`,
        `<guid isPermaLink="true">${escapeHtml(url)}</guid>`,
        p.published_at ? `<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : "",
        `<description>${cdata(p.excerpt.en ?? "")}</description>`,
        ...p.tags.map((t) => `<category>${cdata(t)}</category>`),
        "</item>",
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>ADMOV Blog</title><link>${SITE_URL}/blog</link><atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/><description>Practical guides on AI ads, automation, content and growth for businesses.</description><language>en</language>${items}</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
