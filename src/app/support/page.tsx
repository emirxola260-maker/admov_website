import type { Metadata } from "next";
import { pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { SupportPage } from "@/views/SupportPage";

export const metadata: Metadata = {
  title: "Support",
  description: "Need help with Admov? Answers to common questions and how to reach us.",
  alternates: { canonical: "/support", languages: pathAlternates(SITE_URL, "/support") },
};

export default function Page() {
  return <SupportPage />;
}
