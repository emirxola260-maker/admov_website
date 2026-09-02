"use client";

import * as React from "react";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { AdminContentProvider, type AdminContentValue } from "@/admin/useAdminContent";
import type { Language } from "@/i18n/config";

// Arabic uses the self-hosted Changa face for everything except the logo (see globals.css).
function FontWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  return <div className={lang === "ar" ? "font-changa" : undefined}>{children}</div>;
}

export function Providers({
  initialLang,
  adminContent,
  children,
}: {
  initialLang: Language;
  adminContent: AdminContentValue;
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <AdminContentProvider value={adminContent}>
        <FontWrapper>{children}</FontWrapper>
      </AdminContentProvider>
    </LanguageProvider>
  );
}
