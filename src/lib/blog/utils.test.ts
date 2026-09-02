import { describe, it, expect } from "vitest";
import { blogHref, localizeBlogPath, blogLangFromPath, readingMinutes, pickLang } from "./utils";

describe("blog utils", () => {
  it("builds language-aware hrefs", () => {
    expect(blogHref("en")).toBe("/blog");
    expect(blogHref("ar", "x")).toBe("/ar/blog/x");
    expect(blogHref("tr")).toBe("/tr/blog");
  });
  it("maps blog paths between languages", () => {
    expect(localizeBlogPath("/blog/hello", "ar")).toBe("/ar/blog/hello");
    expect(localizeBlogPath("/tr/blog", "en")).toBe("/blog");
    expect(localizeBlogPath("/work", "ar")).toBeNull();
  });
  it("detects the language of a blog path", () => {
    expect(blogLangFromPath("/blog")).toBe("en");
    expect(blogLangFromPath("/ar/blog/x")).toBe("ar");
    expect(blogLangFromPath("/products")).toBeNull();
  });
  it("computes reading time and language fallback", () => {
    expect(readingMinutes("word ".repeat(450))).toBe(2);
    expect(readingMinutes("")).toBe(1);
    expect(pickLang({ en: "a" }, "ar")).toBe("a");
    expect(pickLang({ en: "a", ar: "b" }, "ar")).toBe("b");
  });
});
