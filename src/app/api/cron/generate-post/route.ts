import { runDailyGeneration } from "@/lib/blog/pipeline";

// Called by Vercel Cron (see vercel.json). Vercel sends `Authorization: Bearer <CRON_SECRET>`.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await runDailyGeneration({ force: false });
  return Response.json(result, { status: result.ok ? 200 : 500 });
}
