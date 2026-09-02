import { OG_CONTENT_TYPE, OG_SIZE, renderPostOg } from "@/lib/blog/og";

export const alt = "ADMOV Blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderPostOg(slug, "en");
}
