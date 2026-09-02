import { describe, it, expect } from "vitest";
import { ALLOWED_CONTENT_TYPES, MAX_UPLOAD_BYTES, buildObjectKey, publicUrlFor } from "./cdn-policy";

// buildObjectKey(folder, fileName, contentType, now, rand)
const key = (folder: string, name: string, type = "image/png", now = 1, rand = "abcd1234") =>
  buildObjectKey(folder, name, type, now, rand);

describe("buildObjectKey", () => {
  it("builds a predictable key from a clean name", () => {
    expect(key("products", "Logo Final.PNG", "image/png", 1700000000000, "deadbeef")).toBe(
      "products/1700000000000-deadbeef-logo-final.png",
    );
  });

  it("strips path traversal out of the file name", () => {
    const k = key("products", "../../../etc/passwd");
    expect(k).toBe("products/1-abcd1234-passwd.png");
    expect(k).not.toContain("..");
    expect(k.split("/")).toHaveLength(2);
  });

  it("stops the folder escaping its own segment", () => {
    expect(key("../secrets", "a.png")).toBe("secrets/1-abcd1234-a.png");
    expect(key("", "a.png")).toBe("misc/1-abcd1234-a.png");
    expect(key("a/b", "a.png").split("/")).toHaveLength(2);
  });

  it("drops spaces and exotic characters", () => {
    const k = key("products", "ev il<>?.png");
    expect(k).not.toContain(" ");
    expect(k).toMatch(/^products\/1-abcd1234-[a-z0-9-]*\.png$/);
  });

  it("takes the extension from the content type, not the file name", () => {
    expect(key("products", "not-really.png", "image/webp")).toBe("products/1-abcd1234-not-really.webp");
  });

  it("never keeps a double extension from the uploaded name", () => {
    expect(key("products", "payload.html.png")).toBe("products/1-abcd1234-payload-html.png");
  });

  it("falls back when the name has no usable characters", () => {
    expect(key("products", "___.png")).toBe("products/1-abcd1234-file.png");
  });

  it("caps very long names", () => {
    expect(key("products", `${"a".repeat(200)}.png`).length).toBeLessThan(90);
  });

  it("separates two uploads of the same name in the same millisecond", () => {
    // Without the random component the PUT would silently overwrite the first file.
    const a = buildObjectKey("products", "logo.png", "image/png", 1700000000000, "aaaaaaaa");
    const b = buildObjectKey("products", "logo.png", "image/png", 1700000000000, "bbbbbbbb");
    expect(a).not.toBe(b);
  });

  it("survives a random component with no usable characters", () => {
    expect(key("products", "a.png", "image/png", 1, "----")).toBe("products/1-x-a.png");
  });
});

describe("upload policy", () => {
  it("only allows raster image types", () => {
    expect(ALLOWED_CONTENT_TYPES.has("image/png")).toBe(true);
    expect(ALLOWED_CONTENT_TYPES.has("image/webp")).toBe(true);
    // SVG is deliberately excluded: it can carry script and the bucket is public.
    expect(ALLOWED_CONTENT_TYPES.has("image/svg+xml")).toBe(false);
    expect(ALLOWED_CONTENT_TYPES.has("text/html")).toBe(false);
    expect(ALLOWED_CONTENT_TYPES.has("application/pdf")).toBe(false);
  });

  it("keeps the cap under Vercel's 4.5 MB request-body limit", () => {
    expect(MAX_UPLOAD_BYTES).toBeLessThan(4.5 * 1024 * 1024);
  });

  it("builds a public URL under the admin-uploads bucket", () => {
    expect(publicUrlFor("products/1-a.png")).toMatch(/\/admin-uploads\/products\/1-a\.png$/);
  });
});
