import type { Metadata } from "next";
import { WorkPage } from "@/views/WorkPage";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Explore our portfolio of AI-powered creative work — from cinematic video production to fully automated business systems.",
  alternates: { canonical: "/work" },
};

export default function Page() {
  return <WorkPage />;
}
