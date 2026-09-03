import { describe, it, expect } from "vitest";
import { LOCALIZED_PATHS, localePath, localizePath, pathAlternates, stripLangPrefix } from "./paths";

describe("localePath", () => {
  it("leaves English at the bare path", () => {
    expect(localePath("en", "/")).toBe("/");
    expect(localePath("en", "/work")).toBe("/work");
  });

  it("prefixes the other languages", () => {
    expect(localePath("ar", "/")).toBe("/ar");
    expect(localePath("ar", "/work")).toBe("/ar/work");
    expect(localePath("tr", "/products")).toBe("/tr/products");
  });
});

describe("stripLangPrefix", () => {
  it("removes a language segment", () => {
    expect(stripLangPrefix("/ar/work")).toBe("/work");
    expect(stripLangPrefix("/tr")).toBe("/");
  });

  it("leaves unprefixed paths alone", () => {
    expect(stripLangPrefix("/work")).toBe("/work");
    expect(stripLangPrefix("/")).toBe("/");
  });

  it("does not mistake a normal segment for a language", () => {
    // "/en/..." is never a real URL here, and /products must survive untouched.
    expect(stripLangPrefix("/products")).toBe("/products");
  });
});

describe("localizePath", () => {
  it("maps marketing pages across languages", () => {
    expect(localizePath("/work", "ar")).toBe("/ar/work");
    expect(localizePath("/ar/work", "en")).toBe("/work");
    expect(localizePath("/tr/products", "ar")).toBe("/ar/products");
    expect(localizePath("/", "tr")).toBe("/tr");
  });

  it("still maps blog URLs", () => {
    expect(localizePath("/blog", "ar")).toBe("/ar/blog");
    expect(localizePath("/ar/blog/my-post", "tr")).toBe("/tr/blog/my-post");
  });

  it("returns null for pages that have no language variant", () => {
    expect(localizePath("/admin", "ar")).toBeNull();
    expect(localizePath("/nope", "ar")).toBeNull();
  });
});

describe("pathAlternates", () => {
  it("lists every language plus x-default", () => {
    expect(pathAlternates("https://admov.io", "/work")).toEqual({
      en: "https://admov.io/work",
      ar: "https://admov.io/ar/work",
      tr: "https://admov.io/tr/work",
      "x-default": "https://admov.io/work",
    });
  });

  it("covers every localized path without producing a double slash", () => {
    for (const p of LOCALIZED_PATHS) {
      for (const url of Object.values(pathAlternates("https://admov.io", p))) {
        expect(url).not.toMatch(/admov\.io\/\//);
      }
    }
  });
});
