import type { LocalizedText } from "@/lib/blog/types";

export type ProductStatus = "draft" | "published";
export type ProductCategory = "saas" | "app" | "website" | "course" | "tool";
export const PRODUCT_CATEGORIES: ProductCategory[] = ["saas", "app", "website", "course", "tool"];

export interface Product {
  id: string;
  slug: string;
  name: string;
  status: ProductStatus;
  featured: boolean;
  sort_order: number;
  category: ProductCategory;
  badges: string[];
  url: string | null;
  logo_url: string | null;
  image_url: string | null;
  video_url: string | null;
  tagline: LocalizedText;
  description: LocalizedText;
  created_at: string;
  updated_at: string;
}

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;

export const EMPTY_PRODUCT: ProductInput = {
  slug: "",
  name: "",
  status: "draft",
  featured: false,
  sort_order: 0,
  category: "saas",
  badges: [],
  url: "",
  logo_url: "",
  image_url: "",
  video_url: "",
  tagline: { en: "" },
  description: { en: "" },
};
