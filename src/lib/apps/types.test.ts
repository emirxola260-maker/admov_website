import { describe, it, expect } from "vitest";
import { compactText, courseLangs, formatPrice, galleryOf, isPaid, previewDevice, storeBase } from "./types";

describe("previewDevice", () => {
  it("frames phone-only apps in a phone", () => {
    expect(previewDevice(["ios"])).toBe("phone");
    expect(previewDevice(["ios", "android"])).toBe("phone");
  });
  it("frames anything with a desktop or web build in a window", () => {
    expect(previewDevice(["ios", "web"])).toBe("desktop");
    expect(previewDevice(["macos"])).toBe("desktop");
    expect(previewDevice([])).toBe("desktop");
  });
});

describe("galleryOf", () => {
  it("keeps real entries in order and skips blanks", () => {
    const gallery = [{ url: "https://a/1.png" }, { url: "  " }, { url: "https://a/2.png", caption: { en: "Two" } }];
    expect(galleryOf({ gallery, image_url: "https://a/cover.png" })).toEqual([gallery[0], gallery[2]]);
  });
  it("falls back to the cover image, then to nothing", () => {
    expect(galleryOf({ gallery: [], image_url: "https://a/cover.png" })).toEqual([{ url: "https://a/cover.png" }]);
    expect(galleryOf({ gallery: [], image_url: null })).toEqual([]);
  });
});

describe("compactText", () => {
  it("drops blank languages and trims the rest", () => {
    expect(compactText({ ar: " ٦ أسابيع ", en: "", tr: "   " })).toEqual({ ar: "٦ أسابيع" });
  });
  it("is null when nothing is left", () => {
    expect(compactText({ en: "" })).toBeNull();
    expect(compactText(null)).toBeNull();
  });
});

describe("isPaid", () => {
  it("treats a course seat as a paid item", () => {
    expect(isPaid("enrolment")).toBe(true);
  });
  it("never charges for a store listing", () => {
    expect(isPaid("store_link")).toBe(false);
  });
});

describe("storeBase", () => {
  it("sends courses to /courses and everything else to /apps", () => {
    expect(storeBase("course")).toBe("/courses");
    expect(storeBase("app")).toBe("/apps");
    expect(storeBase("template")).toBe("/apps");
  });
});

describe("courseLangs", () => {
  it("lists only languages with a real curriculum", () => {
    expect(courseLangs({ curriculum_md: { ar: "## محاور", en: "   " } })).toEqual(["ar"]);
  });
  it("is empty for a course with no curriculum at all", () => {
    expect(courseLangs({ curriculum_md: null })).toEqual([]);
    expect(courseLangs({ curriculum_md: {} })).toEqual([]);
  });
  it("keeps the site's language order", () => {
    expect(courseLangs({ curriculum_md: { tr: "x", en: "y", ar: "z" } })).toEqual(["en", "ar", "tr"]);
  });
});

describe("formatPrice", () => {
  it("drops the cents on a whole amount", () => {
    expect(formatPrice(29900, "usd", "en")).toBe("$299");
  });
  it("keeps real cents", () => {
    expect(formatPrice(4950, "usd", "en")).toBe("$49.50");
  });
  it("divides zero-decimal currencies correctly", () => {
    // JPY has no minor unit, so 500 means ¥500, not ¥5.
    expect(formatPrice(500, "jpy", "en")).toBe("¥500");
  });
  it("is empty when there is no price", () => {
    expect(formatPrice(null, "usd", "en")).toBe("");
  });
});
