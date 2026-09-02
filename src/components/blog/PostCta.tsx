import { translations } from "@/i18n/translations";
import type { Language } from "@/i18n/config";
import { VioletButton } from "@/components/ui/VioletButton";

const I8CHAT_PILLARS = new Set(["automation", "product-spotlight"]);
const ACADEMY_PILLARS = new Set(["ai-ads", "llm-setup", "web-app", "market"]);

/** Contextual call-to-action at the end of a post: cross-sells ADMOV products by topic. */
export function PostCta({ pillar, lang }: { pillar: string | null; lang: Language }) {
  const t = translations[lang].blog;
  const variant = pillar && I8CHAT_PILLARS.has(pillar) ? "i8chat" : pillar && ACADEMY_PILLARS.has(pillar) ? "academy" : "default";
  const copy = variant === "i8chat" ? t.ctaI8chat : variant === "academy" ? t.ctaAcademy : t.ctaDefault;
  const href = variant === "i8chat" ? "https://i8chat.com" : variant === "academy" ? "https://admovacademy.com" : "/#contact";

  return (
    <aside
      className="mt-14 rounded-[2rem] border border-violet/30 p-8 md:p-10 backdrop-blur-xl"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.28) 0%, rgba(115, 103, 240, 0.12) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      <h2 className="text-2xl md:text-3xl text-zinc-50 mb-3">{copy.title}</h2>
      <p className="text-zinc-300 mb-6 max-w-xl leading-relaxed">{copy.body}</p>
      <VioletButton href={href}>{copy.button}</VioletButton>
    </aside>
  );
}
