"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDown, Check, Plus } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languages } from "@/i18n/translations";
import { academyCopy } from "@/i18n/academy";
import { localePath } from "@/lib/i18n/paths";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { parseCurriculum } from "@/lib/courses/curriculum";
import type { AppItem } from "@/lib/apps/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostArticle } from "@/components/blog/PostArticle";
import { AppPrice } from "@/components/apps/AppMeta";
import { AppAction } from "@/components/apps/AppAction";
import { PurchaseResult } from "@/components/apps/PurchaseResult";
import { AdmovMark } from "@/components/ui/Logo";
import { CourseFacts, AcademyHelp } from "./CoursesPage";
import { CourseMedia } from "./CourseMedia";
import styles from "./academy.module.css";

export function CourseDetail({ course }: { course: AppItem }) {
  const { t, lang } = useLanguage();
  const a = academyCopy[lang];
  const curriculum = parseCurriculum(course.curriculum_md?.[lang]);
  const project = pickLang(course.project, lang);
  const description = pickLang(course.description, lang);
  const format = pickLang(course.format, lang);
  const outcomes = course.features?.[lang] ?? [];
  const gallery = (course.gallery ?? []).filter(item => sanitizeHttpUrl(item.url));
  const instructor = course.instructor;
  const markdown = (text: string) => <PostArticle markdown={text} lang={lang} className={styles.markdown} />;

  return <div className={styles.page}>
    <Navbar />
    <main className={styles.detailMain}>
      <div className={styles.container}>
        <Link href={localePath(lang, "/courses")} className={styles.back}><ArrowLeft size={16} className="rtl:rotate-180" aria-hidden="true" />{t.courses.back}</Link>
        <React.Suspense fallback={null}><PurchaseResult fulfilment={course.fulfilment} /></React.Suspense>
        <header className={styles.detailHero}>
          <div className={styles.detailIntro}>
            <p className={styles.academyName}><AdmovMark />{a.academy}</p>
            <h1>{course.name}</h1>
            <p className={styles.tagline}>{pickLang(course.tagline, lang)}</p>
            <CourseFacts course={course} />
            <a href="#curriculum" className={styles.textLink}>{a.curriculum}<ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <CourseMedia course={course} lang={lang} priority />
        </header>

        <div className={styles.detailLayout}>
          <div className={styles.courseBody}>
            {project && <section className={styles.projectPanel}><AdmovMark outline aria-hidden="true" /><div><h2>{a.project}</h2><p>{project}</p></div></section>}
            {description && <section className={styles.bodySection}><h2>{a.overview}</h2>{markdown(description)}</section>}
            {!!outcomes.length && <section className={styles.bodySection}><h2>{a.outcomes}</h2><ul className={styles.outcomes}>{outcomes.map((item, index) => <li key={index}><Check size={18} aria-hidden="true" />{markdown(item)}</li>)}</ul></section>}

            <section id="curriculum" className={styles.curriculum} aria-labelledby="curriculum-heading">
              <div className={styles.curriculumHeading}><div><h2 id="curriculum-heading">{a.curriculum}</h2><p>{a.moduleHint}</p></div>{curriculum.moduleCount > 0 && <span>{curriculum.moduleCount.toLocaleString(lang)} {a.modules} · {curriculum.lessonCount.toLocaleString(lang)} {a.lessons}</span>}</div>
              {curriculum.sections.map((section, sectionIndex) => <section className={styles.curriculumSection} key={sectionIndex}>
                {section.title && <h3>{section.title}</h3>}
                {section.intro && markdown(section.intro)}
                {section.kind === "modules" && <div className={styles.moduleList}>{section.modules.map((module, index) => <details className={styles.module} key={index} open={index === 0}>
                  <summary><span className={styles.moduleNumber}>{module.number.toLocaleString(lang, { minimumIntegerDigits: 2 })}</span><span className={styles.moduleTitle}>{module.title}<small>{module.lessons.length.toLocaleString(lang)} {a.lessons}</small></span><Plus size={20} aria-hidden="true" /></summary>
                  <div className={styles.moduleContent}>{module.body && markdown(module.body)}{!!module.lessons.length && <ul>{module.lessons.map((lesson, lessonIndex) => <li key={lessonIndex}>{markdown(lesson)}</li>)}</ul>}</div>
                </details>)}</div>}
                {section.kind === "list" && <ul className={styles.audience}>{section.items.map((item, index) => <li key={index}>{markdown(item)}</li>)}</ul>}
                {section.kind === "chips" && <ul className={styles.tools}>{section.items.map((item, index) => <li key={index}>{item}</li>)}</ul>}
                {section.kind === "text" && markdown(section.body)}
              </section>)}
              {!!curriculum.notes.length && <dl className={styles.notes}>{curriculum.notes.map((note, index) => <div key={index}><dt>{note.label}</dt><dd>{markdown(note.text)}</dd></div>)}</dl>}
            </section>

            {!!gallery.length && <section className={styles.bodySection}><h2>{a.gallery}</h2><div className={styles.gallery}>{gallery.map((item, index) => <figure key={index}><img src={sanitizeHttpUrl(item.url)} alt={pickLang(item.caption, lang) || course.name} loading="lazy" />{pickLang(item.caption, lang) && <figcaption>{pickLang(item.caption, lang)}</figcaption>}</figure>)}</div></section>}
            {instructor?.name && <section className={styles.bodySection}><h2>{a.instructor}</h2><div className={styles.instructor}>{sanitizeHttpUrl(instructor.photo_url ?? "") && <img src={sanitizeHttpUrl(instructor.photo_url ?? "")} alt={instructor.name} loading="lazy" />}<div><h3>{instructor.name}</h3><p>{pickLang(instructor.role, lang)}</p>{pickLang(instructor.bio, lang) && markdown(pickLang(instructor.bio, lang) ?? "")}</div></div></section>}
          </div>

          <aside className={styles.enrolSidebar} aria-labelledby="enrol-title">
            <div className={styles.enrolPanel}>
              <p className={styles.academyName}>{a.enrol}</p><h2 id="enrol-title">{course.name}</h2>
              <div className={styles.price}><span>{a.price}</span><AppPrice app={course} large />{course.billing === "one_time" && <small>{a.oneTime}</small>}</div>
              <AppAction app={course} large block className={styles.enrolButton} />
              <dl className={styles.enrolFacts}><div><dt>{a.language}</dt><dd>{languages.find(item => item.code === lang)?.nativeName}</dd></div>{format && <div><dt>{a.format}</dt><dd>{format}</dd></div>}</dl>
              <p className={styles.enrolNote}>{t.courses.enrolNote}</p>
            </div>
          </aside>
        </div>
        <AcademyHelp />
      </div>
    </main><Footer />
  </div>;
}
