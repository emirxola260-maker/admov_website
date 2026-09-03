import type { Metadata } from "next";
import { DEFAULT_LANG } from "@/i18n/config";
import { HomeRoute, homeMetadata } from "@/lib/routes/home";

export async function generateMetadata(): Promise<Metadata> {
  return homeMetadata(DEFAULT_LANG);
}

export default async function Page() {
  return <HomeRoute />;
}
