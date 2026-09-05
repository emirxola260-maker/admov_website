import { createServiceClient } from "@/lib/supabase/admin";
import { hashToken, DOWNLOAD_MAX_USES } from "@/lib/apps/fulfilment";
import { CDN_BASE_URL } from "@/lib/server/cdn-policy";

export const dynamic = "force-dynamic";

/**
 * Serves a purchased file.
 *
 * The link the buyer receives carries a random token; only its hash is stored,
 * so a leaked database cannot be turned into working download links. The file
 * itself lives in a private bucket and is streamed through this route, which
 * is the only place the CDN service token is used.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createServiceClient();
  if (!supabase) return new Response("Downloads are unavailable", { status: 503 });

  const { data: order } = await supabase
    .from("app_orders")
    .select("id, app_id, status, download_expires_at, download_count")
    .eq("download_token", hashToken(token))
    .maybeSingle();

  if (!order || order.status !== "paid") return new Response("This link is not valid.", { status: 404 });
  if (order.download_expires_at && new Date(order.download_expires_at) < new Date()) {
    return new Response("This download link has expired. Get in touch and we'll send a new one.", { status: 410 });
  }
  if (order.download_count >= DOWNLOAD_MAX_USES) {
    return new Response("This link has reached its download limit. Get in touch and we'll send a new one.", { status: 429 });
  }

  const { data: app } = await supabase.from("apps").select("name, download_key").eq("id", order.app_id).single();
  if (!app?.download_key) return new Response("This app has no file attached yet.", { status: 404 });

  const serviceToken = process.env.CDN_SERVICE_TOKEN;
  const upstream = await fetch(`${CDN_BASE_URL}/${encodeURI(app.download_key)}`, {
    headers: serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {},
  });
  if (!upstream.ok || !upstream.body) {
    console.error("download fetch failed with HTTP", upstream.status);
    return new Response("The file could not be fetched. Please get in touch.", { status: 502 });
  }

  await supabase
    .from("app_orders")
    .update({ download_count: order.download_count + 1 } as never)
    .eq("id", order.id);

  const filename = app.download_key.split("/").pop() || `${app.name}.zip`;
  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
