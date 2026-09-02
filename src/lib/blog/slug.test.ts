import { describe, it, expect } from "vitest";
import { slugify, uniqueSlug } from "./slug";

describe("slugify", () => {
  it("lowercases, strips accents and punctuation", () => {
    expect(slugify("Hello, World! — AI & Ads for Café Owners")).toBe("hello-world-ai-and-ads-for-cafe-owners");
  });
  it("truncates long titles cleanly", () => {
    const s = slugify("a ".repeat(100), 20);
    expect(s.length).toBeLessThanOrEqual(20);
    expect(s.endsWith("-")).toBe(false);
  });
  it("never returns an empty slug", () => {
    expect(slugify("!!!")).toBe("post");
  });
});

describe("uniqueSlug", () => {
  it("adds a numeric suffix on collision", () => {
    expect(uniqueSlug("x", new Set())).toBe("x");
    expect(uniqueSlug("x", new Set(["x"]))).toBe("x-2");
    expect(uniqueSlug("x", new Set(["x", "x-2"]))).toBe("x-3");
  });
});
