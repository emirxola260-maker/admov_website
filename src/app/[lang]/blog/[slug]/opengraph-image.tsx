import { DEFAULT_LANG, isLanguage } from "@/i18n/config";
import { OG_CONTENT_TYPE, OG_SIZE, renderPostOg } from "@/lib/blog/og";

export const alt = "ADMOV Blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  return renderPostOg(slug, isLanguage(lang) ? lang : DEFAULT_LANG);
}
