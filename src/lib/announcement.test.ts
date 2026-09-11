import { describe, it, expect } from "vitest";
import { getAnnouncement, hashAnnouncement } from "./announcement";

const base = { enabled: true, text: { en: "CreatorFlow is coming soon", ar: "كرييتور فلو قريباً" }, linkUrl: "/apps", linkLabel: { en: "See apps" } };

describe("getAnnouncement", () => {
  it("is null when switched off or empty", () => {
    expect(getAnnouncement(null, "en")).toBeNull();
    expect(getAnnouncement({ announcement: { ...base, enabled: false } }, "en")).toBeNull();
    expect(getAnnouncement({ announcement: { ...base, text: { en: "  " } } }, "en")).toBeNull();
  });

  it("uses the visitor's language and falls back to English", () => {
    expect(getAnnouncement({ announcement: base }, "ar")!.text).toBe("كرييتور فلو قريباً");
    expect(getAnnouncement({ announcement: base }, "tr")!.text).toBe("CreatorFlow is coming soon");
  });

  it("keeps an internal link in the visitor's language", () => {
    expect(getAnnouncement({ announcement: base }, "ar")!.href).toBe("/ar/apps");
    expect(getAnnouncement({ announcement: base }, "en")!.href).toBe("/apps");
  });

  it("refuses non-http links", () => {
    expect(getAnnouncement({ announcement: { ...base, linkUrl: "javascript:alert(1)" } }, "en")!.href).toBeNull();
  });

  it("gets a new version when the message changes, so it reappears after dismissal", () => {
    const a = getAnnouncement({ announcement: base }, "en")!.version;
    const b = getAnnouncement({ announcement: { ...base, text: { en: "Now live!" } } }, "en")!.version;
    expect(a).not.toBe(b);
    expect(getAnnouncement({ announcement: base }, "en")!.version).toBe(a);
  });

  it("hashes deterministically", () => {
    expect(hashAnnouncement("x")).toBe(hashAnnouncement("x"));
  });
});
