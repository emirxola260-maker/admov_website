"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localePath } from "@/lib/i18n/paths";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import type { AppItem } from "@/lib/apps/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostArticle } from "@/components/blog/PostArticle";
import { AppPrice } from "@/components/apps/AppMeta";
import { AppAction } from "@/components/apps/AppAction";
import { PurchaseResult } from "@/components/apps/PurchaseResult";
import { CourseFacts } from "./CoursesPage";

/**
 * A course sales page: pitch and enrol button first, then what the student
 * will be able to do, then the full curriculum — with the enrol button
 * repeated at the end, so someone who read every module can buy without
 * scrolling back up.
 */
export function CourseDetail({ course }: { course: AppItem }) {
  const { t, lang } = useLanguage();
  const c = t.courses;
  const image = sanitizeHttpUrl(course.image_url ?? "");
  const tagline = pickLang(course.tagline, lang) ?? "";
  const description = pickLang(course.description, lang) ?? "";
  const outcomes = (course.features?.[lang] ?? []) as string[];
  const curriculum = course.curriculum_md?.[lang] ?? "";

  const enrolBlock = (
    <div className="flex flex-col items-start gap-3">
      <AppPrice app={course} large />
      <AppAction app={course} large />
      <p className="text-sm text-zinc-500 max-w-md">{c.enrolNote}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <main className="pt-32 md:pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href={localePath(lang, "/courses")}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-violet transition-colors mb-10"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" aria-hidden />
            {c.back}
          </Link>

          <React.Suspense fallback={null}>
            <PurchaseResult fulfilment={course.fulfilment} />
          </React.Suspense>

          <header className="flex flex-col gap-5">
            <span className="section-label">{t.apps.kinds.course}</span>
            <h1 className="text-4xl md:text-6xl leading-[1.1]">{course.name}</h1>
            {tagline && <p className="text-xl md:text-2xl text-zinc-200 leading-snug max-w-3xl">{tagline}</p>}
            <CourseFacts course={course} />
            {description && <p className="text-zinc-400 leading-relaxed max-w-3xl whitespace-pre-line">{description}</p>}
            {image && (
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 aspect-[16/9] mt-2">
                <img src={image} alt={course.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="pt-2">{enrolBlock}</div>
          </header>

          {outcomes.length > 0 && (
            <section className="mt-16 rounded-3xl border border-violet/30 bg-violet/[0.06] p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl mb-6">{c.outcomes}</h2>
              <ul className="grid gap-3">
                {outcomes.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-zinc-200">
                    <Check size={18} className="mt-1 shrink-0 text-violet" aria-hidden />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {curriculum && (
            <section className="mt-16">
              <h2 className="text-3xl md:text-4xl mb-8">{c.curriculum}</h2>
              <PostArticle markdown={curriculum} lang={lang} />
            </section>
          )}

          <section className="mt-16 pt-10 border-t border-white/10">{enrolBlock}</section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
