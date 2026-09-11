"use client";

import * as React from "react";
import { dirFor, type Language } from "@/i18n/config";

/**
 * Reading progress for a blog post.
 *
 * Measures the article element rather than the document, so the bar reaches
 * 100% when the article ends — not when the reader scrolls past "more posts"
 * and the footer. Purely a visual aid duplicating the native scrollbar, so it
 * is hidden from assistive technology.
 */
/**
 * Fraction of the article that has been read, from its viewport rectangle.
 *
 * `top` is the article's distance from the top of the viewport (negative once
 * scrolled past). Progress hits 1 when the article's last line reaches the
 * bottom of the viewport, so the footer and "more posts" do not count. An
 * article shorter than the viewport is fully visible the moment it is reached,
 * so it reports 1 rather than dividing by a zero or negative span.
 */
export function readingProgress(top: number, height: number, viewportHeight: number): number {
  if (!Number.isFinite(top) || !Number.isFinite(height) || !Number.isFinite(viewportHeight)) return 0;
  const scrolled = -top;
  const span = height - viewportHeight;
  const progress = span <= 0 ? (scrolled >= 0 ? 1 : 0) : scrolled / span;
  return Math.min(1, Math.max(0, progress));
}

export function ReadingProgress({ targetId, lang }: { targetId: string; lang: Language }) {
  const barRef = React.useRef<HTMLDivElement>(null);
  const rtl = dirFor(lang) === "rtl";

  React.useEffect(() => {
    const article = document.getElementById(targetId);
    const bar = barRef.current;
    if (!article || !bar) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = article.getBoundingClientRect();
      bar.style.transform = `scaleX(${readingProgress(rect.top, rect.height, window.innerHeight)})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Images and fonts change the article's height after first paint.
    const observer = new ResizeObserver(schedule);
    observer.observe(article);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [targetId]);

  return (
    <div aria-hidden className="fixed left-0 right-0 z-40 h-[3px] bg-transparent pointer-events-none" style={{ top: "calc(5rem + var(--announce-h, 0px))" }}>
      <div
        ref={barRef}
        className="h-full w-full bg-violet"
        style={{ transform: "scaleX(0)", transformOrigin: rtl ? "right" : "left", willChange: "transform" }}
      />
    </div>
  );
}
