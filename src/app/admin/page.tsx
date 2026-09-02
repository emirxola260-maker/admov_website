import type { Metadata } from "next";
import { AdminPage } from "@/admin/AdminPage";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminPage />;
}
