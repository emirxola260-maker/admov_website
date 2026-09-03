import type { Metadata } from "next";
import { resolveLang, type LangParams } from "@/lib/routes/lang";
import { HomeRoute, homeMetadata } from "@/lib/routes/home";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return homeMetadata(resolveLang((await params).lang));
}

export default async function Page({ params }: LangParams) {
  resolveLang((await params).lang);
  return <HomeRoute />;
}
