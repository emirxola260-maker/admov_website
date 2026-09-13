import { describe, it, expect } from "vitest";
import { courseLangs, formatPrice, isPaid, storeBase } from "./types";

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
