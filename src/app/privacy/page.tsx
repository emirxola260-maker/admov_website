import type { Metadata } from "next";
import { pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { PrivacyPolicy } from "@/views/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Admov collects, uses and protects your information.",
  alternates: { canonical: "/privacy", languages: pathAlternates(SITE_URL, "/privacy") },
};

export default function Page() {
  return <PrivacyPolicy />;
}
