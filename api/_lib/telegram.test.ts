import { describe, it, expect } from "vitest";
import { escapeHtml, validateContactPayload, buildTelegramMessage } from "./telegram";

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml('<a href="x">&')).toBe("&lt;a href=\"x\"&gt;&amp;");
  });
  it("coerces non-strings safely", () => {
    expect(escapeHtml(undefined as unknown as string)).toBe("undefined");
  });
});

describe("validateContactPayload", () => {
  it("accepts a valid payload and trims fields", () => {
    const r = validateContactPayload({
      name: "  Jane  ", email: "jane@example.com", phone: "+1 555 1234",
      workType: "AI Video", date: "Mon May 25", message: "hi", lang: "en",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.name).toBe("Jane");
      expect(r.data.email).toBe("jane@example.com");
    }
  });
  it("rejects a missing name", () => {
    const r = validateContactPayload({ name: "", email: "a@b.co", phone: "12345" });
    expect(r.ok).toBe(false);
  });
  it("rejects an invalid email", () => {
    const r = validateContactPayload({ name: "Jane", email: "not-an-email", phone: "12345" });
    expect(r.ok).toBe(false);
  });
  it("rejects an over-long message", () => {
    const r = validateContactPayload({ name: "Jane", email: "a@b.co", phone: "12345", message: "x".repeat(2001) });
    expect(r.ok).toBe(false);
  });
  it("rejects a non-object body", () => {
    expect(validateContactPayload(null).ok).toBe(false);
    expect(validateContactPayload("nope" as unknown as object).ok).toBe(false);
  });
});

describe("buildTelegramMessage", () => {
  it("escapes user input so injected HTML is neutralized", () => {
    const msg = buildTelegramMessage({
      name: "<b>x</b>", email: "a@b.co", phone: "1", workType: "", date: "", message: "<script>", lang: "en",
    });
    expect(msg).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(msg).toContain("&lt;script&gt;");
    expect(msg).not.toContain("<script>");
  });
});
