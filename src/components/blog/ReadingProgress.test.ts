import { describe, it, expect } from "vitest";
import { readingProgress } from "./ReadingProgress";

// A typical post: 6000px of article in a 900px viewport.
const H = 6000;
const V = 900;

describe("readingProgress", () => {
  it("is 0 before the article is reached", () => {
    expect(readingProgress(400, H, V)).toBe(0);
    expect(readingProgress(0, H, V)).toBe(0);
  });

  it("tracks the middle of the article", () => {
    // Halfway through the scrollable span of (6000 - 900).
    expect(readingProgress(-(H - V) / 2, H, V)).toBeCloseTo(0.5, 5);
  });

  it("reaches 1 when the article's end meets the bottom of the viewport", () => {
    expect(readingProgress(-(H - V), H, V)).toBe(1);
  });

  it("stays at 1 past the article — the footer must not push it further", () => {
    expect(readingProgress(-(H - V) - 3000, H, V)).toBe(1);
  });

  it("never leaves the 0..1 range", () => {
    for (const top of [99999, -99999, 0, -1]) {
      const p = readingProgress(top, H, V);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
  });

  it("treats an article shorter than the viewport as read once reached", () => {
    expect(readingProgress(-1, 500, V)).toBe(1);
    expect(readingProgress(200, 500, V)).toBe(0);
  });

  it("survives a zero-height viewport instead of producing NaN", () => {
    // Seen for real in an embedded browser pane; must not emit scaleX(NaN).
    expect(Number.isFinite(readingProgress(-100, H, 0))).toBe(true);
  });

  it("returns 0 for non-finite measurements", () => {
    expect(readingProgress(NaN, H, V)).toBe(0);
    expect(readingProgress(-100, Infinity, V)).toBe(0);
  });
});
