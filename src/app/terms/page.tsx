import type { Metadata } from "next";
import { pathAlternates } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/blog/metadata";
import { TermsOfService } from "@/views/TermsOfService";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of Admov.",
  alternates: { canonical: "/terms", languages: pathAlternates(SITE_URL, "/terms") },
};

export default function Page() {
  return <TermsOfService />;
}
