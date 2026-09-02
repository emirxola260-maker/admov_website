import { applyApproval } from "@/lib/blog/pipeline";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://admov.io";

// POST only — chat clients pre-fetch links, so approval must never happen on GET.
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return new Response("Bad request", { status: 400 });
  const id = String(form.get("id") ?? "");
  const token = String(form.get("token") ?? "");
  const action = String(form.get("action") ?? "approve");

  const result = await applyApproval({ id, token, action });
  if (!result.ok) return new Response(result.error, { status: result.status });

  const origin = process.env.VERCEL_ENV === "production" ? SITE_URL : new URL(request.url).origin;
  return Response.redirect(`${origin}${result.redirectTo}`, 303);
}

export function GET() {
  return new Response("Use the Approve button on the preview page.", { status: 405, headers: { Allow: "POST" } });
}
