import { describe, it, expect } from "vitest";
import { sanitizeHttpUrl, safeJsonLd } from "./security";

describe("sanitizeHttpUrl", () => {
  it("allows https and http URLs", () => {
    expect(sanitizeHttpUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
    expect(sanitizeHttpUrl("http://example.com/v.mp4")).toBe("http://example.com/v.mp4");
  });
  it("allows root-relative same-origin paths", () => {
    expect(sanitizeHttpUrl("/work-kyom.webp")).toBe("/work-kyom.webp");
    expect(sanitizeHttpUrl("  /flags/en.svg ")).toBe("/flags/en.svg");
  });
  it("blocks protocol-relative URLs", () => {
    expect(sanitizeHttpUrl("//evil.com/x.png")).toBe("");
  });
  it("blocks javascript: URLs", () => {
    expect(sanitizeHttpUrl("javascript:alert(1)")).toBe("");
  });
  it("blocks data: URLs by default", () => {
    expect(sanitizeHttpUrl("data:text/html,<script>alert(1)</script>")).toBe("");
  });
  it("returns the provided fallback for invalid input", () => {
    expect(sanitizeHttpUrl("", "/placeholder.png")).toBe("/placeholder.png");
    expect(sanitizeHttpUrl(undefined, "/placeholder.png")).toBe("/placeholder.png");
    expect(sanitizeHttpUrl("not a url", "/placeholder.png")).toBe("/placeholder.png");
  });
});

describe("safeJsonLd", () => {
  it("escapes '<' as unicode escape to neutralize </script> injection", () => {
    const payload = {
      title: "Attack </script><script>alert('xss')</script>",
      description: "normal text <bold>",
    };
    const result = safeJsonLd(payload);
    expect(result).not.toContain("</script>");
    expect(result).toContain("\\u003c/script>");
    expect(JSON.parse(result)).toEqual(payload);
  });
});
