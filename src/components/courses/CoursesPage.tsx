"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Clock, Gauge, Layers } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languages } from "@/i18n/translations";
import type { Language } from "@/i18n/config";
import { localePath } from "@/lib/i18n/paths";
import { pickLang } from "@/lib/blog/utils";
import type { AppItem } from "@/lib/apps/types";
import { parseCurriculum } from "@/lib/courses/curriculum";
import { academyCopy } from "@/i18n/academy";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdmovMark } from "@/components/ui/Logo";
import { AppPrice } from "@/components/apps/AppMeta";
import { CourseMedia } from "./CourseMedia";
import styles from "./academy.module.css";

export function CoursesPage({ courses, availableIn }: { courses: AppItem[]; availableIn: Language[] }) {
  const { t, lang } = useLanguage();
  const a = academyCopy[lang];
  const elsewhere = availableIn.filter((l) => l !== lang);
  const [selected, setSelected] = useState<string | null>(null);
  const visibleCourses = selected ? courses.filter(course => course.slug === selected) : courses;
  const chooser = {
    ar: { all: "كل المسارات", label: "ماذا تريد أن تصنع؟", coding: "تطبيق أو موقع", content: "صور وفيديوهات", result: "مسارات تناسب اختيارك" },
    en: { all: "All courses", label: "What do you want to make?", coding: "An app or website", content: "Photos and videos", result: "Courses for your choice" },
    tr: { all: "Tüm kurslar", label: "Ne üretmek istiyorsunuz?", coding: "Uygulama veya site", content: "Fotoğraf ve video", result: "Seçiminize uygun kurslar" },
  }[lang];

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.indexMain}>
        <div className={styles.container}>
          <header className={styles.academyHero}>
            <div>
              <p className={styles.academyName}><AdmovMark />{a.academy}</p>
              <h1>{a.title}</h1>
              <p className={styles.heroIntro}>{a.intro}</p>
              {courses.length > 0 && <a href="#course-catalogue" className={styles.textLink}>{a.browse}<ArrowDown size={18} aria-hidden="true" /></a>}
            </div>
            <div className={styles.learningNote}>
              <AdmovMark outline className={styles.noteMark} />
              <h2>{a.approach}</h2>
              <p>{a.approachText}</p>
            </div>
          </header>

          <section id="course-catalogue" className={styles.catalogue} aria-labelledby="catalogue-title">
            {courses.length > 0 ? <>
              <div className={styles.catalogueHeader}><h2 id="catalogue-title">{a.catalogue}</h2><p>{a.catalogueNote}</p></div>
              <div className={styles.chooser} role="group" aria-label={chooser.label}>
                <button type="button" aria-pressed={selected === null} onClick={() => setSelected(null)}>{chooser.all}</button>
                {courses.map(course => <button key={course.id} type="button" aria-pressed={selected === course.slug} onClick={() => setSelected(course.slug)}>{course.slug === "ai-coding" ? chooser.coding : course.slug === "ai-content-creation" ? chooser.content : course.name}</button>)}
              </div>
              <p className="sr-only" role="status">{chooser.result}: {visibleCourses.length.toLocaleString(lang)}</p>
              <div className={styles.courseList}>
                {visibleCourses.map((course, index) => <CourseCard key={course.id} course={course} index={index} lang={lang} />)}
              </div>
            </> : <div className={styles.empty}>
              <h2 id="catalogue-title">{elsewhere.length ? t.courses.notInLang : t.courses.empty}</h2>
              {elsewhere.length > 0 && <div className={styles.languageLinks}>
                <span>{t.courses.availableIn}</span>
                {elsewhere.map(l => <Link key={l} href={localePath(l, "/courses")} className={styles.solidLink}>{languages.find(item => item.code === l)?.nativeName ?? l}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
              </div>}
            </div>}
          </section>
          <AcademyHelp />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CourseCard({ course, index, lang }: { course: AppItem; index: number; lang: Language }) {
  const a = academyCopy[lang];
  const href = `${localePath(lang, "/courses")}/${course.slug}`;
  const project = pickLang(course.project, lang);
  return (
    <article className={styles.courseRow}>
      <Link href={href} className={styles.courseImageLink} aria-label={course.name}><CourseMedia course={course} lang={lang} priority={index === 0} /></Link>
      <div className={styles.courseInfo}>
        <CourseFacts course={course} compact />
        <h3><Link href={href}>{course.name}</Link></h3>
        <p className={styles.tagline}>{pickLang(course.tagline, lang)}</p>
        {project && <div className={styles.projectBrief}><span>{a.project}</span><p>{project}</p></div>}
        <div className={styles.courseFooter}><AppPrice app={course} /><Link href={href} className={styles.solidLink}>{a.details}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </article>
  );
}

export function CourseFacts({ course, compact = false }: { course: AppItem; compact?: boolean }) {
  const { t, lang } = useLanguage();
  const duration = pickLang(course.duration, lang);
  const level = pickLang(course.level, lang);
  const { moduleCount } = parseCurriculum(course.curriculum_md?.[lang]);
  return (
    <div className={styles.facts}>
      {duration && <span><Clock size={14} aria-hidden="true" /><span className="sr-only">{t.courses.duration}: </span>{duration}</span>}
      {!!moduleCount && <span><Layers size={14} aria-hidden="true" />{moduleCount.toLocaleString(lang)} {academyCopy[lang].modules}</span>}
      {!compact && level && <span><Gauge size={14} aria-hidden="true" /><span className="sr-only">{t.courses.level}: </span>{level}</span>}
    </div>
  );
}

export function AcademyHelp() {
  const { lang } = useLanguage();
  const a = academyCopy[lang];
  return <aside className={styles.help}><div><h2>{a.help}</h2><p>{a.helpText}</p></div><Link href={`${localePath(lang, "/")}#contact`} className={styles.textLink}>{a.contact}<ArrowUpRight size={18} aria-hidden="true" /></Link></aside>;
}
