import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { translations } from "@/i18n/translations";
import type { Language } from "@/i18n/config";
import { getPostBySlug } from "@/lib/data/posts";
import { formatPostDate, pickLang } from "./utils";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

let fontPromise: Promise<ArrayBuffer> | null = null;
function loadFont(): Promise<ArrayBuffer> {
  // Changa covers Latin and Arabic; ImageResponse needs TTF (not WOFF2).
  fontPromise ??= readFile(join(process.cwd(), "public", "fonts", "changa-800.ttf")).then((b) =>
    b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength),
  );
  return fontPromise;
}

/** Branded 1200×630 card for a blog post (shared by the EN and AR/TR routes). */
export async function renderPostOg(slug: string, lang: Language) {
  const post = await getPostBySlug(slug);
  const title = pickLang(post?.title, lang) ?? "ADMOV Blog";
  const pillarLabel = post?.pillar ? (translations[lang].blog.pillars as Record<string, string>)[post.pillar] : "Blog";
  const date = post ? formatPostDate(post.published_at ?? post.generated_at, lang) : "";
  const font = await loadFont();
  const rtl = lang === "ar";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #09090b 0%, #16123a 55%, #2b2470 100%)",
          color: "#fafafa",
          fontFamily: "Changa",
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 100 100">
            <polygon points="50,0 100,100 0,100" fill="#A49BFF" />
            <polygon points="50,50 75,100 25,100" fill="#7367F0" />
          </svg>
          <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>ADMOV</span>
          <span style={{ marginLeft: rtl ? 0 : "auto", marginRight: rtl ? "auto" : 0, fontSize: 22, color: "#B4AAFF", textTransform: "uppercase", letterSpacing: 3 }}>
            {pillarLabel}
          </span>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 52 : 64, fontWeight: 800, lineHeight: 1.15, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#a1a1aa" }}>
          <span>admov.io/blog</span>
          <span>{date}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Changa", data: font, weight: 800, style: "normal" }] },
  );
}
