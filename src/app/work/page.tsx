import type { Metadata } from "next";
import { pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { WorkPage } from "@/views/WorkPage";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Explore our portfolio of AI-powered creative work — from cinematic video production to fully automated business systems.",
  alternates: { canonical: "/work", languages: pathAlternates(SITE_URL, "/work") },
};

export default function Page() {
  return <WorkPage />;
}
