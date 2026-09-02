import type { Metadata } from "next";
import { TermsOfService } from "@/views/TermsOfService";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of Admov.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <TermsOfService />;
}
