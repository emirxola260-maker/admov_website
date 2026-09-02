import type { Metadata } from "next";
import { getPublishedProducts } from "@/lib/data/products";
import { translations } from "@/i18n/translations";
import { ProductsPage } from "@/components/products/ProductsPage";

export const metadata: Metadata = {
  title: translations.en.products.pageTitle,
  description: translations.en.products.pageIntro,
  alternates: { canonical: "/products" },
};

export default async function Page() {
  const products = await getPublishedProducts();
  return <ProductsPage products={products} />;
}
