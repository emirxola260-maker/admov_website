import type { Metadata } from "next";
import { getCourseLangs, getPublishedCourses } from "@/lib/data/apps";
import { courseLangs } from "@/lib/apps/types";
import { coursesIndexMetadata } from "@/lib/apps/metadata";
import { resolveLang, type LangParams } from "@/lib/routes/lang";
import { CoursesPage } from "@/components/courses/CoursesPage";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return coursesIndexMetadata(resolveLang((await params).lang));
}

export default async function Page({ params }: LangParams) {
  const lang = resolveLang((await params).lang);
  const [courses, availableIn] = await Promise.all([getPublishedCourses(), getCourseLangs()]);
  return <CoursesPage courses={courses.filter((c) => courseLangs(c).includes(lang))} availableIn={availableIn} />;
}
