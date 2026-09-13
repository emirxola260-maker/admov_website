import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseCurriculum } from "./curriculum";

/** The two seeded curricula, straight from the SQL the owner runs. */
function seededCurricula(): string[] {
  const sql = readFileSync(join(process.cwd(), "docs/security/supabase-apps-store.sql"), "utf8");
  return [...sql.matchAll(/\$md\$([\s\S]*?)\$md\$/g)].map((m) => m[1]);
}

describe("parseCurriculum", () => {
  it("reads both seeded courses into audience, modules and tools", () => {
    const [coding, content] = seededCurricula().map(parseCurriculum);

    expect(coding.sections.map((s) => s.kind)).toEqual(["list", "modules", "chips"]);
    expect(coding.moduleCount).toBe(7);
    expect(coding.lessonCount).toBe(28);
    expect(coding.sections[0].items).toHaveLength(4);
    expect(coding.sections[2].items).toContain("Claude Code");
    expect(coding.notes.map((n) => n.label)).toEqual(["طريقة الشرح", "شو بتاخد معك"]);

    expect(content.sections.map((s) => s.kind)).toEqual(["list", "modules", "chips"]);
    expect(content.moduleCount).toBe(6);
    expect(content.lessonCount).toBe(24);
    expect(content.sections[2].items).toEqual([
      "Midjourney", "Flux", "Nano Banana", "ComfyUI", "Seedance", "Kling", "Veo", "Higgsfield", "ElevenLabs", "CapCut",
    ]);
  });

  it("numbers modules as written and strips the number from the title", () => {
    const parsed = parseCurriculum("## Modules\n\n### 1. Basics\n- a\n- b\n\n### 2) Next steps\n1. c");
    const [first, second] = parsed.sections[0].modules;
    expect(first).toMatchObject({ number: 1, title: "Basics", lessons: ["a", "b"] });
    expect(second).toMatchObject({ number: 2, title: "Next steps", lessons: ["c"] });
  });

  it("accepts Arabic-Indic numerals and unnumbered headings", () => {
    const parsed = parseCurriculum("### ٣. الوحدة الثالثة\n- درس\n### Bonus\n- extra");
    expect(parsed.sections[0].modules.map((m) => [m.number, m.title])).toEqual([[3, "الوحدة الثالثة"], [2, "Bonus"]]);
  });

  it("keeps an intro paragraph and any prose inside a module", () => {
    const parsed = parseCurriculum("## Path\nStart here.\n### 1. One\nWhy it matters.\n- lesson");
    expect(parsed.sections[0].intro).toBe("Start here.");
    expect(parsed.sections[0].modules[0].body).toBe("Why it matters.");
  });

  it("falls back to plain markdown for free-form sections", () => {
    const parsed = parseCurriculum("## About\nSome text.\n\nMore text with a [link](https://x.y).");
    expect(parsed.sections[0]).toMatchObject({ kind: "text", body: "Some text.\n\nMore text with a [link](https://x.y)." });
  });

  it("handles CRLF and empty input", () => {
    expect(parseCurriculum("## A\r\n- x\r\n- y").sections[0].items).toEqual(["x", "y"]);
    expect(parseCurriculum("")).toEqual({ sections: [], notes: [], moduleCount: 0, lessonCount: 0 });
    expect(parseCurriculum(null).sections).toEqual([]);
  });
});
