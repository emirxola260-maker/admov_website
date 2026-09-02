import "server-only";
import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/products/types";

export const PRODUCTS_TAG = "products";

async function fetchPublishedProducts(): Promise<Product[]> {
  const supabase = createAnonServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("products fetch failed:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export const getPublishedProducts = unstable_cache(fetchPublishedProducts, ["products-published"], {
  tags: [PRODUCTS_TAG],
  revalidate: 60,
});
