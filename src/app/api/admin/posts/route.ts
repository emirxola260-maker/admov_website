import { requireAdmin } from "@/lib/server/auth";
import { regeneratePost, runDailyGeneration } from "@/lib/blog/pipeline";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/** Admin-only actions that need the Anthropic key (everything else is written directly via RLS). */
export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => ({}))) as { action?: string; topic?: string; pillar?: string; id?: string; lang?: string };

  switch (body.action) {
    case "generate-now": {
      const result = await runDailyGeneration({ force: true, topic: body.topic ?? null, pillar: body.pillar ?? null });
      return Response.json(result, { status: result.ok ? 200 : 500 });
    }
    case "regenerate": {
      if (!body.id) return Response.json({ ok: false, error: "Missing id" }, { status: 400 });
      const lang = body.lang === "ar" || body.lang === "tr" ? body.lang : undefined;
      const result = await regeneratePost(body.id, lang);
      return Response.json(result, { status: result.ok ? 200 : 500 });
    }
    default:
      return Response.json({ ok: false, error: "Unknown action" }, { status: 400 });
  }
}
