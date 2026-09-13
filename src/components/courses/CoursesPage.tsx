"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Clock, Gauge } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languages } from "@/i18n/translations";
import type { Language } from "@/i18n/config";
import { localePath } from "@/lib/i18n/paths";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import type { AppItem } from "@/lib/apps/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ShinyText from "@/components/ShinyText";
import { AppPrice } from "@/components/apps/AppMeta";
import { AppAction } from "@/components/apps/AppAction";

/**
 * `courses` arrives already filtered to the page's language by the server.
 * `availableIn` is every language that has courses, so a visitor on a
 * language with none is pointed at the one that does.
 */
export function CoursesPage({ courses, availableIn }: { courses: AppItem[]; availableIn: Language[] }) {
  const { t, lang } = useLanguage();
  const c = t.courses;
  const elsewhere = availableIn.filter((l) => l !== lang);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <main className="pt-32 md:pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="section-label">{c.label}</span>
          <h1 className="text-4xl md:text-6xl mb-6 max-w-3xl">
            {c.heading}
            <ShinyText text={c.headingHighlight} className="text-violet" color="#8B7DF0" shineColor="#ffffff" speed={3} />
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mb-12">{c.subtext}</p>

          {courses.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-zinc-400 mb-5">{elsewhere.length ? c.notInLang : c.empty}</p>
              {elsewhere.length > 0 && (
                <p className="text-sm text-zinc-500 flex items-center justify-center gap-3 flex-wrap">
                  {c.availableIn}
                  {elsewhere.map((l) => (
                    <Link
                      key={l}
                      href={localePath(l, "/courses")}
                      className="rounded-full border border-violet/40 px-4 py-2 text-violet hover:bg-violet/10 transition-colors"
                    >
                      {languages.find((m) => m.code === l)?.nativeName ?? l}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CourseCard({ course, index, lang }: { course: AppItem; index: number; lang: Language }) {
  const image = sanitizeHttpUrl(course.image_url ?? "");
  const tagline = pickLang(course.tagline, lang) ?? "";
  const href = `${localePath(lang, "/courses")}/${course.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.08, 0.3), duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-violet/40 transition-colors"
    >
      {image && (
        <Link href={href} className="block aspect-[16/9] bg-zinc-900 overflow-hidden">
          <img src={image} alt={course.name} loading="lazy" className="w-full h-full object-cover" />
        </Link>
      )}
      <div className="flex flex-col gap-4 p-7 flex-1">
        <Link href={href}>
          <h2 className="text-2xl md:text-3xl text-zinc-50 hover:text-violet transition-colors">{course.name}</h2>
        </Link>
        {tagline && <p className="text-zinc-300 leading-relaxed">{tagline}</p>}
        <CourseFacts course={course} />
        <div className="mt-auto pt-4 flex items-center justify-between gap-3 flex-wrap border-t border-white/10">
          <AppPrice app={course} />
          <AppAction app={course} />
        </div>
      </div>
    </motion.article>
  );
}

/** Duration and level pills — rendered only for the facts the course has. */
export function CourseFacts({ course }: { course: AppItem }) {
  const { t, lang } = useLanguage();
  const duration = pickLang(course.duration, lang);
  const level = pickLang(course.level, lang);
  if (!duration && !level) return null;
  const pill = "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300";
  return (
    <div className="flex flex-wrap gap-2">
      {duration && (
        <span className={pill}>
          <Clock size={13} aria-hidden />
          <span className="sr-only">{t.courses.duration}: </span>
          {duration}
        </span>
      )}
      {level && (
        <span className={pill}>
          <Gauge size={13} aria-hidden />
          <span className="sr-only">{t.courses.level}: </span>
          {level}
        </span>
      )}
    </div>
  );
}
