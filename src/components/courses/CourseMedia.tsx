import type { AppItem } from "@/lib/apps/types";
import type { Language } from "@/i18n/config";
import { sanitizeHttpUrl } from "@/lib/security";
import { academyCopy } from "@/i18n/academy";
import { AdmovMark } from "@/components/ui/Logo";
import styles from "./academy.module.css";

const covers: Record<string, string> = {
  "ai-coding": "/images/academy/ai-coding.webp",
  "ai-content-creation": "/images/academy/ai-content-creation.webp",
};

export function CourseMedia({ course, lang, priority = false }: { course: AppItem; lang: Language; priority?: boolean }) {
  const uploaded = sanitizeHttpUrl(course.image_url ?? "");
  const src = uploaded || covers[course.slug];
  return (
    <div className={styles.cover}>
      {src ? <img src={src} width="1536" height="1024" alt={course.name} loading={priority ? "eager" : "lazy"} className={styles.coverImage} /> : <AdmovMark outline className={styles.fallbackMark} />}
      {!uploaded && covers[course.slug] && <span className={styles.artNote}>{academyCopy[lang].art}</span>}
    </div>
  );
}
