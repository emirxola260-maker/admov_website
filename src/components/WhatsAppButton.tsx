"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { getAdminContact, useAdminContent } from "@/admin/useAdminContent";
import { sanitizeHttpUrl } from "@/lib/security";
import { WhatsAppIcon } from "./ui/SocialIcons";

export function WhatsAppButton() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { content } = useAdminContent();
  if (pathname?.startsWith("/admin")) return null;
  const href = sanitizeHttpUrl(getAdminContact(content)?.whatsapp, "https://wa.me/905375755445");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.footer.whatsapp}
      title={t.footer.whatsapp}
      className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-transform"
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
