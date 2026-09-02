import { describe, it, expect } from "vitest";
import { sanitizeHttpUrl } from "./security";

describe("sanitizeHttpUrl", () => {
  it("allows https and http URLs", () => {
    expect(sanitizeHttpUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
    expect(sanitizeHttpUrl("http://example.com/v.mp4")).toBe("http://example.com/v.mp4");
  });
  it("allows root-relative same-origin paths", () => {
    expect(sanitizeHttpUrl("/work-kyom.png")).toBe("/work-kyom.png");
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
