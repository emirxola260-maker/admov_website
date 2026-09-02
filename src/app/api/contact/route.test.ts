import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";
import { resetRateLimit } from "@/lib/server/ratelimit";

const valid = { name: "Jane", email: "jane@example.com", phone: "+90 555", workType: "AI Video", date: "", message: "hi", lang: "en", company: "" };

function request(body: unknown, ip = "1.2.3.4") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));

beforeEach(() => {
  resetRateLimit();
  process.env.TELEGRAM_BOT_TOKEN = "test-token";
  process.env.TELEGRAM_CHAT_ID = "1";
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("POST /api/contact", () => {
  it("relays a valid submission to Telegram", async () => {
    const res = await POST(request(valid));
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/sendMessage");
    expect(JSON.parse(init.body as string).text).toContain("Jane");
  });

  it("silently drops honeypot submissions", async () => {
    const res = await POST(request({ ...valid, company: "bot inc" }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid payload", async () => {
    const res = await POST(request({ ...valid, email: "nope" }));
    expect(res.status).toBe(400);
  });

  it("rate limits after five submissions from one IP", async () => {
    for (let i = 0; i < 5; i++) expect((await POST(request(valid))).status).toBe(200);
    const res = await POST(request(valid));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
  });

  it("reports a delivery failure", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 500 }));
    const res = await POST(request(valid));
    expect(res.status).toBe(502);
  });
});
