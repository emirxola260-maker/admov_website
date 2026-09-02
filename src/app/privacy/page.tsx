import type { Metadata } from "next";
import { PrivacyPolicy } from "@/views/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Admov collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <PrivacyPolicy />;
}
