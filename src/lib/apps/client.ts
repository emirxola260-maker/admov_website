import { supabase } from "@/lib/supabase/client";
import { compactText, type AppItemAdmin, type AppInput } from "./types";

function client() {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export async function listAppsAdmin(): Promise<AppItemAdmin[]> {
  const { data, error } = await client().from("apps").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AppItemAdmin[];
}

export async function saveApp(input: AppInput & { id?: string }): Promise<AppItemAdmin> {
  const { id, ...rest } = input;
  // Empty strings would fail the "store listings must link somewhere" check in
  // a confusing way, so blanks become nulls before they reach Postgres.
  const payload = {
    ...rest,
    store_url: rest.store_url || null,
    demo_url: rest.demo_url || null,
    download_key: rest.download_key || null,
    stripe_price_id: rest.stripe_price_id || null,
    stripe_product_id: rest.stripe_product_id || null,
    logo_url: rest.logo_url || null,
    image_url: rest.image_url || null,
    video_url: rest.video_url || null,
    duration: compactText(rest.duration),
    level: compactText(rest.level),
    format: compactText(rest.format),
    project: compactText(rest.project),
    instructor: rest.instructor?.name?.trim()
      ? {
          name: rest.instructor.name.trim(),
          photo_url: rest.instructor.photo_url?.trim() || null,
          role: compactText(rest.instructor.role) ?? {},
          bio: compactText(rest.instructor.bio) ?? {},
        }
      : null,
    gallery: (rest.gallery ?? [])
      .filter((item) => item?.url?.trim())
      .map((item) => ({ url: item.url.trim(), caption: compactText(item.caption) ?? {} })),
    curriculum_md: rest.curriculum_md ?? {},
    price_cents: rest.fulfilment === "store_link" ? null : rest.price_cents,
  };
  const query = id
    ? client().from("apps").update(payload as never).eq("id", id)
    : client().from("apps").insert(payload as never);
  const { data, error } = await query.select("*").single();
  if (error) throw new Error(error.message);
  return data as AppItemAdmin;
}

export async function deleteApp(id: string): Promise<void> {
  const { error } = await client().from("apps").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
