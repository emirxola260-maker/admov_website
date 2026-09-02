import { describe, it, expect } from "vitest";
import { PILLARS, pickPillar, dayOfYear, buildEnUserPrompt, buildSystemPrompt } from "./prompts";

describe("pickPillar", () => {
  it("rotates by day and skips recently used pillars", () => {
    const first = pickPillar(0, []);
    expect(first.id).toBe(PILLARS[0].id);
    const skipped = pickPillar(0, [PILLARS[0].id, PILLARS[1].id]);
    expect(skipped.id).toBe(PILLARS[2].id);
  });
  it("always returns a pillar even when everything is recent", () => {
    expect(pickPillar(3, PILLARS.map((p) => p.id))).toBeTruthy();
  });
});

describe("prompts", () => {
  it("computes day of year", () => {
    expect(dayOfYear(new Date(Date.UTC(2026, 0, 1)))).toBe(1);
    expect(dayOfYear(new Date(Date.UTC(2026, 11, 31)))).toBe(365);
  });
  it("includes the requested topic and recent titles", () => {
    const p = buildEnUserPrompt({ pillar: PILLARS[0], topic: "AI ads for dentists", recentTitles: ["Old post"] });
    expect(p).toContain("AI ads for dentists");
    expect(p).toContain("Old post");
  });
  it("lists products in the system prompt", () => {
    expect(buildSystemPrompt([{ name: "i8chat", url: "https://i8chat.com" }])).toContain("i8chat");
  });
});
