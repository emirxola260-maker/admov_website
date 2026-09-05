import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedApp } from "@/lib/data/apps";
import { appMetadata } from "@/lib/apps/metadata";
import { resolveLang } from "@/lib/routes/lang";
import { AppDetail } from "@/components/apps/AppDetail";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  return appMetadata(slug, resolveLang(lang));
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  resolveLang(lang);
  const app = await getPublishedApp(slug);
  if (!app) notFound();
  return <AppDetail app={app} />;
}
