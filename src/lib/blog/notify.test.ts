import { describe, it, expect } from "vitest";
import { buildDraftTelegramMessage, draftKeyboard } from "./notify";

describe("buildDraftTelegramMessage", () => {
  it("escapes model output and reports word counts", () => {
    const msg = buildDraftTelegramMessage({
      title: "<b>Hi</b> & bye",
      excerpt: "x <script>",
      pillar: "ai-ads",
      bodies: { en: "one two three", ar: "واحد", tr: "" },
    });
    expect(msg).toContain("&lt;b&gt;Hi&lt;/b&gt; &amp; bye");
    expect(msg).not.toContain("<script>");
    expect(msg).toContain("EN 3w");
    expect(msg).toContain("AR 1w");
  });
  it("builds an inline keyboard with the preview link", () => {
    const kb = draftKeyboard("https://admov.io/admin/approve?id=1&token=t", "https://admov.io/admin");
    expect(kb.inline_keyboard[0][0].url).toContain("/admin/approve");
  });
});
