import { describe, it, expect } from "vitest";
import { BlogGenerationError, readParsed } from "./parse";

const ok = { output_parsed: { title: "x" }, status: "completed", output: [{ type: "message", content: [{ type: "output_text" }] }] };

function kindOf(fn: () => unknown): string {
  try {
    fn();
  } catch (e) {
    return e instanceof BlogGenerationError ? e.kind : "not-a-generation-error";
  }
  return "no-throw";
}

describe("readParsed", () => {
  it("returns the parsed object on a completed response", () => {
    expect(readParsed(ok, "t")).toEqual({ title: "x" });
  });
  it("maps max_output_tokens to a truncated error", () => {
    expect(kindOf(() => readParsed({ ...ok, status: "incomplete", incomplete_details: { reason: "max_output_tokens" } }, "t"))).toBe("truncated");
  });
  it("maps the content filter to a refusal error", () => {
    expect(kindOf(() => readParsed({ ...ok, status: "incomplete", incomplete_details: { reason: "content_filter" } }, "t"))).toBe("refusal");
  });
  it("maps a refusal content part to a refusal error", () => {
    const refused = { output_parsed: null, status: "completed", output: [{ type: "message", content: [{ type: "refusal", refusal: "no" }] }] };
    expect(kindOf(() => readParsed(refused, "t"))).toBe("refusal");
  });
  it("reports a failed response with the API error message", () => {
    const failed = { output_parsed: null, status: "failed", error: { message: "upstream exploded" }, output: [] };
    try {
      readParsed(failed, "EN");
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(BlogGenerationError);
      expect((e as BlogGenerationError).kind).toBe("api");
      expect((e as Error).message).toContain("upstream exploded");
    }
  });
  it("maps a missing parsed payload to a parse error", () => {
    expect(kindOf(() => readParsed({ ...ok, output_parsed: null }, "t"))).toBe("parse");
  });
});
