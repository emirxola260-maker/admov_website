import { supabase } from "@/lib/supabase/client";
import type { Product, ProductInput } from "./types";

function client() {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export async function listProductsAdmin(): Promise<Product[]> {
  const { data, error } = await client().from("products").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function saveProduct(input: ProductInput & { id?: string }): Promise<Product> {
  const { id, ...rest } = input;
  const payload = {
    ...rest,
    url: rest.url || null,
    logo_url: rest.logo_url || null,
    image_url: rest.image_url || null,
    video_url: rest.video_url || null,
  };
  const query = id
    ? client().from("products").update(payload as never).eq("id", id)
    : client().from("products").insert(payload as never);
  const { data, error } = await query.select("*").single();
  if (error) throw new Error(error.message);
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await client().from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setProductOrder(items: { id: string; sort_order: number }[]): Promise<void> {
  for (const item of items) {
    const { error } = await client().from("products").update({ sort_order: item.sort_order } as never).eq("id", item.id);
    if (error) throw new Error(error.message);
  }
}

/** Upload to the public `media` bucket and return the public URL. */
export async function uploadMedia(file: File, folder = "products"): Promise<string> {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-80);
  const path = `${folder}/${Date.now()}-${safe}`;
  const { error } = await client().storage.from("media").upload(path, file, { upsert: false, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return client().storage.from("media").getPublicUrl(path).data.publicUrl;
}
