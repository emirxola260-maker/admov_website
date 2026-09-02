import type { Metadata } from "next";
import { SupportPage } from "@/views/SupportPage";

export const metadata: Metadata = {
  title: "Support",
  description: "Need help with Admov? Answers to common questions and how to reach us.",
  alternates: { canonical: "/support" },
};

export default function Page() {
  return <SupportPage />;
}
