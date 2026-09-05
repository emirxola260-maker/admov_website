import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LANG } from "@/i18n/config";
import { getPublishedApp } from "@/lib/data/apps";
import { appMetadata } from "@/lib/apps/metadata";
import { AppDetail } from "@/components/apps/AppDetail";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return appMetadata((await params).slug, DEFAULT_LANG);
}

export default async function Page({ params }: Props) {
  const app = await getPublishedApp((await params).slug);
  if (!app) notFound();
  return <AppDetail app={app} />;
}
