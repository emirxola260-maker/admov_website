import type { Metadata } from "next";
import { translations } from "@/i18n/translations";
import { getPublishedProducts } from "@/lib/data/products";
import { localePath, pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { resolveLang, type LangParams } from "@/lib/routes/lang";
import { ProductsPage } from "@/components/products/ProductsPage";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  const t = translations[lang].products;
  return {
    title: t.pageTitle,
    description: t.pageIntro,
    alternates: { canonical: localePath(lang, "/products"), languages: pathAlternates(SITE_URL, "/products") },
  };
}

export default async function Page({ params }: LangParams) {
  resolveLang((await params).lang);
  const products = await getPublishedProducts();
  return <ProductsPage products={products} />;
}
